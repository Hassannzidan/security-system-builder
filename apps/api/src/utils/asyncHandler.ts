/**
 * Wraps an async Express handler so any rejected promise is forwarded to the
 * central error-handling middleware instead of surfacing as an unhandled
 * rejection. Generic over the route params so validated handlers keep precise
 * `req.params` typing.
 */
import type { NextFunction, Request, RequestHandler, Response } from 'express';

export function asyncHandler<P = Record<string, string>>(
  handler: (req: Request<P>, res: Response, next: NextFunction) => Promise<void> | void,
): RequestHandler<P> {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
