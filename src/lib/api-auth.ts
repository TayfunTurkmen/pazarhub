import { auth } from '@/auth';
import { jsonError } from './api-response';

export async function requireAuth() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: jsonError('Oturum gerekli', 401) } as const;
    }
    return { session, userId: session.user.id, role: session.user.role } as const;
}

export async function requireAdmin() {
    const result = await requireAuth();
    if ('error' in result) return result;
    if (result.role !== 'admin') {
        return { error: jsonError('Yonetici yetkisi gerekli', 403) } as const;
    }
    return result;
}
