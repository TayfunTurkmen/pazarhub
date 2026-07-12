import 'server-only';

import { isDatabaseEnabled } from '@/lib/env';
import { phoneToEmail } from '@/lib/phone';
import { db } from '@/services/database';

export async function ensureOAuthUser(profile: {
  email?: string | null;
  name?: string | null;
  image?: string | null;
}): Promise<{ id: string; role: string }> {
  const email = profile.email?.toLowerCase().trim();
  if (!email) throw new Error('NO_EMAIL');

  if (isDatabaseEnabled()) {
    const { prisma } = await import('@/lib/prisma');
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: profile.name ?? email.split('@')[0],
          image: profile.image,
          status: 'ACTIVE',
          verified: true,
        },
      });
    }
    return { id: user.id, role: user.role.toLowerCase() };
  }

  const existing = await db.users.getByEmail(email);
  if (existing) return { id: existing.id, role: existing.role ?? 'user' };

  const created = await db.users.create({
    name: profile.name ?? email,
    email,
    type: 'individual',
    avatar: profile.image ?? undefined,
    verified: true,
    status: 'active',
    role: 'user',
  });
  return { id: created.id, role: created.role ?? 'user' };
}

export async function resolvePhoneUser(
  phone: string,
  code: string,
  name?: string,
): Promise<{ id: string; email: string; name: string; image: string | null; role: string } | null> {
  const { normalizePhone, isValidTurkishMobile } = await import('@/lib/phone');
  const { getAuthSettings } = await import('@/lib/auth-settings');
  const { ADMIN_PHONE, ADMIN_SMS_CODE } = await import('@/lib/auth-constants');

  const normalized = normalizePhone(phone);
  if (!isValidTurkishMobile(normalized)) return null;

  const settings = await getAuthSettings();

  if (normalized === normalizePhone(ADMIN_PHONE) && code === ADMIN_SMS_CODE) {
    let user = await db.users.getByPhone(normalized);
    if (!user) {
      user = await db.users.registerByPhone(normalized, 'Admin Yönetici');
      await db.users.update(user.id, { role: 'admin', status: 'active', verified: true });
      user = (await db.users.getById(user.id))!;
    }
    if (user.status === 'banned') return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.avatar ?? null,
      role: user.role ?? 'user',
    };
  }

  if (settings.smsVerificationEnabled) {
    if (!code) return null;
    return null;
  }

  let user = await db.users.getByPhone(normalized);
  if (!user) {
    user = await db.users.registerByPhone(normalized, name?.trim() || undefined);
  }
  if (user.status === 'pending' || user.status === 'banned') return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.avatar ?? null,
    role: user.role ?? 'user',
  };
}

export { phoneToEmail };
