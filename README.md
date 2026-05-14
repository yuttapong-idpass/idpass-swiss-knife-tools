# idpass-swiss-knife-tools

Utility web app for encoding, formatting, and helper tools.

## Project Structure

This project uses feature-first organization under `src`.

```txt
src/
  app/            # app bootstrap, routes, shared app config
  features/       # business features grouped by domain
  components/     # reusable UI components used across features
  hooks/          # shared React hooks
  lib/            # framework-agnostic helpers and utilities
  providers/      # global providers (theme, context)
  utils/          # helper functions and integrations
  assets/         # static files imported by source code
  model/          # shared models/types (legacy, migrate to app/types or feature folders)
  container/      # legacy pages/components (avoid adding new files here)
```

Detailed guide: `docs/PROJECT_STRUCTURE.md`

## Folder Rules

- Add new screens/tools under `src/features/<feature-name>/components`.
- Keep feature state in `src/features/<feature-name>/stores`.
- Put app-wide route setup in `src/app/routes.tsx`.
- Put cross-feature UI components in `src/components`.
- Do not add new files in `src/container` (legacy area).
