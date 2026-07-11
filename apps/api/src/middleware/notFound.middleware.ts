import type { RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError.js';

/** Catch-all for unmatched routes; forwards a 404 `ApiError` to the handler. */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};
