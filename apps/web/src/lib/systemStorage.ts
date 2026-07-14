/**
 * systemStorage — the single place in the app that touches `localStorage`.
 *
 * Everything else (the hook, the review panel) goes through these functions, so
 * the storage key, the on-disk shape and its validation live in exactly one
 * spot. The persisted payload is a versioned {@link SavedSystem}; on read it is
 * parsed and validated with zod, and any corrupt / stale / wrong-version blob is
 * removed and treated as "nothing saved". None of these functions throw.
 */
import { z } from 'zod';

import type { BundleState } from '@/hooks/useBundleBuilder';

/** Versioned storage key — bump the `v1` suffix on any breaking shape change. */
const STORAGE_KEY = 'security-system-builder:saved-system:v1';

/**
 * The persisted envelope. `state` is exactly the hook's {@link BundleState}, so
 * the shape is defined once (in the hook) and reused here rather than redeclared.
 */
export interface SavedSystem {
  version: 1;
  /** ISO-8601 timestamp of when the system was saved. */
  savedAt: string;
  state: BundleState;
}

const productSelectionSchema = z.object({
  activeVariantId: z.string().nullable(),
  // z.number() rejects NaN by default, so a corrupt numeric survives validation
  // only as a finite number; reconciliation clamps the rest.
  quantities: z.record(z.string(), z.number()),
});

const savedSystemSchema = z.object({
  version: z.literal(1),
  savedAt: z.string(),
  state: z.object({
    openStepIndex: z.number(),
    selections: z.record(z.string(), productSelectionSchema),
  }),
});

/**
 * Safely resolve `localStorage`. Returns null when storage is unavailable
 * (SSR, or a browser that throws on access in private mode) so callers degrade
 * to "nothing saved" instead of crashing.
 */
function getStorage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

/**
 * Serialise and persist the current builder state under the versioned key.
 * Returns true on success, false if the write failed (quota exceeded, private
 * mode, storage disabled) — never throws.
 */
export function saveSystem(state: BundleState): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    const payload: SavedSystem = {
      version: 1,
      savedAt: new Date().toISOString(),
      state,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

/**
 * Read, parse and validate the saved state. Returns the persisted
 * {@link BundleState}, or null when there is nothing saved. On corrupt JSON,
 * schema-validation failure or a version mismatch, the bad key is removed and
 * null is returned. Never throws.
 */
export function loadSystem(): BundleState | null {
  const storage = getStorage();
  if (!storage) return null;

  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (raw == null) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // JSON.parse failed → corrupt blob. Remove it so we cleanly fall back to seeds.
    if (import.meta.env.DEV) {
      console.warn('[systemStorage] Discarding saved system: JSON.parse failed (corrupt blob).');
    }
    clearSystem();
    return null;
  }

  const result = savedSystemSchema.safeParse(parsed);
  if (!result.success) {
    if (import.meta.env.DEV) {
      const versionMismatch = result.error.issues.some((issue) => issue.path[0] === 'version');
      console.warn(
        `[systemStorage] Discarding saved system: ${
          versionMismatch ? 'version mismatch' : 'schema validation failed'
        }.`,
        result.error.issues,
      );
    }
    clearSystem();
    return null;
  }

  return result.data.state;
}

/** Remove any saved system. No-op when storage is unavailable; never throws. */
export function clearSystem(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Best-effort — nothing more we can do if removal fails.
  }
}
