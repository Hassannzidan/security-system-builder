/** Eyebrow label shown above the review panel below the wide (1440px) breakpoint. */
export function ReviewEyebrow() {
  return (
    <p
      className="text-eyebrow min-[1440px]:hidden px-[15px] pb-[5px] pt-[15px]"
      style={{
        color: '#484848',
        verticalAlign: 'middle',
      }}
    >
      Review
    </p>
  );
}
