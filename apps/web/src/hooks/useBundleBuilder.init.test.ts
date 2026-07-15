import { createElement, StrictMode, useState } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { Step, StepProduct } from '@security-system-builder/shared';

import stepsJson from '../../../api/src/data/steps.json';
import {
  DEFAULT_VARIANT_KEY,
  resolveInitialState,
  useBundleBuilder,
  type BundleState,
} from './useBundleBuilder';

/**
 * Regression coverage for the builder's ONE-TIME hydration: a saved system must
 * be restored (saved-state-first), and the API seeds must apply only when there
 * is nothing saved. Uses the real 4-step catalog so the mock and production
 * agree on product ids / variants.
 */

const steps = (stepsJson as { steps: Step[] }).steps;
const STORAGE_KEY = 'security-system-builder:saved-system:v1';

// --- Seed-derived expectations ---------------------------------------------
// These hydration tests assert "the seed is applied correctly" — a property that
// must hold for ANY seed values, not the specific numbers that ship today. So we
// DERIVE the expected hydrated state from each product's own `seed` in the live
// catalog rather than hardcoding steps.json's quantities (which drift and then
// silently lie). The derivation still fails loudly if seeding logic breaks: it
// reads only the raw `seed.variantId` / `seed.qty` inputs and compares them to
// the hydrated output.

/** Every product across all steps, flattened. */
function allProducts(): StepProduct[] {
  return steps.flatMap((step) => step.products);
}

/** Find a product by id, throwing if the catalog no longer contains it. */
function findProduct(id: string): StepProduct {
  const product = allProducts().find((p) => p.id === id);
  if (!product) throw new Error(`No product "${id}" in the catalog`);
  return product;
}

/**
 * The quantity map `seedSelections` must produce for a product, derived purely
 * from its seed: seeded products carry `seed.qty` under the seed's variant id
 * (or the default key), seedless products come up with an empty map (unselected).
 */
function expectedSeededQuantities(id: string): Record<string, number> {
  const { seed } = findProduct(id);
  if (seed == null) return {};
  return { [seed.variantId ?? DEFAULT_VARIANT_KEY]: seed.qty };
}

/** The card state (`getCardState` shape) a freshly-seeded product must show. */
function expectedSeededCard(id: string): { activeVariantId: string | null; quantity: number } {
  const product = findProduct(id);
  const activeVariantId = product.seed?.variantId ?? product.variants?.[0]?.id ?? null;
  const key = activeVariantId ?? DEFAULT_VARIANT_KEY;
  return { activeVariantId, quantity: expectedSeededQuantities(id)[key] ?? 0 };
}

/** The exact bug-report payload: Cam v4 Black ×10, hub 1, cam-unlimited 1. */
function bugReportSaved(): BundleState {
  return {
    openStepIndex: 0,
    selections: {
      'wyze-cam-v4': { activeVariantId: 'black', quantities: { black: 10 } },
      'wyze-sense-hub': { activeVariantId: null, quantities: { [DEFAULT_VARIANT_KEY]: 1 } },
      'cam-unlimited': { activeVariantId: null, quantities: { [DEFAULT_VARIANT_KEY]: 1 } },
    },
  };
}

// --- resolveInitialState (pure, render-timing independent) ------------------

describe('resolveInitialState', () => {
  it('restores the saved bug-report payload (Black ×10), not the seeds', () => {
    const state = resolveInitialState(steps, bugReportSaved());

    expect(state.selections['wyze-cam-v4']).toEqual({
      activeVariantId: 'black',
      quantities: { black: 10 },
    });
    expect(state.selections['cam-unlimited']?.quantities[DEFAULT_VARIANT_KEY]).toBe(1);
    expect(state.selections['wyze-sense-hub']?.quantities[DEFAULT_VARIANT_KEY]).toBe(1);
  });

  it('applies each product API seed when nothing is saved', () => {
    const state = resolveInitialState(steps, null);

    // Property: for EVERY product the hydrated quantity map equals exactly what
    // its own seed prescribes. Seeded products come up at seed.qty (under the
    // seed's variant, or the default key); seedless products stay unselected with
    // an empty map. Derived from the catalog, so it holds for any seed values.
    for (const product of allProducts()) {
      expect(state.selections[product.id]?.quantities).toEqual(
        expectedSeededQuantities(product.id),
      );
    }

    // The catalog must genuinely exercise both branches — otherwise the loop
    // above could pass on a degenerate (all-seeded or all-seedless) catalog.
    expect(allProducts().some((p) => p.seed != null)).toBe(true);
    expect(allProducts().some((p) => p.seed == null)).toBe(true);

    // Named products still hydrate to their own seed, asserted against the exact
    // seed input (variant + qty) rather than a hardcoded literal.
    for (const id of ['wyze-cam-v4', 'cam-unlimited', 'wyze-sense-hub']) {
      const { seed } = findProduct(id);
      expect(seed).not.toBeNull(); // these ship seeded
      const key = seed!.variantId ?? DEFAULT_VARIANT_KEY;
      expect(state.selections[id]?.quantities[key]).toBe(seed!.qty);
    }
  });
});

// --- Hook initialization (real render timing) ------------------------------

function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? (map.get(k) as string) : null),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => map.delete(k),
    setItem: (k: string, v: string) => map.set(k, String(v)),
  } as Storage;
}

function writeSaved(state: BundleState): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: 1, savedAt: '2026-07-14T00:00:00.000Z', state }),
  );
}

/** Captured on every render so assertions can read the latest hydrated state. */
interface Captured {
  cam: { activeVariantId: string | null; quantity: number };
  save: () => boolean;
}
let captured: Captured;
let deliverSteps: (s: Step[]) => void;

/** Mirrors react-query: mounts with [] (pending), then delivers real steps. */
function Harness() {
  const [s, setS] = useState<Step[]>([]);
  deliverSteps = setS;
  const builder = useBundleBuilder(s);
  captured = { cam: builder.getCardState('wyze-cam-v4'), save: builder.saveSystem };
  return null;
}

/** Mount the harness, then deliver the catalog — the empty→populated sequence. */
function mountAndDeliver(strict = false): TestRenderer.ReactTestRenderer {
  let renderer!: TestRenderer.ReactTestRenderer;
  const element = strict
    ? createElement(StrictMode, null, createElement(Harness))
    : createElement(Harness);
  act(() => {
    renderer = TestRenderer.create(element);
  });
  act(() => {
    deliverSteps(steps);
  });
  return renderer;
}

beforeEach(() => {
  (globalThis as { localStorage?: Storage }).localStorage = fakeStorage();
});
afterEach(() => {
  delete (globalThis as { localStorage?: Storage }).localStorage;
});

describe('useBundleBuilder hydration', () => {
  it('initializes with Black ×10 from the saved payload (seeds NOT applied)', () => {
    writeSaved(bugReportSaved());

    const renderer = mountAndDeliver();
    expect(captured.cam).toEqual({ activeVariantId: 'black', quantity: 10 });
    act(() => renderer.unmount());
  });

  it('does not hydrate against the empty steps array before the catalog arrives', () => {
    writeSaved(bugReportSaved());

    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(createElement(Harness));
    });
    // Still pending: no selections yet, and crucially the guard has NOT marked
    // itself done, so the catalog can still hydrate the saved state.
    expect(captured.cam).toEqual({ activeVariantId: null, quantity: 0 });

    act(() => {
      deliverSteps(steps);
    });
    expect(captured.cam).toEqual({ activeVariantId: 'black', quantity: 10 });
    act(() => renderer.unmount());
  });

  it('seeds Cam v4 from its API seed when storage is empty', () => {
    const renderer = mountAndDeliver();
    // Nothing saved → the card shows exactly Cam v4's seed: whatever variant and
    // quantity steps.json prescribes (white ×1 today), derived here so the test
    // tracks the seed instead of a hardcoded number.
    expect(captured.cam).toEqual(expectedSeededCard('wyze-cam-v4'));
    act(() => renderer.unmount());
  });

  it('survives StrictMode double-invocation (still Black ×10, not seeds)', () => {
    writeSaved(bugReportSaved());

    const renderer = mountAndDeliver(true);
    expect(captured.cam).toEqual({ activeVariantId: 'black', quantity: 10 });
    act(() => renderer.unmount());
  });

  it('stays correct across save → reload → save → reload', () => {
    writeSaved(bugReportSaved());

    // Session 1: hydrate, then re-save the current system (unchanged).
    const first = mountAndDeliver();
    expect(captured.cam).toEqual({ activeVariantId: 'black', quantity: 10 });
    act(() => {
      expect(captured.save()).toBe(true);
    });
    act(() => first.unmount());

    // Session 2 (reload): a fresh mount must restore Black ×10 again.
    const second = mountAndDeliver();
    expect(captured.cam).toEqual({ activeVariantId: 'black', quantity: 10 });
    act(() => {
      expect(captured.save()).toBe(true);
    });
    act(() => second.unmount());

    // Session 3 (reload again): still correct — the guard doesn't degrade.
    const third = mountAndDeliver();
    expect(captured.cam).toEqual({ activeVariantId: 'black', quantity: 10 });
    act(() => third.unmount());
  });
});
