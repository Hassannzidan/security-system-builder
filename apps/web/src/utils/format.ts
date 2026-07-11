/**
 * Small pure formatting helpers. UI-agnostic and easily unit-testable.
 */

/** Format a numeric amount as a currency string. */
export function formatPrice(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
