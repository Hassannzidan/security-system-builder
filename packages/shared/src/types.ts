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
