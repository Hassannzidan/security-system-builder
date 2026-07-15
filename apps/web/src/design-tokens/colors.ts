/**
 * Color Design Tokens
 *
 * Architecture:
 * 1. Primitive palette — raw brand values (internal building blocks)
 * 2. Opacity scale     — reusable alpha values (no hardcoded rgba)
 * 3. Semantic aliases  — what UI code should consume
 *
 * Prefer semantic tokens in components so themes can evolve
 * without chasing hex values across the codebase.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert `#RRGGBB` + alpha (0–1) → `rgba(...)`. */
function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

const gray = {
  900: '#0B0D10',
  700: '#525963',
  600: '#6F7882',
  500: '#A8B2BD',
  400: '#CED6DE',
  300: '#F0F4F7',
} as const;

const primary = {
  DEFAULT: '#4E2FD2',
} as const;

const base = {
  white: '#FFFFFF',
  black: '#1F1F1F',
  /** Absolute black — hairline borders, high-contrast strokes */
  absoluteBlack: '#000000',
} as const;

/** Mint aligns with success — used for subtle tint overlays. */
const mint = {
  DEFAULT: '#0AA288',
} as const;

/** Soft indigo wash — the review panel surface from Figma. */
const indigo = {
  50: '#EEF1FB',
} as const;

/**
 * UI-specific neutrals that sit off the numeric gray ramp — each tied to one
 * surface/role rather than a step in a scale. Kept as primitives so every raw
 * hex is declared exactly once and consumed through the semantic aliases below.
 */
const neutral = {
  /** App page canvas — the off-white builder background. */
  canvas: '#F7F8FC',
  /** Display heading ink (e.g. the 404 headline). */
  heading: '#1E2430',
  /** Eyebrow / step-label ink. */
  eyebrow: '#484848',
  /** Hover fill for neutral surface buttons (one notch below `gray.300`). */
  surfaceHover: '#E4E9EF',
  /** Expanded accordion-step surface tint. */
  expandedStep: '#EDF4FF',
  /** Loader/spinner track ring. */
  loaderTrack: '#CBD5E1',
  /** Unselected variant-swatch hairline. */
  swatchBorder: '#CCCCCC',
  /** Image-placeholder shimmer gradient stops. */
  shimmerFrom: '#EDF1F5',
  shimmerTo: '#DCE3EB',
} as const;

const status = {
  success: '#0AA288',
  error: '#D8392B',
  link: '#0000EE',
} as const;

/**
 * Reusable opacity scale.
 * Compose with primitives via `withAlpha` — never hardcode alpha in rgba strings.
 */
export const opacity = {
  /** Soft washes / glass tints (Figma 4%) */
  4: 0.04,
  /** Brand mute / translucent primary (Figma 70%) */
  70: 0.7,
  /** Scrims / modal overlays (Figma 75%) */
  75: 0.75,
  /** Semantic aliases for intent-based usage */
  subtle: 0.04,
  overlay: 0.75,
  disabled: 0.7,
} as const;

export const primitiveColors = {
  gray,
  primary,
  base,
  mint,
  indigo,
  neutral,
  status,
  opacity,
} as const;

// ---------------------------------------------------------------------------
// Semantic aliases (consume these in UI)
// ---------------------------------------------------------------------------

export const colors = {
  /** Brand primary */
  primary: {
    DEFAULT: primary.DEFAULT,
    /** Text / icon color on primary surfaces */
    foreground: base.white,
    muted: withAlpha(primary.DEFAULT, opacity[70]),
  },

  /** Neutral scale — keep numeric steps for layout flexibility */
  gray: {
    300: gray[300],
    400: gray[400],
    500: gray[500],
    600: gray[600],
    700: gray[700],
    900: gray[900],
  },

  /** Text roles */
  text: {
    primary: gray[900],
    secondary: gray[700],
    tertiary: gray[600],
    disabled: gray[500],
    inverse: base.white,
    link: status.link,
    /** Display heading ink — larger than `primary`, used on hero/404 headlines */
    heading: neutral.heading,
    /** Eyebrow / step-label ink */
    eyebrow: neutral.eyebrow,
    /** Body / description copy at 75% of base black */
    description: withAlpha(base.black, opacity[75]),
  },

  /** Surface / page backgrounds */
  background: {
    default: base.white,
    canvas: neutral.canvas,
    surface: gray[300],
    surfaceHover: neutral.surfaceHover,
    expandedStep: neutral.expandedStep,
    surfaceElevated: gray[300],
    inverse: gray[900],
    overlay: withAlpha(base.black, opacity.overlay),
    tint: withAlpha(mint.DEFAULT, opacity.subtle),
    wash: withAlpha(base.white, opacity.subtle),
    reviewPanel: indigo[50],
    shimmerFrom: neutral.shimmerFrom,
    shimmerTo: neutral.shimmerTo,
  },

  /** Borders & dividers */
  border: {
    default: gray[400],
    muted: gray[300],
    strong: gray[500],
    black: base.absoluteBlack,
    swatch: neutral.swatchBorder,
    loaderTrack: neutral.loaderTrack,
    focus: primary.DEFAULT,
  },

  /**
   * Feedback / status
   * Extend with warning / info once Figma defines them.
   */
  status: {
    success: status.success,
    error: status.error,
  },

  /** Absolute base colors when semantics don't fit */
  base: {
    white: base.white,
    black: base.black,
    absoluteBlack: base.absoluteBlack,
  },
} as const;

export type Colors = typeof colors;
export type PrimitiveColors = typeof primitiveColors;
export type Opacity = typeof opacity;
