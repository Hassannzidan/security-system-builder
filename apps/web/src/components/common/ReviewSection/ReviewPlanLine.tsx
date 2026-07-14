import { colors, fontFamily, fontWeight, letterSpacing, lineHeight } from '@/design-tokens';

import { PlanIcon } from '../Accordion';
import { ReviewPrice } from './ReviewPrice';
import type { ReviewPlanLineProps } from './types';

/**
 * The PLAN group renders as a dedicated line (keyed on the plan step's category
 * upstream): a small Wyze shield glyph, the plan name split two-tone, and the
 * recurring price — with NO quantity stepper (a plan is a single-select choice).
 *
 * Two-tone name: the first word is dark and the remainder brand-purple ("Cam"
 * dark, "Unlimited" purple), matching the design. Splitting on the FIRST space is
 * an assumption tied to the current "Cam <Tier>" naming; a plan named with more
 * than two words would keep only the first word dark, which reads correctly for
 * this catalog.
 */
export function ReviewPlanLine({ item }: ReviewPlanLineProps) {
  const firstSpace = item.name.indexOf(' ');
  const lead = firstSpace >= 0 ? item.name.slice(0, firstSpace) : item.name;
  const accent = firstSpace >= 0 ? item.name.slice(firstSpace + 1) : '';

  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center"
        style={{ color: colors.primary.DEFAULT }}
        aria-hidden
      >
        {/* Reuse the plan step's shield glyph tinted purple as the Wyze mark. */}
        <PlanIcon />
      </span>

      <span
        className="min-w-0 flex-1 truncate"
        style={{
          fontFamily: fontFamily.primary.join(', '),
          fontWeight: fontWeight.bold,
          fontSize: '16px',
          lineHeight: lineHeight['130'],
          letterSpacing: letterSpacing['0.6'],
        }}
      >
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
