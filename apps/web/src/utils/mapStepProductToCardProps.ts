import type { StepProduct } from '@security-system-builder/shared';

import type { ProductCardProps } from '@/components/common/ProductCard/types';

/** The bundle-builder state for a single card (from `useBundleBuilder`). */
interface CardState {
  activeVariantId: string | null;
  quantity: number;
}

/** Change handlers the card forwards back to the bundle builder. */
interface CardHandlers {
  onVariantChange: (variantId: string) => void;
  onQuantityChange: (quantity: number) => void;
}

/**
 * Adapter mapping an API `StepProduct` + bundle-builder state onto the
 * presentational `ProductCardProps`. Keeps the card domain-agnostic:
 * `image -> imageUrl`, `pricing.price -> price`, `pricing.compareAt ->
 * compareAtPrice`, `learnMoreUrl -> learnMoreHref`. Variants pass through as the
 * shared shape. The card image tracks the active variant so switching colours is
 * visible, falling back to the product image.
 *
 * Note: the `selected` border is deliberately NOT set here — it depends on
 * whether *any* variant has qty > 0 (`isProductSelected`), which only the bundle
 * builder knows. The page passes `selected` alongside these props.
 */
export function mapStepProductToCardProps(
  product: StepProduct,
  cardState: CardState,
  handlers: CardHandlers,
): ProductCardProps {
  const activeVariant = product.variants?.find((v) => v.id === cardState.activeVariantId);

  return {
    title: product.name,
    description: product.description,
    imageUrl: activeVariant?.image ?? product.image,
    imageAlt: product.name,
    badge: product.badge,
    learnMoreHref: product.learnMoreUrl,
    variants: product.variants ?? undefined,
    selectedVariantId: cardState.activeVariantId,
    onVariantChange: handlers.onVariantChange,
    price: product.pricing.price,
    compareAtPrice: product.pricing.compareAt,
    quantity: cardState.quantity,
    onQuantityChange: handlers.onQuantityChange,
    stepperDisabled: product.required === true,
  };
}
