import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { AppContextProvider } from '@/context/AppContext';

/**
 * Single composition point for every top-level provider. Add future providers
 * (theme, auth, i18n, …) here so `main.tsx` stays untouched.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AppContextProvider>{children}</AppContextProvider>
    </QueryProvider>
  );
}
