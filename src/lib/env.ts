import 'server-only';

const isProduction = process.env.NODE_ENV === 'production';
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

function warnIfMissing(name: string, value: string | undefined) {
  if (!value && isProduction && !isBuildPhase) {
    console.warn(`[env] Warning: ${name} is not set — related features may be degraded.`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction,
  authSecret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? '',
  databaseUrl:
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    '',
  upstashUrl: process.env.UPSTASH_REDIS_REST_URL ?? '',
  upstashToken: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
  openaiApiKey: process.env.OPENAI_API_KEY ?? '',
  openaiModel: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
} as const;

warnIfMissing('AUTH_SECRET', env.authSecret);
warnIfMissing('UPSTASH_REDIS_REST_URL', env.upstashUrl);
warnIfMissing('UPSTASH_REDIS_REST_TOKEN', env.upstashToken);

export function isDatabaseEnabled(): boolean {
  return Boolean(env.databaseUrl);
}

/** Call at runtime startup (instrumentation) — not during build */
export function validateProductionEnv(): void {
  if (!isProduction) return;

  const missing: string[] = [];
  if (!env.authSecret) missing.push('AUTH_SECRET');
  if (!env.databaseUrl) missing.push('DATABASE_URL');

  if (missing.length > 0) {
    throw new Error(`[env] Missing required production variables: ${missing.join(', ')}`);
  }
}

export function isRateLimitDistributed(): boolean {
  return Boolean(env.upstashUrl && env.upstashToken);
}
