import { db } from '@/services/database';
import { jsonOk } from '@/lib/api-response';
import { requireAdmin } from '@/lib/api-auth';

export async function GET() {
    const authResult = await requireAdmin();
    if ('error' in authResult) return authResult.error;

    const users = await db.users.getAll();
    const enriched = await Promise.all(
        users.map(async (user) => ({
            ...user,
            listingsCount: await db.users.getListingCount(user.id),
        }))
    );
    return jsonOk(enriched);
}
