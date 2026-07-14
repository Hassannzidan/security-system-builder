import type { LineItem } from '@/hooks/useBundleBuilder';

/**
 * Category groups render in this fixed order regardless of step ordering; only
 * groups that currently have line items are shown. Values match `step.category`
 * as emitted by the API (`LineItem.category`).
 */
export const REVIEW_CATEGORY_ORDER = ['Cameras', 'Sensors', 'Accessories', 'Plan'] as const;

/** The plan group is rendered specially (two-tone name, no stepper). */
export const PLAN_CATEGORY = 'Plan';

/**
 * Bundle-level fulfillment row shown at the bottom of the summary. It is NOT a
 * product from `lineItems`, so it is hard-coded here per the design. Priced like
 * a discounted line: $5.99 struck through, then FREE.
 */
export const FAST_SHIPPING = {
  label: 'Fast Shipping',
  price: 0,
  compareAtPrice: 5.99,
} as const;

/**
 * Financing estimate shown in the purple pill ("as low as $19.19/mo").
 *
 * The task does not specify the financing formula, and the design's $19.19/mo
 * does NOT equal subtotal / 12 (≈ $15.66 on the seeded bundle). Rather than
 * invent an interest rate to back-fit the number, we surface the design value as
 * a single, clearly-labelled constant. This is the ONLY intentionally hard-coded
 * money value in the review — every other amount (subtotal, compare-at, savings)
 * is derived live from `totals`.
 */
export const FINANCING_ESTIMATE = 19.19;

/** Copy for the 30-day returns guarantee block. */
export const RETURNS_HEADING = '30-day hassle-free returns';
export const RETURNS_BODY =
  "If you're not totally in love with the product, we will refund you 100%.";

export type LineItemGroup = { category: string; items: LineItem[] };
