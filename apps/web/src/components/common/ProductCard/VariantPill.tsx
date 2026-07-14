import {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  opacity,
  radius,
} from '@/design-tokens';

import type { ProductVariant } from './types';

const UNSELECTED_BORDER = '#CCCCCC';
const SELECTED_BORDER = '#0AA288';
const SELECTED_FILL = `rgba(29, 240, 187, ${opacity[4]})`; // #1DF0BB @ 4%

export function VariantPill({
  variant,
  selected,
  onSelect,
}: {
  variant: ProductVariant;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="inline-flex shrink-0 items-center overflow-hidden box-border transition-colors"
      style={{
        height: 26,
        borderRadius: radius.xs,
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: selected ? SELECTED_BORDER : UNSELECTED_BORDER,
        backgroundColor: selected ? SELECTED_FILL : 'transparent',
        color: colors.base.black,
      }}
    >
      <span className="flex h-full w-7 shrink-0 items-center justify-center overflow-hidden">
        <img src={variant.swatch} alt="" aria-hidden className="h-full w-full object-contain" />
      </span>
      <span className="flex h-full items-center pl-0.5 pr-2">
        <span
          className="whitespace-nowrap"
          style={{
            fontFamily: fontFamily.primary.join(', '),
            fontWeight: fontWeight.medium,
            fontSize: fontSize['10'],
            lineHeight: lineHeight['100'],
            letterSpacing: letterSpacing['0.6'],
          }}
        >
          {variant.label}
        </span>
      </span>
    </button>
  );
}
