/**
 * Global UI state managed with `useReducer`. This holds cross-cutting client
 * state (theme, sidebar, etc.) — server state belongs in TanStack Query.
 */

export interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

export type AppAction =
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean };

export const initialAppState: AppState = {
  theme: 'light',
  sidebarOpen: true,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    default:
      return state;
  }
}
