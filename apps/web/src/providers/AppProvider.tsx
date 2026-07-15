import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';

/**
 * Single composition point for every top-level provider. Add future providers
 * (theme, auth, i18n, …) here so `main.tsx` stays untouched.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
