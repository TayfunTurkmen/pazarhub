import 'server-only';

import { User, RegisterInput } from '@/types';
import { db } from './database';

export const login = async (email: string, password: string): Promise<User | null> => {
    return db.users.authenticate(email, password);
};

export const register = async (data: RegisterInput): Promise<User> => {
    return db.users.register(data);
};

export const getUserById = async (id: string): Promise<User | null> => {
    return db.users.getById(id);
};
