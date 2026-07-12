export interface ProductVariant {
  id: string;
  /** Visible label, e.g. "White". */
  label: string;
  /** Small preview image shown inside the variant pill. */
  thumbnailUrl?: string;
  /** Solid color swatch, used when no thumbnail is provided. */
  swatch?: string;
}

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
  selectedVariantId?: string;
  defaultVariantId?: string;
  onVariantChange?: (variantId: string) => void;

  /** Active (current) price. */
  price: number;
  /** Original price shown struck-through above the active price. */
  compareAtPrice?: number;
  currency?: string;

  /** Controlled quantity. Omit to let the card manage its own quantity. */
  quantity?: number;
  defaultQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;

  orientation?: 'horizontal' | 'vertical';
  /** Controlled selected state. Clicking the card toggles selection. */
  selected?: boolean;
  /** Uncontrolled initial selected state when `selected` is omitted. */
  defaultSelected?: boolean;
  /** Called when the card is clicked to toggle selection. */
  onSelectedChange?: (selected: boolean) => void;
  className?: string;
}
