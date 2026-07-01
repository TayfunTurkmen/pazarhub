import { FilterState } from '@/types';

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
    if (Array.isArray(value)) return value[0];
    return value;
}

function parseNumber(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
}

function parseArray(value: string | string[] | undefined): string[] | undefined {
    const raw = first(value);
    if (!raw) return undefined;
    return raw.split(',').map(s => s.trim()).filter(Boolean);
}

export function parseFilterState(params: SearchParams): FilterState {
    return {
        query: first(params.query),
        listingId: first(params.listingId),
        sellerName: first(params.sellerName),
        category: first(params.category),
        minPrice: parseNumber(first(params.minPrice)),
        maxPrice: parseNumber(first(params.maxPrice)),
        city: first(params.city),
        district: first(params.district),
        neighborhood: first(params.neighborhood),
        street: first(params.street),
        listingType: first(params.listingType) as FilterState['listingType'],
        roomCount: parseArray(params.roomCount),
        minArea: parseNumber(first(params.minArea)),
        maxArea: parseNumber(first(params.maxArea)),
        floor: parseArray(params.floor),
        heating: first(params.heating),
        fuel: first(params.fuel),
        gear: first(params.gear),
        year: first(params.year),
        brand: first(params.brand),
        condition: first(params.condition),
        sort: first(params.sort) as FilterState['sort'],
        page: parseNumber(first(params.page)) ?? 1,
        limit: parseNumber(first(params.limit)) ?? 24,
        status: first(params.status) as FilterState['status'],
        adminAll: first(params.adminAll) === 'true',
    };
}

export function buildFilterQueryString(filter: FilterState, extra?: Record<string, string>): string {
    const params = new URLSearchParams();

    const entries: [keyof FilterState, string | number | string[] | undefined][] = [
        ['query', filter.query],
        ['listingId', filter.listingId],
        ['sellerName', filter.sellerName],
        ['category', filter.category],
        ['minPrice', filter.minPrice],
        ['maxPrice', filter.maxPrice],
        ['city', filter.city],
        ['district', filter.district],
        ['neighborhood', filter.neighborhood],
        ['street', filter.street],
        ['listingType', filter.listingType],
        ['minArea', filter.minArea],
        ['maxArea', filter.maxArea],
        ['heating', filter.heating],
        ['fuel', filter.fuel],
        ['gear', filter.gear],
        ['year', filter.year],
        ['brand', filter.brand],
        ['condition', filter.condition],
        ['sort', filter.sort],
        ['page', filter.page && filter.page > 1 ? filter.page : undefined],
    ];

    for (const [key, value] of entries) {
        if (value === undefined || value === '') continue;
        params.set(key, String(value));
    }

    if (filter.roomCount?.length) params.set('roomCount', filter.roomCount.join(','));
    if (filter.floor?.length) params.set('floor', filter.floor.join(','));

    if (extra) {
        for (const [key, value] of Object.entries(extra)) {
            if (value) params.set(key, value);
        }
    }

    const qs = params.toString();
    return qs ? `?${qs}` : '';
}
