/**
 * Shared domain and transport types used across the web and api applications.
 */
import type { ApiErrorCode, ProductCategory, ProductStatus } from './enums.js';

/** A sellable security-system component. */
export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  currency: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** A grouping of products. */
export interface Category {
  id: string;
  slug: ProductCategory;
  name: string;
  description: string;
  productCount: number;
}

/** Whether a step allows selecting one or many of its products. */
export type SelectionType = 'single' | 'multiple';

/** A selectable colour/finish option for a step product. */
export interface ProductVariant {
  id: string;
  label: string;
  swatch: string;
  image: string;
}

/** Pricing for a step product, with an optional strike-through compare-at. */
export interface Pricing {
  price: number;
  compareAt?: number;
}

/** Default quantity/variant the builder pre-selects for a product. */
export interface Seed {
  variantId: string | null;
  qty: number;
}

/** A product presented inside a bundle-builder step. */
export interface StepProduct {
  id: string;
  name: string;
  description?: string;
  learnMoreUrl?: string;
  badge?: string;
  image: string;
  pricing: Pricing;
  variants?: ProductVariant[] | null;
  seed?: Seed | null;
}

/** A single step in the bundle builder, embedding its own products. */
export interface Step {
  id: string;
  order: number;
  title: string;
  icon: string;
  nextLabel?: string;
  category: string;
  selectionType: SelectionType;
  products: StepProduct[];
}

/** Standard success envelope returned by the API. */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/** Standard error envelope returned by the API. */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}

/** Union of the two possible API envelopes. */
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

/** Payload returned by the health endpoint. */
export interface HealthStatus {
  status: 'ok';
  uptime: number;
  timestamp: string;
}
