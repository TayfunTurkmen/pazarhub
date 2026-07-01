import 'server-only';

import { isDatabaseEnabled } from '@/lib/env';
import { IDatabase } from './repository';
import { db as mockDb } from './mockDb';
import { createPrismaDb } from './prismaRepositories';

let prismaDb: IDatabase | null = null;

function getDb(): IDatabase {
    if (!isDatabaseEnabled()) {
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
