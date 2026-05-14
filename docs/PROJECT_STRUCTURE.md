# Project Structure Guide

This document defines a clear and consistent folder structure for this project.

## Root

```txt
.
  public/         # static assets served directly
  src/            # application source code
  docs/           # project documentation
```

## Source Layout

```txt
src/
  app/
    config/       # application-level configs (menu, constants)
    providers/    # app provider composition
    types/        # app-wide types
    routes.tsx    # route declarations
    App.tsx       # app shell

  features/
    <feature>/
      components/ # UI and pages for a single feature
      stores/     # feature-level state (zustand, etc.)
      workers/    # feature web workers (if needed)
      types/      # feature-specific types (optional)
      utils/      # feature-specific helpers (optional)

  components/     # shared/reusable UI components
  hooks/          # shared custom hooks
  lib/            # shared non-React utilities
  providers/      # global providers
  utils/          # shared helpers/integrations
  assets/         # static imports (images/icons/styles)
```

## Naming Conventions

- Use lowercase kebab-case for directories: `json-formatter`, `text-compare`.
- Use PascalCase for React component files: `JsonFormatter.tsx`.
- Keep related styles next to component file when needed.
- Keep one feature per directory in `src/features`.

## Placement Rules

1. New tool/page goes to `src/features/<feature>/components`.
2. New reusable UI component goes to `src/components`.
3. New route is added in `src/app/routes.tsx`.
4. Shared helper logic goes to `src/lib` or `src/utils`.
5. Feature-only state should stay inside that feature folder.
6. Use Title function name, use PasCalCase 

## Legacy Folder Policy

The `src/container` folder is legacy. Do not add new files there.

When touching old code inside `src/container`, migrate it into `src/features/<feature>/components` if practical.
