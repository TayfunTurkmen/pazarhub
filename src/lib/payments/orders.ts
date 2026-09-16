import 'server-only';

import { isDatabaseEnabled } from '@/lib/env';
import { addDays, BOOSTS, ESCROW_FEE_RATE, type BoostCode, type PlanCode } from '@/lib/billing/plans';
import { activatePlan } from '@/lib/billing/store';

export type PaymentKind = 'SUBSCRIPTION' | 'DOPING' | 'SHOWCASE' | 'ESCROW';
export type PaymentProvider = 'PAYTR' | 'IYZICO' | 'DEMO';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface PaymentRecord {
  id: string;
  merchantOid: string;
  userId: string;
  provider: PaymentProvider;
  kind: PaymentKind;
  amount: number;
  status: PaymentStatus;
  listingId?: string;
  plan?: PlanCode;
  productCode?: string;
}

const g = globalThis as unknown as { skonutalOrders?: Map<string, PaymentRecord> };
if (!g.skonutalOrders) g.skonutalOrders = new Map();

export async function createPaymentOrder(data: Omit<PaymentRecord, 'id' | 'status'>): Promise<PaymentRecord> {
  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    const row = await prisma.paymentOrder.create({
      data: {
        merchantOid: data.merchantOid,
        userId: data.userId,
        provider: data.provider,
        kind: data.kind,
        amount: data.amount,
        listingId: data.listingId,
        plan: data.plan,
        productCode: data.productCode,
      },
    });
    return toRecord(row);
  }
  const rec: PaymentRecord = { ...data, id: data.merchantOid, status: 'PENDING' };
  g.skonutalOrders!.set(data.merchantOid, rec);
  return rec;
}

export async function getPaymentByOid(merchantOid: string): Promise<PaymentRecord | null> {
  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    const row = await prisma.paymentOrder.findUnique({ where: { merchantOid } });
    return row ? toRecord(row) : null;
  }
  return g.skonutalOrders!.get(merchantOid) ?? null;
}

export async function markPaid(merchantOid: string): Promise<PaymentRecord | null> {
  const order = await getPaymentByOid(merchantOid);
  if (!order || order.status === 'PAID') return order;
  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    const row = await prisma.paymentOrder.update({
      where: { merchantOid },
      data: { status: 'PAID', paidAt: new Date() },
    });
    await fulfill(toRecord(row));
    return toRecord(row);
  }
  const next = { ...order, status: 'PAID' as const };
  g.skonutalOrders!.set(merchantOid, next);
  await fulfill(next);
  return next;
}

async function fulfill(order: PaymentRecord) {
  if (order.kind === 'SUBSCRIPTION' && order.plan) {
    await activatePlan(order.userId, order.plan, addDays(new Date(), 30));
    return;
  }
  if ((order.kind === 'DOPING' || order.kind === 'SHOWCASE') && order.listingId && order.productCode) {
    const boost = BOOSTS[order.productCode as BoostCode];
    if (!boost) return;
    const { db } = await import('@/services/database');
    await db.listings.update(order.listingId, {
      tier: boost.tier,
      featured: boost.tier === 'showcase',
      boostEndsAt: addDays(new Date(), boost.days).toISOString(),
    });
    return;
  }
  if (order.kind === 'ESCROW') {
    const { holdEscrowByPayment } = await import('@/lib/escrow/store');
    await holdEscrowByPayment(order.id);
  }
}

function toRecord(row: {
  id: string;
  merchantOid: string;
  userId: string;
  provider: string;
  kind: string;
  amount: { toNumber?: () => number } | number;
  status: string;
  listingId?: string | null;
  plan?: string | null;
  productCode?: string | null;
}): PaymentRecord {
  return {
    id: row.id,
    merchantOid: row.merchantOid,
    userId: row.userId,
    provider: row.provider as PaymentProvider,
    kind: row.kind as PaymentKind,
    amount: typeof row.amount === 'number' ? row.amount : Number(row.amount.toNumber?.() ?? row.amount),
    status: row.status as PaymentStatus,
    listingId: row.listingId ?? undefined,
    plan: (row.plan as PlanCode | null) ?? undefined,
    productCode: row.productCode ?? undefined,
  };
}

export { ESCROW_FEE_RATE };
