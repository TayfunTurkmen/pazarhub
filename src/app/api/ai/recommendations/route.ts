import { z } from 'zod';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { jsonOk } from '@/lib/api-response';
import { recommendListings } from '@/lib/ai/recommendations';
import { getListings } from '@/services/serverData';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  roomCount: z.string().optional(),
  listingType: z.enum(['sale', 'rent']).optional(),
  budget: z.number().optional(),
  preferences: z.string().optional(),
  limit: z.number().min(1).max(12).optional(),
});

export const POST = withApiHandler(async (request) => {
  const limit = await rateLimit('ai', getRateLimitIdentifier(request));
  if (!limit.success) {
    return jsonOk({ recommendations: [], message: 'Rate limited' }, 429);
  }

  const parsed = await parseValidatedBody(request, schema);
  if ('error' in parsed) return parsed.error;

  const listings = await getListings({});
  const recommendations = recommendListings(listings, parsed.data, parsed.data.limit ?? 6);

  return jsonOk({
    recommendations: recommendations.map((r) => ({
      listingId: r.listing.id,
      title: r.listing.title,
      price: r.listing.price,
      currency: r.listing.currency,
      city: r.listing.location.city,
      district: r.listing.location.district,
      image: r.listing.images[0] ?? null,
      score: r.score,
      reasons: r.reasons,
      roomCount: r.listing.roomCount,
      listingType: r.listing.listingType,
    })),
  });
}, 'POST /api/ai/recommendations');
