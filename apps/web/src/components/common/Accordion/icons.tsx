import type { ComponentType, SVGProps } from 'react';

import CamerasSvg from '@/assets/icons/step-cameras.svg?react';
import ExtrasSvg from '@/assets/icons/step-extras.svg?react';
import PlanSvg from '@/assets/icons/step-plan.svg?react';
import SensorsSvg from '@/assets/icons/step-sensors.svg?react';

/**
 * Example step icons for the Accordion (security system builder use case).
 *
 * The four step glyphs are the Figma exports in `@/assets/icons/*.svg`, imported
 * as React components via `vite-plugin-svgr`. Their source `#6F7882` was swapped
 * for `currentColor`, so the accordion header tints them (purple when the step
 * is open, grey when collapsed). Each is normalized to a 30×30 box here.
 */

type IconProps = SVGProps<SVGSVGElement>;

/** Wrap an svgr component so the accordion header controls icon size via CSS. */
function withSize(Svg: ComponentType<IconProps>) {
  return function StepIcon(props: IconProps) {
    return <Svg className="size-full" aria-hidden="true" {...props} />;
  };
}

/** Step 1 — Choose your cameras (livestream). */
export const CameraIcon = withSize(CamerasSvg);

/** Step 2 — Choose your plan (shield). */
export const PlanIcon = withSize(PlanSvg);

/** Step 3 — Choose your sensors. */
export const SensorIcon = withSize(SensorsSvg);

/** Step 4 — Add extra protection. */
export const ShieldPlusIcon = withSize(ExtrasSvg);

/** Filled triangle that points up when `open`, down otherwise. */
export function Chevron({ open, ...props }: IconProps & { open: boolean }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="#4E2FD2"
      stroke="#4E2FD2"
      strokeWidth={2}
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transition: 'transform 150ms ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
      {...props}
    >
      <path d="M7 9h10l-5 6z" />
    </svg>
  );
}
