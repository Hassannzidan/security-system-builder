import type { ReactNode } from 'react';

import {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
  spacing,
} from '@/design-tokens';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Chevron } from './icons';

/** Surface tint shown behind an expanded step. */
const EXPANDED_BG = '#EDF4FF';

export interface AccordionStepProps {
  /** Radix item value — unique per step, used to drive open state. */
  value: string;
  /** 1-based position, rendered as "STEP {stepNumber} OF {totalSteps}". */
  stepNumber: number;
  totalSteps: number;
  /** Show the "STEP X OF N" eyebrow. */
  showEyebrow?: boolean;
  icon?: ReactNode;
  title: string;
  isOpen: boolean;
  /** Count shown as "N selected" while open. Omit to hide. */
  selectedCount?: number;
  /** Body content, rendered only while open. Optional. */
  children?: ReactNode;
  /** Label for the centered advance button, e.g. "Next: Choose your plan". */
  nextLabel: string;
  onNext: () => void;
}

/**
 * A single, self-contained step of the reusable <Accordion />.
 *
 * Built on the shadcn/Radix accordion primitives: an <AccordionItem> whose
 * <AccordionTrigger> is the header (optional "STEP X OF N" eyebrow, icon, title,
 * and a right-aligned "N selected" count + chevron), and an <AccordionContent>
 * that reveals the body and a centered "Next: …" button. Radix owns the
 * open/close state and keyboard/ARIA behaviour; `isOpen` only drives styling.
 */
export function AccordionStep({
  value,
  stepNumber,
  totalSteps,
  showEyebrow = true,
  icon,
  title,
  isOpen,
  selectedCount,
  children,
  nextLabel,
  onNext,
}: AccordionStepProps) {
  // Open → tinted, purple-bordered card. Collapsed → flat full-width row
  // separated from its neighbours by hairline dividers, no card chrome.
  const itemStyle = isOpen
    ? {
        borderRadius: '10px',
        border: 'none',
        backgroundColor: EXPANDED_BG,
      }
    : {
        borderBottom: `1px solid ${colors.border.default}`,
        backgroundColor: 'transparent',
      };

  return (
    <AccordionItem value={value} className="overflow-hidden transition-colors" style={itemStyle}>
      <AccordionTrigger
        className="flex w-full flex-col text-left"
        style={{
          gap: spacing.sm,
          padding: `${spacing['15']} ${spacing['15']}`,
        }}
      >
        {showEyebrow && (
          <span
            className="w-full"
            style={{
              fontFamily: fontFamily.secondary.join(', '),
              fontWeight: fontWeight.semiBold,
              fontSize: '11px',
              lineHeight: lineHeight['100'],
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: colors.text.tertiary,
              borderBottom: `1px solid ${colors.border.default}`,
              paddingBottom: isOpen ? '5px' : spacing.sm,
            }}
          >
            Step {stepNumber} of {totalSteps}
          </span>
        )}

        <span className="flex w-full items-center gap-2.5">
          {icon && (
            <span
              className="grid shrink-0 place-items-center"
              style={{
                width: 30,
                height: 30,
                color: colors.text.tertiary,
              }}
            >
              {icon}
            </span>
          )}

          <span
            className="truncate"
            style={{
              fontFamily: fontFamily.primary.join(', '),
              fontWeight: fontWeight.semiBold,
              fontSize: fontSize['28'],
              lineHeight: lineHeight['100'],
              letterSpacing: letterSpacing.none,
              color: colors.text.primary,
            }}
          >
            {title}
          </span>

          <span
            className="ml-auto flex shrink-0 items-center gap-1.5"
            style={{
              color: isOpen ? colors.primary.DEFAULT : colors.text.tertiary,
              fontFamily: fontFamily.secondary.join(', '),
              fontWeight: fontWeight.medium,
              fontSize: fontSize['12'],
              lineHeight: lineHeight['100'],
            }}
          >
            {isOpen && selectedCount !== undefined && <span>{selectedCount} selected</span>}
            <Chevron open={isOpen} />
          </span>
        </span>
      </AccordionTrigger>

      <AccordionContent
        className="flex flex-col"
        style={{
          gap: spacing.lg,
          padding: `0 ${spacing['15']} ${spacing.lg}`,
        }}
      >
        {children}

        <button
          type="button"
          onClick={onNext}
          className="self-center transition-colors hover:bg-white/60 active:opacity-90"
          style={{
            fontFamily: fontFamily.primary.join(', '),
            fontWeight: fontWeight.semiBold,
            fontSize: fontSize['16'],
            letterSpacing: letterSpacing['0.6'],
            color: colors.primary.DEFAULT,
            backgroundColor: colors.background.default,
            border: `1px solid ${colors.primary.muted}`,
            borderRadius: radius.md,
            padding: `${spacing.md} ${spacing['2xl']}`,
          }}
        >
          {nextLabel}
        </button>
      </AccordionContent>
    </AccordionItem>
  );
}
