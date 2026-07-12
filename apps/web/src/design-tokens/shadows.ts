/**
 * Shadow Design Tokens
 *
 * Elevation / depth tokens for cards, dropdowns, modals, etc.
 * Figma has not defined shadows yet — structure is ready to fill.
 */

export const shadows = {
  // TODO: none — extract from Figma once elevation styles exist
  // none: 'none',
  // sm: '...',
  // md: '...',
  // lg: '...',
} as const;

export type Shadows = typeof shadows;
export type ShadowToken = keyof typeof shadows;
