/**
 * Request validation middleware factory backed by Zod.
 *
 * Usage:
 *   router.get('/', validate({ query: mySchema }), handler)
 *
 * On success the parsed values replace `req.body/query/params`. On failure the
 * Zod issues are wrapped in a 400 `ApiError` (bad request) and forwarded to the
 * central error handler; any non-Zod error is passed through untouched.
 */
import type { RequestHandler } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';
import { ApiError } from '../utils/ApiError.js';

interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) Object.assign(req.query, schemas.query.parse(req.query));
      if (schemas.params) Object.assign(req.params, schemas.params.parse(req.params));
      next();
    } catch (error) {
      // Translate validation failures into a 400 and forward everything else.
      if (error instanceof ZodError) {
        next(ApiError.badRequest('Invalid request parameters', error.flatten()));
        return;
      }
      next(error);
    }
  };
}
