/**
 * Express application factory. Wires up global middleware, the API router and
 * the error-handling stack. Kept separate from `server.ts` so it can be
 * imported by tests without binding a port.
 */
import express, { type Express } from 'express';
import cors from 'cors';
import { API_BASE_PATH } from '@security-system-builder/shared';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.corsOrigins }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(API_BASE_PATH, apiRouter);

  // 404 + centralised error handling must be registered last.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
