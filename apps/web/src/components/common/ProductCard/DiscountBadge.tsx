import type { ReactNode } from 'react';

import { borderWidth, colors, radius } from '@/design-tokens';
import { cn } from '@/lib/utils';

export function DiscountBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        'text-badge absolute left-0 top-0 z-10 inline-flex items-center justify-center whitespace-nowrap text-center text-white shadow-sm',
      )}
      style={{
        width: 65,
        height: 19,
        borderRadius: radius.lg,
        background: `linear-gradient(135deg, #6D4AE0 0%, ${colors.primary.DEFAULT} 100%)`,
        border: `solid ${borderWidth.sm} ${colors.border.black}`,
      }}
    >
      {children}
    </span>
  );
}
