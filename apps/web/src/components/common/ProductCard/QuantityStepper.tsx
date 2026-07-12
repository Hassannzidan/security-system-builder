import { Minus, Plus } from 'lucide-react';

import { borderWidth, colors, letterSpacing, lineHeight } from '@/design-tokens';
import { cn } from '@/lib/utils';

export function QuantityStepper({
  value,
  min,
  max,
  onChange,
  title,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  title: string;
}) {
  const btn =
    'flex shrink-0 items-center justify-center rounded bg-[#F0F4F7] text-[#525963] ' +
    'transition-colors hover:bg-[#E4E9EF] disabled:cursor-not-allowed disabled:opacity-40';
  const decreaseDisabled = value <= min;

  return (
    <div className="flex h-full items-center gap-2">
      <button
        type="button"
        className={cn(btn, 'disabled:bg-transparent disabled:hover:bg-transparent')}
        style={{
          width: 20,
          height: 20,
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
        className="min-w-[1rem] text-center text-base font-semibold tabular-nums text-[#0B0D10]"
        style={{ lineHeight: lineHeight['20'], letterSpacing: letterSpacing.none }}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={btn}
        style={{ width: 20, height: 20 }}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase ${title} quantity`}
      >
        <Plus className="h-3 w-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}
