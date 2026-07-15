import type { ReactNode } from 'react';

/**
 * View-model for a single accordion step.
 *
 * This is a presentational shape, deliberately decoupled from the shared `Step`
 * domain type. The mapping from `Step` (done in `HomePage`) is:
 *   - `Step.id`        → `id`
 *   - `Step.title`     → `title`
 *   - `Step.icon`      → `icon`     (string key resolved to a React glyph)
 *   - `Step.nextLabel` → `nextLabel`
 *   - `Step.order`     → used only to sort steps before rendering; not stored here
 * `selectionType`, `category` and `products` stay in the domain layer — the
 * accordion is agnostic to them. `selectedCount` / `content` are supplied by the
 * page from bundle-builder state.
 */
export interface AccordionStepConfig {
  /** Stable identifier for the step. Maps from `Step.id`. */
  id: string;
  /** Bold step heading, e.g. "Choose your cameras". Maps from `Step.title`. */
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
   * Label for the centered advance button. Maps from `Step.nextLabel`.
   * Present → the step renders that button. Omitted → no footer button at all
   * (e.g. the final step). A label is never auto-generated.
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
