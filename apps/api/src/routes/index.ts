/**
 * Aggregates all resource routers under a single API router. Mounted by the
 * app at `API_BASE_PATH`.
 */
import { Router } from 'express';
import { API_ROUTES } from '@security-system-builder/shared';
import { healthRouter } from './health.routes.js';
import { stepsRouter } from './steps.routes.js';

export const apiRouter: Router = Router();

apiRouter.use(API_ROUTES.health, healthRouter);
apiRouter.use(API_ROUTES.steps, stepsRouter);
