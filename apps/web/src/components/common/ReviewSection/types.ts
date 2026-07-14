import type { LineItem, BundleTotals } from '@/hooks/useBundleBuilder';

/** Absolute quantity setter, shared with the product cards through context. */
export type SetQuantity = (productId: string, variantKey: string, qty: number) => void;

export interface ReviewSummaryProps {
  items: LineItem[];
  onSetQuantity: SetQuantity;
}

export interface ReviewLineItemProps {
  item: LineItem;
  onSetQuantity: SetQuantity;
}

export interface ReviewPlanLineProps {
  item: LineItem;
}

export interface ReviewCheckoutProps {
  totals: BundleTotals;
  onSave: () => void;
}
