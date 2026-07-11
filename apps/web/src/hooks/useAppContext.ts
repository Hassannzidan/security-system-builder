import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

/** Access the global app state and dispatcher. Throws if used outside provider. */
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return ctx;
}
