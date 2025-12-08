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
