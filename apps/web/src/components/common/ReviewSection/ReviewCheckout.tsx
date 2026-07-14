import { useEffect, useRef, useState } from 'react';

import satisfactionBadge from '@/assets/satisfaction-badge.svg';
import { colors, fontFamily, fontWeight, letterSpacing, lineHeight } from '@/design-tokens';
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

/** Right column of the review panel: guarantee, financing + total, savings, CTA. */
export function ReviewCheckout({ totals, onSave }: ReviewCheckoutProps) {
  // Placeholder confirmation — the task allows a prototype checkout with no order
  // backend. Swaps the CTA for an inline confirmation on click.
  const [placed, setPlaced] = useState(false);

  // Feedback for the "Save my system for later" link. On success it flips to
  // "Saved ✓" (disabled) for ~2s then reverts; on failure it shows a persistent
  // error in the same slot that the user can click to retry.
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
      {/* Guarantee */}
      <div className="flex items-center gap-[25px]">
        <img
          src={satisfactionBadge}
          alt="100% Wyze satisfaction guarantee"
          className="h-[131px] w-[131px] shrink-0"
        />
        <div className="flex min-w-0 flex-col gap-2.5">
          <h3
            className="text-[#1F1F1F]"
            style={{
              fontFamily: fontFamily.primary.join(', '),
              fontWeight: fontWeight.semiBold,
              fontSize: '18px',
              lineHeight: '110%',
              letterSpacing: letterSpacing['0.6'],
              verticalAlign: 'middle',
            }}
          >
            {RETURNS_HEADING}
          </h3>
          <p
            style={{
              fontFamily: fontFamily.primary.join(', '),
              fontWeight: fontWeight.regular,
              fontSize: '18px',
              lineHeight: '110%',
              letterSpacing: letterSpacing['0.6'],
              verticalAlign: 'middle',
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
          className="inline-flex h-[27px] w-fit items-center gap-2.5 p-2 text-white"
          style={{
            backgroundColor: colors.primary.DEFAULT,
            borderRadius: '3px',
            fontFamily: fontFamily.primary.join(', '),
            fontWeight: fontWeight.regular,
            fontSize: '16px',
            lineHeight: lineHeight['100'],
            letterSpacing: '-0.05em',
          }}
        >
          {/* Single allowed hard-coded money value — see FINANCING_ESTIMATE. */}
          as low as {formatPrice(FINANCING_ESTIMATE)}/mo
        </span>
        <div className="flex items-baseline gap-2">
          <span
            className="line-through"
            style={{
              fontFamily: fontFamily.primary.join(', '),
              fontWeight: fontWeight.medium,
              fontSize: '22px',
              lineHeight: '20px',
              letterSpacing: '0.25%',
              textAlign: 'center',
              color: colors.gray[600],
            }}
          >
            {formatPrice(totals.compareAtSubtotal)}
          </span>
          <span
            style={{
              fontFamily: fontFamily.primary.join(', '),
              fontWeight: fontWeight.bold,
              fontSize: '28px',
              lineHeight: '32px',
              letterSpacing: '-0.13%',
              textAlign: 'right',
              verticalAlign: 'middle',
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
            lineHeight: '100%',
            letterSpacing: '-0.06px',
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
        className="flex h-12 w-full items-center justify-center gap-2 text-white transition-colors disabled:cursor-default"
        style={{
          backgroundColor: placed ? colors.status.success : colors.primary.DEFAULT,
          borderRadius: '4px',
          padding: '13px 16px',
          fontFamily: fontFamily.secondary.join(', '),
          fontWeight: fontWeight.bold,
          fontSize: '17px',
          lineHeight: lineHeight['100'],
          letterSpacing: '0px',
          verticalAlign: 'middle',
        }}
      >
        {placed ? 'Order placed — this is a prototype' : 'Checkout'}
      </button>

      {/* Save for later — click-triggered persistence via the storage module.
          The link doubles as its own feedback slot (see saveStatus). */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saveStatus === 'saved'}
        aria-live="polite"
        className="mx-auto underline disabled:cursor-default disabled:no-underline"
        style={{
          fontFamily: fontFamily.primary.join(', '),
          fontWeight: fontWeight.medium,
          fontSize: '14px',
          lineHeight: lineHeight['130'],
          letterSpacing: letterSpacing['0.6'],
          color: saveStatus === 'error' ? colors.status.error : colors.primary.DEFAULT,
        }}
      >
        {SAVE_LABELS[saveStatus]}
      </button>
    </div>
  );
}
