import { jsonError, jsonOk, jsonRateLimited } from '@/lib/api-response';
import { requireAuth } from '@/lib/api-auth';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { z } from 'zod';
import { getPaymentByOid, markPaid } from '@/lib/payments/orders';

const schema = z.object({ merchantOid: z.string().min(6).max(64) });

export const POST = withApiHandler(async (request: Request) => {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;
  const limit = await rateLimit('listing', getRateLimitIdentifier(request, auth.userId));
  if (!limit.success) return jsonRateLimited(limit.retryAfter);

  const parsed = await parseValidatedBody(request, schema);
  if ('error' in parsed) return parsed.error;

  const order = await getPaymentByOid(parsed.data.merchantOid);
  if (!order || order.userId !== auth.userId) return jsonError('Sipariş bulunamadı', 404);
  if (order.provider !== 'DEMO') return jsonError('Bu sipariş demo değil', 422);

  const paid = await markPaid(order.merchantOid);
  return jsonOk(paid);
}, 'POST /api/payments/demo/confirm');
