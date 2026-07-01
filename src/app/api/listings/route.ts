import { NextRequest } from 'next/server';
import { db } from '@/services/database';
import { parseFilterState } from '@/lib/filters';
import { jsonOk, jsonError, parseBody } from '@/lib/api-response';
import { requireAuth } from '@/lib/api-auth';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';
import { User } from '@/types';

export async function GET(request: NextRequest) {
    const filter = parseFilterState(Object.fromEntries(request.nextUrl.searchParams));
    const result = await db.listings.getPaginated(filter);
    return jsonOk(result);
}

interface CreateListingBody {
    title: string;
    description: string;
    price: number;
    categoryId: string;
    city: string;
    district?: string;
    roomCount?: string;
    netArea?: number;
    floor?: number;
    heating?: string;
    images?: string[];
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const limit = await rateLimit('listing', getRateLimitIdentifier(request, authResult.userId));
    if (!limit.success) return jsonError('Cok fazla istek. Lutfen bekleyin.', 429);

    const body = await parseBody<CreateListingBody>(request);
    if (!body?.title || !body.price || !body.categoryId) {
        return jsonError('Eksik alanlar: title, price, categoryId', 422);
    }

    const [seller, category] = await Promise.all([
        db.users.getById(authResult.userId),
        db.categories.getById(body.categoryId),
    ]);

    if (!seller) return jsonError('Gecersiz oturum', 401);
    if (!category) return jsonError('Gecersiz kategori', 422);

    const listing = await db.listings.create({
        title: body.title,
        description: body.description || '',
        price: body.price,
        currency: 'TL',
        category,
        location: { city: body.city, district: body.district || '' },
        images: body.images?.length
            ? body.images
            : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop'],
        attributes: {},
        seller: seller as User,
        status: 'pending',
        featured: false,
        tier: 'standard',
        listingType: 'sale',
        roomCount: body.roomCount,
        netArea: body.netArea,
        floor: body.floor,
        heating: body.heating,
    });

    return jsonOk(listing, 201);
}
