import { colors, fontFamily } from '@/design-tokens';
import { cn } from '@/lib/utils';
import { formatPrice, isFreePrice, priceIntervalSuffix } from '@/utils/format';

export function PriceBlock({
  price,
  compareAtPrice,
  currency = 'USD',
  layout = 'stacked',
  interval,
  tone = 'card',
  className,
}: {
  price: number;
  compareAtPrice?: number;
  currency?: string;
  layout?: 'stacked' | 'inline';
  interval?: 'month';
  tone?: 'card' | 'review';
  className?: string;
}) {
  const discounted = compareAtPrice !== undefined && compareAtPrice > price;
  const isFree = isFreePrice(price, compareAtPrice);
  const suffix = priceIntervalSuffix(interval);

  if (tone === 'review') {
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
          {isFree ? 'FREE' : `${formatPrice(price, currency)}${suffix}`}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex',
        layout === 'stacked' ? 'flex-col items-end gap-0.5' : 'flex-row items-baseline gap-1.5',
      )}
    >
      {discounted && (
        <span className="text-card-price text-sale line-through">
          {formatPrice(compareAtPrice!, currency)}
          {suffix}
        </span>
      )}
      {isFree ? (
        <span className="text-card-price" style={{ color: colors.primary.DEFAULT }}>
          FREE
        </span>
      ) : (
        <span className="text-card-price text-ink-secondary">
          {formatPrice(price, currency)}
          {suffix}
        </span>
      )}
    </div>
  );
}
