import { Minus, Plus } from 'lucide-react';

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
  return (
    <div className="flex h-full items-center gap-2">
      <button
        type="button"
        className={btn}
        style={{ width: 20, height: 20 }}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease ${title} quantity`}
      >
        <Minus className="h-3 w-3" strokeWidth={2.5} />
      </button>
      <span
        className="min-w-[1rem] text-center text-sm font-semibold tabular-nums leading-none text-[#0B0D10]"
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
