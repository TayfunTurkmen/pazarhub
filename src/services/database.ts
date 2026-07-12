import 'server-only';

import { isDatabaseEnabled } from '@/lib/env';
import { IDatabase } from './repository';
import { db as mockDb } from './mockDb';
import { createPrismaDb } from './prismaRepositories';

let prismaDb: IDatabase | null = null;

function getDb(): IDatabase {
    if (!isDatabaseEnabled()) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('[database] DATABASE_URL is required in production');
        }
        return mockDb;
    }
    if (!prismaDb) {
        prismaDb = createPrismaDb();
    }
    return prismaDb;
}

export const db: IDatabase = new Proxy({} as IDatabase, {
    get(_target, prop: keyof IDatabase) {
        return getDb()[prop];
    },
});

export { isDatabaseEnabled };
