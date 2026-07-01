import { NextRequest } from 'next/server';
import { db } from '@/services/database';
import { parseFilterState } from '@/lib/filters';
import { jsonOk } from '@/lib/api-response';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if ('error' in authResult) return authResult.error;

    const filter = parseFilterState(Object.fromEntries(request.nextUrl.searchParams));
    filter.adminAll = true;

    const result = await db.listings.getPaginated(filter);
    return jsonOk(result);
}