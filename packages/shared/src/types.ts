/**
 * Shared domain and transport types used across the web and api applications.
 */
import type { ApiErrorCode } from './enums.js';

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
  /** Billing interval for recurring-priced products (plans). Absent = one-time. */
  interval?: 'month';
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
  image?: string;
  pricing: Pricing;
  variants?: ProductVariant[] | null;
  seed?: Seed | null;
  /**
   * When true the product is mandatory: locked at its seeded quantity and never
   * incremented, decremented or removed. A required product must have a non-null
   * seed with qty >= 1. Absent/false = normal behaviour.
   */
  required?: boolean;
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
