import { jsonError, jsonOk, jsonRateLimited } from '@/lib/api-response';
import { requireAuth } from '@/lib/api-auth';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { z } from 'zod';
import { BOOSTS, getPlan, type BoostCode, type PlanCode } from '@/lib/billing/plans';
import { merchantOid, originFromRequest } from '@/lib/payments/crypto';
import { createPaymentOrder } from '@/lib/payments/orders';
import { isPaytrConfigured, createPaytrToken } from '@/lib/payments/paytr';
import { isIyzicoConfigured, createIyzicoCheckout } from '@/lib/payments/iyzico';
import { calcFee, createEscrow } from '@/lib/escrow/store';
import { db } from '@/services/database';

const schema = z.object({
  kind: z.enum(['SUBSCRIPTION', 'DOPING', 'SHOWCASE', 'ESCROW']),
  provider: z.enum(['PAYTR', 'IYZICO', 'DEMO']).optional(),
  plan: z.enum(['CORPORATE_STARTER', 'CORPORATE_PRO', 'CORPORATE_AGENCY']).optional(),
  productCode: z.enum(['DOPING_7', 'DOPING_15', 'SHOWCASE_7', 'SHOWCASE_30']).optional(),
  listingId: z.string().min(1).max(64).optional(),
});

function pickProvider(requested?: 'PAYTR' | 'IYZICO' | 'DEMO'): 'PAYTR' | 'IYZICO' | 'DEMO' {
  if (requested === 'DEMO') return 'DEMO';
  if (requested === 'PAYTR' && isPaytrConfigured()) return 'PAYTR';
  if (requested === 'IYZICO' && isIyzicoConfigured()) return 'IYZICO';
  if (isPaytrConfigured()) return 'PAYTR';
  if (isIyzicoConfigured()) return 'IYZICO';
  return 'DEMO';
}

export const POST = withApiHandler(async (request: Request) => {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;
  const limit = await rateLimit('listing', getRateLimitIdentifier(request, auth.userId));
  if (!limit.success) return jsonRateLimited(limit.retryAfter);

  const parsed = await parseValidatedBody(request, schema);
  if ('error' in parsed) return parsed.error;
  const body = parsed.data;
  const user = await db.users.getById(auth.userId);
  if (!user) return jsonError('Kullanıcı bulunamadı', 401);

  let amount = 0;
  let basket = 'skonutal.com';
  let plan: PlanCode | undefined;
  let productCode: string | undefined;

  if (body.kind === 'SUBSCRIPTION') {
    if (!body.plan) return jsonError('Plan seçin', 422);
    const selected = getPlan(body.plan);
    amount = selected.monthlyPrice;
    basket = `${selected.name} aylık üyelik`;
    plan = selected.code;
  } else if (body.kind === 'DOPING' || body.kind === 'SHOWCASE') {
    if (!body.listingId || !body.productCode) return jsonError('İlan ve paket gerekli', 422);
    const listing = await db.listings.getById(body.listingId);
    if (!listing || listing.seller.id !== auth.userId) return jsonError('İlan size ait değil', 403);
    const boost = BOOSTS[body.productCode as BoostCode];
    if (!boost || (body.kind === 'SHOWCASE' && boost.tier !== 'showcase') || (body.kind === 'DOPING' && boost.tier !== 'premium')) {
      return jsonError('Geçersiz paket', 422);
    }
    amount = boost.price;
    basket = `${boost.name} — ${listing.title}`;
    productCode = body.productCode;
  } else {
    if (!body.listingId) return jsonError('İlan gerekli', 422);
    const listing = await db.listings.getById(body.listingId);
    if (!listing) return jsonError('İlan bulunamadı', 404);
    if (listing.seller.id === auth.userId) return jsonError('Kendi ilanınız için Param Güvende açılamaz', 422);
    amount = listing.price;
    basket = `Param Güvende — ${listing.title}`;
  }

  const provider = pickProvider(body.provider);
  const oid = merchantOid();
  const order = await createPaymentOrder({
    merchantOid: oid,
    userId: auth.userId,
    provider,
    kind: body.kind,
    amount,
    listingId: body.listingId,
    plan,
    productCode,
  });

  if (body.kind === 'ESCROW' && body.listingId) {
    const listing = await db.listings.getById(body.listingId);
    if (listing) {
      await createEscrow({
        listingId: listing.id,
        buyerId: auth.userId,
        sellerId: listing.seller.id,
        amount,
        fee: calcFee(amount),
        paymentOrderId: order.id,
      });
    }
  }

  const origin = originFromRequest(request);
  const okUrl = `${origin}/odeme?status=ok&oid=${oid}`;
  const failUrl = `${origin}/odeme?status=fail&oid=${oid}`;

  if (provider === 'PAYTR') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const session = await createPaytrToken({
      merchantOid: oid,
      email: user.email,
      amountKurus: Math.round(amount * 100),
      userIp: ip,
      userName: user.name,
      basketName: basket,
      okUrl,
      failUrl,
      callbackUrl: `${origin}/api/payments/paytr/callback`,
    });
    return jsonOk({ orderId: oid, provider, iframeUrl: session.iframeUrl, amount, basket });
  }

  if (provider === 'IYZICO') {
    const session = await createIyzicoCheckout({
      merchantOid: oid,
      price: amount,
      email: user.email,
      name: user.name,
      callbackUrl: `${origin}/api/payments/iyzico/callback`,
      basketName: basket,
    });
    return jsonOk({
      orderId: oid,
      provider,
      checkoutFormContent: session.checkoutFormContent,
      paymentPageUrl: session.paymentPageUrl,
      amount,
      basket,
    });
  }

  return jsonOk({
    orderId: oid,
    provider: 'DEMO',
    demoUrl: `/odeme?oid=${oid}&demo=1`,
    amount,
    basket,
  });
}, 'POST /api/payments/checkout');
