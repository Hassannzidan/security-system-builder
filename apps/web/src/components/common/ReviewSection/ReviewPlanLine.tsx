import { colors } from '@/design-tokens';
import { splitTitleForTwoTone } from '@/utils/splitTitleForTwoTone';

import { PlanIcon } from '../Accordion';
import { ReviewPrice } from './ReviewPrice';
import type { ReviewPlanLineProps } from './types';

/**
 * The PLAN group renders as a dedicated line (keyed on the plan step's category
 * upstream): a small Wyze shield glyph, the plan name split two-tone, and the
 * recurring price — with NO quantity stepper (a plan is a single-select choice).
 *
 * Two-tone name: the lead is dark and the final word brand-purple ("Cam" dark,
 * "Unlimited" purple), matching the design. The split (shared with PlanCard via
 * `splitTitleForTwoTone`) breaks at the LAST space; for the current two-word
 * "Cam <Tier>" naming that is the same single break either way.
 */
export function ReviewPlanLine({ item }: ReviewPlanLineProps) {
  const { head: lead, tail: accent } = splitTitleForTwoTone(item.name);

  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden"
        style={{ color: colors.primary.DEFAULT }}
        aria-hidden
      >
        {/* Show the selected plan's own image; fall back to the tinted shield mark. */}
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <PlanIcon />
        )}
      </span>

      <span className="text-plan-line-name min-w-0 flex-1 truncate">
        <span style={{ color: colors.base.black }}>{lead}</span>
        {accent && <span style={{ color: colors.primary.DEFAULT }}> {accent}</span>}
      </span>

      <ReviewPrice
        className="shrink-0"
        price={item.lineTotal}
        compareAtPrice={item.lineCompareAtTotal}
        interval={item.interval}
      />
    </div>
  );
}
