import { colors, fontFamily, fontWeight } from '@/design-tokens';
import { cn } from '@/lib/utils';
import { formatPrice, isFreePrice, priceIntervalSuffix } from '@/utils/format';

/**
 * Review-row price: the struck-through original in gray, then the active total in
 * brand purple — or the word "FREE" when a zero price carries a compare-at. The
 * FREE / interval decisions come from the shared `isFreePrice` / `priceIntervalSuffix`
 * helpers so this stays consistent with the product-card PriceBlock rather than
 * re-implementing that logic. (The review row differs only in colour: gray strike
 * + purple active, vs. the card's red strike.)
 */
export function ReviewPrice({
  price,
  compareAtPrice,
  interval,
  currency = 'USD',
  className,
}: {
  price: number;
  compareAtPrice?: number;
  interval?: 'month';
  currency?: string;
  className?: string;
}) {
  const free = isFreePrice(price, compareAtPrice);
  const discounted = compareAtPrice !== undefined && compareAtPrice > price;
  const suffix = priceIntervalSuffix(interval);
  const typeStyle = {
    fontFamily: fontFamily.primary.join(', '),
    fontWeight: fontWeight.medium,
    fontSize: '16px',
    lineHeight: '16px',
    letterSpacing: '0.5%',
    textAlign: 'right',
    verticalAlign: 'middle',
  } as const;

  return (
    <div className={cn('flex flex-row items-baseline justify-end gap-1.5', className)}>
      {discounted && (
        <span className="line-through" style={{ ...typeStyle, color: colors.gray[600] }}>
          {formatPrice(compareAtPrice!, currency)}
          {suffix}
        </span>
      )}
      <span style={{ ...typeStyle, color: colors.primary.DEFAULT }}>
        {free ? 'FREE' : `${formatPrice(price, currency)}${suffix}`}
      </span>
    </div>
  );
}
