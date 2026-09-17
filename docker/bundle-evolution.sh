#!/bin/bash
set -euo pipefail

# Coolify/Railpack VPS builds often OOM while compiling Evolution (esbuild).
# Default: skip unless BUILD_EVOLUTION=1 is set.
if [ "${BUILD_EVOLUTION:-0}" != "1" ] && [ "${SKIP_EVOLUTION:-0}" = "1" ]; then
  echo "[skonutal] SKIP_EVOLUTION=1 — Evolution API not bundled (WhatsApp QR disabled)."
  exit 0
fi

if [ "${BUILD_EVOLUTION:-0}" != "1" ]; then
  # Auto-skip on small builders (<2.5GiB) unless forced
  MEM_KB="$(awk '/MemTotal/ {print $2}' /proc/meminfo 2>/dev/null || echo 0)"
  if [ "${MEM_KB}" -gt 0 ] && [ "${MEM_KB}" -lt 2500000 ]; then
    echo "[skonutal] Builder RAM ~$((MEM_KB/1024))MiB < 2500MiB — skipping Evolution build."
    echo "[skonutal] Set BUILD_EVOLUTION=1 on a larger builder (or use Dockerfile pack) for WhatsApp."
    exit 0
  fi
fi

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
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"

# Parent /app uses Prisma 7. Keep Evolution on its own Prisma 6 CLI and schema.
SAFE_PATH="$(printf '%s' "$PATH" | tr ':' '\n' | grep -vE '^/app/node_modules(/|$)' | paste -sd: - || true)"
export PATH="${DEST}/node_modules/.bin:${SAFE_PATH:-/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin}"

echo "[skonutal] Installing Evolution dependencies..."
npm ci --omit=optional

export PATH="${DEST}/node_modules/.bin:${PATH}"

echo "[skonutal] Generating Evolution Prisma client (${DATABASE_PROVIDER})..."
if [ -x ./Docker/scripts/generate_database.sh ]; then
  bash ./Docker/scripts/generate_database.sh
else
  npm run db:generate
fi

echo "[skonutal] Building Evolution API..."
# Prefer lighter build path when available (skip full tsc typecheck if possible)
if npm run build --if-present; then
  :
else
  echo "[skonutal] Evolution npm run build failed" >&2
  exit 1
fi

if [ ! -f dist/main.js ]; then
  echo "[skonutal] Evolution build did not produce dist/main.js" >&2
  exit 1
fi

echo "[skonutal] Evolution API ready at ${DEST}"
