import { fontSize } from './typography';
import { spacing as space } from './spacing';

/**
 * Responsive tokens for the accordion stepper.
 *
 * Values are mobile-first. Pair with Tailwind breakpoint prefixes that match
 * `breakpoints` (sm / lg / xl).
 */
export const stepper = {
  /** Horizontal + vertical padding inside each step header / content */
  inset: {
    base: space.md,
    sm: space['15'],
    lg: space.xl,
  },

  /** "STEP X OF N" eyebrow */
  eyebrow: {
    fontSize: { base: '10px', sm: '11px' },
    letterSpacing: '1px',
  },

  /** Step title ("Choose your cameras") */
  title: {
    fontSize: { base: '20px', sm: '24px', lg: fontSize['28'] },
  },

  /** Leading step icon box */
  icon: {
    size: { base: 24, sm: 28, lg: 30 },
  },

  /** Gap between header rows and inside content */
  gap: {
    header: { base: space.sm, sm: space.sm },
    content: { base: space.md, sm: space.lg },
  },

  /** "Next: …" advance button */
  nextButton: {
    fontSize: { base: '14px', sm: fontSize['16'] },
    padding: {
      base: `${space.sm} ${space.lg}`,
      sm: `${space.md} ${space['2xl']}`,
    },
  },

  /**
   * Tailwind classes for full-bleed dividers inside padded headers.
   * Keeps eyebrow borders aligned with section dividers at every breakpoint.
   */
  eyebrowBleed:
    '-mx-3 w-[calc(100%+24px)] px-3 sm:-mx-[15px] sm:w-[calc(100%+30px)] sm:px-[15px] lg:-mx-5 lg:w-[calc(100%+40px)] lg:px-5',

  /** Tailwind padding classes for trigger / content areas */
  triggerPadding: 'gap-2 p-3 sm:gap-2 sm:p-[15px] lg:gap-2 lg:p-5',
  contentPadding: 'gap-3 px-3 pb-3 sm:gap-4 sm:px-[15px] sm:pb-4 lg:px-5 lg:pb-4',
  nextButtonLayout: 'w-full sm:w-auto',
  nextButtonPadding: 'px-4 py-2 sm:px-6 sm:py-3',
} as const;

export type Stepper = typeof stepper;
