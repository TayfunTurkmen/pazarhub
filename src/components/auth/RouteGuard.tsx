'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield } from 'lucide-react';

interface RouteGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
    redirectTo?: string;
}

export default function RouteGuard({
    children,
    requireAuth = false,
    requireAdmin = false,
    redirectTo = '/login',
}: RouteGuardProps) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const isAdmin = user?.role === 'admin';
    const isAuthorized = (!requireAuth || isAuthenticated) && (!requireAdmin || isAdmin);

    useEffect(() => {
        if (requireAuth && !isAuthenticated) {
            router.push(redirectTo);
            return;
        }
        if (requireAdmin && !isAdmin) {
            router.push('/');
        }
    }, [requireAuth, requireAdmin, isAuthenticated, isAdmin, router, redirectTo]);

    if (!isAuthorized) {
        if (requireAdmin && isAuthenticated) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                    <Shield size={48} className="text-rose-500 mb-4 opacity-60" />
                    <h2 className="text-xl font-bold text-[var(--color-foreground)]">Erişim Reddedildi</h2>
                    <p className="text-sm text-[var(--color-muted)] mt-2">Bu sayfaya erişmek için yönetici yetkisi gereklidir.</p>
                </div>
            );
        }
        return null;
    }

    return <>{children}</>;
}
