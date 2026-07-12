import { Link } from '@/i18n/navigation';
import { Listing } from '@/types';
import { MapPin, Maximize, Bed, Tag, Heart, BadgeCheck } from 'lucide-react';
import Image from 'next/image';

interface ListingCardProps {
  listing: Listing;
  badge?: 'showcase' | 'premium';
  showVerified?: boolean;
}

export default function ListingCard({ listing, badge, showVerified }: ListingCardProps) {
  const isVerified = showVerified && listing.seller?.verified === true;

  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="h-full overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-primary)]/20 hover:-translate-y-0.5 transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-elevated)]">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 280px"
          />

          {badge === 'showcase' && (
            <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
              VİTRİN
            </div>
          )}
          {badge === 'premium' && (
            <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
              PREMIUM
            </div>
          )}
          {!badge && listing.featured && (
            <div className="absolute top-2.5 left-2.5 bg-[var(--color-secondary)] text-blue-900 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
              Vitrin
            </div>
          )}

          {isVerified && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              <BadgeCheck size={11} />
              Doğrulanmış
            </div>
          )}

          {!isVerified && listing.listingType && (
            <div className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${listing.listingType === 'rent' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
              <Tag size={10} />
              {listing.listingType === 'rent' ? 'Kiralık' : 'Satılık'}
            </div>
          )}

          <button
            type="button"
            aria-label="Favorilere ekle"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white/90 dark:bg-black/50 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:text-rose-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <Heart size={15} />
          </button>
        </div>

        <div className="p-3.5 space-y-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] h-10 leading-5">
            {listing.title}
          </h3>

          <p className="text-base font-bold text-[var(--color-primary)]">
            {new Intl.NumberFormat('tr-TR').format(listing.price)} {listing.currency}
          </p>

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
            <div className="flex items-center gap-1 ml-auto">
              <MapPin size={13} />
              <span className="truncate max-w-[80px]">{listing.location.city}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
