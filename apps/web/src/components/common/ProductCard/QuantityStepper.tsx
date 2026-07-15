import { Minus, Plus } from 'lucide-react';

import {
  borderWidth,
  colors,
  fontFamily,
  letterSpacing,
  lineHeight,
  spacing,
} from '@/design-tokens';
import { cn } from '@/lib/utils';

export function QuantityStepper({
  value,
  min,
  max,
  onChange,
  title,
  disabled = false,
  variant = 'card',
}: {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  title: string;
  disabled?: boolean;
  variant?: 'card' | 'review';
}) {
  const btnBg =
    variant === 'review' ? 'bg-white hover:bg-[#F0F4F7]' : 'bg-[#F0F4F7] hover:bg-[#E4E9EF]';
  const btn =
    `flex shrink-0 items-center justify-center rounded text-[#525963] ${btnBg} ` +
    'transition-colors disabled:cursor-not-allowed disabled:opacity-40';
  const decreaseDisabled = disabled || value <= min;

  return (
    <div className={cn('flex h-full items-center', variant === 'review' ? 'gap-2.5' : 'gap-2')}>
      <button
        type="button"
        className={cn(btn, 'disabled:bg-transparent disabled:hover:bg-transparent')}
        style={{
          width: spacing.xl,
          height: spacing.xl,
          ...(decreaseDisabled
            ? {
                borderStyle: 'solid',
                borderWidth: borderWidth.sm,
                borderColor: colors.border.default,
              }
            : undefined),
        }}
        onClick={() => onChange(value - 1)}
        disabled={decreaseDisabled}
        aria-label={`Decrease ${title} quantity`}
      >
        <Minus className="h-3 w-3" strokeWidth={2.5} />
      </button>
      <span
        className={cn(
          'min-w-[1rem] text-center tabular-nums text-[#0B0D10] font-normal sm:font-semibold',
          variant === 'review' ? 'text-sm' : 'text-base',
        )}
        style={
          variant === 'review'
            ? {
                fontFamily: fontFamily.primary.join(', '),
                lineHeight: lineHeight['16'],
                letterSpacing: letterSpacing.none,
                verticalAlign: 'bottom',
              }
            : { lineHeight: lineHeight['20'], letterSpacing: letterSpacing.none }
        }
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={btn}
        style={{ width: spacing.xl, height: spacing.xl }}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label={`Increase ${title} quantity`}
      >
        <Plus className="h-3 w-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}
