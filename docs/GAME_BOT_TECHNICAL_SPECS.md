# Game Bot Technical Specs

Version: 0.1.0
Date: 2025-12-07

## Overview

This document describes the current implementation state of the Project Nexus Core (a Discord game bot monorepo). It captures the repository layout, key artifacts created so far, and recommended next steps to move toward a working system.

## Repository Layout (current)

- `package.json` — Root monorepo package config (workspaces configured).
- `pnpm-workspace.yaml` — pnpm workspace includes `apps/*`, `packages/*`, and `supabase/functions/*`.
- `.github/workflows/ci.yml` — Basic CI that runs `pnpm install` and a lint step.
- `packages/shared/` — Shared Zod schemas and type exports:
  - `package.json` — declares `@nexus/shared` with `zod` dependency.
  - `schemas/item.ts` — `ItemSchema` with enums, stats, tags, etc.
  - `schemas/quest.ts` — `QuestSchema` with objectives and rewards.
  - `index.ts` — re-exports schemas.
- `supabase/`
  - `migrations/20251207000000_init_nexus.sql` — initial DB schema (enums, `items`, `quests`, indexes, RLS policies).
  - `functions/` — placeholder edge functions and example:
    - `create_item/index.ts` — simple Deno Echo function for testing.
- `apps/forge/` — Designer dashboard placeholder
  - `src/components/AutoForm.tsx` — auto-generated React component that maps Zod types to form fields.
  - `package.json` & `README.md` (placeholders)
- `apps/bot/` — Gateway Sentinel (Discord bot)
  - `index.js` — placeholder entry script
  - `package.json` — minimal package file

## What was done (actions taken)

- Initialized pnpm workspace and root `package.json`.
- Added `packages/shared` with `Item` and `Quest` Zod schemas.
- Added Supabase migration SQL for initial schema and RLS policies.
- Added a simple Supabase Edge Function example (`create_item`) in Deno format.
- Implemented an `AutoForm` React component in `apps/forge` that consumes Zod schemas to render forms.
- Scaffoled minimal `apps/bot` entrypoint and placeholder scripts.
- Added CI workflow (`.github/workflows/ci.yml`).
- Installed workspace dependencies with `pnpm install`.
- Initialized the git repository, committed the scaffold, resolved an unrelated-history merge with `origin/main`, pushed to remote, and removed an embedded gitlink submodule (`gamebot`) from the index.

## Current Git State

- Branch: `main` (local `main` tracks `origin/main`).
- Latest commits include the scaffold, examples, merge commit resolving README conflict, and removal of the embedded gitlink.

## Local Development Quickstart

Prerequisites:
- Node.js v20+, `pnpm` installed
- Docker Desktop (for Supabase local)
- Supabase CLI installed

Commands to get started locally:

1. Install dependencies (root):

```bash
pnpm install
```

2. Start local Supabase stack (Docker required):

```bash
supabase start
```

3. Apply database migration (this will recreate the DB locally):

```bash
supabase db reset
```

4. Run apps individually (placeholders):

Bot (placeholder):
```bash
cd apps/bot
node index.js
```

Forge (placeholder):
```bash
cd apps/forge
# Start your Next/Vite dev server here once scaffolded
```

## Environment Variables (examples)

- `DISCORD_TOKEN` — Bot token for Discord gateway.
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — for Edge Functions and server side access.

## Recommendations / Next Steps

1. Build the minimal Discord bot implementation first (recommended):
   - Implement a small TypeScript bot in `apps/bot` using `discord.js` or preferred library.
   - Add a simple command (e.g., `!createitem`) that accepts JSON or structured arguments, validates with `@nexus/shared` `ItemSchema`, and POSTs to the `create_item` function or directly inserts into Supabase.
   - This will exercise the Zod schemas, migrations, and function endpoints quickly.

2. Harden the Supabase Edge function(s):
   - Replace the echo function with real validation (import `@nexus/shared`), authentication, and database writes.
   - Add indexing/Typesense sync logic once a Typesense infra is available.

3. Scaffold `apps/forge` (Next.js) once backend endpoints are stable:
   - Use the `AutoForm` component as a starting point for designer forms.
   - Wire form submission to the Supabase function and surface errors/success.

4. Add tests & CI improvements:
   - Add unit tests for Zod schemas and integration tests for the Supabase functions.
   - Expand `.github/workflows/ci.yml` to run tests.

5. Secrets & deployment:
   - Store `SUPABASE_SERVICE_ROLE_KEY` and `DISCORD_TOKEN` in your CI secrets and production environment securely.

## Actionable Checklist (short)

- [x] Initialize monorepo scaffold and shared schemas
- [x] Add Supabase migration
- [x] Add AutoForm component
- [x] Add Supabase Echo function example
- [x] Run `pnpm install`
- [x] Commit and push scaffold
- [ ] Implement TypeScript Discord bot in `apps/bot`
- [ ] Implement production Supabase functions and Typesense sync
- [ ] Build Forge UI and wire to backend

---

File created: `docs/GAME_BOT_TECHNICAL_SPECS.md`

If you want, I can now scaffold the TypeScript bot implementation in `apps/bot` (recommended next step) or scaffold a Next.js starter app in `apps/forge`. Which should I do next?
