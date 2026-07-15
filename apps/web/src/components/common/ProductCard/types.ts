import type { ProductVariant } from '@security-system-builder/shared';

export type { ProductVariant };

export interface ProductCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  badge?: string;

  learnMoreHref?: string;
  onLearnMore?: () => void;
  learnMoreLabel?: string;

  variants?: ProductVariant[];
  selectedVariantId: string | null;
  onVariantChange?: (variantId: string) => void;

  price: number;
  compareAtPrice?: number;
  currency?: string;

  quantity: number;
  onQuantityChange?: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;

  stepperDisabled?: boolean;

  orientation?: 'horizontal' | 'vertical';

  imageAlign?: 'start' | 'center';
  selected?: boolean;

  onToggleSelect?: () => void;
  className?: string;
}
