import 'server-only';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { isDatabaseEnabled } from '@/lib/env';
import { db } from '@/services/database';

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
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
                    if (!user?.passwordHash || user.status === 'BANNED') return null;
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
                if (!user) return null;
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.avatar ?? null,
                    role: user.role ?? 'user',
                };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role ?? 'user';
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = (token.role as string) ?? 'user';
            }
            return session;
        },
    },
});