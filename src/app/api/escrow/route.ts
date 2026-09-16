import { jsonError, jsonOk, jsonRateLimited } from '@/lib/api-response';
import { requireAuth } from '@/lib/api-auth';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { z } from 'zod';
import { db } from '@/services/database';
import { getEscrow, listEscrowsForUser, setEscrowStatus } from '@/lib/escrow/store';

const patchSchema = z.object({
  id: z.string().min(1),
  action: z.enum(['deliver', 'confirm', 'dispute', 'cancel']),
});

export const GET = withApiHandler(async (request: Request) => {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;
  const items = await listEscrowsForUser(auth.userId);
  return jsonOk(items);
}, 'GET /api/escrow');

export const PATCH = withApiHandler(async (request: Request) => {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;
  const limit = await rateLimit('listing', getRateLimitIdentifier(request, auth.userId));
  if (!limit.success) return jsonRateLimited(limit.retryAfter);
  const parsed = await parseValidatedBody(request, patchSchema);
  if ('error' in parsed) return parsed.error;

  const deal = await getEscrow(parsed.data.id);
  if (!deal) return jsonError('İşlem bulunamadı', 404);

  if (parsed.data.action === 'deliver') {
    if (deal.sellerId !== auth.userId || deal.status !== 'HELD') return jsonError('Teslim işaretlenemez', 403);
    return jsonOk(await setEscrowStatus(deal.id, 'DELIVERED', { deliveredAt: new Date() }));
  }
  if (parsed.data.action === 'confirm') {
    if (deal.buyerId !== auth.userId || deal.status !== 'DELIVERED') return jsonError('Onaylanamaz', 403);
    await db.listings.update(deal.listingId, { status: 'sold' });
    return jsonOk(await setEscrowStatus(deal.id, 'COMPLETED', { releasedAt: new Date() }));
  }
  if (parsed.data.action === 'dispute') {
    if (deal.buyerId !== auth.userId && deal.sellerId !== auth.userId) return jsonError('Yetkisiz', 403);
    return jsonOk(await setEscrowStatus(deal.id, 'DISPUTED'));
  }
  if (deal.buyerId !== auth.userId || deal.status !== 'AWAITING_PAYMENT') return jsonError('İptal edilemez', 403);
  return jsonOk(await setEscrowStatus(deal.id, 'CANCELED'));
}, 'PATCH /api/escrow');
