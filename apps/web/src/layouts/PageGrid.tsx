import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface PageGridProps {
  children: ReactNode;
  /** Element to render as the grid root. Defaults to `div`. */
  as?: ElementType;
  /** Extra classes on the grid root (background, min-height, etc.). */
  className?: string;
}

/**
 * Shared page column grid (full viewport width).
 *
 * The root element *is* the grid — pages put layout on this shell, and children
 * choose columns with `col-span` / `col-start`. Components stay layout-agnostic.
 *
 * - Below `lg`: single column.
 * - `lg`+: 12-column grid.
 */
export function PageGrid({ children, as: Comp = 'div', className }: PageGridProps) {
  return (
    <Comp
      className={cn(
        'grid w-full grid-cols-1 gap-4 py-6 sm:py-8 lg:grid-cols-12 lg:gap-4 lg:py-10',
        className,
      )}
    >
      {children}
    </Comp>
  );
}
