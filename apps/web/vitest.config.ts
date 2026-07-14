import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Vitest-only config, kept separate from vite.config.ts to avoid a type collision
// between Vitest's bundled vite typings and the app's vite 6.
//
// Most suites are plain `.ts` and run in the default `node` environment (they
// inject an in-memory `localStorage` stub where needed). A few component/hook
// suites are `.tsx` and render through react-dom; each opts into jsdom with a
// `// @vitest-environment jsdom` docblock. esbuild's automatic JSX runtime lets
// those compile without a React plugin here.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
