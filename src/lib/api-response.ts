import { NextResponse } from 'next/server';

export function jsonOk<T>(data: T, status = 200, requestId?: string) {
    const res = NextResponse.json({ success: true, data, ...(requestId ? { requestId } : {}) }, { status });
    return res;
}

export function jsonError(message: string, status = 400, requestId?: string) {
    return NextResponse.json({ success: false, error: message, ...(requestId ? { requestId } : {}) }, { status });
}

export async function parseBody<T>(request: Request): Promise<T | null> {
    try {
        return (await request.json()) as T;
    } catch {
        return null;
    }
}

export function jsonRateLimited(retryAfterSeconds = 60) {
    const res = jsonError('Cok fazla istek. Lutfen bekleyin.', 429);
    res.headers.set('Retry-After', String(retryAfterSeconds));
    return res;
}
