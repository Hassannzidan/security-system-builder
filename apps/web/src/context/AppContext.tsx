/**
 * Application-wide context backed by `useReducer`. Consumers read state and
 * dispatch actions via the `useAppContext` hook.
 */
import { createContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import { appReducer, initialAppState, type AppAction, type AppState } from '@/store/appReducer';

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
