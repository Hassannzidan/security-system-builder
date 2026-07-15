import { colors } from '@/design-tokens';
import { formatPrice } from '@/utils/format';

import type { OrderTotalsProps } from './types';

/**
 * Pure money display: the struck-through compare-at total beside the live
 * subtotal. Props in, JSX out — no state. Rendered once per breakpoint layout.
 */
export function OrderTotals({ compareAtSubtotal, subtotal }: OrderTotalsProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="text-checkout-compare line-through"
        style={{
          textAlign: 'center',
          color: colors.gray[600],
        }}
      >
        {formatPrice(compareAtSubtotal)}
      </span>
      <span
        className="text-checkout-total"
        style={{
          textAlign: 'right',
          verticalAlign: 'middle',
          color: colors.primary.DEFAULT,
        }}
      >
        {formatPrice(subtotal)}
      </span>
    </div>
  );
}
