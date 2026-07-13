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
}

export interface BundleTotals {
  subtotal: number;
  compareAtSubtotal: number;
  savings: number;
}

/** Build the initial per-product selection map from each product's API seed. */
function seedSelections(steps: Step[]): Record<string, ProductSelection> {
  const selections: Record<string, ProductSelection> = {};

  for (const step of steps) {
    for (const product of step.products) {
      if (product.seed) {
        const key = product.seed.variantId ?? DEFAULT_VARIANT_KEY;
        selections[product.id] = {
          activeVariantId: product.seed.variantId,
          quantities: { [key]: product.seed.qty },
        };
      } else {
        selections[product.id] = {
          activeVariantId: product.variants?.[0]?.id ?? null,
          quantities: {},
        };
      }
    }
  }

  return selections;
}

/**
 * useBundleBuilder — owns ALL client state for the bundle builder: the open
 * accordion step, the active variant per card, and per-variant quantities.
 *
 * It receives the `steps` array from the react-query layer and seeds selections
 * from each product's `seed` the first time real data arrives. Everything the
 * UI needs (card state, per-step selected counts, derived line items and totals)
 * is exposed as memoised, referentially-stable helpers.
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

  // --- Open step ----------------------------------------------------------

  const setOpenStep = useCallback((index: number) => {
    setState((prev) => ({ ...prev, openStepIndex: index }));
  }, []);

  const goToNextStep = useCallback(() => {
    setState((prev) => ({ ...prev, openStepIndex: prev.openStepIndex + 1 }));
  }, []);

  // --- Quantity / variant mutations --------------------------------------

  const setQuantity = useCallback((productId: string, variantKey: string, qty: number) => {
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
  }, []);

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

  const adjustActive = useCallback((productId: string, delta: number) => {
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
  }, []);

  const incrementActive = useCallback(
    (productId: string) => adjustActive(productId, 1),
    [adjustActive],
  );
  const decrementActive = useCallback(
    (productId: string) => adjustActive(productId, -1),
    [adjustActive],
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
            image: variant?.image ?? product.image,
            category: step.category,
            stepId: step.id,
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
    getSelectedCount,
    isProductSelected,
    lineItems,
    totals,
  };
}

export type BundleBuilder = ReturnType<typeof useBundleBuilder>;
