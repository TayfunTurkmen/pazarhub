# syntax=docker/dockerfile:1
# Coolify: PORT, HOSTNAME=0.0.0.0, DATABASE_URL, AUTH_SECRET
# WhatsApp: Evolution API runs on 127.0.0.1:8080 inside this container.
# Healthcheck path: /api/health

FROM node:22-bookworm-slim AS evolution
WORKDIR /evolution
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/*
ARG EVOLUTION_REF=2.3.7
RUN git clone --depth 1 --branch "${EVOLUTION_REF}" https://github.com/EvolutionAPI/evolution-api.git .
ENV DATABASE_PROVIDER=postgresql
ENV DATABASE_CONNECTION_URI=postgresql://postgres:postgres@127.0.0.1:5432/evolution?schema=evolution_api
ENV DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/evolution?schema=evolution_api
ENV DOCKER_ENV=true
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
ENV HUSKY=0
RUN if [ -f .env.example ]; then cp .env.example .env; fi \
    && find Docker/scripts -type f -name '*.sh' -exec sed -i 's/\r$//' {} \; \
    && chmod +x Docker/scripts/*.sh \
    && npm ci \
    && bash ./Docker/scripts/generate_database.sh \
    && npm run build

FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_SITE_NAME=skonutal.com
ENV NEXT_TELEMETRY_DISABLED=1
ENV AUTH_SECRET=docker-build-placeholder-secret-value-32ch
ENV DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/skonutal
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_SITE_NAME=${NEXT_PUBLIC_SITE_NAME}
RUN npx prisma generate && npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql postgresql-contrib redis-server ffmpeg openssl ca-certificates python3 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app /app
COPY --from=evolution /evolution /evolution

COPY docker/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh /app/docker/*.sh && chmod +x /entrypoint.sh /app/docker/*.sh

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=skonutal
ENV DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/skonutal
ENV AUTH_TRUST_HOST=true
ENV EVOLUTION_API_URL=http://127.0.0.1:8080
ENV EVOLUTION_INSTANCE=skonutal
ENV SERVER_PORT=8080
ENV SERVER_URL=http://127.0.0.1:8080
ENV CACHE_REDIS_ENABLED=true
ENV CACHE_REDIS_URI=redis://127.0.0.1:6379/6
ENV CACHE_LOCAL_ENABLED=false
ENV RABBITMQ_ENABLED=false
ENV DATABASE_PROVIDER=postgresql
ENV DATABASE_SAVE_DATA_INSTANCE=true
ENV DATABASE_SAVE_DATA_NEW_MESSAGE=true
ENV CONFIG_SESSION_PHONE_CLIENT=skonutal.com
ENV CONFIG_SESSION_PHONE_NAME=Chrome
ENV LANGUAGE=tr

EXPOSE 3000
VOLUME ["/var/lib/postgresql", "/evolution/instances", "/var/lib/redis"]

HEALTHCHECK --interval=30s --timeout=8s --start-period=120s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/entrypoint.sh"]
