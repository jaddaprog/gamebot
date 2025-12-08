#!/usr/bin/env bash
set -euo pipefail

echo "Local Supabase helper script — start stack, apply migrations, and serve functions"

if ! command -v supabase >/dev/null 2>&1; then
  echo "ERROR: supabase CLI not found. Install it first: https://supabase.com/docs/guides/cli"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker not found. Install Docker Desktop or Docker Engine before running this script."
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Starting Supabase local stack (this will pull images if needed)..."
supabase start

echo
read -r -p "Apply database migrations/reset local DB? This will reset local DB and apply migrations. Proceed? (y/N): " apply
if [[ "$apply" =~ ^[Yy]$ ]]; then
  echo "Resetting local DB and applying migrations..."
  echo "This may take a few moments."
  supabase db reset
else
  echo "Skipping DB reset. Ensure migrations are applied before running tests."
fi

echo
echo "Now prepare env for functions. You must provide SUPABASE_SERVICE_ROLE_KEY."
if [ -z "${SUPABASE_SERVICE_ROLE_KEY-}" ]; then
  read -r -p "Enter your SUPABASE_SERVICE_ROLE_KEY (or press Enter to abort): " key
  if [ -z "$key" ]; then
    echo "No service role key provided — aborting. You can set SUPABASE_SERVICE_ROLE_KEY in your shell and re-run this script."
    exit 1
  fi
  export SUPABASE_SERVICE_ROLE_KEY="$key"
fi

export SUPABASE_URL="http://localhost:54321"

ENV_FILE=".supabase_functions_env"
cat > "$ENV_FILE" <<EOF
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
EOF

echo "Serving Supabase Edge Functions with env file: $ENV_FILE"
echo "(Use Ctrl+C to stop the function server)"
supabase functions serve --env-file "$ENV_FILE"

# Note: This process blocks while functions are served. Open a new terminal to run the bot and Forge UI.
