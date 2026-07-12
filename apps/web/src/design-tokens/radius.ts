/**
 * Border Radius Design Tokens
 *
 * Figma values (2, 4, 5, 7, 10) are normalized onto a clear
 * semantic ladder so corners stay consistent across the product.
 */

export const radius = {
  none: '0px',
  xs: '2px', // chips, tight controls
  sm: '4px', // inputs, small buttons
  md: '8px', // cards, panels (snaps 5/7 → 8)
  lg: '10px',
  xl: '12px', // modals, large surfaces
  full: '9999px', // pills, avatars
} as const;

export type Radius = typeof radius;
export type RadiusToken = keyof typeof radius;
