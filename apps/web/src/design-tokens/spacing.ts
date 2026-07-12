/**
 * Spacing Design Tokens
 *
 * Prefer the 4px-base semantic ladder for general layout.
 * Exact Figma values are kept when components need pixel parity.
 */

export const spacing = {
  none: '0px',
  xs: '4px',
  sm: '8px', // clusters Figma 5–8
  /** Exact Figma 11 — product card padding */
  '11': '11px',
  md: '12px', // clusters Figma 10–13
  /** Exact Figma 15 — product card horizontal padding (vertical orientation) */
  '15': '15px',
  lg: '16px', // clusters Figma 15–16 when snapped
  /** Exact Figma 19 — product card image ↔ info gap */
  '19': '19px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px', // Figma 30 → snapped to 4px grid
  /** Exact Figma 101 — product card image column max width (horizontal) */
  '101': '101px',
  /** Exact Figma — product card max height (horizontal) */
  '159': '159px',
  /** Exact Figma — product card max width (vertical) */
  '225': '225px',
  /** Exact Figma — product card max height (vertical) */
  '331': '331px',
  /** Exact Figma — product card max width (horizontal) */
  '361.5': '361.5px',
} as const;

export type Spacing = typeof spacing;
export type SpacingToken = keyof typeof spacing;
