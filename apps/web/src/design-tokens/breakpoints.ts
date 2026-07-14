/**
 * Breakpoint Design Tokens
 *
 * Mobile-first ladder aligned with Tailwind defaults so token values and
 * utility classes (`sm:`, `md:`, `lg:`) stay in sync.
 */
export const breakpoints = {
  /** Large phones / small tablets */
  sm: '640px',
  /** Tablets */
  md: '768px',
  /** Desktop */
  lg: '1024px',
  /** Large desktop */
  xl: '1280px',
  /**
   * Wide layout switch — at/above this the review panel goes two-column and
   * product cards render vertically. Used by the JS media query in HomePage.
   *
   * NOTE: the Tailwind `min-[1440px]:` / `lg:max-[1439px]:` arbitrary classes in
   * HomePage/ReviewSection/ReviewSummary/ReviewLineItem mirror `wide`/`wideMax`.
   * They must stay literal (Tailwind JIT needs static class names) — keep them in
   * sync with these tokens by hand. `wide`/`wideMax` are an intentional
   * off-by-one pair (CSS min 1440 ↔ JS max 1439); change them together.
   */
  wide: '1440px',
  wideMax: '1439px',
  /** Wide screens */
  '2xl': '1536px',
} as const;

export type Breakpoints = typeof breakpoints;
export type BreakpointToken = keyof typeof breakpoints;
