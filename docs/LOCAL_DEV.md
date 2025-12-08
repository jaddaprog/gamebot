# Local Development — Supabase, Functions, Bot & Forge

This document explains how to run the local Supabase stack, apply migrations, and serve Edge Functions for Project Nexus Core.

Prerequisites
- Docker Desktop or Docker Engine
- Supabase CLI installed (`supabase`)
- `pnpm` for running workspace scripts

Quick helper script
- `scripts/local-supabase.sh` — helper that starts Supabase, optionally resets the DB, and serves functions.

Important: SUPABASE_SERVICE_ROLE_KEY
- The Edge Function `create_item` requires a service role key to insert into the `items` table via server-side privileges.
- To find your Service Role Key:
  1. Open your Supabase project dashboard.
 2. Go to `Settings` -> `API`.
 3. Copy the `Service Role` key.

Running the helper script
1. From the repo root:
```bash
chmod +x scripts/local-supabase.sh
./scripts/local-supabase.sh
```

2. The script will prompt you to apply migrations (it runs `supabase db reset` if you agree) and will then ask for `SUPABASE_SERVICE_ROLE_KEY` if not already in your environment. The script writes a temporary `.supabase_functions_env` file and serves functions using that env file.

Running the other services
- In a new terminal, after the function server is running you can start:

Bot:
```bash
# set DISCORD_TOKEN and SUPABASE_FUNCTION_URL=http://localhost:54321/functions/v1/create_item
pnpm --filter @nexus/bot dev
```

Forge UI:
```bash
# set NEXT_PUBLIC_SUPABASE_FUNCTION_URL=http://localhost:54321/functions/v1/create_item
pnpm --filter @nexus/forge dev
```

Testing the function directly (curl):
```bash
curl -X POST http://localhost:54321/functions/v1/create_item \
  -H "Content-Type: application/json" \
  -d '{"name":"Short Sword","description":"A basic blade","rarity":"Common","slot":"MainHand","goldValue":10,"abilities":[{"name":"Ignite","staminaCost":2,"applies":["Oiled"],"synergy":{"trigger":"Oiled","multiplier":1.5}}]}'
```

Notes
- The helper script is intended for local development only. Do not store or commit production keys to the repository.
- If you prefer not to use the helper script, you can run the commands manually:
  - `supabase start`
  - `supabase db reset`
  - `supabase functions serve --env-file <path>`
