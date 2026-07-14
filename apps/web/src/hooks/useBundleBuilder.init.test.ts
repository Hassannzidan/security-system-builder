import { createElement, StrictMode, useState } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { Step } from '@security-system-builder/shared';

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

  it('applies the API seeds when nothing is saved', () => {
    const state = resolveInitialState(steps, null);

    // Cam v4 has no seed → starts unselected.
    expect(state.selections['wyze-cam-v4']?.quantities).toEqual({});
    // Seeded products come up at their seed quantities.
    expect(state.selections['cam-unlimited']?.quantities[DEFAULT_VARIANT_KEY]).toBe(1);
    expect(state.selections['wyze-sense-motion-sensor']?.quantities[DEFAULT_VARIANT_KEY]).toBe(2);
    expect(state.selections['wyze-microsd-card-256gb']?.quantities[DEFAULT_VARIANT_KEY]).toBe(2);
    expect(state.selections['wyze-sense-hub']?.quantities[DEFAULT_VARIANT_KEY]).toBe(1);
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

  it('seeds when storage is empty (Cam v4 unselected — qty 0, default variant highlighted)', () => {
    const renderer = mountAndDeliver();
    // No seed on Cam v4 → quantity 0 (unselected); the active chip defaults to
    // the first variant ("white"), exactly as seedSelections produces.
    expect(captured.cam).toEqual({ activeVariantId: 'white', quantity: 0 });
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
