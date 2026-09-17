export type Currency = 'TL' | 'USD' | 'EUR' | 'GBP';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    type: 'individual' | 'corporate';
    role?: 'user' | 'admin';
    storeName?: string;
    verified?: boolean;
    status?: 'active' | 'banned' | 'pending';
    joinedAt?: string;
}

export interface RegisterInput {
    type: 'individual' | 'corporate';
    email: string;
    name: string;
    password: string;
    phone?: string;
    storeName?: string;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string; // e.g., 'emlak-konut-satilik'
    parentId?: string;
    icon?: string; // Icon name from lucide
}

export interface Location {
    city: string;
    district: string;
    neighborhood?: string;
    street?: string;
    lat?: number;
    lng?: number;
}

export interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: Currency;
    category: Category;
    location: Location;
    images: string[];
    attributes: Record<string, string | number | boolean>;
    seller: User;
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'passive' | 'sold' | 'pending' | 'rejected';
    featured: boolean;
    listingType?: 'sale' | 'rent';
    tier?: 'standard' | 'premium' | 'showcase'; // doping tier
    // Real Estate Specific
    roomCount?: string; // e.g., '1+1', '2+1'
    netArea?: number; // m2
    floor?: number; // 0 for ground, etc.
    heating?: string; // 'Gas', 'Central'
    expiresAt?: string;
    boostEndsAt?: string;
}

// Filter Options
export interface FilterState {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    district?: string;
    neighborhood?: string;
    street?: string;
    query?: string;
    listingId?: string;
    sellerName?: string;
    listingType?: 'sale' | 'rent';
    roomCount?: string[];
    minArea?: number;
    maxArea?: number;
    floor?: string[];
    heating?: string;
    fuel?: string;
    gear?: string;
    year?: string;
    brand?: string;
    condition?: string;
    sort?: 'newest' | 'price_asc' | 'price_desc';
    tier?: 'standard' | 'premium' | 'showcase';
    page?: number;
    limit?: number;
    status?: Listing['status'];
    sellerType?: 'individual' | 'corporate';
    adminAll?: boolean;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    body: string;
    readAt?: string;
    createdAt: string;
}

export interface Conversation {
    id: string;
    listingId: string;
    listingTitle: string;
    otherUserName: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unread: boolean;
}
