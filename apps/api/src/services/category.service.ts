/**
 * Category data access. Intentionally thin — no business logic — reading from
 * the in-memory static dataset.
 */
import type { Category } from '@security-system-builder/shared';
import { categories } from '../data/index.js';

export const categoryService = {
  findAll(): Category[] {
    return categories;
  },
};
