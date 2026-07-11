/**
 * Application error type carrying an HTTP status and a machine-readable code.
 * Thrown anywhere in the request lifecycle and translated into an
 * `ApiErrorResponse` by the error-handling middleware.
 */
import { ApiErrorCode } from '@security-system-builder/shared';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: ApiErrorCode;
  readonly details?: unknown;

  constructor(statusCode: number, code: ApiErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static notFound(message = 'Resource not found', details?: unknown): ApiError {
    return new ApiError(404, ApiErrorCode.NotFound, message, details);
  }

  static badRequest(message = 'Bad request', details?: unknown): ApiError {
    return new ApiError(400, ApiErrorCode.BadRequest, message, details);
  }

  static validation(message = 'Validation failed', details?: unknown): ApiError {
    return new ApiError(422, ApiErrorCode.ValidationError, message, details);
  }
}
