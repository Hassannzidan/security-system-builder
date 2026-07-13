import { useState } from 'react';

import { Accordion as AccordionRoot } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

import { AccordionStep } from './AccordionStep';
import type { AccordionProps } from './types';

/**
 * Accordion — a reusable, vertical, single-open accordion / stepper.
 *
 * Composes the shadcn/Radix accordion primitives (`type="single" collapsible`)
 * and layers the stepper UI on top: each step supplies a title, an optional
 * icon, an optional "N selected" count, and optional body content. Only one step
 * is open at a time; every open step ends with a centered "Next: …" button that
 * advances to the following step (calling `onComplete` on the last).
 *
 * Open state is uncontrolled by default (seeded by `defaultOpenIndex`) or can be
 * controlled via `openIndex` + `onOpenChange`. Internally, indices are mapped to
 * each step's `id` — the value Radix uses to track the open item.
 */
export function Accordion({
  steps,
  defaultOpenIndex = 0,
  openIndex,
  onOpenChange,
  onComplete,
  showStepEyebrow = true,
  className,
}: AccordionProps) {
  // Radix tracks the open item by string value; we use each step's id.
  const valueAt = (index: number) => steps[index]?.id ?? '';
  const indexOf = (value: string) => steps.findIndex((step) => step.id === value);

  const [internalValue, setInternalValue] = useState(() => valueAt(defaultOpenIndex));
  const isControlled = openIndex !== undefined;
  const currentValue = isControlled ? valueAt(openIndex) : internalValue;
  const currentOpen = indexOf(currentValue);

  const setOpen = (index: number) => {
    if (!isControlled) setInternalValue(valueAt(index));
    onOpenChange?.(index);
  };

  // Radix hands back '' when the open item collapses onto itself.
  const handleValueChange = (value: string) => setOpen(value ? indexOf(value) : -1);

  const goToNext = (index: number) => {
    if (index >= steps.length - 1) {
      onComplete?.();
      return;
    }
    setOpen(index + 1);
  };

  return (
    <AccordionRoot
      type="single"
      collapsible
      value={currentValue}
      onValueChange={handleValueChange}
      className={cn('flex flex-col', className)}
    >
      {steps.map((step, index) => {
        const nextStep = steps[index + 1];
        const nextLabel = step.nextLabel ?? (nextStep ? `Next: ${nextStep.title}` : 'Next');

        return (
          <AccordionStep
            key={step.id}
            value={step.id}
            stepNumber={index + 1}
            totalSteps={steps.length}
            showEyebrow={showStepEyebrow}
            icon={step.icon}
            title={step.title}
            isOpen={currentOpen === index}
            selectedCount={step.selectedCount}
            nextLabel={nextLabel}
            onNext={() => goToNext(index)}
          >
            {step.content}
          </AccordionStep>
        );
      })}
    </AccordionRoot>
  );
}
