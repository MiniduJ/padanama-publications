#!/bin/sh
# Vercel build. Production: sync the schema into Supabase (falls back to DATABASE_URL if the Supabase
# integration vars are missing), copy existing data across once, then seed/refresh the catalogue.
set -e
prisma generate
if [ "$VERCEL_ENV" = "production" ]; then
  TARGET="${POSTGRES_URL_NON_POOLING:-$DATABASE_URL}"
  DATABASE_URL="$TARGET" prisma db push --skip-generate
  # Supabase serves every public table over its REST API with the public (anon) key. The app talks to
  # Postgres directly as the table owner, so turn on row-level security (no policies) for every table:
  # the REST API sees nothing, the app is unaffected. Re-run each deploy to cover newly added tables.
  echo "DO \$\$ DECLARE r record; BEGIN FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename); END LOOP; END \$\$;" \
    | prisma db execute --stdin --url "$TARGET"
  node scripts/copy-db-to-supabase.mjs
  DATABASE_URL="$TARGET" tsx prisma/seed.ts
fi
next build
