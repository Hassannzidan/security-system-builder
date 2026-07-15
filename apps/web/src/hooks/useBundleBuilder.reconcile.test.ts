import { describe, expect, it } from 'vitest';

import type { Step } from '@security-system-builder/shared';

import { DEFAULT_VARIANT_KEY, reconcileSavedState, type BundleState } from './useBundleBuilder';

/**
 * Build a representative 3-step catalog: a multi-select camera step (a variant
 * product + a seeded variant-less sensor), a single-select plan step (seeded
 * "basic"), and a step holding a required, locked hub.
 */
function makeSteps(): Step[] {
  return [
    {
      id: 'cameras',
      order: 1,
      title: 'Cameras',
      icon: 'camera',
      category: 'Cameras',
      selectionType: 'multiple',
      products: [
        {
          id: 'cam-a',
          name: 'Cam A',
          pricing: { price: 10 },
          variants: [
            { id: 'white', label: 'White', swatch: '', image: '' },
            { id: 'black', label: 'Black', swatch: '', image: '' },
          ],
          seed: null,
        },
        {
          id: 'sensor-motion',
          name: 'Motion Sensor',
          pricing: { price: 19 },
          variants: null,
          seed: { variantId: null, qty: 2 },
        },
      ],
    },
    {
      id: 'plan',
      order: 2,
      title: 'Plan',
      icon: 'plan',
      category: 'Plan',
      selectionType: 'single',
      products: [
        {
          id: 'plan-basic',
          name: 'Basic',
          pricing: { price: 9, interval: 'month' },
          variants: null,
          seed: { variantId: null, qty: 1 },
        },
        {
          id: 'plan-pro',
          name: 'Pro',
          pricing: { price: 19, interval: 'month' },
          variants: null,
          seed: null,
        },
      ],
    },
    {
      id: 'sensors',
      order: 3,
      title: 'Sensors',
      icon: 'sensor',
      category: 'Sensors',
      selectionType: 'multiple',
      products: [
        {
          id: 'hub',
          name: 'Hub',
          pricing: { price: 0 },
          variants: null,
          required: true,
          seed: { variantId: null, qty: 1 },
        },
      ],
    },
  ];
}

/** A fully-valid saved state that should survive reconciliation intact. */
function makeValidSaved(): BundleState {
  return {
    openStepIndex: 2,
    selections: {
      'cam-a': { activeVariantId: 'black', quantities: { black: 3 } },
      'sensor-motion': { activeVariantId: null, quantities: { [DEFAULT_VARIANT_KEY]: 2 } },
      'plan-basic': { activeVariantId: null, quantities: { [DEFAULT_VARIANT_KEY]: 0 } },
      'plan-pro': { activeVariantId: null, quantities: { [DEFAULT_VARIANT_KEY]: 1 } },
      hub: { activeVariantId: null, quantities: { [DEFAULT_VARIANT_KEY]: 1 } },
    },
  };
}

describe('reconcileSavedState', () => {
  it('preserves a valid saved state (roundtrip)', () => {
    const result = reconcileSavedState(makeSteps(), makeValidSaved());

    expect(result.openStepIndex).toBe(2);
    // Multi-select variant quantity kept as-is.
    expect(result.selections['cam-a']).toEqual({
      activeVariantId: 'black',
      quantities: { black: 3 },
    });
    // Single-select choice honoured: pro selected, basic zeroed.
    expect(result.selections['plan-pro']?.quantities[DEFAULT_VARIANT_KEY]).toBe(1);
    expect(result.selections['plan-basic']?.quantities[DEFAULT_VARIANT_KEY]).toBe(0);
    // Required hub stays at its seed.
    expect(result.selections['hub']?.quantities[DEFAULT_VARIANT_KEY]).toBe(1);
  });

  it('drops a selection whose product no longer exists in the catalog', () => {
    const saved = makeValidSaved();
    saved.selections['ghost-product'] = {
      activeVariantId: null,
      quantities: { [DEFAULT_VARIANT_KEY]: 5 },
    };

    const result = reconcileSavedState(makeSteps(), saved);

    expect(result.selections['ghost-product']).toBeUndefined();
  });

  it('drops a quantity key whose variant no longer exists on the product', () => {
    const saved = makeValidSaved();
    saved.selections['cam-a'] = {
      activeVariantId: 'black',
      quantities: { black: 2, magenta: 4 }, // magenta is not a current variant
    };

    const result = reconcileSavedState(makeSteps(), saved);

    expect(result.selections['cam-a']?.quantities).toEqual({ black: 2 });
    expect(result.selections['cam-a']?.quantities['magenta']).toBeUndefined();
  });

  it('repairs an activeVariantId that points at a removed variant', () => {
    const saved = makeValidSaved();
    saved.selections['cam-a'] = {
      activeVariantId: 'magenta', // removed
      quantities: { black: 1 },
    };

    const result = reconcileSavedState(makeSteps(), saved);

    // Falls back to the first variant (no seed variant on cam-a).
    expect(result.selections['cam-a']?.activeVariantId).toBe('white');
  });

  it('forces a required product back to its seeded quantity, ignoring the saved value', () => {
    const saved = makeValidSaved();
    // Tamper: hub set to 0 (as if the lock were bypassed) and later to 5.
    saved.selections['hub'] = { activeVariantId: null, quantities: { [DEFAULT_VARIANT_KEY]: 0 } };
    expect(
      reconcileSavedState(makeSteps(), saved).selections['hub']?.quantities[DEFAULT_VARIANT_KEY],
    ).toBe(1);

    saved.selections['hub'] = { activeVariantId: null, quantities: { [DEFAULT_VARIANT_KEY]: 5 } };
    expect(
      reconcileSavedState(makeSteps(), saved).selections['hub']?.quantities[DEFAULT_VARIANT_KEY],
    ).toBe(1);
  });

  it('falls back to the seeded plan when the saved single-select choice is gone', () => {
    const saved = makeValidSaved();
    // The saved plan no longer exists; both real plans are unselected.
    saved.selections['plan-basic'] = {
      activeVariantId: null,
      quantities: { [DEFAULT_VARIANT_KEY]: 0 },
    };
    saved.selections['plan-pro'] = {
      activeVariantId: null,
      quantities: { [DEFAULT_VARIANT_KEY]: 0 },
    };
    saved.selections['plan-legacy'] = {
      activeVariantId: null,
      quantities: { [DEFAULT_VARIANT_KEY]: 1 },
    };

    const result = reconcileSavedState(makeSteps(), saved);

    // Seeded plan (basic) becomes the single selection; exactly one at qty 1.
    expect(result.selections['plan-basic']?.quantities[DEFAULT_VARIANT_KEY]).toBe(1);
    expect(result.selections['plan-pro']?.quantities[DEFAULT_VARIANT_KEY]).toBe(0);
    expect(result.selections['plan-legacy']).toBeUndefined();
  });

  it('enforces exactly one selected plan even if the saved payload has several/too-many', () => {
    const saved = makeValidSaved();
    // Tamper: both plans "selected", pro with an inflated qty.
    saved.selections['plan-basic'] = {
      activeVariantId: null,
      quantities: { [DEFAULT_VARIANT_KEY]: 1 },
    };
    saved.selections['plan-pro'] = {
      activeVariantId: null,
      quantities: { [DEFAULT_VARIANT_KEY]: 5 },
    };

    const result = reconcileSavedState(makeSteps(), saved);
    const selectedCount = ['plan-basic', 'plan-pro'].filter(
      (id) => (result.selections[id]?.quantities[DEFAULT_VARIANT_KEY] ?? 0) > 0,
    );

    expect(selectedCount).toHaveLength(1);
    // First matching product wins and is clamped to exactly 1.
    expect(result.selections['plan-basic']?.quantities[DEFAULT_VARIANT_KEY]).toBe(1);
    expect(result.selections['plan-pro']?.quantities[DEFAULT_VARIANT_KEY]).toBe(0);
  });

  it('clamps negative quantities to 0', () => {
    const saved = makeValidSaved();
    saved.selections['sensor-motion'] = {
      activeVariantId: null,
      quantities: { [DEFAULT_VARIANT_KEY]: -4 },
    };

    const result = reconcileSavedState(makeSteps(), saved);

    expect(result.selections['sensor-motion']?.quantities[DEFAULT_VARIANT_KEY]).toBe(0);
  });

  it('clamps openStepIndex into range', () => {
    const steps = makeSteps();
    expect(
      reconcileSavedState(steps, { ...makeValidSaved(), openStepIndex: 99 }).openStepIndex,
    ).toBe(steps.length - 1);
    expect(
      reconcileSavedState(steps, { ...makeValidSaved(), openStepIndex: -8 }).openStepIndex,
    ).toBe(-1);
    expect(
      reconcileSavedState(steps, { ...makeValidSaved(), openStepIndex: 1.5 }).openStepIndex,
    ).toBe(0);
  });

  it('seeds a product that was added to the catalog after the save', () => {
    const steps = makeSteps();
    // Saved state predates 'sensor-motion' existing — omit it entirely.
    const saved = makeValidSaved();
    delete saved.selections['sensor-motion'];

    const result = reconcileSavedState(steps, saved);

    // New product picks up its seed default (qty 2).
    expect(result.selections['sensor-motion']?.quantities[DEFAULT_VARIANT_KEY]).toBe(2);
  });
});
