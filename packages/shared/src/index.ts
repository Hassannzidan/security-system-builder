/**
 * Public entry point for the shared package.
 *
 * Both `apps/web` and `apps/api` consume everything through this barrel so the
 * two applications always agree on domain types, enums and constants.
 */
export * from './enums.js';
export * from './constants.js';
export * from './types.js';
