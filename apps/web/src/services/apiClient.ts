/**
 * Shared Axios instance. All service modules import this so interceptors,
 * base URL and default headers are configured in exactly one place.
 *
 * Two behaviours are centralised here so services never touch Axios types:
 *   1. Success responses have the `{ success: true, data }` envelope unwrapped —
 *      consumers receive the domain object directly.
 *   2. Failures are normalised into a typed {@link ApiClientError} carrying the
 *      envelope `code` + HTTP `statusCode`.
 *
 * Use the typed {@link api} helpers (`api.get<T>` / `api.post<T>`) rather than
 * the raw instance so return types stay domain-shaped.
 */
import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '@security-system-builder/shared';
import { config } from '@/lib/config';
import { ApiClientError } from './ApiClientError';

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// On 2xx, unwrap the `{ success, data }` envelope so callers get the domain
// object directly. `response.data` is typed `any` by Axios, so the unwrapped
// value flows through as the second type arg of `get`/`post` below.
apiClient.interceptors.response.use(
  (response) => response.data?.data,
  (error: AxiosError<ApiErrorResponse>) => {
    const response = error.response;

    // Well-formed error envelope from the API.
    if (response?.data?.error) {
      const { code, message } = response.data.error;
      return Promise.reject(new ApiClientError({ code, message, statusCode: response.status }));
    }

    // Reached the server but the body wasn't a recognised envelope.
    if (response) {
      return Promise.reject(
        new ApiClientError({
          code: 'HTTP_ERROR',
          message: error.message || `Request failed with status ${response.status}`,
          statusCode: response.status,
        }),
      );
    }

    // No response at all — network failure, timeout, CORS, server down.
    return Promise.reject(
      new ApiClientError({
        code: 'NETWORK_ERROR',
        message: error.message || 'Unable to reach the server',
        statusCode: 0,
      }),
    );
  },
);

/**
 * Thin, typed wrappers over the shared instance. The second Axios type argument
 * (`R = T`) matches the value the response interceptor actually resolves with —
 * the already-unwrapped domain object — so `await api.get<Step[]>(...)` is a
 * `Step[]`, never an `AxiosResponse`.
 */
export const api = {
  get: <T>(url: string, requestConfig?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T, T>(url, requestConfig),
  post: <T>(url: string, body?: unknown, requestConfig?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<T, T>(url, body, requestConfig),
};
