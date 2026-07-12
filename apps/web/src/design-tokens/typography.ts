/**
 * Typography Design Tokens
 *
 * Font roles:
 * - primary   → Gilroy (headings, CTAs, brand moments)
 * - secondary → TT Norms Pro (body, forms, dense UI)
 *
 * fontSize / lineHeight / letterSpacing stay empty until the
 * final Figma type scale is extracted. Do not invent values.
 */

/** System fallbacks shared by every stack */
export const fontFamilyFallback = ['system-ui', 'sans-serif'] as const;

export const fontFamily = {
  /** Gilroy — headings, CTAs, brand moments */
  primary: ['Gilroy', ...fontFamilyFallback],
  /** TT Norms Pro — body text, forms, dense UI */
  secondary: ['"TT Norms Pro"', ...fontFamilyFallback],
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
} as const;

/**
 * Type scale — intentionally empty.
 * Fill from Figma once sizes are locked (e.g. xs → 4xl).
 */
export const fontSize = {
  // TODO: extract fontSize scale from Figma
} as const;

/**
 * Line heights — intentionally empty.
 * Fill from Figma once the type scale is locked.
 */
export const lineHeight = {
  // TODO: extract lineHeight scale from Figma
} as const;

/**
 * Letter spacing — intentionally empty.
 * Fill from Figma once tracking values are locked.
 */
export const letterSpacing = {
  // TODO: extract letterSpacing scale from Figma
} as const;

export const typography = {
  fontFamily,
  fontFamilyFallback,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
} as const;

export type FontFamily = typeof fontFamily;
export type FontWeight = typeof fontWeight;
export type Typography = typeof typography;
