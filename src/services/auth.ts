import { User } from '@/types';
import { db } from './mockDb';

// Auth service now uses the DB abstraction layer
export const login = async (email: string, password: string): Promise<User | null> => {
    return db.users.authenticate(email, password);
};

export const register = async (data: { type: 'individual' | 'corporate'; email: string; name: string }): Promise<User> => {
    return db.users.create({
        name: data.name,
        email: data.email,
        type: data.type,
        verified: false,
    });
};

// Helper to get user by ID (for session reconstruction)
export const getUserById = async (id: string): Promise<User | null> => {
    return db.users.getById(id);
};
