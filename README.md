# Security System Builder

[![CI](https://github.com/Hassannzidan/security-system-builder/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/Hassannzidan/security-system-builder/actions/workflows/ci.yml)

A multi-step bundle builder for a home-security kit, with a live review panel that
stays in sync with the configuration as you build it. The
repo is a pnpm-workspaces monorepo: a React + Vite web app (`apps/web`), a small
Express + TypeScript API that serves the product catalog as JSON (`apps/api`), and
a shared types/enums/constants package consumed by both (`packages/shared`).

Built as a production-oriented frontend architecture exercise rather than only a
pixel-perfect UI recreation.

## Preview

### Desktop

![Desktop view](assets/previews/large-screens-view.gif)

### Medium Screens

![Medium screens view](assets/previews/medium-screens-view.gif)

### Tablet

![Tablet view](assets/previews/tablet-view.gif)

### Mobile

![Mobile view](assets/previews/mobile-view.gif)

## Features at a Glance

- Multi-step accordion bundle builder
- Live synchronized review panel
- Variant-specific quantities
- Per-step selection counters
- Save & Restore with localStorage
- Data-driven catalog served by Express API
- Shared TypeScript package
- Responsive across desktop, tablet and mobile
- Runtime validation with Zod
- Comprehensive business-logic tests

## Architecture Highlights

- React + TypeScript + Vite
- Express + TypeScript API
- pnpm workspaces monorepo
- React Query
- Radix UI
- Context API
- Zod validation
- Vitest
- Shared package between frontend/backend

## Quick start

Prerequisites (from `package.json` `engines`): **Node ≥ 18**, **pnpm ≥ 9**
(repo is pinned to `pnpm@10.33.2` via `packageManager`).

```bash
pnpm install

# Copy env templates (both have sensible defaults; the web one is optional)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Run web + api together (builds the shared package first, then both dev servers)
pnpm dev
```

- Web app: http://localhost:5173
- API: http://localhost:4000/api/v1 (health at `/api/v1/health`, catalog at `/api/v1/steps`)

The Vite dev server proxies `/api` to Express, so no CORS wiring is needed in dev.

Other scripts (run from the repo root):

```bash
pnpm build                              # build every workspace
pnpm --filter @security-system-builder/web test   # run the web test suite
pnpm lint                               # eslint across the repo
pnpm typecheck                          # tsc --noEmit across the repo
```

## What's implemented

- **4-step accordion** (Cameras → Plan → Sensors → Extras), one step open at a time,
  built on Radix Accordion.
- **Product cards** with color variants, discount badges, "Learn more" links, and a
  quantity stepper; **single-select plan cards** render as radios (no stepper).
- **Per-variant quantities** — each color of a product keeps its own count.
- **Live review panel** with steppers that edit the same state the cards do, so a
  change in either place is reflected in the other immediately.
- **Category grouping** in the review panel, with **subtotal, compare-at, and savings**
  totals derived from the current selection.
- **Seed state on load** matches the default bundle in the design (e.g. 1× Wyze Cam v4,
  2× Pan v3, the Cam Unlimited plan, 2 motion sensors, the required hub, 2 SD cards).
- **Click-triggered save & restore** via `localStorage` ("Save my system for later"),
  restored on next load — not auto-save (see decisions).
- **Responsive** layout down to mobile.
- **Data-driven from the API** (the bonus): the catalog is fetched from Express, not
  imported statically.

## Key decisions & tradeoffs

**One `useBundleBuilder` hook behind a Context, not Redux/Zustand.**
All client state (open step, active variant per card, per-variant quantities) lives in
a single hook exposed through one Context provider. _Why:_ the app is a single page with
one bundle; a single provider is the single source of truth, which is what makes the card
stepper and the review-panel stepper stay in sync for free — they read and mutate the same
state. _Cost:_ the Context is coarse-grained, so any change re-renders the subtree. That's
fine at this catalog size (11 products); at real scale I'd split contexts or move to a
store with selectors.

**Quantities keyed per-variant, with a `'__default__'` sentinel for variant-less products.**
`ProductSelection.quantities` is `Record<variantId | '__default__', number>`. _Why:_ the
"track quantity per variant" requirement becomes trivial — every product, with variants or
not, has the same map shape — and the review panel stays a pure projection of that map (one
line per non-zero entry). _Cost:_ a magic sentinel key that readers have to know about; it's
centralized as an exported constant to contain that.

**Everything derived is computed, never stored.** Line items, subtotal, savings, and
per-step selected counts are `useMemo`-derived from `steps` + `selections`. _Why:_ storing
them invites drift between the number shown and the state that produced it; deriving makes
that class of bug impossible.

**Persistence is click-triggered, versioned, and reconciled on restore.** Saving happens
only when the user clicks "Save my system" (the brief's contract is _build → click → return
→ restored_), not on every keystroke. The payload is a versioned envelope
(`security-system-builder:saved-system:v1`) validated with Zod on read; a corrupt, stale, or
wrong-version blob is discarded as "nothing saved". Restored state is then **reconciled
against the current catalog** (`reconcileSavedState`): selections for deleted products/variants
are dropped, required products are forced back to their locked quantity, single-select steps
are re-normalized to exactly one choice, and the open-step index is clamped. _Why:_ a saved
system can predate catalog changes; restoring it blindly could surface an impossible or
corrupt selection. _Cost:_ more logic than a raw `JSON.parse`, but it's pure and unit-tested.

**API instead of a static JSON import (the bonus).** _Why:_ it mirrors a production data flow
(fetch → validate at the boundary → render) and keeps the catalog shape owned by the server.
_Cost:_ two processes in dev; mitigated by the Vite proxy so the client still just calls `/api`.

**Product images are served from AWS S3**, with the URLs living in the catalog JSON.
_Why:_ it keeps the repo lean and treats image URLs as catalog data, the way a real
CDN-backed catalog would. _Cost:_ a network dependency for images; the card renders a shimmer
placeholder until each image loads.

**Radix Accordion instead of a hand-rolled one.** _Why:_ correct ARIA roles and keyboard
behavior out of the box, which is easy to get subtly wrong by hand. _Cost:_ one more dependency.

**Tests target the state/reconciliation/hydration logic, not shallow renders.** The real
bugs in this app live in seeding, save/restore, catalog reconciliation, and StrictMode
hydration timing — so that's what the suite exercises. **28 tests across 4 files, all
passing** (`useBundleBuilder` init + reconcile, StrictMode hydration, and `systemStorage`).

## Data & state shape

The catalog (`apps/api/src/data/steps.json`) is an array of steps; each step has a
`selectionType` (`"multiple"` or `"single"`) and a list of products. A product with variants:

```jsonc
{
  "id": "wyze-cam-v4",
  "name": "Wyze Cam v4",
  "badge": "Save 22%",
  "image": "https://…s3.amazonaws.com/white-camera-v4.png",
  "pricing": { "price": 27.98, "compareAt": 35.98 },   // compareAt drives the strike-through
  "variants": [ { "id": "white", "label": "White", "swatch": "…", "image": "…" }, … ],
  "seed": { "variantId": "white", "qty": 1 }            // pre-selected on load; null = unselected
}
```

A variant-less product (a plan) drops `variants` and carries an `interval` for the `/mo`
suffix: `"pricing": { "price": 9.99, "compareAt": 12.99, "interval": "month" }`, plus
`"required": true` on the locked sensor hub.

Client state (`apps/web/src/hooks/useBundleBuilder.ts`):

```ts
interface ProductSelection {
  activeVariantId: string | null; // which color chip is highlighted on the card
  quantities: Record<string, number>; // keyed by variantId, or '__default__'
}
interface BundleState {
  openStepIndex: number; // -1 = all collapsed
  selections: Record<string, ProductSelection>; // keyed by product id
}
```

`activeVariantId` tracks which chip the card's stepper acts on; `quantities` holds an
independent count per variant. The review panel emits one line per `quantities` entry with
`qty > 0`, so per-variant lines fall out of the same map without extra bookkeeping.

## Project structure

```
apps/
  web/                 # React + Vite frontend
    src/
      components/      # Accordion, ProductCard, PlanCard, ReviewSection
      hooks/           # useBundleBuilder (+ tests), useStepsQuery, useMediaQuery
      lib/             # systemStorage (localStorage + Zod), queryClient, config
      context/         # BundleBuilderContext
      services/        # apiClient + steps.service
      design-tokens/   # colors, spacing, typography, etc.
  api/                 # Express + TypeScript API
    src/
      routes/ controllers/ services/ repositories/   # GET /api/v1/health, /api/v1/steps[/:id]
      data/steps.json  # the product catalog
packages/
  shared/              # types, enums, constants (workspace:* dep of both apps)
```

## Known limitations / what I'd do next

- **No component-interaction or E2E tests yet.** State logic is well covered; the next
  layer would be Testing Library interaction tests on the card/review sync and a Playwright
  smoke test of the full build → save → reload flow.
- **Design-token adoption is partial** — a `design-tokens/` layer exists and most surfaces
  use it, but some components still carry ad-hoc values that should be migrated onto tokens.
- **Checkout is a placeholder**, per the brief — the review panel's checkout affordance is
  not wired to a real flow.
- **No elevation/shadow tokens** — the Figma defines no shadow styles; they'd slot into the
  design-token layer when they exist.

### Performance notes

A Lighthouse mobile audit (production build via `vite preview`) scores **Performance 65 /
Accessibility 92 / Best Practices 100**, with **CLS 0** and **TBT 120ms**. The score is
dominated by image payload, not application code: catalog product photos are served from S3
as full-resolution PNGs (~1MB each, ~10MB total), and variant swatches currently reuse the
full-size card image. Production plan:

- **Image pipeline** — resize + convert to WebP per display size (card ~800px, swatch thumbs
  ~64px); the `steps.json` schema already separates image vs swatch URLs, so this is asset
  generation + a URL swap, not a schema change.
- **CDN + caching** — `Cache-Control` headers on the S3 objects and CloudFront in front of the
  bucket for HTTP/2 and edge caching.
- **Loading hints** — `fetchpriority="high"` on the LCP card image, `loading="lazy"` on
  below-fold and swatch images.
- **Fonts** — convert the remaining TTF font to woff2.
- **Accessibility** — raise the two low-contrast text tokens to WCAG AA and enlarge stepper
  tap targets to 24px.

Application-level signals are already healthy (zero layout shift, 120ms blocking time, ~139KB
gzip JS), so the remediation is an asset/CDN task rather than a rewrite.
