import { db } from '@/services/database';
import { requireAuth } from '@/lib/api-auth';
import { jsonOk, jsonError } from '@/lib/api-response';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { favoriteSchema } from '@/lib/validation';

export const GET = withApiHandler(async (_request: Request) => {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const favorites = await db.favorites.getByUserId(authResult.userId);
    return jsonOk(favorites);
}, 'GET /api/favorites');

export const POST = withApiHandler(async (request: Request) => {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const parsed = await parseValidatedBody(request, favoriteSchema);
    if ('error' in parsed) return parsed.error;

    const listing = await db.listings.getById(parsed.data.listingId);
    if (!listing) {
        return jsonError('Ilan bulunamadi', 404);
    }

    await db.favorites.add(authResult.userId, parsed.data.listingId);
    return jsonOk({ added: true }, 201);
}, 'POST /api/favorites');
