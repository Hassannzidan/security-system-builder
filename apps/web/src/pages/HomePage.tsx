import type { ReactNode } from 'react';

import type { Step } from '@security-system-builder/shared';

import {
  Accordion,
  CameraIcon,
  PlanIcon,
  SensorIcon,
  ShieldPlusIcon,
  ProductCard,
  PlanCard,
  ReviewSection,
  type AccordionStepConfig,
} from '@/components/common';
import {
  BundleBuilderProvider,
  useBundleBuilderContext,
  type BundleBuilderContextValue,
} from '@/context/BundleBuilderContext';
import { breakpoints, colors, fontWeight, lineHeight } from '@/design-tokens';
import { DEFAULT_VARIANT_KEY } from '@/hooks/useBundleBuilder';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { PageGrid } from '@/layouts';
import { cn } from '@/lib/utils';
import { mapStepProductToCardProps } from '@/utils/mapStepProductToCardProps';
import { mapStepProductToPlanCardProps } from '@/utils/mapStepProductToPlanCardProps';

/**
 * HomePage — the bundle builder. Selection state lives in `BundleBuilderProvider`
 * (which instantiates the steps query + `useBundleBuilder` once), so the 4-step
 * accordion and the review panel below it are two sibling consumers of the same
 * state — a change in either place is instantly reflected in the other.
 *
 * Layout (mobile-first):
 * - `<main>` *is* the shared 12-column PageGrid (full viewport width).
 * - Below `lg`: content full width. `lg`+: content on cols 2–11 (10 cols).
 */

/** Center band: full width on mobile, cols 2–11 on lg+. */
const CENTER_COLS = 'col-span-full min-w-0 lg:col-span-10 lg:col-start-2';

/** The context value satisfies the builder shape the step grids consume. */
type Builder = BundleBuilderContextValue;

/** Resolve a `Step.icon` string key to its React glyph. */
const STEP_ICONS: Record<string, ReactNode> = {
  camera: <CameraIcon />,
  plan: <PlanIcon />,
  sensor: <SensorIcon />,
  extras: <ShieldPlusIcon />,
};

/**
 * Responsive grid of product cards for a step.
 *
 * At `1440px`+ the accordion is full-width, so cards render *vertically* and pack
 * up to 5 across. Below `1440px` the accordion narrows to a 6-col column beside
 * the review sidebar; there the cards switch to a *horizontal* layout (image left,
 * info right) and drop to at most 2 across. The orientation flip is a real JS prop
 * (it drives image/price sub-layouts), so it's keyed off a media query, not CSS.
 */
function StepProductsGrid({ step, builder }: { step: Step; builder: Builder }) {
  // Center every product image within its frame — both axes, both orientations.
  const imageAlign = 'center';
  const isCompact = useMediaQuery(`(max-width: ${breakpoints.wideMax})`);
  const orientation = isCompact ? 'horizontal' : 'vertical';
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        isCompact
          ? // 2-across in compact. When the product count is odd, the final card
            // is alone in the last row — span it across both columns and center it.
            'sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2 sm:[&>*:last-child:nth-child(odd)]:mx-auto'
          : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        // The bottom margin only separates the grid from the footer button.
        // The last step has no button, so it collapses to the content padding.
        step.nextLabel && 'mb-6',
      )}
    >
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
            // Single-column (mobile) grid cell is wider than the card's max-width,
            // so center the capped card in its cell; left-align from `sm` up.
            className="mx-auto sm:mx-0"
            orientation={orientation}
            imageAlign={imageAlign}
            selected={builder.isProductSelected(product.id)}
            onToggleSelect={() => builder.toggleActive(product.id)}
            {...props}
          />
        );
      })}
    </div>
  );
}

/**
 * Responsive radiogroup of plan cards for a single-select step (3 across on
 * desktop → 1 column on phone). Single-select semantics: exactly one card is
 * chosen, driven by the builder's `getSingleSelection`.
 */
function StepPlansGrid({ step, builder }: { step: Step; builder: Builder }) {
  const selectedId = builder.getSingleSelection(step.id);
  return (
    <div
      role="radiogroup"
      aria-label={step.title}
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
        step.nextLabel && 'mb-6',
      )}
    >
      {step.products.map((product) => {
        const props = mapStepProductToPlanCardProps(product, {
          selected: selectedId === product.id,
          onSelect: () => builder.selectSingle(step.id, product.id),
        });
        return <PlanCard key={product.id} {...props} />;
      })}
    </div>
  );
}

/** Render a step's body according to its selection type. */
function StepContent({ step, builder }: { step: Step; builder: Builder }) {
  return step.selectionType === 'single' ? (
    <StepPlansGrid step={step} builder={builder} />
  ) : (
    <StepProductsGrid step={step} builder={builder} />
  );
}

/** Map live API steps to accordion configs, sorted by `order`. */
function buildAccordionSteps(apiSteps: Step[], builder: Builder): AccordionStepConfig[] {
  return [...apiSteps]
    .sort((a, b) => a.order - b.order)
    .map((step) => ({
      id: step.id,
      title: step.title,
      icon: STEP_ICONS[step.icon],
      nextLabel: step.nextLabel,
      selectedCount: builder.getSelectedCount(step.id),
      content: <StepContent step={step} builder={builder} />,
    }));
}

/** The page body — reads shared state from context and renders the loaded UI. */
function HomeContent() {
  const builder = useBundleBuilderContext();

  if (builder.isPending) {
    return (
      <div
        className="flex min-h-[40vh] items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#CBD5E1] border-t-[#6D28D9]" />
        <span className="sr-only">Loading your system builder…</span>
      </div>
    );
  }

  if (builder.isError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="font-primary text-sm font-medium text-[#525963]">
          We couldn’t load the system builder.
        </p>
        <button
          type="button"
          onClick={() => builder.refetch()}
          className="rounded-md border border-[#6D28D9]/40 px-4 py-2 text-sm font-semibold text-[#6D28D9] transition-colors hover:bg-[#6D28D9]/5"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    // Below `lg`: single column (mobile stack). `lg`–1439px: a 10-col grid split
    // into a 6-col accordion + a 4-col review sidebar. `1440px`+: single column
    // again, so the review returns to a full-width panel beneath the accordion.
    <div className="grid grid-cols-1 items-start gap-4 lg:max-[1439px]:grid-cols-10 lg:max-[1439px]:gap-2">
      <div className="min-w-0 lg:max-[1439px]:col-span-6">
        {/* Mobile-only heading shown above the stepper. */}
        <h1
          className="mb-4 block px-4 sm:hidden"
          style={{
            fontFamily: "'Gilroy-Bold', 'Gilroy', sans-serif",
            fontWeight: fontWeight.regular,
            fontSize: '31px',
            lineHeight: lineHeight['110'],
            letterSpacing: '-0.06px',
            textAlign: 'center',
            color: colors.base.black,
          }}
        >
          Let’s get started!
        </h1>
        <Accordion
          steps={buildAccordionSteps(builder.steps, builder)}
          openIndex={builder.openStepIndex}
          onOpenChange={builder.setOpenStep}
        />
      </div>
      <div className="min-w-0 lg:max-[1439px]:col-span-4">
        <ReviewSection />
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <BundleBuilderProvider>
      <PageGrid as="main" className="min-h-screen bg-[#F7F8FC]">
        <div className={cn(CENTER_COLS, 'flex flex-col gap-4')}>
          <HomeContent />
        </div>
      </PageGrid>
    </BundleBuilderProvider>
  );
}
