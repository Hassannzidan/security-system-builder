import { QuantityStepper } from '@/components/ui/QuantityStepper';

import { ReviewPrice } from './ReviewPrice';
import type { ReviewLineItemProps } from './types';

/**
 * A single product line in the review summary: a thumbnail in a white rounded
 * box, the product name (with a variant label appended for non-default variants
 * — see `LineItem.variantLabel`), then a right-aligned quantity stepper and the
 * line pricing.
 *
 * The stepper is the SAME control the product card uses, bound to the SAME state
 * via `onSetQuantity(productId, variantKey, qty)`: editing here updates the card
 * and the step counters instantly. Decrementing to 0 removes this line (the hook
 * drops zero-quantity entries from `lineItems`). Locked lines (the required Sense
 * Hub) render the stepper with both buttons disabled.
 */
export function ReviewLineItem({ item, onSetQuantity }: ReviewLineItemProps) {
  const label = item.variantLabel ? `${item.name} – ${item.variantLabel}` : item.name;

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-[41px] w-[41px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <div className="h-full w-full bg-surface" aria-hidden />
        )}
      </div>

      <span className="text-line-item-name min-w-0 flex-1 truncate text-ink-black">{label}</span>

      <div className="flex shrink-0 items-center gap-4">
        <QuantityStepper
          value={item.qty}
          min={0}
          max={99}
          onChange={(next) => onSetQuantity(item.productId, item.variantKey, next)}
          title={item.name}
          disabled={item.locked}
          variant="review"
        />
        <ReviewPrice
          price={item.lineTotal}
          compareAtPrice={item.lineCompareAtTotal}
          interval={item.interval}
        />
      </div>
    </div>
  );
}
