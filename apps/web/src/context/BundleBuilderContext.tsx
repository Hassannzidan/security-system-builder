/**
 * Bundle-builder context.
 *
 * `useBundleBuilder` owns ALL selection state for the page. Two sibling trees now
 * need that state — the step accordion and the review panel — so the hook is
 * instantiated exactly once here (alongside the steps query) and shared through
 * context. This keeps a single source of truth: a quantity changed on a product
 * card and the same quantity changed on a review row are the very same state, so
 * they stay in sync automatically. Context around the existing hook is the right
 * size for this app — no external state library is warranted.
 */
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';

import type { Step } from '@security-system-builder/shared';

import { useStepsQuery } from '@/hooks/useStepsQuery';
import { useBundleBuilder, type BundleBuilder } from '@/hooks/useBundleBuilder';

/** Everything the hook exposes, plus the steps data and query status. */
export interface BundleBuilderContextValue extends BundleBuilder {
  /** Steps as returned by the query (empty array until the first load resolves). */
  steps: Step[];
  isPending: boolean;
  isError: boolean;
  /** Re-run the steps query (used by the error-state "Try again" button). */
  refetch: () => void;
}

const BundleBuilderContext = createContext<BundleBuilderContextValue | undefined>(undefined);

export function BundleBuilderProvider({ children }: { children: ReactNode }) {
  const stepsQuery = useStepsQuery();
  const { isPending, isError, refetch: queryRefetch } = stepsQuery;
  const steps = useMemo(() => stepsQuery.data ?? [], [stepsQuery.data]);
  const builder = useBundleBuilder(steps);

  const refetch = useCallback(() => {
    void queryRefetch();
  }, [queryRefetch]);

  // `builder` is a fresh object every render (the hook returns an object literal),
  // so this recomputes whenever bundle state changes — exactly what we want:
  // consumers re-render together on every selection change.
  const value = useMemo<BundleBuilderContextValue>(
    () => ({ ...builder, steps, isPending, isError, refetch }),
    [builder, steps, isPending, isError, refetch],
  );

  return <BundleBuilderContext.Provider value={value}>{children}</BundleBuilderContext.Provider>;
}

/**
 * Access the shared bundle-builder state. Throws a descriptive error when called
 * outside `<BundleBuilderProvider>` so the misuse surfaces immediately.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useBundleBuilderContext(): BundleBuilderContextValue {
  const ctx = useContext(BundleBuilderContext);
  if (!ctx) {
    throw new Error(
      'useBundleBuilderContext must be used within a <BundleBuilderProvider>. ' +
        'Wrap the page (or the relevant subtree) in the provider before consuming bundle-builder state.',
    );
  }
  return ctx;
}
