/**
 * Small helpers to build the standard API envelopes defined in the shared
 * package, keeping controller code terse and consistent.
 */
import type { ApiErrorCode, ApiResponse, ApiErrorResponse } from '@security-system-builder/shared';

export function success<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function failure(code: ApiErrorCode, message: string, details?: unknown): ApiErrorResponse {
  return { success: false, error: { code, message, details } };
}
