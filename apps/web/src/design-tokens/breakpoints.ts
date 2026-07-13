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
  /** Wide screens */
  '2xl': '1536px',
} as const;

export type Breakpoints = typeof breakpoints;
export type BreakpointToken = keyof typeof breakpoints;
