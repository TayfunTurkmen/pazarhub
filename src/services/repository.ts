import { Listing, Category, User, FilterState } from '@/types';

// ============================================================
// Repository Interfaces — Swap implementations for real DB
// ============================================================

export interface IListingRepository {
    getAll(filter?: FilterState): Promise<Listing[]>;
    getFeatured(): Promise<Listing[]>;
    getById(id: string): Promise<Listing | null>;
    getByUserId(userId: string): Promise<Listing[]>;
    create(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing>;
    update(id: string, data: Partial<Listing>): Promise<Listing | null>;
    delete(id: string): Promise<boolean>;
    count(filter?: FilterState): Promise<number>;
}

export interface IUserRepository {
    getById(id: string): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    create(user: Omit<User, 'id'>): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User | null>;
    authenticate(email: string, password: string): Promise<User | null>;
}

export interface ICategoryRepository {
    getAll(): Promise<Category[]>;
    getById(id: string): Promise<Category | null>;
    getBySlug(slug: string): Promise<Category | null>;
    getChildren(parentId: string): Promise<Category[]>;
    getRoots(): Promise<Category[]>;
}

// ============================================================
// Database Interface — Single entry point
// ============================================================

export interface IDatabase {
    listings: IListingRepository;
    users: IUserRepository;
    categories: ICategoryRepository;
}
