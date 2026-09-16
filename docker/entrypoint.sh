#!/bin/bash
set -euo pipefail

export AUTH_SECRET="${AUTH_SECRET:-$(openssl rand -hex 32)}"
export AUTH_TRUST_HOST="${AUTH_TRUST_HOST:-true}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-${NEXT_PUBLIC_APP_URL:-http://localhost:3000}}"
export AUTH_URL="${AUTH_URL:-${NEXTAUTH_URL}}"
export NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-${NEXTAUTH_URL}}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-3000}"
export NODE_ENV="${NODE_ENV:-production}"

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

if [ "${SKIP_EMBEDDED}" != "1" ]; then
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
    echo "[skonutal] Initializing embedded PostgreSQL..."
    su -s /bin/bash postgres -c "initdb -D '${PGDATA}' --encoding=UTF8 --locale=C.UTF-8 --auth-local=trust --auth-host=trust --username='${POSTGRES_USER}'"
  fi

  echo "[skonutal] Starting embedded PostgreSQL..."
  su -s /bin/bash postgres -c "postgres -D '${PGDATA}' -c listen_addresses=127.0.0.1 -c unix_socket_directories=/tmp -c logging_collector=off" &

  for _ in $(seq 1 60); do
    if su -s /bin/bash postgres -c "pg_isready -h 127.0.0.1 -U '${POSTGRES_USER}'" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done

  if ! su -s /bin/bash postgres -c "pg_isready -h 127.0.0.1 -U '${POSTGRES_USER}'" >/dev/null 2>&1; then
    echo "[skonutal] PostgreSQL failed to start" >&2
    exit 1
  fi

  DB_EXISTS="$(su -s /bin/bash postgres -c "psql -h 127.0.0.1 -U '${POSTGRES_USER}' -d postgres -tAc \"SELECT 1 FROM pg_database WHERE datname='${POSTGRES_DB}'\"" || true)"
  if [ "${DB_EXISTS}" != "1" ]; then
    echo "[skonutal] Creating database ${POSTGRES_DB}..."
    su -s /bin/bash postgres -c "createdb -h 127.0.0.1 -U '${POSTGRES_USER}' '${POSTGRES_DB}'"
  fi
else
  echo "[skonutal] Coolify/external DATABASE_URL detected (${HOST}) — embedded Postgres skipped."
  if [ -z "${DATABASE_URL:-}" ]; then
    echo "[skonutal] DATABASE_URL is required when SKIP_EMBEDDED_POSTGRES=1" >&2
    exit 1
  fi
fi

cd /app
echo "[skonutal] Applying schema..."
npx prisma db push --skip-generate

if [ "${SKIP_EMBEDDED}" != "1" ] && [ ! -f /var/lib/postgresql/.skonutal_seeded ]; then
  echo "[skonutal] Seeding demo data..."
  npx tsx prisma/seed.ts
  touch /var/lib/postgresql/.skonutal_seeded
  chown postgres:postgres /var/lib/postgresql/.skonutal_seeded || true
elif [ "${SEED_ON_START:-0}" = "1" ]; then
  echo "[skonutal] SEED_ON_START=1 — seeding..."
  npx tsx prisma/seed.ts || true
fi

export EVOLUTION_API_KEY="${EVOLUTION_API_KEY:-${AUTHENTICATION_API_KEY:-$(openssl rand -hex 16)}}"
export AUTHENTICATION_API_KEY="${AUTHENTICATION_API_KEY:-${EVOLUTION_API_KEY}}"
export EVOLUTION_API_URL="${EVOLUTION_API_URL:-http://127.0.0.1:8080}"
export EVOLUTION_INSTANCE="${EVOLUTION_INSTANCE:-skonutal}"
export SERVER_PORT="${SERVER_PORT:-8080}"
export SERVER_URL="${SERVER_URL:-http://127.0.0.1:8080}"
export CACHE_REDIS_ENABLED="${CACHE_REDIS_ENABLED:-true}"
export CACHE_REDIS_URI="${CACHE_REDIS_URI:-redis://127.0.0.1:6379/6}"
export DATABASE_PROVIDER="${DATABASE_PROVIDER:-postgresql}"
export DATABASE_CONNECTION_URI="${DATABASE_CONNECTION_URI:-$(node -e 'const u=new URL(process.env.DATABASE_URL); u.searchParams.set("schema","evolution_api"); console.log(u.toString())')}"
export CONFIG_SESSION_PHONE_CLIENT="${CONFIG_SESSION_PHONE_CLIENT:-skonutal.com}"
export CONFIG_SESSION_PHONE_NAME="${CONFIG_SESSION_PHONE_NAME:-Chrome}"
export LANGUAGE="${LANGUAGE:-tr}"
export DOCKER_ENV=true

mkdir -p /var/lib/redis /evolution/instances
chown -R redis:redis /var/lib/redis 2>/dev/null || true

echo "[skonutal] Starting Redis..."
redis-server --daemonize yes --bind 127.0.0.1 --port 6379 --dir /tmp --save "" --protected-mode yes || true

if [ -d /evolution ]; then
  echo "[skonutal] Starting Evolution API on 127.0.0.1:${SERVER_PORT}..."
  (
    cd /evolution
    if [ -x ./Docker/scripts/deploy_database.sh ]; then
      bash ./Docker/scripts/deploy_database.sh || npx prisma db push --skip-generate || true
    fi
    npm run start:prod
  ) > /tmp/evolution.log 2>&1 &

  for _ in $(seq 1 40); do
    if node -e "fetch('http://127.0.0.1:${SERVER_PORT}').then(()=>process.exit(0)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
      echo "[skonutal] Evolution API is up"
      break
    fi
    sleep 1
  done
else
  echo "[skonutal] Evolution API files missing — WhatsApp QR login disabled"
fi

echo "[skonutal] Starting web server on ${HOSTNAME}:${PORT}"
exec npx next start -H "${HOSTNAME}" -p "${PORT}"
