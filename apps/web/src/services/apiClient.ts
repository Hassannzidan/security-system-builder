/**
 * Shared Axios instance. All service modules import this so interceptors,
 * base URL and default headers are configured in exactly one place.
 */
import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@security-system-builder/shared';
import { config } from '@/lib/config';

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Unwrap the API error envelope into a rejected promise carrying a clean message.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.error?.message ?? error.message ?? 'Unexpected network error';
    return Promise.reject(new Error(message));
  },
);
