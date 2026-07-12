import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/format';

export function PriceBlock({
  price,
  compareAtPrice,
  currency,
  /** stacked = red above gray (horizontal card); inline = red then gray in a row (vertical card) */
  layout = 'stacked',
}: {
  price: number;
  compareAtPrice?: number;
  currency: string;
  layout?: 'stacked' | 'inline';
}) {
  const discounted = compareAtPrice !== undefined && compareAtPrice > price;
  return (
    <div
      className={cn(
        'flex leading-none',
        layout === 'stacked' ? 'flex-col items-end gap-0.5' : 'flex-row items-baseline gap-1.5',
      )}
    >
      {discounted && (
        <span className="font-['Gilroy'] text-[10px] font-normal text-[#D8392B] line-through">
          {formatPrice(compareAtPrice!, currency)}
        </span>
      )}
      <span className="font-['Gilroy'] text-sm font-normal text-[#525963]">
        {formatPrice(price, currency)}
      </span>
    </div>
  );
}
