/**
 * Spacing Design Tokens
 *
 * Figma extracted many near-duplicates (5, 10, 11, 13, 15…).
 * Those are normalized onto a 4px base scale.
 *
 * Only semantic aliases are public — use these in components.
 */

export const spacing = {
  none: '0px',
  xs: '4px',
  sm: '8px', // clusters Figma 5–8
  md: '12px', // clusters Figma 10–13
  lg: '16px', // clusters Figma 15
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px', // Figma 30 → snapped to 4px grid
} as const;

export type Spacing = typeof spacing;
export type SpacingToken = keyof typeof spacing;
