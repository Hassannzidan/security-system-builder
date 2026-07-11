/**
 * Request validation middleware factory backed by Zod.
 *
 * Usage:
 *   router.get('/', validate({ query: mySchema }), handler)
 *
 * On success the parsed values replace `req.body/query/params`. On failure a
 * `ZodError` is forwarded to the error handler.
 */
import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

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
      // Forward Zod (or any) validation error to the centralised error handler.
      next(error);
    }
  };
}
