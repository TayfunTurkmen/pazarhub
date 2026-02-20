export type Currency = 'TL' | 'USD' | 'EUR' | 'GBP';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    type: 'individual' | 'corporate';
    role?: 'user' | 'admin';
    storeName?: string; // If corporate
    verified?: boolean;
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
    status: 'active' | 'passive' | 'sold';
    featured: boolean;
    listingType?: 'sale' | 'rent';
    tier?: 'standard' | 'premium' | 'showcase'; // doping tier
    // Real Estate Specific
    roomCount?: string; // e.g., '1+1', '2+1'
    netArea?: number; // m2
    floor?: number; // 0 for ground, etc.
    heating?: string; // 'Gas', 'Central'
}

// Filter Options
export interface FilterState {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    query?: string;
    listingId?: string;
    sellerName?: string;
    listingType?: 'sale' | 'rent';
    roomCount?: string[];
    minArea?: number;
    maxArea?: number;
    floor?: string[];
    heating?: string;
    sort?: 'newest' | 'price_asc' | 'price_desc';
}
