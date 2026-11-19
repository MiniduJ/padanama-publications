#!/bin/sh
# Vercel build. Production: sync the schema into Supabase (falls back to DATABASE_URL if the Supabase
# integration vars are missing), copy existing data across once, then seed/refresh the catalogue.
set -e
prisma generate
if [ "$VERCEL_ENV" = "production" ]; then
  TARGET="${POSTGRES_URL_NON_POOLING:-$DATABASE_URL}"
  DATABASE_URL="$TARGET" prisma db push --skip-generate
  node scripts/copy-db-to-supabase.mjs
  DATABASE_URL="$TARGET" tsx prisma/seed.ts
fi
next build
