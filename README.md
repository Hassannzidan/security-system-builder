# Security System Builder

A production-ready **pnpm workspaces** monorepo scaffold for the Security System
Builder take-home assignment. It contains a React + Vite frontend, an Express +
TypeScript API, and a shared package of types, enums and constants consumed by
both.

> This repository is a **scaffold only** — configuration, tooling and wiring are
> in place, but no assignment UI or business logic is implemented.

## Tech stack

| Area     | Tooling                                                                      |
| -------- | ---------------------------------------------------------------------------- |
| Monorepo | pnpm workspaces, TypeScript project references, shared Prettier/ESLint       |
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Axios,     |
|          | React Router, Context API + `useReducer`, lucide-react, clsx, tailwind-merge |
| Backend  | Express, TypeScript, tsx, Zod, dotenv, cors                                  |
| Shared   | TypeScript types, interfaces, enums, constants                               |

## Structure

```
security-system-builder/
├── apps/
│   ├── web/          # React + Vite frontend
│   └── api/          # Express + TypeScript API
├── packages/
│   └── shared/       # Shared types, enums, constants
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .editorconfig
├── .prettierrc
└── .gitignore
```

## Getting started

```bash
# Install all workspace dependencies
pnpm install

# Copy environment templates
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env   # optional

# Start web + api together
pnpm dev
```

- Web dev server: http://localhost:5173
- API server: http://localhost:4000/api
- Health check: http://localhost:4000/api/health

The Vite dev server proxies `/api` to the Express server, so no CORS setup is
needed during development.

## Root scripts

| Script           | Description                                 |
| ---------------- | ------------------------------------------- |
| `pnpm dev`       | Run the web and api dev servers in parallel |
| `pnpm build`     | Build every workspace package               |
| `pnpm lint`      | Lint every workspace package                |
| `pnpm format`    | Format the whole repo with Prettier         |
| `pnpm typecheck` | Type-check every workspace package          |

## API endpoints

| Method | Path              | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | `/api/health`     | Service health status    |
| GET    | `/api/products`   | List products (static)   |
| GET    | `/api/categories` | List categories (static) |

## The shared package

`@security-system-builder/shared` is consumed by both apps as a
`workspace:*` dependency and exposes:

- **types / interfaces** — `Product`, `Category`, `ApiResponse<T>`, …
- **enums** — `ProductCategory`, `ProductStatus`, `ApiErrorCode`
- **constants** — `API_BASE_PATH`, `API_ROUTES`, default ports

Everything is re-exported from `packages/shared/src/index.ts`.

## Notes

- No authentication is included, by design.
- No assignment UI is built — `apps/web` ships only configured providers,
  routing, services and hooks ready to build on.
