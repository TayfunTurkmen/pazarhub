import type { Listing } from '@/types';

export interface RecommendationCriteria {
  query?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  roomCount?: string;
  listingType?: 'sale' | 'rent';
  budget?: number;
  preferences?: string;
}

export interface ScoredListing {
  listing: Listing;
  score: number;
  reasons: string[];
}

function scoreListing(listing: Listing, criteria: RecommendationCriteria): ScoredListing {
  let score = 50;
  const reasons: string[] = [];

  if (criteria.city && listing.location.city.toLowerCase().includes(criteria.city.toLowerCase())) {
    score += 15;
    reasons.push(`${listing.location.city} bölgesinde`);
  }

  if (criteria.listingType && listing.listingType === criteria.listingType) {
    score += 10;
    reasons.push(criteria.listingType === 'sale' ? 'Satılık ilan' : 'Kiralık ilan');
  }

  if (criteria.roomCount && listing.roomCount === criteria.roomCount) {
    score += 12;
    reasons.push(`${criteria.roomCount} oda`);
  }

  const budget = criteria.budget ?? criteria.maxPrice;
  if (budget && listing.price <= budget) {
    score += 15;
    reasons.push('Bütçenize uygun');
  } else if (budget && listing.price <= budget * 1.1) {
    score += 8;
    reasons.push('Bütçenize yakın fiyat');
  }

  if (criteria.minPrice && listing.price >= criteria.minPrice) score += 5;
  if (criteria.maxPrice && listing.price <= criteria.maxPrice) score += 5;

  const q = (criteria.query ?? criteria.preferences ?? '').toLowerCase();
  if (q) {
    const haystack = `${listing.title} ${listing.description} ${listing.location.district}`.toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    const matches = tokens.filter((t) => haystack.includes(t)).length;
    if (matches > 0) {
      score += Math.min(20, matches * 5);
      reasons.push('Arama kriterlerinizle eşleşiyor');
    }
  }

  if (listing.tier === 'showcase') {
    score += 8;
    reasons.push('Öne çıkan ilan');
  } else if (listing.tier === 'premium') {
    score += 5;
  }

  if (listing.seller.verified) {
    score += 5;
    reasons.push('Doğrulanmış satıcı');
  }

  if (listing.netArea && listing.netArea >= 80) {
    score += 3;
  }

  return { listing, score: Math.min(100, score), reasons: reasons.slice(0, 3) };
}

export function recommendListings(
  listings: Listing[],
  criteria: RecommendationCriteria,
  limit = 6,
): ScoredListing[] {
  return listings
    .filter((l) => l.status === 'active')
    .map((listing) => scoreListing(listing, criteria))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
