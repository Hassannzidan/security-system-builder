import { useState } from 'react';

import satisfactionBadge from '@/assets/satisfaction-badge.svg';
import { colors, fontFamily, fontWeight, letterSpacing, lineHeight, radius } from '@/design-tokens';
import { formatPrice } from '@/utils/format';

import { FINANCING_ESTIMATE, RETURNS_BODY, RETURNS_HEADING } from './constants';
import type { ReviewCheckoutProps } from './types';

/** Right column of the review panel: guarantee, financing + total, savings, CTA. */
export function ReviewCheckout({ totals, onSave }: ReviewCheckoutProps) {
  // Placeholder confirmation — the task allows a prototype checkout with no order
  // backend. Swaps the CTA for an inline confirmation on click.
  const [placed, setPlaced] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Guarantee */}
      <div className="flex items-center gap-4">
        <img
          src={satisfactionBadge}
          alt="100% Wyze satisfaction guarantee"
          className="h-[120px] w-[120px] shrink-0"
        />
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3
            className="text-[#1F1F1F]"
            style={{
              fontFamily: fontFamily.primary.join(', '),
              fontWeight: fontWeight.semiBold,
              fontSize: '18px',
              lineHeight: lineHeight['130'],
              letterSpacing: letterSpacing['0.6'],
            }}
          >
            {RETURNS_HEADING}
          </h3>
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
            {RETURNS_BODY}
          </p>
        </div>
      </div>

      {/* Financing pill + total */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className="inline-flex items-center rounded-full px-3 py-1.5 text-white"
          style={{
            backgroundColor: colors.primary.DEFAULT,
            fontFamily: fontFamily.primary.join(', '),
            fontWeight: fontWeight.semiBold,
            fontSize: '13px',
            lineHeight: lineHeight['100'],
            letterSpacing: letterSpacing['0.6'],
          }}
        >
          {/* Single allowed hard-coded money value — see FINANCING_ESTIMATE. */}
          as low as {formatPrice(FINANCING_ESTIMATE)}/mo
        </span>
        <div className="flex items-baseline gap-2">
          <span
            className="font-['Gilroy'] font-normal line-through"
            style={{
              fontSize: '18px',
              color: colors.gray[600],
              letterSpacing: letterSpacing['0.6'],
            }}
          >
            {formatPrice(totals.compareAtSubtotal)}
          </span>
          <span
            className="font-['Gilroy']"
            style={{
              fontSize: '28px',
              fontWeight: fontWeight.bold,
              lineHeight: lineHeight['100'],
              letterSpacing: letterSpacing['0.6'],
              color: colors.primary.DEFAULT,
            }}
          >
            {formatPrice(totals.subtotal)}
          </span>
        </div>
      </div>

      {/* Savings callout — only when the bundle actually saves money */}
      {totals.savings > 0 && (
        <p
          className="text-center"
          style={{
            fontFamily: fontFamily.primary.join(', '),
            fontWeight: fontWeight.semiBold,
            fontSize: '14px',
            lineHeight: lineHeight['130'],
            letterSpacing: letterSpacing['0.6'],
            color: colors.status.success,
          }}
        >
          Congrats! You&apos;re saving {formatPrice(totals.savings)} on your security bundle!
        </p>
      )}

      {/* Checkout */}
      <button
        type="button"
        onClick={() => setPlaced(true)}
        disabled={placed}
        className="w-full text-white transition-colors disabled:cursor-default"
        style={{
          backgroundColor: placed ? colors.status.success : colors.primary.DEFAULT,
          borderRadius: radius.md,
          padding: '14px 16px',
          fontFamily: fontFamily.primary.join(', '),
          fontWeight: fontWeight.semiBold,
          fontSize: '16px',
          lineHeight: lineHeight['100'],
          letterSpacing: letterSpacing['0.6'],
        }}
      >
        {placed ? 'Order placed — this is a prototype' : 'Checkout'}
      </button>

      {/* Save for later — persistence lands next iteration (see saveSystem stub) */}
      <button
        type="button"
        onClick={onSave}
        className="mx-auto underline"
        style={{
          fontFamily: fontFamily.primary.join(', '),
          fontWeight: fontWeight.medium,
          fontSize: '14px',
          lineHeight: lineHeight['130'],
          letterSpacing: letterSpacing['0.6'],
          color: colors.primary.DEFAULT,
        }}
      >
        Save my system for later
      </button>
    </div>
  );
}
