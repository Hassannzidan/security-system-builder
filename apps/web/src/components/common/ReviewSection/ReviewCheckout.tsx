import { useState } from 'react';

import satisfactionBadge from '@/assets/satisfaction-badge.svg';
import { colors, radius } from '@/design-tokens';
import { formatPrice } from '@/utils/format';

import { FINANCING_ESTIMATE, RETURNS_BODY, RETURNS_HEADING } from './constants';
import { OrderTotals } from './OrderTotals';
import { SaveForLater } from './SaveForLater';
import type { ReviewCheckoutProps } from './types';

function FinancingPill() {
  return (
    <span
      className="text-financing-pill inline-flex h-[27px] w-fit items-center gap-2.5 p-2 text-white"
      style={{
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: '3px',
      }}
    >
      as low as {formatPrice(FINANCING_ESTIMATE)}/mo
    </span>
  );
}

/** Right column of the review panel: guarantee, financing + total, savings, CTA. */
export function ReviewCheckout({ totals, onSave }: ReviewCheckoutProps) {
  const [placed, setPlaced] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Badge + returns (wide) or badge + compact pricing stack (narrow). */}
      <div className="flex items-center gap-3 min-[1440px]:gap-[25px]">
        <img
          src={satisfactionBadge}
          alt="100% Wyze satisfaction guarantee"
          className="h-[78px] w-[78px] shrink-0 min-[1440px]:h-[131px] min-[1440px]:w-[131px]"
        />

        <div className="hidden min-w-0 flex-col gap-2.5 min-[1440px]:flex">
          <h3 className="text-returns-heading text-ink-black" style={{ verticalAlign: 'middle' }}>
            {RETURNS_HEADING}
          </h3>
          <p
            className="text-returns-body"
            style={{ verticalAlign: 'middle', color: colors.text.description }}
          >
            {RETURNS_BODY}
          </p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-end gap-2 min-[1440px]:hidden">
          <FinancingPill />
          <OrderTotals compareAtSubtotal={totals.compareAtSubtotal} subtotal={totals.subtotal} />
        </div>
      </div>

      {/* Financing pill + total — wide layout only. */}
      <div className="hidden flex-wrap items-center justify-between gap-3 min-[1440px]:flex">
        <FinancingPill />
        <OrderTotals compareAtSubtotal={totals.compareAtSubtotal} subtotal={totals.subtotal} />
      </div>

      {/* Savings callout — only when the bundle actually saves money */}
      {totals.savings > 0 && (
        <p
          className="text-savings-note text-center"
          style={{
            verticalAlign: 'middle',
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
        className="text-checkout-cta flex h-12 w-full items-center justify-center gap-2 text-white transition-colors disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
        style={{
          backgroundColor: placed ? colors.status.success : colors.primary.DEFAULT,
          borderRadius: radius.sm,
          padding: '13px 16px',
          verticalAlign: 'middle',
        }}
      >
        {placed ? 'Order placed' : 'Checkout'}
      </button>

      <SaveForLater onSave={onSave} />
    </div>
  );
}
