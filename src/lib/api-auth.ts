import { auth } from '@/auth';
import { jsonError } from './api-response';
import { db } from '@/services/database';
import { isDatabaseEnabled } from '@/lib/env';
import type { Session } from 'next-auth';

type AuthSuccess = {
  session: Session;
  userId: string;
  role: string;
};

type AuthFailure = {
  error: ReturnType<typeof jsonError>;
};

export async function requireAuth(): Promise<AuthSuccess | AuthFailure> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: jsonError('Oturum gerekli', 401) };
  }

  if (isDatabaseEnabled()) {
    const user = await db.users.getById(session.user.id);
    if (!user || user.status === 'banned' || user.status === 'pending') {
      return { error: jsonError('Hesap aktif degil', 403) };
    }
    return { session, userId: session.user.id, role: user.role ?? 'user' };
  }

  return { session, userId: session.user.id, role: session.user.role ?? 'user' };
}

export async function requireAdmin(): Promise<AuthSuccess | AuthFailure> {
  const result = await requireAuth();
  if ('error' in result) return result;

  if (result.role?.toLowerCase() !== 'admin') {
    return { error: jsonError('Yonetici yetkisi gerekli', 403) };
  }
  return result;
}
