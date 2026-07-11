import { QueryClient } from '@tanstack/react-query';

/**
 * A single QueryClient instance shared across the app. Defaults are tuned for
 * a typical read-heavy dashboard; adjust per-query as needed.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Centralised query keys keep cache invalidation consistent and typo-free. */
export const queryKeys = {
  products: ['products'] as const,
  categories: ['categories'] as const,
};
