// @vitest-environment jsdom
import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Step } from '@security-system-builder/shared';

import stepsJson from '../../../api/src/data/steps.json';
import { BundleBuilderProvider, useBundleBuilderContext } from '@/context/BundleBuilderContext';

/**
 * End-to-end hydration regression under REAL react-dom `<StrictMode>`.
 *
 * The pure/init suites render with `react-test-renderer`, whose StrictMode is a
 * no-op (no double-invoke, no double-mount) — so they never exercised the case
 * that actually shipped a bug: on load, a saved system did NOT appear until the
 * user touched the UI. The cause was a marker stored in a ref and mutated during
 * render; StrictMode's dev double-mount reset the ref while react-query kept its
 * cache, silently dropping the render-phase hydration. Tracking the marker in
 * state fixes it. This suite mounts the real provider + react-query stack the way
 * `main.tsx` does, so a regression here would fail the way users saw it.
 */

const steps = (stepsJson as { steps: Step[] }).steps;
const STORAGE_KEY = 'security-system-builder:saved-system:v1';

// The real steps query resolves through the service; mock it to the catalog.
vi.mock('@/services', () => ({
  stepsService: { list: () => Promise.resolve(steps) },
}));

/** Reads Cam v4 card state from context and offers an unrelated re-render trigger. */
function CamProbe() {
  const builder = useBundleBuilderContext();
  if (builder.isPending) return <div>pending</div>;
  const cam = builder.getCardState('wyze-cam-v4');
  return (
    <div>
      <span data-testid="cam">
        {cam.activeVariantId ?? 'none'}:{cam.quantity}
      </span>
      {/* Poke a different product — proves hydration was already applied, not
          lazily triggered by the interaction itself. */}
      <button onClick={() => builder.incrementActive('wyze-cam-pan-v3')}>poke</button>
    </div>
  );
}

function mountApp() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BundleBuilderProvider>
          <CamProbe />
        </BundleBuilderProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

function writeSaved(): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      savedAt: '2026-07-14T00:00:00.000Z',
      state: {
        openStepIndex: 0,
        selections: { 'wyze-cam-v4': { activeVariantId: 'black', quantities: { black: 5 } } },
      },
    }),
  );
}

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('useBundleBuilder hydration under react-dom StrictMode', () => {
  it('restores the saved system automatically on load — no interaction required', async () => {
    writeSaved();
    mountApp();

    // Wait for the query to resolve and the card to render, then assert the saved
    // Black ×5 is visible WITHOUT any user interaction.
    await waitFor(() => expect(screen.getByTestId('cam').textContent).toBe('black:5'));
  });

  it('seeds Cam v4 unselected when nothing is saved', async () => {
    mountApp();
    // Cam v4 has no seed → quantity 0, first variant ("white") highlighted.
    await waitFor(() => expect(screen.getByTestId('cam').textContent).toBe('white:0'));
  });

  it('keeps the restored selection after an unrelated interaction', async () => {
    writeSaved();
    mountApp();
    await waitFor(() => expect(screen.getByTestId('cam').textContent).toBe('black:5'));

    await act(async () => {
      fireEvent.click(screen.getByText('poke'));
    });
    // Poking another product must not disturb the hydrated Cam v4 selection.
    expect(screen.getByTestId('cam').textContent).toBe('black:5');
  });
});
