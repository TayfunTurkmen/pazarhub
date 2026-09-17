import { db } from '@/services/database';
import { jsonOk, jsonError, parseBody } from '@/lib/api-response';
import { requireAuth } from '@/lib/api-auth';
import { Listing } from '@/types';
import { filterAllowedImageUrls, sanitizeText } from '@/lib/sanitize';

const OWNER_STATUS = new Set<Listing['status']>(['active', 'passive', 'sold']);

type ListingPatchBody = {
  status?: Listing['status'];
  title?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  city?: string;
  district?: string;
  neighborhood?: string;
  roomCount?: string;
  netArea?: number;
  floor?: number;
  heating?: string;
  images?: string[];
};

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

    const body = await parseBody<ListingPatchBody>(request);
    if (!body) return jsonError('Gecersiz istek', 400);

    const isAdmin = authResult.role === 'admin';
    const isOwner = listing.seller.id === authResult.userId;

    if (!isOwner && !isAdmin) {
        return jsonError('Bu ilani guncelleme yetkiniz yok', 403);
    }

    if (body.status !== undefined) {
        if (isAdmin) {
            // admins can set any status
        } else if (!OWNER_STATUS.has(body.status)) {
            return jsonError('Durum guncelleme yetkiniz yok', 403);
        }
    }

    const patch: Partial<Listing> = {};
    if (body.status !== undefined) patch.status = body.status;
    if (body.title !== undefined) patch.title = sanitizeText(body.title, 500);
    if (body.description !== undefined) patch.description = sanitizeText(body.description, 5000);
    if (body.price !== undefined) patch.price = body.price;
    if (body.roomCount !== undefined) patch.roomCount = body.roomCount;
    if (body.netArea !== undefined) patch.netArea = body.netArea;
    if (body.floor !== undefined) patch.floor = body.floor;
    if (body.heating !== undefined) patch.heating = body.heating;
    if (body.images !== undefined) patch.images = filterAllowedImageUrls(body.images);

    if (body.city !== undefined || body.district !== undefined || body.neighborhood !== undefined) {
        patch.location = {
            city: body.city !== undefined ? sanitizeText(body.city, 120) : listing.location.city,
            district: body.district !== undefined ? sanitizeText(body.district, 120) : listing.location.district,
            neighborhood: body.neighborhood !== undefined
                ? sanitizeText(body.neighborhood, 120)
                : listing.location.neighborhood,
            street: listing.location.street,
            lat: listing.location.lat,
            lng: listing.location.lng,
        };
    }

    if (body.categoryId) {
        const category = await db.categories.getById(body.categoryId);
        if (!category) return jsonError('Gecersiz kategori', 422);
        patch.category = category;
    }

    const updated = await db.listings.update(id, patch);
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
