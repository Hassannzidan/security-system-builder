import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/**
 * Single authoritative ESLint flat config for the whole monorepo.
 *
 * Config is scoped by path so each workspace gets the right environment:
 *   - apps/web/src        → React + browser
 *   - apps/api, shared, tooling/config files → Node
 *
 * Because there is one root config, `eslint .` (root scripts) and `eslint --fix`
 * (lint-staged) both resolve consistently from any working directory.
 */
const noUnusedVars = [
  'error',
  { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
];

export default tseslint.config(
  // Never lint build output or dependencies.
  { ignores: ['**/dist/**', '**/node_modules/**', '**/.husky/**'] },

  // Base JS + TypeScript rules for every source and config file.
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': noUnusedVars,
    },
  },

  // Frontend application code: React + browser globals.
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Backend, shared package, scripts and root/app config files: Node globals.
  {
    files: [
      'apps/api/**/*.{ts,mjs}',
      'packages/shared/**/*.ts',
      'apps/web/*.{ts,js}',
      '**/*.config.{js,mjs,ts}',
      '**/scripts/**/*.{js,mjs}',
      'eslint.config.js',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
);
