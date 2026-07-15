import FastShippingSvg from '@/assets/icons/fast-shipping.svg?react';
import { PriceBlock } from '@/components/ui/PriceBlock';
import { colors } from '@/design-tokens';

import {
  FAST_SHIPPING,
  PLAN_CATEGORY,
  PLAN_CATEGORY_MOBILE_LABEL,
  REVIEW_CATEGORY_ORDER,
  type LineItemGroup,
} from './constants';
import { ReviewLineItem } from './ReviewLineItem';
import { ReviewPlanLine } from './ReviewPlanLine';
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
        <h2 className="text-review-title text-ink-black">Your security system</h2>
        <p className="text-body-responsive" style={{ color: colors.text.description }}>
          Review your personalized protection system designed to keep what matters most safe.
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.category} className="flex flex-col gap-3">
          <Divider />
          <span className="text-category-label" style={{ color: colors.gray[500] }}>
            <span className="sm:hidden">
              {group.category === PLAN_CATEGORY ? PLAN_CATEGORY_MOBILE_LABEL : group.category}
            </span>
            <span className="hidden sm:inline">{group.category}</span>
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
          <FastShippingSvg className="h-7 w-7" aria-hidden="true" focusable="false" />
        </div>
        <span className="text-label-strong min-w-0 flex-1 truncate text-ink-black">
          {FAST_SHIPPING.label}
        </span>
        <PriceBlock
          tone="review"
          className="shrink-0"
          price={FAST_SHIPPING.price}
          compareAtPrice={FAST_SHIPPING.compareAtPrice}
        />
      </div>
    </div>
  );
}
