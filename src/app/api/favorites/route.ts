import { db } from '@/services/database';
import { requireAuth } from '@/lib/api-auth';
import { jsonOk, jsonError } from '@/lib/api-response';

export async function GET() {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const favorites = await db.favorites.getByUserId(authResult.userId);
    return jsonOk(favorites);
}

export async function POST(request: Request) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const body = await request.json().catch(() => null) as { listingId?: string } | null;
    if (!body?.listingId) {
        return jsonError('listingId gerekli', 422);
    }

    await db.favorites.add(authResult.userId, body.listingId);
    return jsonOk({ added: true }, 201);
}
