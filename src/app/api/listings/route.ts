import { db } from '@/services/database';
import { parseFilterState } from '@/lib/filters';
import { jsonOk, jsonError, jsonRateLimited } from '@/lib/api-response';
import { requireAuth } from '@/lib/api-auth';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { createListingSchema } from '@/lib/validation';
import { filterAllowedImageUrls, sanitizeText } from '@/lib/sanitize';
import { User } from '@/types';
import { assertCanCreateListing, listingExpiryFromPlan } from '@/lib/billing/quota';

export const GET = withApiHandler(async (request: Request) => {
    const limit = await rateLimit('read', getRateLimitIdentifier(request));
    if (!limit.success) return jsonRateLimited(limit.retryAfter);

    const url = new URL(request.url);
    const filter = parseFilterState(Object.fromEntries(url.searchParams));
    const result = await db.listings.getPaginated(filter);
    return jsonOk(result);
}, 'GET /api/listings');

export const POST = withApiHandler(async (request: Request) => {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const limit = await rateLimit('listing', getRateLimitIdentifier(request, authResult.userId));
    if (!limit.success) return jsonRateLimited(limit.retryAfter);

    const parsed = await parseValidatedBody(request, createListingSchema);
    if ('error' in parsed) return parsed.error;
    const body = parsed.data;

    const [seller, category] = await Promise.all([
        db.users.getById(authResult.userId),
        db.categories.getById(body.categoryId),
    ]);

    if (!seller) return jsonError('Gecersiz oturum', 401);
    if (!category) return jsonError('Gecersiz kategori', 422);

    let entitlements;
    try {
        entitlements = await assertCanCreateListing(authResult.userId);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'İlan kotası aşıldı';
        const status = (err as Error & { status?: number }).status ?? 402;
        return jsonError(message, status);
    }

    const images = body.images?.length
        ? filterAllowedImageUrls(body.images)
        : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop'];

    const listing = await db.listings.create({
        title: sanitizeText(body.title, 500),
        description: sanitizeText(body.description, 5000),
        price: body.price,
        currency: 'TL',
        category,
        location: {
            city: sanitizeText(body.city, 120),
            district: sanitizeText(body.district, 120),
            neighborhood: body.neighborhood ? sanitizeText(body.neighborhood, 120) : undefined,
        },
        images,
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
        expiresAt: listingExpiryFromPlan(entitlements.plan.listingDays).toISOString(),
    });

    return jsonOk(listing, 201);
}, 'POST /api/listings');
