import type { ReactNode } from 'react';

import type { Step } from '@security-system-builder/shared';

import {
  Accordion,
  CameraIcon,
  PlanIcon,
  SensorIcon,
  ShieldPlusIcon,
  ProductCard,
  type AccordionStepConfig,
} from '@/components/common';
import { useStepsQuery } from '@/hooks/useStepsQuery';
import {
  useBundleBuilder,
  DEFAULT_VARIANT_KEY,
  type BundleBuilder,
} from '@/hooks/useBundleBuilder';
import { PageGrid } from '@/layouts';
import { cn } from '@/lib/utils';
import { mapStepProductToCardProps } from '@/utils/mapStepProductToCardProps';

/**
 * HomePage — the bundle builder. Fetches steps from the API, owns selection
 * state via `useBundleBuilder`, and renders the 4-step accordion with Step 1
 * (cameras) wired to live product cards.
 *
 * Layout (mobile-first):
 * - `<main>` *is* the shared 12-column PageGrid (full viewport width).
 * - Below `lg`: content full width. `lg`+: content on cols 2–11 (10 cols).
 */

/** Center band: full width on mobile, cols 2–11 on lg+. */
const CENTER_COLS = 'col-span-full min-w-0 lg:col-span-10 lg:col-start-2';

/** Resolve a `Step.icon` string key to its React glyph. */
const STEP_ICONS: Record<string, ReactNode> = {
  camera: <CameraIcon />,
  plan: <PlanIcon />,
  sensor: <SensorIcon />,
  extras: <ShieldPlusIcon />,
};

/**
 * TODO: remove when steps 2-4 exist in API.
 * The steps API currently returns only the cameras step. To match the design,
 * headers 2–4 are rendered from this local placeholder config (title + icon +
 * order + advance label, no body) and merged after the API steps.
 */
const PLACEHOLDER_STEPS: Array<{
  id: string;
  order: number;
  title: string;
  icon: string;
  nextLabel?: string;
}> = [
  {
    id: 'plan',
    order: 2,
    title: 'Choose your plan',
    icon: 'plan',
    nextLabel: 'Next: Choose your sensors',
  },
  {
    id: 'sensors',
    order: 3,
    title: 'Choose your sensors',
    icon: 'sensor',
    nextLabel: 'Next: Add extra protection',
  },
  { id: 'extras', order: 4, title: 'Add extra protection', icon: 'extras', nextLabel: 'Next' },
];

/** Responsive grid of product cards for a step (5 across on desktop → 1 on phone). */
function StepProductsGrid({ step, builder }: { step: Step; builder: BundleBuilder }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {step.products.map((product) => {
        const cardState = builder.getCardState(product.id);
        const activeKey = cardState.activeVariantId ?? DEFAULT_VARIANT_KEY;
        const props = mapStepProductToCardProps(product, cardState, {
          onVariantChange: (variantId) => builder.selectVariant(product.id, variantId),
          onQuantityChange: (qty) => builder.setQuantity(product.id, activeKey, qty),
        });
        return (
          <ProductCard
            key={product.id}
            orientation="vertical"
            selected={builder.isProductSelected(product.id)}
            onToggleSelect={() => builder.toggleActive(product.id)}
            {...props}
          />
        );
      })}
    </div>
  );
}

/** Merge live API steps with placeholder headers, sorted by `order`. */
function buildAccordionSteps(apiSteps: Step[], builder: BundleBuilder): AccordionStepConfig[] {
  const apiIds = new Set(apiSteps.map((s) => s.id));

  const fromApi = apiSteps.map((step) => ({
    order: step.order,
    config: {
      id: step.id,
      title: step.title,
      icon: STEP_ICONS[step.icon],
      nextLabel: step.nextLabel,
      selectedCount: builder.getSelectedCount(step.id),
      content: <StepProductsGrid step={step} builder={builder} />,
    } satisfies AccordionStepConfig,
  }));

  const fromPlaceholders = PLACEHOLDER_STEPS.filter((p) => !apiIds.has(p.id)).map((p) => ({
    order: p.order,
    config: {
      id: p.id,
      title: p.title,
      icon: STEP_ICONS[p.icon],
      nextLabel: p.nextLabel,
    } satisfies AccordionStepConfig,
  }));

  return [...fromApi, ...fromPlaceholders].sort((a, b) => a.order - b.order).map((s) => s.config);
}

function Heading() {
  return (
    <h1 className="font-['Gilroy'] text-xl font-bold text-[#0B0D10] sm:text-2xl lg:text-[28px]">
      Build your system
    </h1>
  );
}

export function HomePage() {
  const stepsQuery = useStepsQuery();
  const builder = useBundleBuilder(stepsQuery.data ?? []);

  let body: ReactNode;

  if (stepsQuery.isPending) {
    body = (
      <div
        className="flex min-h-[40vh] items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#CBD5E1] border-t-[#6D28D9]" />
        <span className="sr-only">Loading your system builder…</span>
      </div>
    );
  } else if (stepsQuery.isError) {
    body = (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="font-['Gilroy'] text-sm font-medium text-[#525963]">
          We couldn’t load the system builder.
        </p>
        <button
          type="button"
          onClick={() => stepsQuery.refetch()}
          className="rounded-md border border-[#6D28D9]/40 px-4 py-2 text-sm font-semibold text-[#6D28D9] transition-colors hover:bg-[#6D28D9]/5"
        >
          Try again
        </button>
      </div>
    );
  } else {
    body = (
      <Accordion
        steps={buildAccordionSteps(stepsQuery.data, builder)}
        openIndex={builder.openStepIndex}
        onOpenChange={builder.setOpenStep}
      />
    );
  }

  return (
    <PageGrid as="main" className="min-h-screen bg-[#F7F8FC]">
      <div className={cn(CENTER_COLS, 'flex flex-col gap-4')}>
        <Heading />
        {body}
      </div>
    </PageGrid>
  );
}
