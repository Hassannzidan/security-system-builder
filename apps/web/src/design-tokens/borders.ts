/**
 * Border Design Tokens
 *
 * Width is intentionally sparse — one default stroke keeps
 * the UI calm. Focus color prepares for a11y focus rings.
 */

import { colors } from './colors';

export const borderWidth = {
  none: '0px',
  sm: '1px',
  DEFAULT: '2px',
} as const;

export const borderColor = {
  DEFAULT: colors.border.default,
  muted: colors.border.muted,
  strong: colors.border.strong,
  black: colors.border.black,
  focus: colors.border.focus,
} as const;

export const borders = {
  width: borderWidth,
  color: borderColor,
} as const;

export type BorderWidth = typeof borderWidth;
export type BorderColor = typeof borderColor;
export type Borders = typeof borders;
