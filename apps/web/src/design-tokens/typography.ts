/**
 * Typography Design Tokens
 *
 * Font roles:
 * - primary   → Gilroy (headings, CTAs, brand moments)
 * - secondary → TT Norms Pro (body, forms, dense UI)
 *
 * fontSize stays empty until the final Figma type scale is extracted.
 * lineHeight / letterSpacing include values locked from ProductCard Figma.
 */

/** System fallbacks shared by every stack */
export const fontFamilyFallback = ['system-ui', 'sans-serif'] as const;

/**
 * NOTE: `tailwind.config.js` → theme.extend.fontFamily.{primary,secondary} MUST
 * mirror these stacks exactly. The `font-primary` / `font-secondary` utility
 * classes are generated from that config; keep the two in sync so class-based and
 * inline (`fontFamily.primary.join(', ')`) usage resolve to identical stacks.
 */
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
 * Type scale — locked Figma values.
 */
export const fontSize = {
  /** Variant pill label — product card */
  '10': '10px',
  /** Discount badge — product card */
  '12': '12px',
  /** Review line names / "N selected" / save + savings copy */
  '14': '14px',
  /** Title — product card (horizontal) */
  '16': '16px',
  /** Title — product card (vertical) */
  '18': '18px',
  /** Compare-at total (review) / section title (mobile) */
  '22': '22px',
  /** Step title — accordion */
  '28': '28px',
} as const;

/**
 * Line heights — locked Figma values.
 */
export const lineHeight = {
  /** Discount badge — product card */
  auto: 'auto',
  /** Title / price — product card */
  '100': '100%',
  /** Guarantee heading/body (review) / mobile H1 */
  '110': '110%',
  /** Description — product card */
  '130': '130%',
  /** Review line names / prices / "N selected" leading */
  '16': '16px',
  /** Quantity stepper number — product card */
  '20': '20px',
} as const;

/**
 * Letter spacing — locked Figma values.
 */
export const letterSpacing = {
  /** Quantity stepper number — product card */
  none: '0px',
  /** Title / price / description — product card */
  '0.6': '0.6px',
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
export type LineHeight = typeof lineHeight;
export type LetterSpacing = typeof letterSpacing;
export type Typography = typeof typography;
