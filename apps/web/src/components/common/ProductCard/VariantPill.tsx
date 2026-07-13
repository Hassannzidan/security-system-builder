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
      className="grid shrink-0 grid-cols-2 overflow-hidden box-border transition-colors"
      style={{
        width: 70,
        height: 26,
        borderRadius: radius.xs,
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: selected ? SELECTED_BORDER : UNSELECTED_BORDER,
        backgroundColor: selected ? SELECTED_FILL : 'transparent',
        color: colors.base.black,
      }}
    >
      <span className="flex h-full w-full items-center justify-center overflow-hidden">
        <img src={variant.swatch} alt="" aria-hidden className="h-full w-full object-contain" />
      </span>
      <span className="flex h-full w-full items-center justify-center overflow-hidden px-0.5">
        <span
          className="truncate"
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
