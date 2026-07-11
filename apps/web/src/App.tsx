import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';

/**
 * Root application component. Wires the router; global providers are applied
 * one level up in `main.tsx` via <AppProvider />.
 */
export default function App() {
  return <RouterProvider router={router} />;
}
