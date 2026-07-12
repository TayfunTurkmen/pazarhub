import { Listing, Category, User, FilterState, PaginatedResult, RegisterInput, Conversation, Message } from '@/types';

// ============================================================
// Repository Interfaces — Swap implementations for real DB
// ============================================================

export interface IListingRepository {
    getAll(filter?: FilterState): Promise<Listing[]>;
    getPaginated(filter?: FilterState): Promise<PaginatedResult<Listing>>;
    getFeatured(): Promise<Listing[]>;
    getById(id: string): Promise<Listing | null>;
    getByUserId(userId: string): Promise<Listing[]>;
    create(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing>;
    update(id: string, data: Partial<Listing>): Promise<Listing | null>;
    delete(id: string): Promise<boolean>;
    count(filter?: FilterState): Promise<number>;
}

export interface IUserRepository {
    getAll(): Promise<User[]>;
    getById(id: string): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    getByPhone(phone: string): Promise<User | null>;
    create(user: Omit<User, 'id'>): Promise<User>;
    register(input: RegisterInput): Promise<User>;
    registerByPhone(phone: string, name?: string): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User | null>;
    authenticate(email: string, password: string): Promise<User | null>;
    getListingCount(userId: string): Promise<number>;
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
    favorites: IFavoriteRepository;
    messages: IMessageRepository;
}

export interface IFavoriteRepository {
    getByUserId(userId: string): Promise<Listing[]>;
    isFavorite(userId: string, listingId: string): Promise<boolean>;
    add(userId: string, listingId: string): Promise<void>;
    remove(userId: string, listingId: string): Promise<void>;
}

export interface IMessageRepository {
    getConversationsForUser(userId: string): Promise<Conversation[]>;
    getMessages(conversationId: string, userId: string): Promise<Message[]>;
    sendMessage(conversationId: string, senderId: string, body: string): Promise<Message>;
    startConversation(listingId: string, buyerId: string, body: string): Promise<Conversation>;
}
