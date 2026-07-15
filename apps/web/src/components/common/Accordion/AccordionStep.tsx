import type { ReactNode } from 'react';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Chevron } from '@/components/common/icons';
import { borderWidth, colors, fontFamily, fontWeight, spacing, stepper } from '@/design-tokens';
import { cn } from '@/lib/utils';

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
  /**
   * Label for the centered advance button, e.g. "Next: Choose your plan".
   * Omit to render no footer button at all (e.g. the final step).
   */
  nextLabel?: string;
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
  const itemStyle = {
    backgroundColor: isOpen ? colors.background.expandedStep : colors.background.default,
    borderColor: colors.base.black,
  };

  return (
    <AccordionItem
      value={value}
      className={cn('overflow-hidden transition-colors', stepper.divider)}
      style={itemStyle}
    >
      <AccordionTrigger
        className={cn(
          'flex w-full flex-col text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
          stepper.triggerPadding,
        )}
      >
        {showEyebrow && (
          <span
            className={cn('text-eyebrow w-full pb-2', stepper.divider, stepper.eyebrowBleed)}
            style={{
              verticalAlign: 'middle',
              color: colors.text.eyebrow,
              borderColor: colors.base.black,
            }}
          >
            Step {stepNumber} of {totalSteps}
          </span>
        )}

        <span className="flex w-full items-center gap-2 sm:gap-2.5">
          {icon && (
            <span
              className="grid size-7 shrink-0 place-items-center sm:size-[30px]"
              style={{ color: colors.text.tertiary }}
            >
              {icon}
            </span>
          )}

          <span className={cn(stepper.titleClass)} style={{ color: colors.text.primary }}>
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
            {selectedCount !== undefined && (
              <span
                className={cn('text-selected-count', !isOpen && 'sm:hidden')}
                style={{
                  textAlign: 'center',
                  color: colors.primary.DEFAULT,
                }}
                aria-live="polite"
                aria-atomic="true"
              >
                {selectedCount} selected
              </span>
            )}
            <Chevron open={isOpen} />
          </span>
        </span>
      </AccordionTrigger>

      <AccordionContent className={cn('flex flex-col', stepper.contentPadding)}>
        {children}

        {/* No nextLabel → final step → no footer button (design shows none). */}
        {nextLabel && (
          <button
            type="button"
            onClick={onNext}
            className="text-next-button inline-flex items-center justify-center self-center transition-colors hover:bg-white/60 active:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            style={{
              textAlign: 'center',
              verticalAlign: 'middle',
              color: colors.primary.DEFAULT,
              backgroundColor: 'transparent',
              border: `${borderWidth.sm} solid ${colors.primary.muted}`,
              width: 'fit-content',
              height: '39px',
              borderRadius: '7px',
              paddingTop: '5px',
              paddingRight: '24px',
              paddingBottom: '5px',
              paddingLeft: '24px',
              gap: spacing['10'],
            }}
          >
            {nextLabel}
          </button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
