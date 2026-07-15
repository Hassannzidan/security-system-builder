/**
 * Typography Design Tokens
 *
 * Font roles:
 * - primary   → Gilroy (headings, CTAs, brand moments)
 * - secondary → TT Norms Pro (body, forms, dense UI)
 *
 * fontSize / lineHeight / letterSpacing hold values locked from the ProductCard Figma.
 *
 * ---------------------------------------------------------------------------
 * Two layers live in this file:
 *
 *   1. PRIMITIVES (fontFamily, fontWeight, fontSize, lineHeight, letterSpacing,
 *      typography) — the raw scale. Kept intact; components import them today.
 *
 *   2. SEMANTIC ROLES (textStyles) — one entry per on-screen text role, encoding
 *      the *as-rendered* style at each breakpoint. These drive the generated
 *      `.text-<role>` component classes (see `typography-plugin.js`). Values here
 *      are the values the browser COMPUTES today, NOT the Figma spec — see
 *      DEVIATIONS.md for every place the two disagree.
 * ---------------------------------------------------------------------------
 */

import { breakpoints } from './breakpoints';

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
  /**
   * Figma named face for Gilroy SemiBold (exported as its own family at weight 400).
   * Requires the matching @font-face in `styles/fonts.css`.
   */
  primarySemiBold: ['Gilroy-SemiBold', 'Gilroy', ...fontFamilyFallback],
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

/* -------------------------------------------------------------------------- */
/* Semantic responsive text roles                                             */
/* -------------------------------------------------------------------------- */

/** Resolved font-family stacks as single CSS strings (mirror `fontFamily`). */
const PRIMARY = fontFamily.primary.join(', ');
const PRIMARY_SEMIBOLD = fontFamily.primarySemiBold.join(', ');
const SECONDARY = fontFamily.secondary.join(', ');

/**
 * Breakpoints the text roles switch at. MUST equal tailwind `theme.screens.sm`
 * / `.lg` and `breakpoints.wide` — derived from `breakpoints.ts`, not duplicated.
 */
export const typographyScreens = {
  sm: breakpoints.sm,
  lg: breakpoints.lg,
  wide: breakpoints.wide,
} as const;

export type TypographyScreen = keyof typeof typographyScreens;

/**
 * One full style variant. Typography-only — NEVER color, textAlign, verticalAlign,
 * margins, backgrounds. Those stay at the call site.
 */
export interface TextStyleVariant {
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  textDecoration?: string;
  fontStyle?: 'normal' | 'italic';
  fontVariantNumeric?: string;
}

/** A role: a full `base` variant plus partial overrides at sm / lg / wide. */
export interface TextStyleRole {
  base: TextStyleVariant;
  sm?: Partial<TextStyleVariant>;
  lg?: Partial<TextStyleVariant>;
  wide?: Partial<TextStyleVariant>;
}

/**
 * Semantic text roles. Each value is the AS-RENDERED style today (see
 * TYPOGRAPHY-AUDIT.md §2/§4). Invalid CSS from the source (percentage
 * letter-spacing, `line-height: auto`) is encoded as `normal` because that is
 * what the browser computes — see DEVIATIONS.md.
 */
export const textStyles = {
  /** "REVIEW" / "STEP X OF N" eyebrow. ReviewEyebrow L6, AccordionStep L81. */
  eyebrow: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '10px',
      lineHeight: '100%',
      letterSpacing: '1.6px',
      textTransform: 'uppercase',
    },
    sm: { fontSize: '12px' },
  },

  /**
   * Accordion step title. AccordionStep L112 (replaces stepper.titleClass).
   * NOTE: not wired — the current render's line-height at sm/lg is 32px (from
   * `text-2xl`), which this role (lh 1 → 24/28px) does not reproduce. See
   * DEVIATIONS.md; MIGRATION-REPORT.md marks it skipped.
   */
  stepTitle: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '18px',
      lineHeight: '1',
      letterSpacing: '0px',
    },
    sm: { fontWeight: fontWeight.semiBold, fontSize: '24px' },
    lg: { fontSize: '28px' },
  },

  /** Review panel section title. ReviewSummary L35. */
  reviewTitle: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '22px',
      lineHeight: '100%',
      letterSpacing: '0.6px',
    },
    sm: { fontWeight: fontWeight.semiBold },
    wide: { fontSize: '28px' },
  },

  /** Review panel body copy. ReviewSummary L45. */
  bodyResponsive: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '12px',
      lineHeight: '130%',
      letterSpacing: '0.6px',
    },
    sm: { fontWeight: fontWeight.medium, fontSize: '14px' },
    wide: { fontSize: '16px' },
  },

  /** Fast-shipping / fulfillment label. ReviewSummary L98. */
  labelStrong: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '12px',
      lineHeight: '130%',
      letterSpacing: '0.6px',
    },
    sm: { fontWeight: fontWeight.medium, fontSize: '16px' },
  },

  /** Plan line name (two-tone). ReviewPlanLine L43. */
  planLineName: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '12px',
      lineHeight: '130%',
      letterSpacing: '0.6px',
    },
    sm: { fontWeight: fontWeight.bold, fontSize: '16px' },
  },

  /** Review line-item product name. ReviewLineItem L37 ('0.5%' ls → normal). */
  lineItemName: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: 'normal',
    },
    sm: { fontWeight: fontWeight.medium, fontSize: '14px' },
    wide: { fontSize: '18px' },
  },

  /** Uppercased category heading. ReviewSummary L61. */
  categoryLabel: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '12px',
      lineHeight: '100%',
      letterSpacing: '0.6px',
      textTransform: 'uppercase',
    },
    sm: { fontWeight: fontWeight.medium },
  },

  /** Product card title, horizontal orientation. ProductCard L100 (isVertical=false). */
  cardTitleHorizontal: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '16px',
      lineHeight: '130%',
      letterSpacing: '0.6px',
    },
  },

  /** Product card title, vertical orientation. ProductCard L100 (isVertical=true). */
  cardTitleVertical: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.semiBold,
      fontSize: '18px',
      lineHeight: '130%',
      letterSpacing: '0.6px',
    },
  },

  /** Product/plan card description. ProductCard L113, PlanCard L114. */
  cardDescription: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.medium,
      fontSize: '12px',
      lineHeight: '130%',
      letterSpacing: '0.6px',
    },
  },

  /** Plan card title. PlanCard L100. */
  planTitle: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.semiBold,
      fontSize: '18px',
      lineHeight: '100%',
      letterSpacing: '0.6px',
    },
  },

  /** Variant pill label. VariantPill L47. */
  pillLabel: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.medium,
      fontSize: '10px',
      lineHeight: '100%',
      letterSpacing: '0.6px',
    },
  },

  /** Discount badge. DiscountBadge — Figma: Gilroy-SemiBold / 400 / 12px / lh 100%. */
  badge: {
    base: {
      fontFamily: PRIMARY_SEMIBOLD,
      fontWeight: fontWeight.regular,
      fontSize: fontSize['12'],
      lineHeight: lineHeight['100'],
      letterSpacing: letterSpacing.none,
    },
  },

  /** Product card price. PriceBlock L35/L44/L50 (line-through & colors stay at call site). */
  cardPrice: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '16px',
      lineHeight: '100%',
      letterSpacing: '0.6px',
    },
  },

  /**
   * Review-row price. ReviewPrice L44/L52.
   * NOTE: not wired — the current render's line-height at sm+ is 24px (from
   * `text-base`), which this role (lh 16px) does not reproduce. See
   * DEVIATIONS.md; MIGRATION-REPORT.md marks it skipped.
   */
  reviewPrice: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: 'normal',
    },
    sm: { fontWeight: fontWeight.medium, fontSize: '16px' },
  },

  /** Quantity number, review variant. QuantityStepper L59 (review branch). */
  quantityReview: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '14px',
      lineHeight: '16px',
      letterSpacing: '0px',
      fontVariantNumeric: 'tabular-nums',
    },
    sm: { fontWeight: fontWeight.semiBold },
  },

  /**
   * Quantity number, card variant. QuantityStepper L59 (card branch).
   * Intentionally sets NO fontFamily: the card branch has no family today and
   * renders in the system font. Adding Gilroy would be a visible change. F1.
   */
  quantityCard: {
    base: {
      fontWeight: fontWeight.regular,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0px',
      fontVariantNumeric: 'tabular-nums',
    },
    sm: { fontWeight: fontWeight.semiBold },
  },

  /** Green savings callout. ReviewCheckout L173. */
  savingsNote: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.semiBold,
      fontSize: '14px',
      lineHeight: '100%',
      letterSpacing: '-0.06px',
    },
  },

  /** "as low as $X/mo" financing pill. ReviewCheckout L31. */
  financingPill: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '16px',
      lineHeight: '100%',
      letterSpacing: '-0.05em',
    },
  },

  /** Struck-through compare-at subtotal. ReviewCheckout L59 ('0.25%' ls → normal). */
  checkoutCompare: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.medium,
      fontSize: '22px',
      lineHeight: '20px',
      letterSpacing: 'normal',
    },
  },

  /** Big bundle total. ReviewCheckout L73 ('-0.13%' ls → normal). */
  checkoutTotal: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.bold,
      fontSize: '28px',
      lineHeight: '32px',
      letterSpacing: 'normal',
    },
  },

  /** Satisfaction-guarantee heading. ReviewCheckout L132. */
  returnsHeading: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.semiBold,
      fontSize: '18px',
      lineHeight: '110%',
      letterSpacing: '0.6px',
    },
  },

  /** Satisfaction-guarantee body. ReviewCheckout L145. */
  returnsBody: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '18px',
      lineHeight: '110%',
      letterSpacing: '0.6px',
    },
  },

  /** Checkout CTA button label — the only TT Norms Pro usage. ReviewCheckout L191. */
  checkoutCta: {
    base: {
      fontFamily: SECONDARY,
      fontWeight: fontWeight.bold,
      fontSize: '17px',
      lineHeight: '100%',
      letterSpacing: '0px',
    },
  },

  /** "Save my system for later" link. ReviewCheckout L213 (underline stays at call site). */
  saveLink: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.medium,
      fontSize: '14px',
      lineHeight: '130%',
      letterSpacing: '0.6px',
    },
  },

  /** "N selected" count. AccordionStep L125. */
  selectedCount: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '14px',
      lineHeight: '16px',
      letterSpacing: '0px',
    },
  },

  /** "Next: …" advance button. AccordionStep L151 ('0%' ls → normal). */
  nextButton: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.semiBold,
      fontSize: '18px',
      lineHeight: '24px',
      letterSpacing: 'normal',
    },
  },

  /**
   * Mobile hero heading. HomePage L198.
   * Renders REGULAR (400) today: the source names 'Gilroy-Bold', which is not a
   * registered @font-face family, so it falls back to plain Gilroy and the
   * inline weight 400 wins. This role encodes that reality. F2.
   */
  heroMobile: {
    base: {
      fontFamily: PRIMARY,
      fontWeight: fontWeight.regular,
      fontSize: '31px',
      lineHeight: '110%',
      letterSpacing: '-0.06px',
    },
  },
} as const satisfies Record<string, TextStyleRole>;

export type TextStyles = typeof textStyles;
export type TextStyleRoleName = keyof typeof textStyles;

/** Kebab-case suffixes for generated `.text-<role>` classes (for tailwind-merge config). */
export const typographyRoleNames = Object.keys(textStyles).map((role) =>
  role.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`),
);

/**
 * Flatten a role's `base` + the overrides that apply at `screen` into one style
 * object. Escape hatch for the rare inline case; prefer the generated
 * `.text-<role>` class. `screen` is inclusive and cumulative: 'lg' folds in sm+lg.
 */
export function getTextStyle(
  role: TextStyleRoleName,
  screen: TypographyScreen | 'base' = 'base',
): TextStyleVariant {
  const def = textStyles[role] as TextStyleRole;
  const order: TypographyScreen[] = ['sm', 'lg', 'wide'];
  let result: TextStyleVariant = { ...def.base };
  if (screen === 'base') return result;
  for (const step of order) {
    if (def[step]) result = { ...result, ...def[step] };
    if (step === screen) break;
  }
  return result;
}
