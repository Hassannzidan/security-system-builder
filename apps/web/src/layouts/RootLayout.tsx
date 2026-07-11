import { Outlet } from 'react-router-dom';

/**
 * Top-level layout wrapper. Intentionally minimal — no UI is built in this
 * scaffold; feature pages render inside the <Outlet />.
 */
export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}
