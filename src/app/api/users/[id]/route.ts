import { db } from '@/services/database';
import { jsonOk, jsonError } from '@/lib/api-response';
import { requireAdmin, requireAuth } from '@/lib/api-auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const { id } = await params;
    if (id !== authResult.userId && authResult.role !== 'admin') {
        return jsonError('Erisim reddedildi', 403);
    }

    const user = await db.users.getById(id);
    if (!user) return jsonError('Kullanici bulunamadi', 404);

    const listingsCount = await db.users.getListingCount(id);
    return jsonOk({ ...user, listingsCount });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requireAdmin();
    if ('error' in authResult) return authResult.error;

    const { id } = await params;
    const body = await request.json().catch(() => null) as { status?: 'active' | 'banned' | 'pending' } | null;
    if (!body?.status) return jsonError('status alani gerekli', 422);

    const updated = await db.users.update(id, { status: body.status });
    if (!updated) return jsonError('Kullanici bulunamadi', 404);
    return jsonOk(updated);
}
