/**
 * Centralised error-handling middleware. Translates thrown errors — whether an
 * `ApiError`, a Zod error, or an unexpected exception — into the standard
 * `ApiErrorResponse` envelope.
 */
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiErrorCode } from '@security-system-builder/shared';
import { ApiError } from '../utils/ApiError.js';
import { failure } from '../utils/response.js';
import { env } from '../config/env.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(failure(err.code, err.message, err.details));
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json(failure(ApiErrorCode.ValidationError, 'Validation failed', err.flatten()));
    return;
  }

  // Unexpected error: log it and hide internals from the client in production.
  console.error('Unhandled error:', err);
  res
    .status(500)
    .json(
      failure(
        ApiErrorCode.Internal,
        env.isProduction ? 'Internal server error' : String((err as Error)?.message ?? err),
      ),
    );
};
