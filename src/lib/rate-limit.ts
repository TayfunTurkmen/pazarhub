import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { isRateLimitDistributed, env } from '@/lib/env';

type Bucket = 'auth' | 'listing' | 'upload' | 'message' | 'read' | 'ai';

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(key: string, limit: number, windowMs: number): { success: boolean; remaining: number; retryAfter: number } {
    const now = Date.now();
    const entry = memoryStore.get(key);
    if (!entry || now > entry.resetAt) {
        memoryStore.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: limit - 1, retryAfter: 0 };
    }
    if (entry.count >= limit) {
        return { success: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
    }
    entry.count += 1;
    return { success: true, remaining: limit - entry.count, retryAfter: 0 };
}

const upstashLimits: Partial<Record<Bucket, Ratelimit>> = {};

function getUpstashLimit(bucket: Bucket): Ratelimit | null {
    if (!isRateLimitDistributed()) return null;
    if (!upstashLimits[bucket]) {
        const redis = Redis.fromEnv();
        const limits: Record<Bucket, { requests: number; window: `${number} s` | `${number} m` }> = {
            auth: { requests: 10, window: '1 m' },
            listing: { requests: 20, window: '1 m' },
            upload: { requests: 15, window: '1 m' },
            message: { requests: 30, window: '1 m' },
            read: { requests: 120, window: '1 m' },
            ai: { requests: 30, window: '1 m' },
        };
        upstashLimits[bucket] = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(limits[bucket].requests, limits[bucket].window),
            prefix: `ratelimit:${bucket}`,
        });
    }
    return upstashLimits[bucket] ?? null;
}

const memoryLimits: Record<Bucket, { limit: number; windowMs: number }> = {
    auth: { limit: 20, windowMs: 60_000 },
    listing: { limit: 30, windowMs: 60_000 },
    upload: { limit: 20, windowMs: 60_000 },
    message: { limit: 40, windowMs: 60_000 },
    read: { limit: 200, windowMs: 60_000 },
    ai: { limit: 40, windowMs: 60_000 },
};

export async function rateLimit(bucket: Bucket, identifier: string) {
    if (process.env.DISABLE_RATE_LIMIT === 'true' && !env.isProduction) {
        return { success: true, remaining: 999, retryAfter: 0 };
    }

    const upstash = getUpstashLimit(bucket);
    if (upstash) {
        const result = await upstash.limit(identifier);
        return {
            success: result.success,
            remaining: result.remaining,
            retryAfter: result.success ? 0 : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
        };
    }

    if (env.isProduction) {
        console.warn('[rate-limit] Upstash not configured — using in-memory fallback (not suitable for multi-instance)');
    }

    const cfg = memoryLimits[bucket];
    return memoryRateLimit(`${bucket}:${identifier}`, cfg.limit, cfg.windowMs);
}

export function getRateLimitIdentifier(request: Request, userId?: string): string {
    if (userId) return userId;
    const forwarded = request.headers.get('x-forwarded-for');
    return forwarded?.split(',')[0]?.trim() || 'anonymous';
}
