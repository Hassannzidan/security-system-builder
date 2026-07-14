import { useCallback, useMemo, useRef, useState } from 'react';

import type { Step } from '@security-system-builder/shared';

/**
 * Quantity-map key used for products that have no variants. Real variant ids
 * are used verbatim; this sentinel keeps the map shape uniform.
 */
export const DEFAULT_VARIANT_KEY = '__default__';

interface ProductSelection {
  /** Which variant chip is currently active on the card (null when variant-less). */
  activeVariantId: string | null;
  /** Per-variant quantities. Keyed by variant id, or DEFAULT_VARIANT_KEY. */
  quantities: Record<string, number>;
}

interface BundleState {
  /** Index of the currently-open accordion step (0 on load, -1 when all collapsed). */
  openStepIndex: number;
  /** Client selection state, keyed by product id. */
  selections: Record<string, ProductSelection>;
}

/** One (product, variant) pair with a positive quantity, for the review panel. */
export interface LineItem {
  productId: string;
  variantId: string | null;
  productName: string;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** Original per-unit price when discounted, else equal to `unitPrice`. */
  compareAtUnitPrice: number;
  compareAtLineTotal: number;
  image: string;
  /** Step category the product belongs to — used to group the review panel. */
  category: string;
  stepId: string;
  /**
   * Whether this line came from a quantity-based (multi-select) step. Single-
   * select steps (plans) set this to false so the review panel can render the
   * line without a stepper. Derived from the owning step's `selectionType`.
   */
  hasStepper: boolean;
  /**
   * Whether this line is a required product locked at its seeded quantity. The
   * review panel renders its stepper disabled. Derived from `product.required`.
   */
  locked: boolean;
}

export interface BundleTotals {
  subtotal: number;
  compareAtSubtotal: number;
  savings: number;
}

/**
 * Build the initial per-product selection map.
 *
 * Multi-select steps (cameras): every product starts UNSELECTED (empty
 * quantities) so the user picks what they want from a clean slate — the API
 * `seed.qty` is intentionally not applied. We still default the active variant
 * (which colour chip is highlighted) to the seed's variant when present,
 * otherwise the first variant.
 *
 * Single-select steps (plans): radio semantics require exactly one product
 * chosen from load, so the seed IS applied here — the seeded product starts at
 * qty 1 (under DEFAULT_VARIANT_KEY, since plans have no variants).
 *
 * Required products (multi-select): mandatory items are locked at their seeded
 * quantity, so their seed IS applied too — the product starts selected at
 * seed.qty and can never be changed (see the mutator guards below).
 */
function seedSelections(steps: Step[]): Record<string, ProductSelection> {
  const selections: Record<string, ProductSelection> = {};

  for (const step of steps) {
    const isSingle = step.selectionType === 'single';
    for (const product of step.products) {
      const seeded = (isSingle && product.seed != null) || product.required === true;
      const seedKey = product.seed?.variantId ?? DEFAULT_VARIANT_KEY;
      selections[product.id] = {
        activeVariantId: product.seed?.variantId ?? product.variants?.[0]?.id ?? null,
        quantities: seeded ? { [seedKey]: product.seed!.qty } : {},
      };
    }
  }

  return selections;
}

/**
 * useBundleBuilder — owns ALL client state for the bundle builder: the open
 * accordion step, the active variant per card, and per-variant quantities.
 *
 * It receives the `steps` array from the react-query layer and initialises
 * selections the first time real data arrives — every product starts unselected
 * (only its default active variant is set). Everything the UI needs (card state,
 * per-step selected counts, derived line items and totals) is exposed as
 * memoised, referentially-stable helpers.
 */
export function useBundleBuilder(steps: Step[]) {
  const [state, setState] = useState<BundleState>({ openStepIndex: 0, selections: {} });

  // Seed once per steps identity. Assigning state during render (guarded by the
  // ref) re-renders before commit, so the first paint already shows seeded
  // quantities — no flash of empty state that a useEffect would cause.
  const seededStepsRef = useRef<Step[] | null>(null);
  if (steps.length > 0 && seededStepsRef.current !== steps) {
    seededStepsRef.current = steps;
    setState((prev) => ({ ...prev, selections: seedSelections(steps) }));
  }

  const { openStepIndex, selections } = state;

  // Required products are locked at their seeded quantity: every mutator below
  // short-circuits for them so their selection state can never change.
  const requiredProductIds = useMemo(() => {
    const ids = new Set<string>();
    for (const step of steps) {
      for (const product of step.products) {
        if (product.required === true) ids.add(product.id);
      }
    }
    return ids;
  }, [steps]);

  // --- Open step ----------------------------------------------------------

  const setOpenStep = useCallback((index: number) => {
    setState((prev) => ({ ...prev, openStepIndex: index }));
  }, []);

  const goToNextStep = useCallback(() => {
    setState((prev) => ({ ...prev, openStepIndex: prev.openStepIndex + 1 }));
  }, []);

  // --- Quantity / variant mutations --------------------------------------

  const setQuantity = useCallback(
    (productId: string, variantKey: string, qty: number) => {
      if (requiredProductIds.has(productId)) return;
      const clamped = Math.max(0, qty);
      setState((prev) => {
        const current = prev.selections[productId] ?? { activeVariantId: null, quantities: {} };
        return {
          ...prev,
          selections: {
            ...prev.selections,
            [productId]: {
              ...current,
              quantities: { ...current.quantities, [variantKey]: clamped },
            },
          },
        };
      });
    },
    [requiredProductIds],
  );

  const selectVariant = useCallback((productId: string, variantId: string) => {
    // Switching the active variant must NOT touch any quantities — each
    // variant keeps its own count independently.
    setState((prev) => {
      const current = prev.selections[productId] ?? { activeVariantId: null, quantities: {} };
      return {
        ...prev,
        selections: {
          ...prev.selections,
          [productId]: { ...current, activeVariantId: variantId },
        },
      };
    });
  }, []);

  const adjustActive = useCallback(
    (productId: string, delta: number) => {
      if (requiredProductIds.has(productId)) return;
      setState((prev) => {
        const current = prev.selections[productId] ?? { activeVariantId: null, quantities: {} };
        const key = current.activeVariantId ?? DEFAULT_VARIANT_KEY;
        const next = Math.max(0, (current.quantities[key] ?? 0) + delta);
        return {
          ...prev,
          selections: {
            ...prev.selections,
            [productId]: {
              ...current,
              quantities: { ...current.quantities, [key]: next },
            },
          },
        };
      });
    },
    [requiredProductIds],
  );

  const incrementActive = useCallback(
    (productId: string) => adjustActive(productId, 1),
    [adjustActive],
  );
  const decrementActive = useCallback(
    (productId: string) => adjustActive(productId, -1),
    [adjustActive],
  );

  // Toggle a product's selection: clicking a selected card zeroes the active
  // variant, clicking an unselected one bumps it to 1. Operates on the active
  // variant — the same count the card's stepper shows.
  const toggleActive = useCallback(
    (productId: string) => {
      if (requiredProductIds.has(productId)) return;
      setState((prev) => {
        const current = prev.selections[productId] ?? { activeVariantId: null, quantities: {} };
        const key = current.activeVariantId ?? DEFAULT_VARIANT_KEY;
        const isOn = (current.quantities[key] ?? 0) > 0;
        return {
          ...prev,
          selections: {
            ...prev.selections,
            [productId]: {
              ...current,
              quantities: { ...current.quantities, [key]: isOn ? 0 : 1 },
            },
          },
        };
      });
    },
    [requiredProductIds],
  );

  // Single-select (radio) choice for a step: set the chosen product to qty 1 and
  // zero every OTHER product in the same step. Re-selecting the already-selected
  // product is a no-op — a single-select step always keeps one product chosen
  // (there is deliberately no toggle-off). Plans have no variants, so quantities
  // live under DEFAULT_VARIANT_KEY.
  const selectSingle = useCallback(
    (stepId: string, productId: string) => {
      const step = steps.find((s) => s.id === stepId);
      if (!step) return;
      setState((prev) => {
        const nextSelections = { ...prev.selections };
        for (const product of step.products) {
          const current = nextSelections[product.id] ?? {
            activeVariantId: null,
            quantities: {},
          };
          nextSelections[product.id] = {
            ...current,
            quantities: {
              ...current.quantities,
              [DEFAULT_VARIANT_KEY]: product.id === productId ? 1 : 0,
            },
          };
        }
        return { ...prev, selections: nextSelections };
      });
    },
    [steps],
  );

  // --- Reads --------------------------------------------------------------

  const getCardState = useCallback(
    (productId: string): { activeVariantId: string | null; quantity: number } => {
      const selection = selections[productId];
      if (!selection) return { activeVariantId: null, quantity: 0 };
      const key = selection.activeVariantId ?? DEFAULT_VARIANT_KEY;
      return {
        activeVariantId: selection.activeVariantId,
        quantity: selection.quantities[key] ?? 0,
      };
    },
    [selections],
  );

  const isProductSelected = useCallback(
    (productId: string): boolean => {
      const selection = selections[productId];
      if (!selection) return false;
      return Object.values(selection.quantities).some((qty) => qty > 0);
    },
    [selections],
  );

  const getSelectedCount = useCallback(
    (stepId: string): number => {
      const step = steps.find((s) => s.id === stepId);
      if (!step) return 0;
      return step.products.reduce(
        (count, product) => (isProductSelected(product.id) ? count + 1 : count),
        0,
      );
    },
    [steps, isProductSelected],
  );

  // The chosen product id in a single-select step (the one with qty > 0), or
  // null if none is selected. For a seeded plan step this is never null.
  const getSingleSelection = useCallback(
    (stepId: string): string | null => {
      const step = steps.find((s) => s.id === stepId);
      if (!step) return null;
      const chosen = step.products.find((product) => isProductSelected(product.id));
      return chosen?.id ?? null;
    },
    [steps, isProductSelected],
  );

  // --- Derived (review panel) --------------------------------------------

  const lineItems = useMemo<LineItem[]>(() => {
    const items: LineItem[] = [];

    for (const step of steps) {
      for (const product of step.products) {
        const selection = selections[product.id];
        if (!selection) continue;

        const unitPrice = product.pricing.price;
        const compareAtUnitPrice = product.pricing.compareAt ?? unitPrice;

        for (const [variantKey, quantity] of Object.entries(selection.quantities)) {
          if (quantity <= 0) continue;

          const variant =
            variantKey === DEFAULT_VARIANT_KEY
              ? null
              : (product.variants?.find((v) => v.id === variantKey) ?? null);

          items.push({
            productId: product.id,
            variantId: variant?.id ?? null,
            productName: product.name,
            variantLabel: variant?.label ?? null,
            quantity,
            unitPrice,
            lineTotal: unitPrice * quantity,
            compareAtUnitPrice,
            compareAtLineTotal: compareAtUnitPrice * quantity,
            image: variant?.image ?? product.image ?? '',
            category: step.category,
            stepId: step.id,
            hasStepper: step.selectionType !== 'single',
            locked: product.required === true,
          });
        }
      }
    }

    return items;
  }, [steps, selections]);

  const totals = useMemo<BundleTotals>(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const compareAtSubtotal = lineItems.reduce((sum, item) => sum + item.compareAtLineTotal, 0);
    return {
      subtotal,
      compareAtSubtotal,
      savings: compareAtSubtotal - subtotal,
    };
  }, [lineItems]);

  return {
    openStepIndex,
    setOpenStep,
    goToNextStep,
    getCardState,
    selectVariant,
    setQuantity,
    incrementActive,
    decrementActive,
    toggleActive,
    selectSingle,
    getSelectedCount,
    getSingleSelection,
    isProductSelected,
    lineItems,
    totals,
  };
}

export type BundleBuilder = ReturnType<typeof useBundleBuilder>;
