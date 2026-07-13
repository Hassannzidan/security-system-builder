import {
  Accordion,
  CameraIcon,
  PlanIcon,
  SensorIcon,
  ShieldPlusIcon,
  type AccordionStepConfig,
} from '@/components/common';
import { PageGrid } from '@/layouts';
import { cn } from '@/lib/utils';

/**
 * HomePage — hosts the reusable <Accordion /> as a 4-step system builder.
 *
 * Layout (mobile-first):
 * - `<main>` *is* the shared 12-column PageGrid.
 * - Below `lg`: single column (content full width).
 * - `lg`+: Accordion sits on cols 2–11; outermost cols 1 and 12 stay empty.
 *
 * Step bodies are intentionally empty for now; the accordion is driven entirely
 * by this `steps` config, so content can be dropped in per step later without
 * touching the component.
 */
const STEPS: AccordionStepConfig[] = [
  { id: 'cameras', title: 'Choose your cameras', icon: <CameraIcon /> },
  { id: 'plan', title: 'Choose your plan', icon: <PlanIcon /> },
  { id: 'sensors', title: 'Choose your sensors', icon: <SensorIcon /> },
  { id: 'extras', title: 'Add extra protection', icon: <ShieldPlusIcon /> },
];

/** Center band of the page grid: full width on mobile, cols 2–11 on lg+. */
const CENTER_COLS = 'col-span-full min-w-0 lg:col-span-10 lg:col-start-2';

export function HomePage() {
  return (
    <PageGrid as="main" className="min-h-screen bg-[#F7F8FC]">
      <h1
        className={cn(
          CENTER_COLS,
          "font-['Gilroy'] text-xl font-bold text-[#0B0D10] sm:text-2xl lg:text-[28px]",
        )}
      >
        Build your system
      </h1>
      <Accordion className={CENTER_COLS} steps={STEPS} />
    </PageGrid>
  );
}
