import { colors } from '@/design-tokens';
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

  return (
    <div
      className={cn(
        'flex',
        layout === 'stacked' ? 'flex-col items-end gap-0.5' : 'flex-row items-baseline gap-1.5',
      )}
    >
      {discounted && (
        <span className="text-card-price text-[#D8392B] line-through">
          {formatPrice(compareAtPrice!, currency)}
          {suffix}
        </span>
      )}
      {isFree ? (
        <span className="text-card-price" style={{ color: colors.primary.DEFAULT }}>
          FREE
        </span>
      ) : (
        <span className="text-card-price text-[#525963]">
          {formatPrice(price, currency)}
          {suffix}
        </span>
      )}
    </div>
  );
}
