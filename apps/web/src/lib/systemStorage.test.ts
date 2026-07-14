import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { BundleState } from '@/hooks/useBundleBuilder';

import { clearSystem, loadSystem, saveSystem } from './systemStorage';

/** Must match the versioned key in systemStorage.ts. */
const STORAGE_KEY = 'security-system-builder:saved-system:v1';

/** Minimal in-memory Storage stub so these suites need no jsdom/happy-dom. */
function createFakeStorage(): Storage & { _map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    _map: map,
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? (map.get(key) as string) : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => map.delete(key),
    setItem: (key: string, value: string) => map.set(key, String(value)),
  };
}

function sampleState(): BundleState {
  return {
    openStepIndex: 1,
    selections: {
      'cam-a': { activeVariantId: 'black', quantities: { black: 2 } },
      hub: { activeVariantId: null, quantities: { __default__: 1 } },
    },
  };
}

let fakeStorage: ReturnType<typeof createFakeStorage>;

beforeEach(() => {
  fakeStorage = createFakeStorage();
  (globalThis as { localStorage?: Storage }).localStorage = fakeStorage;
});

afterEach(() => {
  delete (globalThis as { localStorage?: Storage }).localStorage;
});

describe('systemStorage', () => {
  it('round-trips a saved system', () => {
    const state = sampleState();

    expect(saveSystem(state)).toBe(true);
    expect(loadSystem()).toEqual(state);

    // Payload is versioned and timestamped.
    const raw = fakeStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const payload = JSON.parse(raw as string);
    expect(payload.version).toBe(1);
    expect(typeof payload.savedAt).toBe('string');
    expect(payload.state).toEqual(state);
  });

  it('returns null and clears the key on corrupt JSON', () => {
    fakeStorage.setItem(STORAGE_KEY, '{ this is not valid json');

    expect(loadSystem()).toBeNull();
    expect(fakeStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('returns null and clears the key on a version mismatch', () => {
    fakeStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 2, savedAt: 'x', state: sampleState() }),
    );

    expect(loadSystem()).toBeNull();
    expect(fakeStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('returns null and clears the key when the shape fails validation', () => {
    fakeStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, savedAt: 'x', state: { openStepIndex: 'nope' } }),
    );

    expect(loadSystem()).toBeNull();
    expect(fakeStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('returns null when nothing is saved', () => {
    expect(loadSystem()).toBeNull();
  });

  it('clearSystem removes the saved payload', () => {
    saveSystem(sampleState());
    expect(fakeStorage.getItem(STORAGE_KEY)).not.toBeNull();

    clearSystem();
    expect(fakeStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('saveSystem returns false when the write throws (quota / private mode)', () => {
    (globalThis as { localStorage?: Storage }).localStorage = {
      ...fakeStorage,
      setItem: () => {
        throw new DOMException('QuotaExceededError');
      },
    } as Storage;

    expect(saveSystem(sampleState())).toBe(false);
  });

  it('degrades to null / false when storage is unavailable', () => {
    delete (globalThis as { localStorage?: Storage }).localStorage;

    expect(loadSystem()).toBeNull();
    expect(saveSystem(sampleState())).toBe(false);
    expect(() => clearSystem()).not.toThrow();
  });
});
