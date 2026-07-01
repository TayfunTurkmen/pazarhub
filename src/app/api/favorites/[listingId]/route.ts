import { db } from '@/services/database';
import { requireAuth } from '@/lib/api-auth';
import { jsonOk } from '@/lib/api-response';

export async function DELETE(_request: Request, { params }: { params: Promise<{ listingId: string }> }) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const { listingId } = await params;
    await db.favorites.remove(authResult.userId, listingId);
    return jsonOk({ removed: true });
}

export async function GET(_request: Request, { params }: { params: Promise<{ listingId: string }> }) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const { listingId } = await params;
    const isFavorite = await db.favorites.isFavorite(authResult.userId, listingId);
    return jsonOk({ isFavorite });
}
