import type { ReactNode } from 'react';

import {
  borderWidth,
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
} from '@/design-tokens';
import { cn } from '@/lib/utils';

export function DiscountBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        'absolute left-0 top-0 z-10 inline-flex items-center justify-center text-white shadow-sm',
      )}
      style={{
        width: 65,
        height: 19,
        borderRadius: radius.lg,
        background: 'linear-gradient(135deg, #6D4AE0 0%, #4E2FD2 100%)',
        border: `solid ${borderWidth.sm} ${colors.border.black}`,
        fontFamily: fontFamily.primary.join(', '),
        fontWeight: fontWeight.semiBold,
        fontSize: fontSize['12'],
        lineHeight: lineHeight.auto,
        letterSpacing: letterSpacing.none,
      }}
    >
      {children}
    </span>
  );
}
