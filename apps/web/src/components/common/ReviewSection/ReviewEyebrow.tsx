import { lineHeight } from '@/design-tokens';

/** Eyebrow label shown above the review panel below the wide (1440px) breakpoint. */
export function ReviewEyebrow() {
  return (
    <p
      className="min-[1440px]:hidden px-[15px] pb-[5px] pt-[15px] font-['Gilroy-Medium','Gilroy',sans-serif] text-[10px] font-normal uppercase leading-none tracking-[1.6px] sm:text-xs"
      style={{
        lineHeight: lineHeight['100'],
        color: '#484848',
        verticalAlign: 'middle',
      }}
    >
      Review
    </p>
  );
}
