/**
 * Zod schemas for the steps routes, consumed by the `validate()` middleware.
 */
import { z } from 'zod';

/** Validates the `:stepId` route param (lowercase kebab/alphanumeric ids). */
export const stepIdParamSchema = z.object({
  stepId: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
});
