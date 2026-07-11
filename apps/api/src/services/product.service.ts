/**
 * Product data access. Intentionally thin — no business logic — reading from
 * the in-memory static dataset.
 */
import type { Product } from '@security-system-builder/shared';
import { products } from '../data/index.js';

export const productService = {
  findAll(): Product[] {
    return products;
  },
};
