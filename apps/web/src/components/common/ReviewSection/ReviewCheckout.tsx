import { useEffect, useRef, useState } from 'react';

import satisfactionBadge from '@/assets/satisfaction-badge.svg';
import { colors, radius } from '@/design-tokens';
import { formatPrice } from '@/utils/format';

import { FINANCING_ESTIMATE, RETURNS_BODY, RETURNS_HEADING } from './constants';
import type { ReviewCheckoutProps } from './types';

/** How long the "Saved ✓" confirmation stays up before reverting to the link. */
const SAVED_FEEDBACK_MS = 2000;

/** Save-for-later feedback: idle link, transient success, or a persistent error. */
type SaveStatus = 'idle' | 'saved' | 'error';

const SAVE_LABELS: Record<SaveStatus, string> = {
  idle: 'Save my system for later',
  saved: 'Saved ✓',
  error: "Couldn't save — check browser storage settings",
};

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

function CheckoutTotals({
  compareAtSubtotal,
  subtotal,
}: {
  compareAtSubtotal: number;
  subtotal: number;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="text-checkout-compare line-through"
        style={{
          textAlign: 'center',
          color: colors.gray[600],
        }}
      >
        {formatPrice(compareAtSubtotal)}
      </span>
      <span
        className="text-checkout-total"
        style={{
          textAlign: 'right',
          verticalAlign: 'middle',
          color: colors.primary.DEFAULT,
        }}
      >
        {formatPrice(subtotal)}
      </span>
    </div>
  );
}

/** Right column of the review panel: guarantee, financing + total, savings, CTA. */
export function ReviewCheckout({ totals, onSave }: ReviewCheckoutProps) {
  const [placed, setPlaced] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (revertTimer.current) clearTimeout(revertTimer.current);
    },
    [],
  );

  const handleSave = () => {
    if (revertTimer.current) clearTimeout(revertTimer.current);
    const succeeded = onSave();
    if (succeeded) {
      setSaveStatus('saved');
      revertTimer.current = setTimeout(() => setSaveStatus('idle'), SAVED_FEEDBACK_MS);
    } else {
      setSaveStatus('error');
    }
  };

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
          <CheckoutTotals compareAtSubtotal={totals.compareAtSubtotal} subtotal={totals.subtotal} />
        </div>
      </div>

      {/* Financing pill + total — wide layout only. */}
      <div className="hidden flex-wrap items-center justify-between gap-3 min-[1440px]:flex">
        <FinancingPill />
        <CheckoutTotals compareAtSubtotal={totals.compareAtSubtotal} subtotal={totals.subtotal} />
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
        className="text-checkout-cta flex h-12 w-full items-center justify-center gap-2 text-white transition-colors disabled:cursor-default"
        style={{
          backgroundColor: placed ? colors.status.success : colors.primary.DEFAULT,
          borderRadius: radius.sm,
          padding: '13px 16px',
          verticalAlign: 'middle',
        }}
      >
        {placed ? 'Order placed' : 'Checkout'}
      </button>

      {/* Save for later — click-triggered persistence via the storage module.
          The link doubles as its own feedback slot (see saveStatus). */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saveStatus === 'saved'}
        aria-live="polite"
        className="text-save-link mx-auto underline disabled:cursor-default disabled:no-underline"
        style={{
          color: saveStatus === 'error' ? colors.status.error : colors.primary.DEFAULT,
        }}
      >
        {SAVE_LABELS[saveStatus]}
      </button>
    </div>
  );
}
