/**
 * API-local type helpers. Domain types live in the shared package and are
 * re-exported here for convenience.
 */
import type { Request, Response, NextFunction } from 'express';

export type { HealthStatus } from '@security-system-builder/shared';

/** Signature for an async Express handler that may throw. */
export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;
