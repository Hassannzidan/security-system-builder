/**
 * Steps data access. This is the ONLY module that touches `steps.json` on disk.
 *
 * It simulates a MongoDB-style collection: the JSON file plays the role of a
 * collection dump, loaded and validated once, then served from an in-memory
 * cache. Query methods are async and return deep copies of documents — exactly
 * as a real driver would hand back fresh objects — so swapping this module for
 * a genuine MongoDB collection later requires no changes upstream.
 */
import { createRequire } from 'node:module';
import { z } from 'zod';
import type { Step } from '@security-system-builder/shared';

// JSON is loaded via `require` so this works identically under tsx, Node ESM
// and the compiled output without relying on JSON import assertions.
const require = createRequire(import.meta.url);

/** Zod mirror of the shared `Step` model, used to fail fast on corrupt data. */
const variantSchema = z.object({
  id: z.string(),
  label: z.string(),
  swatch: z.string(),
  image: z.string(),
});

const pricingSchema = z.object({
  price: z.number(),
  compareAt: z.number().optional(),
  interval: z.literal('month').optional(),
});

const seedSchema = z.object({
  variantId: z.string().nullable(),
  qty: z.number(),
});

const productSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    learnMoreUrl: z.string().optional(),
    badge: z.string().optional(),
    image: z.string().optional(),
    pricing: pricingSchema,
    variants: z.array(variantSchema).nullable().optional(),
    seed: seedSchema.nullable().optional(),
    required: z.boolean().optional(),
  })
  .superRefine((product, ctx) => {
    // A required product is locked at its seeded quantity, so it must ship with
    // a non-null seed of at least one unit.
    if (product.required === true && (product.seed == null || product.seed.qty < 1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `required product "${product.id}" must have a non-null seed with qty >= 1`,
        path: ['seed'],
      });
    }
  });

const stepSchema = z
  .object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    icon: z.string(),
    nextLabel: z.string().optional(),
    category: z.string(),
    selectionType: z.enum(['single', 'multiple']),
    products: z.array(productSchema),
  })
  .superRefine((step, ctx) => {
    if (step.selectionType !== 'single') return;

    // A single-selection step may pre-select at most one product, and that
    // seed must represent a single unit (qty exactly 1).
    const seeded = step.products.filter((p) => p.seed != null);
    if (seeded.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `single-selection step "${step.id}" has ${seeded.length} seeded products; at most one is allowed`,
        path: ['products'],
      });
    }
    for (const product of seeded) {
      if (product.seed!.qty !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `seeded product "${product.id}" in single-selection step "${step.id}" must have seed.qty === 1`,
          path: ['products'],
        });
      }
    }
  });

/** The file is shaped like a collection dump: `{ steps: [...] }`. */
const collectionSchema = z.object({
  steps: z.array(stepSchema),
});

/** In-memory cache of the parsed collection; populated on first access. */
let collection: Step[] | null = null;

/**
 * Loads, validates and caches the collection. Throws immediately with a clear
 * message if the on-disk data does not match the schema.
 */
function load(): Step[] {
  if (collection) return collection;

  const parsed = collectionSchema.safeParse(require('../data/steps.json'));
  if (!parsed.success) {
    throw new Error(
      `steps.json failed schema validation: ${JSON.stringify(parsed.error.flatten())}`,
    );
  }

  collection = parsed.data.steps as Step[];
  return collection;
}

export const stepsRepository = {
  /** Returns every step as fresh, independently-mutable documents. */
  async find(): Promise<Step[]> {
    return structuredClone(load());
  },

  /** Returns a single step by id, or `null` when it does not exist. */
  async findById(id: string): Promise<Step | null> {
    const step = load().find((s) => s.id === id);
    return step ? structuredClone(step) : null;
  },
};
