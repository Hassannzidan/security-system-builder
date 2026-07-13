import type { ProductVariant } from '@security-system-builder/shared';

export type { ProductVariant };

export interface ProductCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Optional discount badge text, e.g. "Save 22%". Hidden when omitted. */
  badge?: string;

  /** "Learn More" link target. Renders the link only when href/onLearnMore is set. */
  learnMoreHref?: string;
  onLearnMore?: () => void;
  learnMoreLabel?: string;

  /** Color / configuration options. Omit or pass an empty array for no selector. */
  variants?: ProductVariant[];
  /** Controlled active variant id (null when the product has no variants). */
  selectedVariantId: string | null;
  onVariantChange?: (variantId: string) => void;

  /** Active (current) price. */
  price: number;
  /** Original price shown struck-through above the active price. */
  compareAtPrice?: number;
  currency?: string;

  /** Controlled quantity of the active variant. */
  quantity: number;
  onQuantityChange?: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;

  orientation?: 'horizontal' | 'vertical';
  /** Highlights the card border. The parent passes `quantity > 0`. */
  selected?: boolean;
  className?: string;
}
