import 'server-only';

import { isDatabaseEnabled } from '@/lib/env';
import { ESCROW_FEE_RATE } from '@/lib/billing/plans';

export type EscrowStatus = 'AWAITING_PAYMENT' | 'HELD' | 'DELIVERED' | 'COMPLETED' | 'DISPUTED' | 'REFUNDED' | 'CANCELED';

export interface EscrowRecord {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  fee: number;
  status: EscrowStatus;
  paymentOrderId: string;
}

const g = globalThis as unknown as { skonutalEscrow?: Map<string, EscrowRecord> };
if (!g.skonutalEscrow) g.skonutalEscrow = new Map();

export function calcFee(amount: number): number {
  return Math.round(amount * ESCROW_FEE_RATE * 100) / 100;
}

export async function createEscrow(input: Omit<EscrowRecord, 'id' | 'status'>): Promise<EscrowRecord> {
  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    const row = await prisma.escrowDeal.create({
      data: {
        listingId: input.listingId,
        buyerId: input.buyerId,
        sellerId: input.sellerId,
        amount: input.amount,
        fee: input.fee,
        paymentOrderId: input.paymentOrderId,
        status: 'AWAITING_PAYMENT',
      },
    });
    return mapEscrow(row);
  }
  const rec: EscrowRecord = { ...input, id: input.paymentOrderId, status: 'AWAITING_PAYMENT' };
  g.skonutalEscrow!.set(rec.id, rec);
  return rec;
}

export async function holdEscrowByPayment(paymentOrderId: string): Promise<void> {
  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    await prisma.escrowDeal.updateMany({
      where: { paymentOrderId, status: 'AWAITING_PAYMENT' },
      data: { status: 'HELD' },
    });
    return;
  }
  const rec = [...g.skonutalEscrow!.values()].find((e) => e.paymentOrderId === paymentOrderId);
  if (rec) {
    rec.status = 'HELD';
    g.skonutalEscrow!.set(rec.id, rec);
  }
}

export async function getEscrow(id: string): Promise<EscrowRecord | null> {
  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    const row = await prisma.escrowDeal.findUnique({ where: { id } });
    return row ? mapEscrow(row) : null;
  }
  return g.skonutalEscrow!.get(id) ?? null;
}

export async function listEscrowsForUser(userId: string): Promise<EscrowRecord[]> {
  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    const rows = await prisma.escrowDeal.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(mapEscrow);
  }
  return [...g.skonutalEscrow!.values()].filter((e) => e.buyerId === userId || e.sellerId === userId);
}

export async function setEscrowStatus(id: string, status: EscrowStatus, extra?: { deliveredAt?: Date; releasedAt?: Date }): Promise<EscrowRecord | null> {
  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    const row = await prisma.escrowDeal.update({
      where: { id },
      data: { status, deliveredAt: extra?.deliveredAt, releasedAt: extra?.releasedAt },
    });
    return mapEscrow(row);
  }
  const rec = g.skonutalEscrow!.get(id);
  if (!rec) return null;
  rec.status = status;
  g.skonutalEscrow!.set(id, rec);
  return rec;
}

function mapEscrow(row: {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: { toNumber?: () => number } | number;
  fee: { toNumber?: () => number } | number;
  status: string;
  paymentOrderId: string;
}): EscrowRecord {
  return {
    id: row.id,
    listingId: row.listingId,
    buyerId: row.buyerId,
    sellerId: row.sellerId,
    amount: typeof row.amount === 'number' ? row.amount : Number(row.amount.toNumber?.() ?? row.amount),
    fee: typeof row.fee === 'number' ? row.fee : Number(row.fee.toNumber?.() ?? row.fee),
    status: row.status as EscrowStatus,
    paymentOrderId: row.paymentOrderId,
  };
}
