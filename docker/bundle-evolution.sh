#!/bin/bash
set -euo pipefail

DEST="${1:-/app/evolution}"
EVOLUTION_REPO="${EVOLUTION_REPO:-https://github.com/EvolutionAPI/evolution-api.git}"
EVOLUTION_REF="${EVOLUTION_REF:-2.3.7}"

if [ -f "${DEST}/package.json" ] && [ -d "${DEST}/node_modules" ] && [ -f "${DEST}/dist/main.js" ]; then
  echo "[skonutal] Evolution already bundled at ${DEST}"
  exit 0
fi

echo "[skonutal] Cloning Evolution API (${EVOLUTION_REF}) into ${DEST}..."
rm -rf "$DEST"

if ! git clone --depth 1 --branch "$EVOLUTION_REF" "$EVOLUTION_REPO" "$DEST"; then
  echo "[skonutal] Ref ${EVOLUTION_REF} unavailable, cloning default branch"
  git clone --depth 1 "$EVOLUTION_REPO" "$DEST"
fi

cd "$DEST"

if [ -d Docker/scripts ]; then
  find Docker/scripts -type f -name '*.sh' -exec sed -i 's/\r$//' {} \;
  chmod +x Docker/scripts/*.sh
fi

if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
fi

export DATABASE_PROVIDER="${DATABASE_PROVIDER:-postgresql}"
export DATABASE_CONNECTION_URI="${DATABASE_CONNECTION_URI:-postgresql://postgres:postgres@127.0.0.1:5432/evolution?schema=evolution_api}"
export DATABASE_URL="${DATABASE_URL:-$DATABASE_CONNECTION_URI}"
export DOCKER_ENV=true
export PRISMA_SKIP_POSTINSTALL_GENERATE=1
export HUSKY=0

# Parent /app uses Prisma 7. Keep Evolution on its own Prisma 6 CLI and schema.
# Do not match /app/evolution/node_modules — only the parent app bins.
SAFE_PATH="$(printf '%s' "$PATH" | tr ':' '\n' | grep -vE '^/app/node_modules(/|$)' | paste -sd: - || true)"
export PATH="${DEST}/node_modules/.bin:${SAFE_PATH:-/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin}"

echo "[skonutal] Installing Evolution dependencies..."
npm ci

export PATH="${DEST}/node_modules/.bin:${PATH}"

echo "[skonutal] Generating Evolution Prisma client (${DATABASE_PROVIDER})..."
if [ -x ./Docker/scripts/generate_database.sh ]; then
  bash ./Docker/scripts/generate_database.sh
else
  npm run db:generate
fi

echo "[skonutal] Building Evolution API..."
npm run build

if [ ! -f dist/main.js ]; then
  echo "[skonutal] Evolution build did not produce dist/main.js" >&2
  exit 1
fi

echo "[skonutal] Evolution API ready at ${DEST}"
