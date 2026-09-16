import 'server-only';

import { isDatabaseEnabled } from '@/lib/env';
import { PLANS, getPlan, type Plan, type PlanCode } from './plans';

export interface Entitlements {
  plan: Plan;
  periodEnd: string;
  usedListings: number;
  remainingListings: number;
  canPost: boolean;
}

type MemorySub = { userId: string; plan: PlanCode; periodEnd: Date };

const g = globalThis as unknown as { skonutalSubs?: Map<string, MemorySub> };
if (!g.skonutalSubs) g.skonutalSubs = new Map();

export async function getActivePlan(userId: string): Promise<{ code: PlanCode; periodEnd: Date }> {
  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE', currentPeriodEnd: { gt: new Date() } },
      orderBy: { currentPeriodEnd: 'desc' },
    });
    if (sub) return { code: sub.plan as PlanCode, periodEnd: sub.currentPeriodEnd };
  } else {
    const sub = g.skonutalSubs!.get(userId);
    if (sub && sub.periodEnd > new Date()) return { code: sub.plan, periodEnd: sub.periodEnd };
  }
  return { code: 'FREE', periodEnd: new Date(Date.now() + 30 * 86400000) };
}

export async function activatePlan(userId: string, plan: PlanCode, periodEnd: Date): Promise<void> {
  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    await prisma.subscription.updateMany({ where: { userId, status: 'ACTIVE' }, data: { status: 'CANCELED' } });
    await prisma.subscription.create({
      data: { userId, plan, status: 'ACTIVE', currentPeriodEnd: periodEnd },
    });
    if (plan !== 'FREE') {
      await prisma.user.update({ where: { id: userId }, data: { type: 'CORPORATE', verified: true } });
    }
    return;
  }
  g.skonutalSubs!.set(userId, { userId, plan, periodEnd });
}

export async function getEntitlements(userId: string): Promise<Entitlements> {
  const { db } = await import('@/services/database');
  const { code, periodEnd } = await getActivePlan(userId);
  const plan = getPlan(code);
  const listings = await db.listings.getByUserId(userId);
  const usedListings = listings.filter((l) => {
    const live = l.status === 'active' || l.status === 'pending';
    const unexpired = !l.expiresAt || new Date(l.expiresAt) > new Date();
    return live && unexpired;
  }).length;
  const remainingListings = Math.max(0, plan.listingQuota - usedListings);
  return {
    plan,
    periodEnd: periodEnd.toISOString(),
    usedListings,
    remainingListings,
    canPost: remainingListings > 0,
  };
}

export { PLANS };
