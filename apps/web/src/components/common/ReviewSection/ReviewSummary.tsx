import { Truck } from 'lucide-react';

import { colors, fontFamily, fontWeight, letterSpacing, lineHeight } from '@/design-tokens';

import {
  FAST_SHIPPING,
  PLAN_CATEGORY,
  REVIEW_CATEGORY_ORDER,
  type LineItemGroup,
} from './constants';
import { ReviewLineItem } from './ReviewLineItem';
import { ReviewPlanLine } from './ReviewPlanLine';
import { ReviewPrice } from './ReviewPrice';
import type { ReviewSummaryProps } from './types';

/** Hairline divider matching the design's faint rule; reads on the indigo panel. */
function Divider() {
  return <hr className="border-t border-black/[0.06]" />;
}

/** Group line items into the fixed category order, dropping empty categories. */
function groupByCategory(items: ReviewSummaryProps['items']): LineItemGroup[] {
  return REVIEW_CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);
}

export function ReviewSummary({ items, onSetQuantity }: ReviewSummaryProps) {
  const groups = groupByCategory(items);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2
          // Design spec labels this Gilroy-SemiBold; the family registers SemiBold
          // at weight 600, so we use that to render the intended glyph.
          className="text-[#1F1F1F]"
          style={{
            fontFamily: fontFamily.primary.join(', '),
            fontWeight: fontWeight.semiBold,
            fontSize: '28px',
            lineHeight: lineHeight['100'],
            letterSpacing: letterSpacing['0.6'],
          }}
        >
          Your security system
        </h2>
        <p
          style={{
            fontFamily: fontFamily.primary.join(', '),
            fontWeight: fontWeight.medium,
            fontSize: '16px',
            lineHeight: lineHeight['130'],
            letterSpacing: letterSpacing['0.6'],
            color: colors.text.description,
          }}
        >
          Review your personalized protection system designed to keep what matters most safe.
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.category} className="flex flex-col gap-3">
          <Divider />
          <span
            className="uppercase"
            style={{
              fontFamily: fontFamily.primary.join(', '),
              fontWeight: fontWeight.medium,
              fontSize: '12px',
              lineHeight: lineHeight['100'],
              letterSpacing: '0.6px',
              color: colors.gray[500],
            }}
          >
            {group.category}
          </span>
          <div className="flex flex-col gap-3">
            {group.items.map((item) =>
              group.category === PLAN_CATEGORY ? (
                <ReviewPlanLine key={`${item.productId}:${item.variantKey}`} item={item} />
              ) : (
                <ReviewLineItem
                  key={`${item.productId}:${item.variantKey}`}
                  item={item}
                  onSetQuantity={onSetQuantity}
                />
              ),
            )}
          </div>
        </div>
      ))}

      <Divider />
      {/* Bundle-level fulfillment row per design — static, not a product line. */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white">
          <Truck className="h-5 w-5" style={{ color: colors.status.success }} strokeWidth={2} />
        </div>
        <span
          className="min-w-0 flex-1 truncate text-[#1F1F1F]"
          style={{
            fontFamily: fontFamily.primary.join(', '),
            fontWeight: fontWeight.medium,
            fontSize: '16px',
            lineHeight: lineHeight['130'],
            letterSpacing: letterSpacing['0.6'],
          }}
        >
          {FAST_SHIPPING.label}
        </span>
        <ReviewPrice
          className="shrink-0"
          price={FAST_SHIPPING.price}
          compareAtPrice={FAST_SHIPPING.compareAtPrice}
        />
      </div>
    </div>
  );
}
