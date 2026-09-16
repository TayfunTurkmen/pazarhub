import { jsonOk, jsonRateLimited } from '@/lib/api-response';
import { requireAuth } from '@/lib/api-auth';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';
import { withApiHandler } from '@/lib/api-handler';
import { getEntitlements } from '@/lib/billing/store';
import { PLANS, BOOSTS } from '@/lib/billing/plans';

export const GET = withApiHandler(async (request: Request) => {
  const limit = await rateLimit('read', getRateLimitIdentifier(request));
  if (!limit.success) return jsonRateLimited(limit.retryAfter);

  const auth = await requireAuth();
  if ('error' in auth) return auth.error;

  const entitlements = await getEntitlements(auth.userId);
  return jsonOk({ entitlements, plans: PLANS, boosts: BOOSTS });
}, 'GET /api/billing/me');
