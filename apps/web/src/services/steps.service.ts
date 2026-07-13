/**
 * Steps service — the sole data source for the bundle builder.
 *
 * Pure functions over the typed API client; no React or react-query concerns
 * live here. Callers get fully-typed shared-domain objects back.
 */
import type { Step } from '@security-system-builder/shared';
import { API_ROUTES } from '@security-system-builder/shared';
import { api } from './apiClient';

export const stepsService = {
  /** Fetch every builder step (each embeds its own products). */
  list(): Promise<Step[]> {
    return api.get<Step[]>(API_ROUTES.steps);
  },

  /** Fetch a single step by id. */
  getById(stepId: string): Promise<Step> {
    return api.get<Step>(`${API_ROUTES.steps}/${stepId}`);
  },
};
