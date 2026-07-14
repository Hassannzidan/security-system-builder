import { useCallback, useMemo, useRef, useState } from 'react';

import type { Step } from '@security-system-builder/shared';

import { loadSystem, saveSystem as writeSavedSystem } from '@/lib/systemStorage';

/**
 * Quantity-map key used for products that have no variants. Real variant ids
 * are used verbatim; this sentinel keeps the map shape uniform.
 */
export const DEFAULT_VARIANT_KEY = '__default__';

export interface ProductSelection {
  /** Which variant chip is currently active on the card (null when variant-less). */
  activeVariantId: string | null;
  /** Per-variant quantities. Keyed by variant id, or DEFAULT_VARIANT_KEY. */
  quantities: Record<string, number>;
}

/**
 * The full serialisable client state of the builder. This is exactly what the
 * storage module persists (as `SavedSystem['state']`) and what
 * {@link reconcileSavedState} produces — the storage layer imports this type
 * rather than redeclaring the shape.
 */
export interface BundleState {
  /** Index of the currently-open accordion step (0 on load, -1 when all collapsed). */
  openStepIndex: number;
  /** Client selection state, keyed by product id. */
  selections: Record<string, ProductSelection>;
}

/** One (product, variant) pair with a positive quantity, for the review panel. */
export interface LineItem {
  productId: string;
  /**
   * Quantity-map key for this line: the variant id, or DEFAULT_VARIANT_KEY when
   * the product is variant-less. The review row passes it straight back to
   * `setQuantity(productId, variantKey, qty)` so its stepper edits exactly this
   * line's variant.
   */
  variantKey: string;
  /** Real variant id (null when the product has no variants). */
  variantId: string | null;
  name: string;
  /**
   * Variant label appended after the name ("Wyze Cam v4 – Black"), but ONLY for
   * non-default variants. The default variant (the seed's, else the first) renders
   * as the bare product name to match the design's "Wyze Cam v4"; any other
   * variant is labelled so multiple lines of the same product stay distinguishable.
   */
  variantLabel?: string;
  /** Variant image when present, otherwise the product image. */
  thumbnail: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  /**
   * Struck-through original line total — present only when the product carries a
   * compare-at price (i.e. it is discounted). Absent for full-price lines.
   */
  lineCompareAtTotal?: number;
  /** Billing interval for recurring lines (plans) — drives the `/mo` suffix. */
  interval?: 'month';
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
 * Every product that ships with a `seed` starts selected at its seeded quantity
 * (under the seed's variant id, or DEFAULT_VARIANT_KEY when variant-less);
 * products with no seed start unselected. This holds uniformly across step
 * kinds:
 *   - Multi-select (cameras / sensors / extras): seeded products are pre-added
 *     at seed.qty so the default bundle — and its review-panel totals — is
 *     visible on load. Products with `seed: null` stay empty.
 *   - Single-select (plans): radio semantics require exactly one product chosen
 *     from load; the one seeded product (qty 1, under DEFAULT_VARIANT_KEY) is it.
 *   - Required (e.g. the sensor hub): seeded like the rest, then locked at that
 *     quantity by the mutator guards below so it can never change.
 *
 * The active variant (which colour chip is highlighted) always defaults to the
 * seed's variant when present, otherwise the first variant.
 */
function seedSelections(steps: Step[]): Record<string, ProductSelection> {
  const selections: Record<string, ProductSelection> = {};

  for (const step of steps) {
    for (const product of step.products) {
      const seedKey = product.seed?.variantId ?? DEFAULT_VARIANT_KEY;
      selections[product.id] = {
        activeVariantId: product.seed?.variantId ?? product.variants?.[0]?.id ?? null,
        quantities: product.seed != null ? { [seedKey]: product.seed.qty } : {},
      };
    }
  }

  return selections;
}

/**
 * Reconcile a previously-saved state against the CURRENT catalog.
 *
 * A saved system may predate catalog changes (a product renamed away, a variant
 * dropped, a required flag added). This maps the saved selections onto today's
 * steps, discarding anything that no longer applies and re-asserting the
 * invariants the live mutators guarantee, so hydration can never surface a
 * corrupt or impossible selection. Pure and side-effect free — unit tested.
 *
 * Rules, in order:
 *   - Start from a freshly-seeded baseline so products ADDED since the save get
 *     their seed defaults (and single-select/required products are covered).
 *   - Drop saved selections whose product no longer exists in any step.
 *   - Drop quantity keys whose variant no longer exists on the product
 *     (DEFAULT_VARIANT_KEY is always kept); clamp negative/non-finite qtys to 0.
 *   - Repair an activeVariantId that points at a now-missing variant.
 *   - Force `required` products back to their seeded selection, ignoring the
 *     saved value (they are locked and must never drift).
 *   - For single-select steps, enforce exactly one product at qty 1: honour the
 *     saved choice when still valid, else fall back to the step's seeded product.
 *   - Clamp openStepIndex into [-1, steps.length - 1] (−1 = all collapsed).
 */
export function reconcileSavedState(steps: Step[], saved: BundleState): BundleState {
  // Seeded baseline: guarantees an entry for every current product, so products
  // added to the catalog since the save appear with their defaults.
  const selections = seedSelections(steps);

  for (const step of steps) {
    for (const product of step.products) {
      // Required products are locked — keep the seeded selection untouched.
      if (product.required === true) continue;

      const savedSelection = saved.selections[product.id];
      if (!savedSelection) continue; // product absent from save → keep seed default

      const validVariantIds = new Set((product.variants ?? []).map((v) => v.id));

      // Keep only quantity keys that still resolve to a variant (or the default
      // sentinel), clamping negatives / non-finite values to 0.
      const quantities: Record<string, number> = {};
      for (const [key, qty] of Object.entries(savedSelection.quantities)) {
        if (key !== DEFAULT_VARIANT_KEY && !validVariantIds.has(key)) continue;
        quantities[key] = Number.isFinite(qty) ? Math.max(0, qty) : 0;
      }

      // Repair a dangling active variant back to the seed's (else first) variant.
      const activeVariantId =
        savedSelection.activeVariantId != null &&
        !validVariantIds.has(savedSelection.activeVariantId)
          ? (product.seed?.variantId ?? product.variants?.[0]?.id ?? null)
          : savedSelection.activeVariantId;

      selections[product.id] = { activeVariantId, quantities };
    }
  }

  // Single-select steps: exactly one product chosen at qty 1 under the default
  // key. Prefer the saved choice when it survived reconciliation; otherwise fall
  // back to the step's seeded product (or the first, if none is seeded).
  for (const step of steps) {
    if (step.selectionType !== 'single') continue;

    const savedChoice = step.products.find(
      (product) => (selections[product.id]?.quantities[DEFAULT_VARIANT_KEY] ?? 0) > 0,
    );
    const seededChoice = step.products.find((product) => product.seed != null);
    const chosenId = savedChoice?.id ?? seededChoice?.id ?? step.products[0]?.id ?? null;

    for (const product of step.products) {
      const current = selections[product.id] ?? { activeVariantId: null, quantities: {} };
      selections[product.id] = {
        ...current,
        quantities: {
          ...current.quantities,
          [DEFAULT_VARIANT_KEY]: product.id === chosenId ? 1 : 0,
        },
      };
    }
  }

  // Clamp the open step into range; −1 keeps the "all collapsed" state valid.
  const rawOpen = saved.openStepIndex;
  const openStepIndex = Number.isInteger(rawOpen)
    ? Math.max(-1, Math.min(steps.length - 1, rawOpen))
    : 0;

  return { openStepIndex, selections };
}

/**
 * The single source of the builder's initial selections, applied once the first
 * real `steps` arrive. There is exactly ONE resolution rule and no competing
 * path: a saved system (when present) is restored — reconciled against the
 * current catalog — and the API seeds are used ONLY when nothing is saved.
 *
 * Kept pure and exported so the initialization contract (saved-state-first, not
 * seed-first) is unit-tested directly, independent of React's render timing.
 */
export function resolveInitialState(steps: Step[], saved: BundleState | null): BundleState {
  return saved
    ? reconcileSavedState(steps, saved)
    : { openStepIndex: 0, selections: seedSelections(steps) };
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

  // Resolve initial state once, the first time real steps arrive. The guard is
  // gated on `steps.length > 0`, so it never fires (and never marks itself done)
  // against the empty array react-query returns before the fetch resolves — the
  // hydration waits for the catalog rather than giving up on it. Assigning state
  // during render (guarded by the ref) re-renders before commit, so the first
  // paint already shows the resolved quantities — no flash of empty state a
  // useEffect causes, and no seed-then-hydrate flicker.
  //
  // `resolveInitialState` is the ONLY writer of initial selections: it restores
  // a saved system when one exists (reconciled against the current catalog) and
  // seeds from the API only when nothing is saved — saved-state-first, never
  // seed-first. Because the ref tracks the `steps` identity (stable across
  // re-renders and re-created on a fresh mount), this survives StrictMode's
  // double-invocation without flipping to the seed path on a second run.
  const seededStepsRef = useRef<Step[] | null>(null);
  if (steps.length > 0 && seededStepsRef.current !== steps) {
    seededStepsRef.current = steps;
    setState(resolveInitialState(steps, loadSystem()));
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

  // --- Persistence --------------------------------------------------------

  // Exposed for the review panel's "Save my system for later" link. Snapshots the
  // current { openStepIndex, selections } and writes it through the storage
  // module, returning whether the write succeeded (false in private-mode / quota
  // situations) so the UI can give feedback.
  //
  // Saving is CLICK-TRIGGERED ONLY. Auto-saving on every state change was
  // deliberately NOT implemented: the task's contract is explicit — build →
  // click → return → restored — so persistence happens only when the user asks.
  const saveSystem = useCallback(
    (): boolean => writeSavedSystem({ openStepIndex, selections }),
    [openStepIndex, selections],
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
        const compareAt = product.pricing.compareAt;
        // The default variant (the seed's, else the first) renders without a
        // label to match the design's bare "Wyze Cam v4"; any other variant is
        // labelled so duplicate-product lines stay distinguishable.
        const defaultVariantId = product.seed?.variantId ?? product.variants?.[0]?.id ?? null;

        for (const [variantKey, quantity] of Object.entries(selection.quantities)) {
          if (quantity <= 0) continue;

          const variant =
            variantKey === DEFAULT_VARIANT_KEY
              ? null
              : (product.variants?.find((v) => v.id === variantKey) ?? null);

          items.push({
            productId: product.id,
            variantKey,
            variantId: variant?.id ?? null,
            name: product.name,
            variantLabel: variant && variant.id !== defaultVariantId ? variant.label : undefined,
            thumbnail: variant?.image ?? product.image ?? '',
            qty: quantity,
            unitPrice,
            lineTotal: unitPrice * quantity,
            lineCompareAtTotal: compareAt != null ? compareAt * quantity : undefined,
            interval: product.pricing.interval,
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
    // Lines with no compare-at contribute their own total, so an all-full-price
    // bundle yields zero savings.
    const compareAtSubtotal = lineItems.reduce(
      (sum, item) => sum + (item.lineCompareAtTotal ?? item.lineTotal),
      0,
    );
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
    saveSystem,
    lineItems,
    totals,
  };
}

export type BundleBuilder = ReturnType<typeof useBundleBuilder>;
