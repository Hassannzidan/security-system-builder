import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Vitest-only config, kept separate from vite.config.ts. The unit tests are plain
// `.ts` (no JSX), so no React/SVGR plugins are needed here — which also avoids a
// type collision between Vitest's bundled vite typings and the app's vite 6.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Node environment; suites needing `localStorage` inject an in-memory stub,
    // so no jsdom/happy-dom dependency is required.
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
});
