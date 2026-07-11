/**
 * Loads the static JSON fixtures and exposes them as typed, in-memory
 * collections. In a real system this module would be backed by a database.
 */
import { createRequire } from 'node:module';
import type { Product, Category } from '@security-system-builder/shared';

// JSON is loaded via `require` so this works identically under tsx, Node ESM
// and the compiled output without relying on JSON import assertions.
const require = createRequire(import.meta.url);

export const products: Product[] = require('./products.json') as Product[];
export const categories: Category[] = require('./categories.json') as Category[];
