import { NextResponse } from 'next/server';

export function jsonOk<T>(data: T, status = 200) {
    return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(message: string, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status });
}

export async function parseBody<T>(request: Request): Promise<T | null> {
    try {
        return (await request.json()) as T;
    } catch {
        return null;
    }
}
