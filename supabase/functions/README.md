This folder contains Supabase Edge Functions (Deno) for Project Nexus Core.

create_item function:
- Validates incoming payload against `@nexus/shared` `ItemSchema`.
- Persists to the `items` table via PostgREST using `SUPABASE_SERVICE_ROLE_KEY`.

Environment variables required when running locally or in deployment:
- `SUPABASE_URL` (e.g., `http://localhost:54321` for local stack)
- `SUPABASE_SERVICE_ROLE_KEY` (service role key for server-side inserts)

Deploy with:
```bash
supabase functions deploy create_item
```

