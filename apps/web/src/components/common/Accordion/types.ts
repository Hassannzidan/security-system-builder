import type { ReactNode } from 'react';

export interface AccordionStepConfig {
  /** Stable identifier for the step. */
  id: string;
  /** Bold step heading, e.g. "Choose your cameras". */
  title: string;
  /** Optional leading icon (line glyph). Tinted by the header. */
  icon?: ReactNode;
  /**
   * Count shown as "N selected" on the right while the step is open.
   * Omit to hide the count entirely.
   */
  selectedCount?: number;
  /** Body content revealed when the step is expanded. */
  content?: ReactNode;
  /**
   * Overrides the auto-generated advance label. When omitted, the step shows
   * "Next: <next step title>" (or just "Next" for the final step).
   */
  nextLabel?: string;
}

export interface AccordionProps {
  /** Ordered steps to render. */
  steps: AccordionStepConfig[];
  /** Index open on first render when uncontrolled. Defaults to 0. */
  defaultOpenIndex?: number;
  /** Controlled open index; pass with `onOpenChange` for controlled mode. */
  openIndex?: number;
  /** Notified when the open step changes. */
  onOpenChange?: (index: number) => void;
  /** Fired when the final step's advance button is pressed. */
  onComplete?: () => void;
  /** Renders the "STEP X OF N" eyebrow above each header. Defaults to true. */
  showStepEyebrow?: boolean;
  className?: string;
}
