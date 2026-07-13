import type { ReactNode } from 'react';

import {
  colors,
  fontFamily,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
  stepper,
} from '@/design-tokens';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

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
  // Permanent bottom border on every item; open state only tints the surface.
  const itemStyle = {
    backgroundColor: isOpen ? EXPANDED_BG : colors.background.default,
    borderBottom: `1px solid ${colors.border.default}`,
  };

  return (
    <AccordionItem value={value} className="overflow-hidden transition-colors" style={itemStyle}>
      <AccordionTrigger className={cn('flex w-full flex-col text-left', stepper.triggerPadding)}>
        {showEyebrow && (
          <span
            className={cn('w-full border-b pb-2 text-[10px] sm:text-[11px]', stepper.eyebrowBleed)}
            style={{
              fontFamily: fontFamily.secondary.join(', '),
              fontWeight: fontWeight.semiBold,
              lineHeight: lineHeight['100'],
              letterSpacing: stepper.eyebrow.letterSpacing,
              textTransform: 'uppercase',
              color: colors.text.tertiary,
              borderColor: colors.border.default,
            }}
          >
            Step {stepNumber} of {totalSteps}
          </span>
        )}

        <span className="flex w-full items-center gap-2 sm:gap-2.5">
          {icon && (
            <span
              className="grid size-6 shrink-0 place-items-center sm:size-7 lg:size-[30px]"
              style={{ color: colors.text.tertiary }}
            >
              {icon}
            </span>
          )}

          <span
            className="truncate font-['Gilroy'] text-[20px] font-semibold leading-none sm:text-2xl lg:text-[28px]"
            style={{ color: colors.text.primary }}
          >
            {title}
          </span>

          <span
            className="ml-auto flex shrink-0 items-center gap-1.5 text-xs font-medium leading-none sm:text-[12px]"
            style={{
              fontFamily: fontFamily.secondary.join(', '),
              fontWeight: fontWeight.medium,
              color: isOpen ? colors.primary.DEFAULT : colors.text.tertiary,
            }}
          >
            {isOpen && selectedCount !== undefined && <span>{selectedCount} selected</span>}
            <Chevron open={isOpen} />
          </span>
        </span>
      </AccordionTrigger>

      <AccordionContent className={cn('flex flex-col', stepper.contentPadding)}>
        {children}

        <button
          type="button"
          onClick={onNext}
          className={cn(
            'self-center text-sm transition-colors hover:bg-white/60 active:opacity-90 sm:text-base',
            stepper.nextButtonLayout,
            stepper.nextButtonPadding,
          )}
          style={{
            fontFamily: fontFamily.primary.join(', '),
            fontWeight: fontWeight.semiBold,
            letterSpacing: letterSpacing['0.6'],
            color: colors.primary.DEFAULT,
            backgroundColor: colors.background.default,
            border: `1px solid ${colors.primary.muted}`,
            borderRadius: radius.md,
          }}
        >
          {nextLabel}
        </button>
      </AccordionContent>
    </AccordionItem>
  );
}
