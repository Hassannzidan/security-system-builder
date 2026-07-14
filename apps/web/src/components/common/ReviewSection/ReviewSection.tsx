import { colors, radius } from '@/design-tokens';
import { useBundleBuilderContext } from '@/context/BundleBuilderContext';

import { ReviewCheckout } from './ReviewCheckout';
import { ReviewSummary } from './ReviewSummary';

/**
 * ReviewSection — the full-width review panel rendered below the step accordion.
 *
 * A rounded soft-indigo card split into two columns on desktop (≈55/45): the left
 * summarises the configured system (grouped line items + fulfillment), the right
 * carries the guarantee, live totals and checkout. Below `lg` it stacks to a
 * single column, summary first.
 *
 * It reads the shared bundle-builder state from context, so its steppers and
 * totals are the very same state the product cards drive — edits sync both ways
 * with no extra wiring.
 */
export function ReviewSection() {
  const { lineItems, totals, setQuantity, saveSystem } = useBundleBuilderContext();

  return (
    <section
      aria-label="Your security system"
      style={{ backgroundColor: colors.background.reviewPanel, borderRadius: radius.xl }}
      className="grid grid-cols-1 gap-8 p-5 sm:p-6 lg:grid-cols-[11fr_9fr] lg:gap-10 lg:p-8"
    >
      <ReviewSummary items={lineItems} onSetQuantity={setQuantity} />
      <ReviewCheckout totals={totals} onSave={saveSystem} />
    </section>
  );
}
