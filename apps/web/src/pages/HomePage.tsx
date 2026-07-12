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
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 font-['Gilroy'] text-2xl font-bold text-[#0B0D10]">
          Build your system
        </h1>
        <Accordion steps={STEPS} />
      </div>
    </main>
  );
}
