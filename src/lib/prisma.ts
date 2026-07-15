import 'server-only';

import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pool: Pool | undefined;
};

function resolveDatabaseUrl(): string {
    return (
        process.env.DATABASE_URL ??
        process.env.POSTGRES_PRISMA_URL ??
        process.env.POSTGRES_URL ??
        ''
    );
}

function createPrismaClient(): PrismaClient {
    const databaseUrl = resolveDatabaseUrl();
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is required when using Prisma');
    }

    const pool = globalForPrisma.pool ?? new Pool({
        connectionString: databaseUrl,
        max: process.env.NODE_ENV === 'production' ? 1 : 10,
    });
    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.pool = pool;
    }

    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter });
    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = client;
    }
    return client;
}

function getPrismaClient(): PrismaClient {
    return globalForPrisma.prisma ?? createPrismaClient();
}

export const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop, receiver) {
        const client = getPrismaClient();
        const value = Reflect.get(client, prop, receiver);
        return typeof value === 'function' ? value.bind(client) : value;
    },
});

export function isDatabaseEnabled(): boolean {
    return Boolean(resolveDatabaseUrl());
}
