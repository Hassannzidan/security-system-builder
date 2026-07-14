import { colors, letterSpacing, lineHeight } from '@/design-tokens';
import { cn } from '@/lib/utils';
import { formatPrice, isFreePrice, priceIntervalSuffix } from '@/utils/format';

export function PriceBlock({
  price,
  compareAtPrice,
  currency,
  layout = 'stacked',
  interval,
}: {
  price: number;
  compareAtPrice?: number;
  currency: string;
  layout?: 'stacked' | 'inline';
  interval?: 'month';
}) {
  const discounted = compareAtPrice !== undefined && compareAtPrice > price;
  const isFree = isFreePrice(price, compareAtPrice);
  const suffix = priceIntervalSuffix(interval);
  const typeStyle = {
    lineHeight: lineHeight['100'],
    letterSpacing: letterSpacing['0.6'],
  } as const;

  return (
    <div
      className={cn(
        'flex',
        layout === 'stacked' ? 'flex-col items-end gap-0.5' : 'flex-row items-baseline gap-1.5',
      )}
    >
      {discounted && (
        <span
          className="font-['Gilroy'] text-base font-normal text-[#D8392B] line-through"
          style={typeStyle}
        >
          {formatPrice(compareAtPrice!, currency)}
          {suffix}
        </span>
      )}
      {isFree ? (
        <span
          className="font-['Gilroy'] text-base font-normal"
          style={{ ...typeStyle, color: colors.primary.DEFAULT }}
        >
          FREE
        </span>
      ) : (
        <span className="font-['Gilroy'] text-base font-normal text-[#525963]" style={typeStyle}>
          {formatPrice(price, currency)}
          {suffix}
        </span>
      )}
    </div>
  );
}
