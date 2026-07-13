/**
 * Design Token System
 *
 * Single entry point for primitives + semantic tokens.
 *
 * Usage:
 *   import { colors, spacing, radius, typography, borders, shadows } from '@/design-tokens';
 *
 * Prefer semantic tokens (colors.text.primary, spacing.md) over primitives.
 */

export { colors, primitiveColors, opacity } from './colors';
export type { Colors, PrimitiveColors, Opacity } from './colors';

export {
  typography,
  fontFamily,
  fontFamilyFallback,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
} from './typography';
export type { Typography, FontFamily, FontWeight, LineHeight, LetterSpacing } from './typography';

export { spacing } from './spacing';
export type { Spacing, SpacingToken } from './spacing';

export { breakpoints } from './breakpoints';
export type { Breakpoints, BreakpointToken } from './breakpoints';

export { stepper } from './stepper';
export type { Stepper } from './stepper';

export { radius } from './radius';
export type { Radius, RadiusToken } from './radius';

export { borders, borderWidth, borderColor } from './borders';
export type { Borders, BorderWidth, BorderColor } from './borders';

export { shadows } from './shadows';
export type { Shadows, ShadowToken } from './shadows';

import { colors } from './colors';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import { spacing } from './spacing';
import { stepper } from './stepper';
import { radius } from './radius';
import { borders } from './borders';
import { shadows } from './shadows';

/** Aggregated token map — useful for theme providers / tooling */
export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  borders,
  shadows,
  breakpoints,
  stepper,
} as const;

export type DesignTokens = typeof tokens;
export default tokens;
