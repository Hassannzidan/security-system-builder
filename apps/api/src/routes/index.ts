/**
 * Aggregates all resource routers under a single API router. Mounted by the
 * app at `API_BASE_PATH`.
 */
import { Router } from 'express';
import { API_ROUTES } from '@security-system-builder/shared';
import { healthRouter } from './health.routes.js';
import { stepsRouter } from './steps.routes.js';
import { productRouter } from './product.routes.js';
import { categoryRouter } from './category.routes.js';

export const apiRouter: Router = Router();

apiRouter.use(API_ROUTES.health, healthRouter);
apiRouter.use(API_ROUTES.steps, stepsRouter);
// Legacy product/category routes remain mounted until the web app is migrated.
apiRouter.use(API_ROUTES.products, productRouter);
apiRouter.use(API_ROUTES.categories, categoryRouter);
