import { colors, fontFamily } from '@/design-tokens';
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
  const priceClass =
    'text-right text-[12px] font-normal leading-4 tracking-[0.5%] sm:text-base sm:font-medium';
  const typeStyle = {
    fontFamily: fontFamily.primary.join(', '),
    verticalAlign: 'middle',
  } as const;

  return (
    <div
      className={cn(
        'flex flex-col items-end justify-end gap-0.5 min-[1440px]:flex-row min-[1440px]:items-baseline min-[1440px]:gap-1.5',
        className,
      )}
    >
      {discounted && (
        <span
          className={cn('line-through', priceClass)}
          style={{ ...typeStyle, color: colors.gray[600] }}
        >
          {formatPrice(compareAtPrice!, currency)}
          {suffix}
        </span>
      )}
      <span className={priceClass} style={{ ...typeStyle, color: colors.primary.DEFAULT }}>
        {free ? 'FREE' : `${formatPrice(price, currency)}${suffix}`}
      </span>
    </div>
  );
}
