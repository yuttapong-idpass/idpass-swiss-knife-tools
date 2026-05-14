# Agent Context: Clean Architecture

This file gives implementation context for AI agents and contributors working in this repository.

## Goal

Keep the codebase modular, testable, and easy to evolve by following a feature-first clean architecture.

## Tech Context

- Runtime: React 19 + TypeScript + Vite
- Routing: `react-router-dom`
- State: `zustand` (feature-level stores)
- UI: shared components under `src/components`

## Source Structure

```txt
src/
  app/            # application shell, routes, app-level providers/config
  features/       # domain/features (main implementation area)
  components/     # shared reusable UI components
  hooks/          # shared hooks
  lib/            # framework-agnostic helper modules
  providers/      # global providers
  utils/          # shared utility/integration helpers
  container/      # legacy area (no new files)
```

## Architecture Layers

Dependency rule: outer layers can depend on inner layers, but not the opposite.

1. Domain/Logic layer
   - Place pure transformation and validation logic in feature-local `utils` or `lib`.
   - Keep this layer independent from React components where possible.

2. Application layer
   - Feature stores in `src/features/<feature>/stores`.
   - Coordinate use cases and data flow for the feature.

3. Interface layer
   - React pages/components in `src/features/<feature>/components`.
   - Read/write via feature store or explicit helper functions.

4. App composition layer
   - App routes and global wiring in `src/app`.
   - Register screens in `src/app/routes.tsx`.

## Import Boundaries

- Prefer alias imports with `@/`.
- Allowed:
  - `features/*` -> `components`, `hooks`, `lib`, `utils`
  - `app/*` -> `features/*`, `components/*`, `providers/*`
- Avoid:
  - Cross-feature deep imports (`featureA/components/...` from `featureB`) unless through a stable exported API.
  - New dependencies on `src/container`.

## Feature Template

Use this structure for new feature modules:

```txt
src/features/<feature-name>/
  components/
    <FeaturePage>.tsx
  stores/
    use<FeatureName>.store.ts
  utils/
    <feature>.ts
  types/
    <feature>.types.ts
```

## Naming Conventions

- Folder names: kebab-case (example: `text-compare`)
- React files: PascalCase (example: `TextCompare.tsx`)
- Store files: `useXxx.store.ts`
- Type files: `<name>.types.ts`

## Change Policy

When implementing changes:

1. Put new business logic in the correct feature folder first.
2. Keep components thin; move heavy logic into store/helpers.
3. Reuse shared UI from `src/components` instead of duplicating.
4. If touching legacy `src/container`, migrate to `src/features` when practical.
5. Update routes only through `src/app/routes.tsx`.

## Definition of Done

- Feature code is inside `src/features/<feature>`
- No new files added to `src/container`
- Imports respect boundaries and use `@/`
- Route changes are centralized in `src/app/routes.tsx`
- Logic and UI are separated enough for easier testing
