/**
 * Loads and validates environment variables once at startup.
 *
 * Importing this module has the side effect of calling `dotenv.config()`, and
 * exposes a strongly-typed, validated `env` object to the rest of the app.
 */
import 'dotenv/config';
import { z } from 'zod';
import { DEFAULT_API_PORT } from '@security-system-builder/shared';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(DEFAULT_API_PORT),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast with a readable message rather than crashing deep in the app.
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const env = {
  ...parsed.data,
  /** Parsed list of allowed CORS origins. */
  corsOrigins: parsed.data.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  isProduction: parsed.data.NODE_ENV === 'production',
};
