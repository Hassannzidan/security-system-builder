import { Link } from 'react-router-dom';

import { PageGrid } from '@/layouts';
import { cn } from '@/lib/utils';

/** Center band: full width on mobile, cols 2–11 on lg+. */
const CENTER_COLS = 'col-span-full min-w-0 lg:col-span-10 lg:col-start-2';

/**
 * 404 page — rendered by the catch-all `path: '*'` route. Mirrors the HomePage
 * shell (shared `PageGrid`, `bg-canvas` canvas, Gilroy type, `primary` accent) so
 * a missing route still feels like part of the builder rather than a dead end.
 */
export function NotFoundPage() {
  return (
    <PageGrid as="main" className="min-h-screen bg-canvas">
      <div
        className={cn(
          CENTER_COLS,
          'flex min-h-[70vh] flex-col items-center justify-center text-center',
        )}
      >
        <p className="font-primary text-[64px] font-bold leading-none tracking-tight text-primary sm:text-[88px]">
          404
        </p>

        <h1 className="mt-4 font-primary text-xl font-semibold text-ink-heading sm:text-2xl">
          This page went off the grid
        </h1>

        <p className="mt-3 max-w-md font-primary text-sm font-medium text-ink-secondary">
          The page you’re looking for doesn’t exist or may have been moved. Let’s get you back to
          building your security system.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-primary text-sm font-semibold text-white transition-colors hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Back to home
        </Link>
      </div>
    </PageGrid>
  );
}
