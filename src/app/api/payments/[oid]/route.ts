import { jsonError, jsonOk, jsonRateLimited } from '@/lib/api-response';
import { requireAuth } from '@/lib/api-auth';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';
import { withApiHandler } from '@/lib/api-handler';
import { getPaymentByOid } from '@/lib/payments/orders';

export const GET = withApiHandler(async (request: Request, context) => {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;
  const limit = await rateLimit('read', getRateLimitIdentifier(request, auth.userId));
  if (!limit.success) return jsonRateLimited(limit.retryAfter);

  const { oid } = await context.params;
  const order = await getPaymentByOid(oid);
  if (!order || order.userId !== auth.userId) return jsonError('Sipariş bulunamadı', 404);
  return jsonOk(order);
}, 'GET /api/payments/[oid]');
