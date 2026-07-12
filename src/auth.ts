import 'server-only';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import { isDatabaseEnabled } from '@/lib/env';
import { getAuthSettings } from '@/lib/auth-settings';
import { ensureOAuthUser, resolvePhoneUser } from '@/lib/oauth-user';
import { db } from '@/services/database';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const oauthProviders = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    oauthProviders.push(
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
    );
}

if (process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET) {
    oauthProviders.push(
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
    );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE },
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            id: 'credentials',
        name: 'credentials',
        credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
            const email = String(credentials?.email ?? '').toLowerCase().trim();
            const password = String(credentials?.password ?? '');
            if (!email || !password) return null;

            if (isDatabaseEnabled()) {
                const { prisma } = await import('@/lib/prisma');
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user?.passwordHash || user.status !== 'ACTIVE') return null;
                const valid = await bcrypt.compare(password, user.passwordHash);
                if (!valid) return null;
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role.toLowerCase(),
                };
            }

            const user = await db.users.authenticate(email, password);
            if (!user || user.status === 'pending' || user.status === 'banned') return null;
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.avatar ?? null,
                role: user.role ?? 'user',
            };
        },
    }),
    Credentials({
        id: 'phone',
        name: 'phone',
        credentials: {
            phone: { label: 'Phone', type: 'text' },
            code: { label: 'Code', type: 'text' },
            name: { label: 'Name', type: 'text' },
        },
        async authorize(credentials) {
            const phone = String(credentials?.phone ?? '');
            const code = String(credentials?.code ?? '').trim();
            const name = String(credentials?.name ?? '').trim();
            return resolvePhoneUser(phone, code, name || undefined);
        },
    }),
        ...oauthProviders,
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (!account || account.provider === 'credentials' || account.provider === 'phone') {
                return true;
            }

            const settings = await getAuthSettings();
            if (account.provider === 'google' && !settings.googleAuthEnabled) return false;
            if (account.provider === 'facebook' && !settings.facebookAuthEnabled) return false;

            try {
                const dbUser = await ensureOAuthUser(user);
                user.id = dbUser.id;
                (user as { role?: string }).role = dbUser.role;
                return true;
            } catch {
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role ?? 'user';
            }
            if (token.id && isDatabaseEnabled()) {
                const fresh = await db.users.getById(token.id as string);
                if (!fresh || fresh.status === 'banned' || fresh.status === 'pending') {
                    return { ...token, role: 'revoked' };
                }
                token.role = fresh.role ?? 'user';
            }
            return token;
        },
        session({ session, token }) {
            if (token.role === 'revoked') {
                return { ...session, user: undefined };
            }
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = (token.role as string) ?? 'user';
            }
            return session;
        },
    },
});
