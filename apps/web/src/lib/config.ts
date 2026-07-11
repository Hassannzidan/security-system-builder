import { API_BASE_PATH } from '@security-system-builder/shared';

/**
 * Frontend runtime configuration, sourced from Vite env vars.
 * `VITE_API_URL` may point at an absolute API origin; when omitted we rely on
 * the dev-server proxy and use a relative base path.
 */
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}${API_BASE_PATH}`
    : API_BASE_PATH,
} as const;
