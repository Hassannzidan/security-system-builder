import type { ReactNode } from 'react';

import { colors, radius } from '@/design-tokens';
import { cn } from '@/lib/utils';

interface ReviewPanelProps {
  children: ReactNode;
  className?: string;
}

/** Shared review panel surface — one background + radius for eyebrow and body. */
export function ReviewPanel({ children, className }: ReviewPanelProps) {
  return (
    <div
      className={cn('flex min-w-0 flex-col overflow-hidden', className)}
      style={{
        backgroundColor: colors.background.reviewPanel,
        borderRadius: radius.xl,
      }}
    >
      {children}
    </div>
  );
}
