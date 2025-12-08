This folder contains Supabase Edge Functions (Deno) for Project Nexus Core.

create_item function:
- Validates incoming payload against `@nexus/shared` `ItemSchema`.
- Persists to the `items` table via PostgREST using `SUPABASE_SERVICE_ROLE_KEY`.

Environment variables required when running locally or in deployment:
- `SUPABASE_URL` (e.g., `http://localhost:54321` for local stack)
- `SUPABASE_SERVICE_ROLE_KEY` (service role key for server-side inserts)

Notes about the implementation:
- The `create_item` function uses `@supabase/supabase-js` (imported from a CDN) to interact with the Postgres `items` table.
- The function validates payloads using the shared Zod schema (`@nexus/shared`).
- Basic in-memory metrics are tracked per function instance: `processed`, `successes`, `validation_errors`, and `db_errors` and are returned in function responses for debugging.
- The function returns structured errors and attempts to detect unique constraint violations (e.g., Postgres `23505`).

Logging & observability:
- The function logs informational messages and errors to stdout (capturable by your function host logs).
- For production, integrate with a metrics/observability backend (e.g., Prometheus, Datadog) instead of in-memory counters.

Deploy with:
```bash
supabase functions deploy create_item
```

