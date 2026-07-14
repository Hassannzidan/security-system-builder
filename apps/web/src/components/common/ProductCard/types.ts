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
  /**
   * When true, both stepper buttons render disabled regardless of quantity —
   * used for required products whose quantity is locked. Purely visual; the
   * bundle builder also guards its mutators for these products.
   */
  stepperDisabled?: boolean;

  orientation?: 'horizontal' | 'vertical';
  /**
   * How the image sits within its frame. "start" (default) top-left anchors it;
   * "center" horizontally centers it within the card.
   */
  imageAlign?: 'start' | 'center';
  /** Highlights the card border. The parent passes `quantity > 0`. */
  selected?: boolean;
  /**
   * When provided, the card body becomes clickable and toggles selection.
   * Clicks on interactive children (links, stepper buttons, variant pills) are
   * ignored so they keep their own behaviour. Omit for a non-selectable card.
   */
  onToggleSelect?: () => void;
  className?: string;
}
