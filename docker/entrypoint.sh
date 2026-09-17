#!/bin/bash
set -uo pipefail

export AUTH_SECRET="${AUTH_SECRET:-$(openssl rand -hex 32)}"
export AUTH_TRUST_HOST="${AUTH_TRUST_HOST:-true}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-${NEXT_PUBLIC_APP_URL:-http://localhost:3000}}"
export AUTH_URL="${AUTH_URL:-${NEXTAUTH_URL}}"
export NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-${NEXTAUTH_URL}}"
export PORT="${PORT:-3000}"
export NODE_ENV="${NODE_ENV:-production}"
# Coolify Railpack: Evolution is not bundled by default (OOM on small builders)
export SKIP_EVOLUTION="${SKIP_EVOLUTION:-1}"

# CRITICAL: Docker/Coolify set HOSTNAME to the container id.
# Never bind Next.js to that — always listen on all interfaces unless LISTEN_HOST is set.
export LISTEN_HOST="${LISTEN_HOST:-0.0.0.0}"

db_host() {
  node -e 'try{console.log(new URL(process.env.DATABASE_URL||"").hostname||"")}catch{console.log("")}'
}

HOST="$(db_host)"
SKIP_EMBEDDED="${SKIP_EMBEDDED_POSTGRES:-}"
if [ -z "$SKIP_EMBEDDED" ]; then
  if [ -n "${HOST}" ] && [ "${HOST}" != "127.0.0.1" ] && [ "${HOST}" != "localhost" ]; then
    SKIP_EMBEDDED=1
  else
    SKIP_EMBEDDED=0
  fi
fi

if [ "${SKIP_EMBEDDED}" != "1" ] && command -v postgres >/dev/null 2>&1; then
  set -e
  PG_MAJOR="$(ls /usr/lib/postgresql | head -n 1)"
  export PATH="/usr/lib/postgresql/${PG_MAJOR}/bin:${PATH}"
  export PGDATA="${PGDATA:-/var/lib/postgresql/${PG_MAJOR}/skonutal}"
  export POSTGRES_USER="${POSTGRES_USER:-postgres}"
  export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
  export POSTGRES_DB="${POSTGRES_DB:-skonutal}"
  export DATABASE_URL="${DATABASE_URL:-postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:5432/${POSTGRES_DB}}"

  mkdir -p /tmp /run/postgresql "$PGDATA"
  chown -R postgres:postgres /var/lib/postgresql /run/postgresql /tmp

  if [ ! -s "${PGDATA}/PG_VERSION" ]; then
    echo "[sendekonutal] Initializing embedded PostgreSQL..."
    su -s /bin/bash postgres -c "initdb -D '${PGDATA}' --encoding=UTF8 --locale=C.UTF-8 --auth-local=trust --auth-host=trust --username='${POSTGRES_USER}'"
  fi

  echo "[sendekonutal] Starting embedded PostgreSQL..."
  su -s /bin/bash postgres -c "postgres -D '${PGDATA}' -c listen_addresses=127.0.0.1 -c unix_socket_directories=/tmp -c logging_collector=off" &

  for _ in $(seq 1 60); do
    if su -s /bin/bash postgres -c "pg_isready -h 127.0.0.1 -U '${POSTGRES_USER}'" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done

  if ! su -s /bin/bash postgres -c "pg_isready -h 127.0.0.1 -U '${POSTGRES_USER}'" >/dev/null 2>&1; then
    echo "[sendekonutal] PostgreSQL failed to start" >&2
    exit 1
  fi

  DB_EXISTS="$(su -s /bin/bash postgres -c "psql -h 127.0.0.1 -U '${POSTGRES_USER}' -d postgres -tAc \"SELECT 1 FROM pg_database WHERE datname='${POSTGRES_DB}'\"" || true)"
  if [ "${DB_EXISTS}" != "1" ]; then
    echo "[sendekonutal] Creating database ${POSTGRES_DB}..."
    su -s /bin/bash postgres -c "createdb -h 127.0.0.1 -U '${POSTGRES_USER}' '${POSTGRES_DB}'"
  fi
  set +e
elif [ -n "${DATABASE_URL:-}" ]; then
  echo "[sendekonutal] External DATABASE_URL (${HOST:-remote}) — embedded Postgres skipped."
else
  echo "[sendekonutal] DATABASE_URL missing — schema push skipped."
fi

cd /app || cd "$(dirname "$0")/.." || true
APP_DIR="$(pwd)"
echo "[sendekonutal] App dir: ${APP_DIR}"

if [ -n "${DATABASE_URL:-}" ]; then
  echo "[sendekonutal] Applying schema..."
  if ! npx prisma db push; then
    echo "[sendekonutal] WARNING: prisma db push failed — starting app anyway" >&2
  fi
fi

if [ "${SKIP_EMBEDDED}" != "1" ] && [ ! -f /var/lib/postgresql/.skonutal_seeded ]; then
  echo "[sendekonutal] Seeding demo data..."
  npx tsx prisma/seed.ts || true
  mkdir -p /var/lib/postgresql
  touch /var/lib/postgresql/.skonutal_seeded
  chown postgres:postgres /var/lib/postgresql/.skonutal_seeded 2>/dev/null || true
elif [ "${SEED_ON_START:-0}" = "1" ]; then
  echo "[sendekonutal] SEED_ON_START=1 — seeding..."
  npx tsx prisma/seed.ts || true
fi

export EVOLUTION_API_KEY="${EVOLUTION_API_KEY:-${AUTHENTICATION_API_KEY:-$(openssl rand -hex 16)}}"
export AUTHENTICATION_API_KEY="${AUTHENTICATION_API_KEY:-${EVOLUTION_API_KEY}}"
export EVOLUTION_API_URL="${EVOLUTION_API_URL:-http://127.0.0.1:8080}"
export EVOLUTION_INSTANCE="${EVOLUTION_INSTANCE:-skonutal}"
export SERVER_PORT="${SERVER_PORT:-8080}"
export SERVER_URL="${SERVER_URL:-http://127.0.0.1:8080}"
export CACHE_REDIS_ENABLED="${CACHE_REDIS_ENABLED:-false}"
export CACHE_REDIS_URI="${CACHE_REDIS_URI:-redis://127.0.0.1:6379/6}"
export DATABASE_PROVIDER="${DATABASE_PROVIDER:-postgresql}"
export DATABASE_CONNECTION_URI="${DATABASE_CONNECTION_URI:-$(node -e 'try{const u=new URL(process.env.DATABASE_URL||"");u.searchParams.set("schema","evolution_api");console.log(u.toString())}catch{console.log("")}')}"
export CONFIG_SESSION_PHONE_CLIENT="${CONFIG_SESSION_PHONE_CLIENT:-sendekonutal.com}"
export CONFIG_SESSION_PHONE_NAME="${CONFIG_SESSION_PHONE_NAME:-Chrome}"
export LANGUAGE="${LANGUAGE:-tr}"
export DOCKER_ENV=true

evo_dir() {
  if [ -f /evolution/package.json ]; then
    echo /evolution
  elif [ -f /app/evolution/package.json ]; then
    echo /app/evolution
  else
    echo ""
  fi
}

start_redis() {
  if [ "${SKIP_EVOLUTION:-1}" = "1" ]; then
    export CACHE_REDIS_ENABLED=false
    return 0
  fi
  mkdir -p /var/lib/redis /tmp
  chown -R redis:redis /var/lib/redis 2>/dev/null || true
  if ! command -v redis-server >/dev/null 2>&1; then
    echo "[sendekonutal] redis-server not installed — Evolution cache disabled"
    export CACHE_REDIS_ENABLED=false
    return 0
  fi
  echo "[sendekonutal] Starting Redis..."
  redis-server --daemonize yes --bind 127.0.0.1 --port 6379 --dir /tmp --save "" --protected-mode yes || true
}

start_evolution() {
  local dir
  dir="$(evo_dir)"
  if [ "${SKIP_EVOLUTION:-1}" = "1" ]; then
    echo "[sendekonutal] SKIP_EVOLUTION=1 — WhatsApp Evolution API disabled"
    return 0
  fi
  if [ -z "$dir" ]; then
    echo "[sendekonutal] Evolution API files missing — WhatsApp QR login disabled"
    return 0
  fi

  mkdir -p "${dir}/instances"
  echo "[sendekonutal] Evolution API starting with the site on 127.0.0.1:${SERVER_PORT}"
  while true; do
    (
      cd "$dir"
      if [ -x ./Docker/scripts/deploy_database.sh ]; then
        bash ./Docker/scripts/deploy_database.sh || npx prisma db push || true
      elif [ -n "${DATABASE_CONNECTION_URI:-}" ]; then
        npx prisma db push || true
      fi
      npm run start:prod
    ) >> /tmp/evolution.log 2>&1 || true
    echo "[sendekonutal] Evolution API exited — restarting in 2s" >> /tmp/evolution.log
    sleep 2
  done
}

start_web() {
  echo "[sendekonutal] Starting web server on ${LISTEN_HOST}:${PORT}"
  echo "[sendekonutal] NEXTAUTH_URL=${NEXTAUTH_URL}"
  echo "[sendekonutal] DATABASE host=${HOST:-none}"
  # Prefer compiled next binary; fall back to npx
  if [ -x ./node_modules/.bin/next ]; then
    exec ./node_modules/.bin/next start -H "${LISTEN_HOST}" -p "${PORT}"
  fi
  exec npx next start -H "${LISTEN_HOST}" -p "${PORT}"
}

start_redis
if [ "${SKIP_EVOLUTION:-1}" != "1" ]; then
  start_evolution &
  EVO_PID=$!
else
  EVO_PID=""
fi

# Run Next in foreground so Coolify keeps the container healthy
start_web
status=$?
echo "[sendekonutal] Web server exited (${status})"
if [ -n "${EVO_PID}" ]; then
  kill -TERM "$EVO_PID" 2>/dev/null || true
fi
exit "$status"
