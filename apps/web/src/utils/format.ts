/**
 * Small pure formatting helpers. UI-agnostic and easily unit-testable.
 */

/** Format a numeric amount as a currency string. */
export function formatPrice(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

/**
 * A price of 0 paired with a compare-at reads as a giveaway ("FREE"), never
 * "$0.00". Shared by PriceBlock's card and review tones so the two render the
 * same giveaway convention.
 */
export function isFreePrice(price: number, compareAtPrice?: number): boolean {
  return price === 0 && compareAtPrice !== undefined;
}

/** Suffix appended to recurring (plan) prices — e.g. "/mo" for monthly billing. */
export function priceIntervalSuffix(interval?: 'month'): string {
  return interval === 'month' ? '/mo' : '';
}
