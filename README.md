# Project Nexus Core — Technical Monorepo

Project Nexus Core is a pnpm-managed monorepo for a Discord-based RPG (Gateway Sentinel bot), a designer dashboard (The Forge), and server-side logic (Supabase Edge Functions + Postgres).

This README captures the current implementation and how to run the project locally.

Quick summary (current state)
- Monorepo managed with `pnpm` workspaces.
- `packages/shared`: Zod schemas (`ItemSchema`, `QuestSchema`) and the new `AbilitySchema` (abilities + `staminaRegen` in `stats`).
- `apps/bot`: TypeScript Discord bot (`discord.js`) that validates items with `@nexus/shared` and forwards them to a Supabase Edge Function `create_item`.
- `apps/forge`: Next.js starter + `AutoForm` (advanced) that supports nested `abilities` via `useFieldArray` and submits items to the `create_item` function.
- `supabase/`:
  - `migrations/20251207000000_init_nexus.sql` — initial schema
  - `migrations/20251207000001_add_combat_mechanics.sql` — adds `staminaRegen`, an index, and documents `abilities`
  - `functions/create_item` — Edge Function (Deno) using `@supabase/supabase-js`, validates with Zod and inserts items (persists `abilities` JSONB).
- Local dev helper: `scripts/local-supabase.sh` and docs at `docs/LOCAL_DEV.md` to run Supabase + functions locally.

Files of interest
- `packages/shared/schemas/item.ts` — Item and Ability Zod schemas (staminaRegen + abilities array).
- `apps/forge/src/components/AutoForm.tsx` — AutoForm with nested-array support (designers can add abilities with synergy metadata).
- `supabase/functions/create_item/index.ts` — validates input and inserts into `items` table using the service role key.

Local development (quick)
1. Install deps (root):
```bash
pnpm install
```

2. Start Supabase local stack + serve functions (requires Docker & Supabase CLI):
```bash
chmod +x scripts/local-supabase.sh
./scripts/local-supabase.sh
```
Follow prompts to apply migrations and provide `SUPABASE_SERVICE_ROLE_KEY`.

3. Start the bot (in another terminal):
```bash
cp apps/bot/.env.example apps/bot/.env
# Edit apps/bot/.env to set DISCORD_TOKEN and SUPABASE_FUNCTION_URL=http://localhost:54321/functions/v1/create_item
pnpm dev:bot
```

4. Start Forge UI (in another terminal):
```bash
# set NEXT_PUBLIC_SUPABASE_FUNCTION_URL=http://localhost:54321/functions/v1/create_item
pnpm --filter @nexus/forge dev
```

5. Test function directly (curl):
```bash
curl -X POST http://localhost:54321/functions/v1/create_item \
  -H "Content-Type: application/json" \
  -d '{"name":"Short Sword","rarity":"Common","slot":"MainHand","goldValue":10,"abilities":[{"name":"Ignite","staminaCost":2,"applies":["Oiled"],"synergy":{"trigger":"Oiled","multiplier":1.5}}]}'
```

Environment variables
- Bot: `DISCORD_TOKEN` and `SUPABASE_FUNCTION_URL` (set in `apps/bot/.env` or your shell).
- Functions: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (used by `create_item` to insert rows).

Security notes
- Never commit secrets. `.gitignore` excludes `.env` by default.
- Keep the Supabase service role key private — it provides full DB access.

Next recommended steps
- Implement the combat resolution engine (Edge Function) that evaluates the Setup→Payoff flow using `abilities` and `staminaRegen`.
- Add tests for Zod schemas and an integration test for the function.
- Add CI steps to run schema/unit tests and to deploy functions to Supabase.

More docs
- `docs/GAME_BOT_TECHNICAL_SPECS.md` — full design doc and current repo state.
- `docs/LOCAL_DEV.md` — detailed instructions for local Supabase, service role key, and running the stack.

If anything here looks off or you'd like more detail (e.g., a diagram, API spec, or automated test), tell me which item to expand and I'll add it.
<<<<<<< HEAD
# Project Nexus Core: Next-Gen Discord Game Bot

A high-retention, social-first RPG bot leveraging hybrid serverless architecture.

See `docs/` for detailed design and implementation notes.

Getting started:

1. Install dependencies: `pnpm install`
2. Start local infra: `supabase start` (or use the helper script below)
3. Reset DB: `supabase db reset`

Local helper script:

Run the helper which starts the Supabase local stack, optionally resets and applies migrations, and serves Edge Functions:

```bash
chmod +x scripts/local-supabase.sh
./scripts/local-supabase.sh
```

See `docs/LOCAL_DEV.md` for details on the service role key and step-by-step local testing.
=======
# gamebot
>>>>>>> origin/main
# Project Nexus Core: Next-Gen Discord Game Bot

A high-retention, social-first RPG bot leveraging hybrid serverless architecture.

See `docs/` for detailed design and implementation notes.

Getting started:

1. Install dependencies: `pnpm install`
2. Start local infra: `supabase start`
3. Reset DB: `supabase db reset`
