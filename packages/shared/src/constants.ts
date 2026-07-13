/**
 * Shared constants used across the web and api applications.
 */

/** Base path under which all REST resources are mounted. */
export const API_BASE_PATH = '/api/v1';

/** Default port the API server listens on when not overridden by the environment. */
export const DEFAULT_API_PORT = 4000;

/** Default port the web dev server runs on. */
export const DEFAULT_WEB_PORT = 5173;

/** Well-known REST routes, kept in one place so both apps stay in sync. */
export const API_ROUTES = {
  health: '/health',
  steps: '/steps',
  products: '/products',
  categories: '/categories',
} as const;

export type ApiRouteKey = keyof typeof API_ROUTES;
