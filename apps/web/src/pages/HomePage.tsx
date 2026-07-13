import {
  Accordion,
  CameraIcon,
  PlanIcon,
  SensorIcon,
  ShieldPlusIcon,
  type AccordionStepConfig,
} from '@/components/common';

/**
 * HomePage — hosts the reusable <Accordion /> as a 4-step system builder.
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

export function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-4xl xl:max-w-5xl">
        <h1 className="mb-4 font-['Gilroy'] text-xl font-bold text-[#0B0D10] sm:mb-6 sm:text-2xl lg:text-[28px]">
          Build your system
        </h1>
        <Accordion steps={STEPS} />
      </div>
    </main>
  );
}
