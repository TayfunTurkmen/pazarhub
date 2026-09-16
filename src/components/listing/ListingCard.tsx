'use client';

import { Link } from '@/i18n/navigation';
import { Listing } from '@/types';
import { MapPin, Maximize, Bed, Heart, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import { formatPerM2, formatTry } from '@/lib/format';

interface ListingCardProps {
  listing: Listing;
  badge?: 'showcase' | 'premium';
  showVerified?: boolean;
}

export default function ListingCard({ listing, badge, showVerified }: ListingCardProps) {
  const resolvedBadge = badge ?? (listing.tier === 'showcase' || listing.featured ? 'showcase' : listing.tier === 'premium' ? 'premium' : undefined);
  const isVerified = showVerified && listing.seller?.verified === true;
  const perM2 = formatPerM2(listing.price, listing.netArea);
  const locationLabel = [listing.location.district, listing.location.city].filter(Boolean).join(', ');

  return (
    <Link href={`/listing/${listing.id}`} className="block group h-full">
      <article className="h-full overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-elevated)]">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 280px"
          />

          {resolvedBadge === 'showcase' && (
            <div className="absolute top-2.5 left-2.5 bg-[var(--color-brand-yellow)] text-[var(--color-ink)] text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
              Vitrin
            </div>
          )}
          {resolvedBadge === 'premium' && (
            <div className="absolute top-2.5 left-2.5 bg-[var(--color-navy)] text-[var(--color-brand-yellow)] text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
              Premium
            </div>
          )}

          {listing.listingType && (
            <div className="absolute bottom-2.5 left-2.5 bg-white/95 text-[var(--color-ink)] text-[10px] font-extrabold px-2 py-1 rounded-md">
              {listing.listingType === 'rent' ? 'Kiralık' : 'Satılık'}
            </div>
          )}

          {isVerified && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              <BadgeCheck size={11} />
              Doğrulanmış
            </div>
          )}

          <button
            type="button"
            aria-label="Favorilere ekle"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white/90 dark:bg-black/50 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:text-rose-500 hover:bg-white opacity-0 group-hover:opacity-100"
          >
            <Heart size={15} />
          </button>
        </div>

        <div className="p-3.5 space-y-2">
          <p className="text-lg font-black text-[var(--color-navy)] dark:text-[var(--color-brand-yellow)]">
            {formatTry(listing.price)}
          </p>
          {perM2 && <p className="text-[11px] text-[var(--color-muted)] -mt-1">{perM2}</p>}

          <h3 className="line-clamp-2 text-sm font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] min-h-10 leading-5">
            {listing.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] pt-2 border-t border-[var(--color-border)]">
            {listing.roomCount && (
              <div className="flex items-center gap-1">
                <Bed size={13} />
                <span>{listing.roomCount}</span>
              </div>
            )}
            {listing.netArea && (
              <div className="flex items-center gap-1">
                <Maximize size={13} />
                <span>{listing.netArea} m²</span>
              </div>
            )}
            <div className="flex items-center gap-1 ml-auto min-w-0">
              <MapPin size={13} className="shrink-0" />
              <span className="truncate">{locationLabel}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
