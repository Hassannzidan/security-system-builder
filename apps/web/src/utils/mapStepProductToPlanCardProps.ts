import type { StepProduct } from '@security-system-builder/shared';

import type { PlanCardProps } from '@/components/common/PlanCard/types';

/**
 * Adapter mapping an API `StepProduct` onto the presentational `PlanCardProps`,
 * mirroring `mapStepProductToCardProps` but for the single-select plan step:
 * `image -> imageUrl`, `pricing.price -> price`, `pricing.compareAt ->
 * compareAtPrice`, `pricing.interval -> interval`, `learnMoreUrl ->
 * learnMoreHref`. Plans have no variants, so there is no variant/quantity state.
 *
 * `selected` and `onSelect` are supplied by the caller since they depend on the
 * bundle builder's single-selection state for the owning step.
 */
export function mapStepProductToPlanCardProps(
  product: StepProduct,
  radio: { selected: boolean; onSelect: () => void },
): PlanCardProps {
  return {
    title: product.name,
    description: product.description,
    imageUrl: product.image,
    imageAlt: product.name,
    badge: product.badge,
    learnMoreHref: product.learnMoreUrl,
    price: product.pricing.price,
    compareAtPrice: product.pricing.compareAt,
    interval: product.pricing.interval,
    selected: radio.selected,
    onSelect: radio.onSelect,
  };
}
