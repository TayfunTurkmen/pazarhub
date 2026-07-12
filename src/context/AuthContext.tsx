'use client';

import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';
import { RegisterInput, User } from '@/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}

export function useAuth() {
    const { data: session, status } = useSession();

    const user: User | null = session?.user
        ? {
              id: session.user.id,
              name: session.user.name ?? '',
              email: session.user.email ?? '',
              avatar: session.user.image ?? undefined,
              type: 'individual',
              role: session.user.role === 'admin' ? 'admin' : 'user',
          }
        : null;

    return {
        user,
        isAuthenticated: Boolean(session?.user),
        isLoading: status === 'loading',
        login: async (email: string, password: string) => {
            const result = await signIn('credentials', {
                email: email.toLowerCase(),
                password,
                redirect: false,
            });
            return !result?.error;
        },
        loginWithPhone: async (phone: string, code?: string, name?: string) => {
            const result = await signIn('phone', {
                phone,
                code: code ?? '',
                name: name ?? '',
                redirect: false,
            });
            return !result?.error;
        },
        signInWithGoogle: () => signIn('google', { callbackUrl: '/dashboard' }),
        signInWithFacebook: () => signIn('facebook', { callbackUrl: '/dashboard' }),
        logout: () => signOut({ redirect: false }),
        register: async (data: RegisterInput) => {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json() as { success: boolean };
            if (!res.ok || !json.success) {
                throw new Error('REGISTER_FAILED');
            }
            const result = await signIn('credentials', {
                email: data.email.toLowerCase(),
                password: data.password,
                redirect: false,
            });
            if (result?.error) throw new Error('REGISTER_LOGIN_FAILED');
        },
    };
}
