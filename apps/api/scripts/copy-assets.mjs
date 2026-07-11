/**
 * Copies non-TypeScript assets (static JSON data) into `dist` after `tsc`,
 * since the compiler does not emit them. Cross-platform and dependency-free.
 */
import { cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const from = resolve(here, '../src/data');
const to = resolve(here, '../dist/data');

await cp(from, to, {
  recursive: true,
  filter: (src) => !src.endsWith('.ts'),
});

console.log(`Copied static data → ${to}`);
