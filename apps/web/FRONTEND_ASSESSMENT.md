# Frontend Assessment — `apps/web`

**Date:** 2026-07-14  
**Scope:** React + TypeScript bundle builder (`apps/web`) vs. target 6-layer data-flow architecture  
**Backend contract:** `GET /api/v1/steps`, `GET /api/v1/steps/:stepId` → `{ success: true, data }` / `{ success: false, error: { code, message } }`  
**Shared types:** `packages/shared` (`Step`, `StepProduct`, `ProductVariant`, `Pricing`, `Seed`, …)

---

## 1. Inventory

### 1.1 Folder tree — `apps/web/src`

```
src/
├── App.tsx
├── main.tsx
├── vite-env.d.ts
├── assets/
│   ├── .gitkeep
│   ├── fonts/
│   │   ├── gilroy/          (6 font files)
│   │   └── tt-norms-pro/    (4 font files)
│   └── icons/
│       ├── step-cameras.svg
│       ├── step-extras.svg
│       ├── step-plan.svg
│       └── step-sensors.svg
├── components/
│   ├── common/
│   │   ├── .gitkeep
│   │   ├── Accordion/
│   │   │   ├── Accordion.tsx
│   │   │   ├── AccordionStep.tsx
│   │   │   ├── icons.tsx
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── ProductCard/
│   │   │   ├── DiscountBadge.tsx
│   │   │   ├── LearnMoreLink.tsx
│   │   │   ├── PriceBlock.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductImage.tsx
│   │   │   ├── QuantityStepper.tsx
│   │   │   ├── VariantPill.tsx
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   └── index.ts
│   └── ui/
│       ├── .gitkeep
│       └── accordion.tsx          # shadcn/Radix primitive
├── context/
│   └── AppContext.tsx
├── design-tokens/
│   ├── borders.ts
│   ├── breakpoints.ts
│   ├── colors.ts
│   ├── index.ts
│   ├── radius.ts
│   ├── shadows.ts
│   ├── spacing.ts
│   ├── stepper.ts
│   └── typography.ts
├── hooks/
│   ├── useAppContext.ts
│   ├── useCategories.ts
│   └── useProducts.ts
├── layouts/
│   ├── PageGrid.tsx
│   ├── RootLayout.tsx
│   └── index.ts
├── lib/
│   ├── config.ts
│   ├── queryClient.ts
│   └── utils.ts
├── pages/
│   ├── HomePage.tsx
│   └── NotFoundPage.tsx
├── providers/
│   ├── AppProvider.tsx
│   └── QueryProvider.tsx
├── routes/
│   └── index.tsx
├── services/
│   ├── apiClient.ts
│   ├── category.service.ts
│   ├── index.ts
│   └── product.service.ts
├── store/
│   └── appReducer.ts
├── styles/
│   ├── fonts.css
│   └── globals.css
├── types/
│   └── index.ts
└── utils/
    └── format.ts
```

### 1.2 Dependencies (data-flow–relevant)

| Package                           | Version     | Role                                          |
| --------------------------------- | ----------- | --------------------------------------------- |
| `axios`                           | ^1.7.9      | HTTP client (`src/services/apiClient.ts`)     |
| `@tanstack/react-query`           | ^5.64.1     | Server-state caching                          |
| `@security-system-builder/shared` | workspace:* | Shared types + `API_BASE_PATH` / `API_ROUTES` |
| `@radix-ui/react-accordion`       | ^1.2.16     | shadcn accordion primitive                    |
| `react-router-dom`                | ^6.28.2     | Routing                                       |
| `lucide-react`                    | ^0.471.1    | Icons (stepper ±)                             |
| `tailwindcss`                     | ^3.4.17     | Styling                                       |
| `vite`                            | ^6.0.7      | Dev server + proxy                            |

**Not installed:** `zustand`, `jotai`, `redux`, or any dedicated client-state library.

**shadcn/ui:** Initialized via `components.json`. Only one UI primitive is installed: `accordion` (`src/components/ui/accordion.tsx`). All other UI is custom under `components/common/`.

**TanStack Query wiring:**

| Location                          | Purpose                                         |
| --------------------------------- | ----------------------------------------------- |
| `src/lib/queryClient.ts`          | `QueryClient` instance + inline `queryKeys`     |
| `src/providers/QueryProvider.tsx` | `QueryClientProvider` wrapper                   |
| `src/providers/AppProvider.tsx`   | Composes `QueryProvider` → `AppContextProvider` |
| `src/main.tsx`                    | Renders `<AppProvider>` around `<App />`        |

Default query options (`src/lib/queryClient.ts:8–14`): `staleTime: 30_000`, `retry: 1`, `refetchOnWindowFocus: false`.

### 1.3 Routes / pages

| Path | Component      | Notes                                               |
| ---- | -------------- | --------------------------------------------------- |
| `/`  | `HomePage`     | Hardcoded 4-step accordion shell; step bodies empty |
| `*`  | `NotFoundPage` | Returns `null` (placeholder)                        |

Router defined in `src/routes/index.tsx`, rendered via `RouterProvider` in `App.tsx`.

---

## 2. Data-flow layer assessment

Target layering vs. current state:

| #   | Layer                               | Status                   | Details                                                    |
| --- | ----------------------------------- | ------------------------ | ---------------------------------------------------------- |
| 1   | API interceptor / client            | ⚠️ exists but has issues | See below                                                  |
| 2   | Service file (`steps.service.ts`)   | ❌ missing               | Legacy `product` / `category` services only                |
| 3   | Query constants (factory keys)      | ⚠️ exists but has issues | Keys co-located with `QueryClient`; no `stepsKeys`         |
| 4   | React-query hooks                   | ⚠️ exists but has issues | `useProducts` / `useCategories` only; no steps hooks       |
| 5   | Custom UI hook (`useBundleBuilder`) | ❌ missing               | No bundle-builder state hook                               |
| 6   | Dumb components                     | ⚠️ exists but has issues | Components exist but are unwired; `ProductCard` owns state |

### 2.1 API client (`src/services/apiClient.ts`)

**✅ Correct:**

- Single Axios instance exported as `apiClient`.
- `baseURL` resolves to `/api/v1` via shared constant when `VITE_API_URL` is unset (`src/lib/config.ts:9–11`).
- Error interceptor reads `error.response.data.error.message` from the shared `ApiErrorResponse` envelope (`apiClient.ts:17–23`).

**⚠️ Issues:**

| Issue                                                                                                                       | Location                                            |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Success envelope `{ success, data }` is **not** unwrapped in the interceptor; each service manually does `return data.data` | `product.service.ts:7–8`, `category.service.ts:7–8` |
| No typed `get`/`post`/… wrapper methods — consumers use raw Axios API                                                       | `apiClient.ts:9–14`                                 |
| Errors are re-thrown as generic `Error(message)` — `code` and `details` from the envelope are discarded                     | `apiClient.ts:20–22`                                |
| No request interceptor or centralized timeout / auth headers                                                                | —                                                   |

**Path correctness:** Uses `API_BASE_PATH = '/api/v1'` from `@security-system-builder/shared`. Not a stale `/api`-only path. Service calls append `API_ROUTES.products` → `/products`, yielding `/api/v1/products` — correct.

### 2.2 Services

| File                               | Endpoint                 | Status                              |
| ---------------------------------- | ------------------------ | ----------------------------------- |
| `src/services/product.service.ts`  | `GET /api/v1/products`   | Legacy — **must migrate or delete** |
| `src/services/category.service.ts` | `GET /api/v1/categories` | Legacy — **must migrate or delete** |
| `src/services/steps.service.ts`    | —                        | **❌ missing**                      |

Neither legacy service is consumed by any page or component today (only referenced by orphaned hooks).

### 2.3 Files that must migrate away from legacy `/products` / `/categories`

| File                               | Action needed                                                   |
| ---------------------------------- | --------------------------------------------------------------- |
| `src/services/product.service.ts`  | Replace with `steps.service.ts` or delete                       |
| `src/services/category.service.ts` | Delete (categories embedded in step payload)                    |
| `src/services/index.ts`            | Update exports                                                  |
| `src/hooks/useProducts.ts`         | Replace with `useStepsQuery` / `useStepQuery`                   |
| `src/hooks/useCategories.ts`       | Delete                                                          |
| `src/lib/queryClient.ts`           | Replace `products` / `categories` keys with `stepsKeys` factory |
| `src/types/index.ts`               | Re-export `Step`, `StepProduct`, etc. from shared               |

### 2.4 React Query

| Check                         | Result                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| Installed                     | ✅ `@tanstack/react-query@^5.64.1`                                                             |
| `QueryClientProvider` mounted | ✅ `AppProvider` → `QueryProvider` → `main.tsx`                                                |
| Default options configured    | ✅ `staleTime`, `retry`, `refetchOnWindowFocus`                                                |
| Query keys centralized        | ⚠️ Partial — inline object in `queryClient.ts:18–21`, not a dedicated file, no factory pattern |
| Steps query hooks             | ❌ missing                                                                                     |

### 2.5 Client state (selections / quantities)

| Mechanism                       | Location                                                | Shape                                                       | Bundle-builder relevant?                                        |
| ------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| `useReducer` context            | `src/store/appReducer.ts`, `src/context/AppContext.tsx` | `{ theme, sidebarOpen }`                                    | ❌ No selection state                                           |
| `useState` inside `ProductCard` | `ProductCard.tsx:73–75`                                 | `{ internalQuantity, internalVariantId, internalSelected }` | ⚠️ Exists but trapped inside component; not per-variant-qty map |
| `useBundleBuilder` hook         | —                                                       | —                                                           | ❌ missing                                                      |

No global shape exists yet for `{ [productId]: { [variantId]: qty } }` or similar.

### 2.6 Component data access

| Component / page                | Fetches data? | Notes                                                   |
| ------------------------------- | ------------- | ------------------------------------------------------- |
| `HomePage`                      | ❌            | Hardcoded `STEPS` config (`HomePage.tsx:23–28`); no API |
| `Accordion`                     | ❌            | Pure presentation; receives `steps` prop                |
| `ProductCard`                   | ❌            | Not rendered anywhere in the app                        |
| `useProducts` / `useCategories` | Would fetch   | **Dead code** — not imported by any component           |

---

## 3. Component assessment (design fidelity + reusability)

### 3.1 Quantity stepper — `QuantityStepper.tsx`

| Criterion                    | Status                                                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reusable component exists    | ✅                                                                                                                                                      |
| Props                        | `value`, `min`, `max`, `onChange`, `title` — **no top-level `disabled` prop**                                                                           |
| Used in app                  | ⚠️ Only inside `ProductCard`; **not rendered on any page**                                                                                              |
| Bordered − / count / + group | ⚠️ Three separate elements with gray pill buttons; minus gets a border only when disabled (`QuantityStepper.tsx:32–38`), not a unified bordered control |
| Disabled styling             | ⚠️ `disabled:opacity-40` + `disabled:cursor-not-allowed` on buttons; minus also gets explicit border when at min                                        |
| Typed against shared         | ❌ Inline props type; no shared type                                                                                                                    |

### 3.2 Product card — `ProductCard.tsx` + `types.ts`

**Current props (`ProductCardProps`):**

```
title, description?, imageUrl?, imageAlt?, badge?,
learnMoreHref?, onLearnMore?, learnMoreLabel?,
variants?, selectedVariantId?, defaultVariantId?, onVariantChange?,
price, compareAtPrice?, currency?,
quantity?, defaultQuantity?, onQuantityChange?, minQuantity?, maxQuantity?,
orientation?, selected?, defaultSelected?, onSelectedChange?, className?
```

| Design element                        | Status | Notes                                                                                       |
| ------------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| Optional discount badge               | ✅     | Via `badge` → `DiscountBadge` in `ProductImage`                                             |
| Product image                         | ✅     | `ProductImage` with placeholder fallback                                                    |
| Title                                 | ✅     |                                                                                             |
| Description                           | ✅     |                                                                                             |
| "Learn More" link                     | ✅     | `LearnMoreLink` — href or onClick                                                           |
| Variant / color chip row              | ✅     | `VariantPill` row; swatch image or color dot + label                                        |
| Bound quantity stepper                | ✅     | Embedded `QuantityStepper`                                                                  |
| Pricing with struck-through compareAt | ✅     | `PriceBlock` — red strikethrough when `compareAtPrice > price`                              |
| Selected border when qty > 0          | ❌     | Border driven by click-toggle `isSelected` (`ProductCard.tsx:208`), independent of quantity |
| Typed against shared `StepProduct`    | ❌     | Local `ProductCardProps` / `ProductVariant`                                                 |

**Additional concerns:**

- Component owns uncontrolled state (`useState` at lines 73–75) — violates "dumb component" target.
- Single quantity per card — no per-variant quantity map.
- `orientation` prop exists but bundle builder likely needs horizontal only.

### 3.3 Variant chips — `VariantPill.tsx`

| Criterion                  | Status                                              |
| -------------------------- | --------------------------------------------------- |
| Separate component         | ✅ `VariantPill.tsx`                                |
| Active variant tracking    | ✅ Parent `ProductCard` tracks `currentVariantId`   |
| Per-variant quantity logic | ❌ Quantity is card-level, not variant-level        |
| Shared type alignment      | ⚠️ Uses **local** `ProductVariant` (`types.ts:1–9`) |

**Type conflict — local vs. shared `ProductVariant`:**

| Field          | Local (`ProductCard/types.ts`) | Shared (`packages/shared/types.ts`) |
| -------------- | ------------------------------ | ----------------------------------- |
| Preview image  | `thumbnailUrl?`                | `swatch` (required)                 |
| Product image  | —                              | `image` (required)                  |
| Color fallback | `swatch?` (optional color)     | —                                   |

Mapping layer will be required when wiring API data.

### 3.4 Accordion / step section — `Accordion/` + `ui/accordion.tsx`

Built on shadcn/Radix (`type="single" collapsible`). Styled stepper wrapper in `components/common/Accordion/`.

| Feature                     | Status | Notes                                                                                                                               |
| --------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| "STEP X OF 4" eyebrow       | ✅     | `AccordionStep.tsx:84` — uppercase styling applied via CSS                                                                          |
| Icon                        | ✅     | Optional per-step `icon` prop; HomePage passes SVG icons                                                                            |
| Title                       | ✅     |                                                                                                                                     |
| Right-side "N selected"     | ⚠️     | Supported via `selectedCount` (`AccordionStep.tsx:113–115`) but **hidden below `sm` breakpoint** and **not passed** from `HomePage` |
| Chevron open/closed state   | ✅     | `Chevron` rotates 180° when open                                                                                                    |
| "Next: …" footer button     | ✅     | Auto-generated or overridden via `nextLabel`                                                                                        |
| Controlled open step        | ✅     | `openIndex` + `onOpenChange` supported                                                                                              |
| Typed against shared `Step` | ❌     | Local `AccordionStepConfig` (`Accordion/types.ts:3–22`)                                                                             |

**HomePage gap:** Step bodies (`content`) are undefined; accordion renders headers only (`HomePage.tsx:23–28`).

### 3.5 Review panel

| Criterion                                  | Status                  |
| ------------------------------------------ | ----------------------- |
| Component exists                           | ❌ **Entirely missing** |
| Grouped categories                         | ❌                      |
| Line items (thumbnail + stepper + pricing) | ❌                      |
| Shipping row                               | ❌                      |
| Guarantee badge                            | ❌                      |
| Financing line                             | ❌                      |
| Totals with strikethrough                  | ❌                      |
| Savings callout                            | ❌                      |
| Checkout button                            | ❌                      |
| Save link                                  | ❌                      |

`PageGrid` (`layouts/PageGrid.tsx`) provides a 12-column grid suitable for a future sidebar but no review column is implemented.

### 3.6 Type duplication summary

| Local type                  | File                                      | Conflicts with shared                                                   |
| --------------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| `ProductVariant`            | `ProductCard/types.ts:1–9`                | ✅ conflicts — different field names / requiredness                     |
| `ProductCardProps`          | `ProductCard/types.ts:11–51`              | ⚠️ parallel to `StepProduct` + `Pricing` — needs adapter, not duplicate |
| `AccordionStepConfig`       | `Accordion/types.ts:3–22`                 | ⚠️ parallel to `Step` — should derive from or map to `Step`             |
| `types/index.ts` re-exports | Only `Product`, `Category`, API envelopes | ❌ missing `Step`, `StepProduct`, `ProductVariant`, `Seed`, `Pricing`   |

---

## 4. State & persistence readiness

### 4.1 localStorage / sessionStorage

**❌ Nothing implemented.** No reads or writes anywhere under `apps/web/src`.

### 4.2 Existing selection-state shape to preserve

**None at app level.** The only selection-related state is:

- `ProductCard` internal defaults: `defaultQuantity`, `defaultVariantId`, `defaultSelected` (component-local, unused).
- API `Seed` type (`packages/shared`): `{ variantId: string | null; qty: number }` per product — this is the authoritative seed source once wired.

A new global state shape should be designed in `useBundleBuilder`, e.g.:

```ts
// Illustrative — not present in codebase
selections: Record<
  productId,
  { activeVariantId: string | null; quantities: Record<variantId, number> }
>;
openStepIndex: number;
```

### 4.3 Current initial / seed state source

| Source                          | Used today?          |
| ------------------------------- | -------------------- |
| Hardcoded `STEPS` in `HomePage` | ✅ titles/icons only |
| API `StepProduct.seed`          | ❌ not consumed      |
| Props / URL params              | ❌                   |
| localStorage                    | ❌                   |

---

## 5. Config & wiring

### 5.1 Vite dev proxy

```ts
// vite.config.ts:16–22
proxy: {
  '/api': { target: 'http://localhost:4000', changeOrigin: true },
}
```

**✅ Correct.** Proxies all `/api/*` including `/api/v1/steps` to the API on port 4000 (shared `DEFAULT_API_PORT`).

### 5.2 Environment / config

| Item             | Location                | Value                                                          |
| ---------------- | ----------------------- | -------------------------------------------------------------- |
| API base URL     | `src/lib/config.ts`     | `VITE_API_URL + API_BASE_PATH` or `API_BASE_PATH` (`/api/v1`)  |
| Shared constants | ✅                      | Imports `API_BASE_PATH` from `@security-system-builder/shared` |
| Env template     | `apps/web/.env.example` | Documents optional `VITE_API_URL`                              |

When `VITE_API_URL` is set to e.g. `http://localhost:4000`, resolved base becomes `http://localhost:4000/api/v1` — correct.

### 5.3 Build & typecheck (executed 2026-07-14)

| Command                               | Result                                  |
| ------------------------------------- | --------------------------------------- |
| `pnpm typecheck` (`tsc --noEmit`)     | ✅ **Pass** — exit 0                    |
| `pnpm build` (`tsc -b && vite build`) | ✅ **Pass** — exit 0, ~285 kB JS bundle |

---

## 6. Gap list

### Required changes

Ordered by dependency — each item must land before or with the ones below it.

1. **[modify]** `src/services/apiClient.ts` — Add response interceptor that unwraps `{ success: true, data }` on 2xx and throws a typed `ApiClientError` (code + message) on `{ success: false }`; expose thin typed `get<T>`/`post<T>` helpers.
2. **[create]** `src/services/steps.service.ts` — Pure functions: `list(): Promise<Step[]>`, `getById(id): Promise<Step>` calling `API_ROUTES.steps` via the client.
3. **[modify]** `src/services/index.ts` — Export `stepsService`; remove legacy `productService` / `categoryService` exports.
4. **[delete]** `src/services/product.service.ts` — Legacy endpoint superseded by steps API.
5. **[delete]** `src/services/category.service.ts` — Legacy endpoint superseded by steps API.
6. **[create]** `src/lib/queryKeys.ts` — Factory keys: `stepsKeys.all`, `stepsKeys.detail(id)`.
7. **[modify]** `src/lib/queryClient.ts` — Remove inline `queryKeys`; import from `queryKeys.ts`.
8. **[create]** `src/hooks/useStepsQuery.ts` — `useQuery({ queryKey: stepsKeys.all, queryFn: stepsService.list, staleTime: … })`.
9. **[create]** `src/hooks/useStepQuery.ts` — `useQuery({ queryKey: stepsKeys.detail(id), … })` (optional if list payload is sufficient for Step 1).
10. **[delete]** `src/hooks/useProducts.ts` — Orphaned legacy hook.
11. **[delete]** `src/hooks/useCategories.ts` — Orphaned legacy hook.
12. **[modify]** `src/types/index.ts` — Re-export `Step`, `StepProduct`, `ProductVariant`, `Pricing`, `Seed`, `SelectionType` from shared.
13. **[modify]** `src/components/common/ProductCard/types.ts` — Remove local `ProductVariant`; import from shared or accept a mapped view-model type.
14. **[create]** `src/utils/mapStepProductToCardProps.ts` (or similar) — Map `StepProduct` → `ProductCardProps` (`image` → `imageUrl`, `pricing.price` → `price`, `variants[].swatch` → pill thumbnail, etc.).
15. **[modify]** `src/components/common/ProductCard/ProductCard.tsx` — Strip internal `useState`; require controlled `quantity`, `selectedVariantId`, `selected` (border = `quantity > 0`, not click-toggle).
16. **[modify]** `src/components/common/ProductCard/VariantPill.tsx` — Accept shared variant shape (`swatch` / `image` fields).
17. **[create]** `src/hooks/useBundleBuilder.ts` — Own accordion open index, per-product/per-variant quantities, active variant per card; seed from API `StepProduct.seed`; derive `selectedCount` per step and cart totals.
18. **[modify]** `src/pages/HomePage.tsx` — Call `useBundleBuilder()` + `useStepsQuery()`; map API steps to accordion config with `content` = product card grid for Step 1 (cameras); pass `selectedCount`, `openIndex`, handlers.
19. **[modify]** `src/components/common/Accordion/types.ts` — Align `AccordionStepConfig` with `Step` fields (`order`, `nextLabel`, `selectionType`) or document explicit mapping in the hook.
20. **[modify]** `src/components/common/Accordion/AccordionStep.tsx:113–115` — Show "N selected" at all breakpoints (or match design spec on mobile).
21. **[create]** `src/components/common/ReviewPanel/ReviewPanel.tsx` — Summary sidebar (can be minimal stub first: line items + subtotal) wired to `useBundleBuilder` totals.
22. **[modify]** `src/pages/HomePage.tsx` — Two-column layout: accordion + `ReviewPanel` via `PageGrid` columns.

### Nice to have

- Error boundaries + query `isError` / `error` UI on `HomePage`.
- Loading skeletons for accordion steps and product cards (`isLoading` / `isPending` from react-query).
- `@tanstack/react-query-devtools` in dev.
- Suspense boundaries if switching to `useSuspenseQuery`.
- Persist `useBundleBuilder` selections to `localStorage` with hydration guard.
- Remove unused `AppContext` theme/sidebar scaffold if not planned.
- Implement `NotFoundPage` (currently returns `null`).
- Storybook or a `/dev/components` route to preview `ProductCard` variants in isolation.
- Currency sourced from API rather than hardcoded `'USD'` default on `ProductCard`.

---

## Summary

The frontend has a **solid UI component foundation** (accordion stepper, product card, stepper, variant pills, design tokens) and **correct infrastructure wiring** (TanStack Query provider, `/api/v1` base path, Vite proxy, shared package). However, it is **not yet connected to the steps API** and does **not follow the target 6-layer architecture**:

- Layers 2, 5 are missing entirely (`steps.service`, `useBundleBuilder`).
- Layer 1 is partial (envelope unwrapping lives in services, not the client).
- Layers 3–4 cover only legacy products/categories with dead hooks.
- Layer 6 components exist but are unwired; `ProductCard` violates the dumb-component rule and uses a local `ProductVariant` that conflicts with shared types.

**Minimum path to render Step 1 (cameras) from the API:** items 1–18 above. The review panel (items 21–22) can follow immediately after Step 1 is functional.
