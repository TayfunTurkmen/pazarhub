import { db } from '@/services/database';
import { jsonOk, jsonError, parseBody } from '@/lib/api-response';
import { requireAuth } from '@/lib/api-auth';
import { Listing } from '@/types';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const listing = await db.listings.getById(id);
    if (!listing) return jsonError('Ilan bulunamadi', 404);
    return jsonOk(listing);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const { id } = await params;
    const listing = await db.listings.getById(id);
    if (!listing) return jsonError('Ilan bulunamadi', 404);

    const body = await parseBody<{ status?: Listing['status']; title?: string; price?: number }>(request);
    if (!body) return jsonError('Gecersiz istek', 400);

    const isAdmin = authResult.role === 'admin';
    const isOwner = listing.seller.id === authResult.userId;

    if (body.status !== undefined) {
        if (!isAdmin) return jsonError('Durum guncelleme yetkiniz yok', 403);
    } else if (!isOwner && !isAdmin) {
        return jsonError('Bu ilani guncelleme yetkiniz yok', 403);
    }

    const updated = await db.listings.update(id, body);
    if (!updated) return jsonError('Ilan bulunamadi', 404);
    return jsonOk(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const { id } = await params;
    const listing = await db.listings.getById(id);
    if (!listing) return jsonError('Ilan bulunamadi', 404);

    if (listing.seller.id !== authResult.userId && authResult.role !== 'admin') {
        return jsonError('Bu ilani silme yetkiniz yok', 403);
    }

    const deleted = await db.listings.delete(id);
    if (!deleted) return jsonError('Ilan bulunamadi', 404);
    return jsonOk({ deleted: true });
}
