import { db } from '@/services/database';
import { jsonOk, jsonError } from '@/lib/api-response';
import { requireAuth } from '@/lib/api-auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const { id } = await params;
    if (id !== authResult.userId && authResult.role !== 'admin') {
        return jsonError('Erisim reddedildi', 403);
    }

    const listings = await db.listings.getByUserId(id);
    return jsonOk(listings);
}
