import { Link } from '@/i18n/navigation';
import { Listing } from '@/types';
import { MapPin, Maximize, Bed, Tag } from 'lucide-react';
import Image from 'next/image';

interface ListingCardProps {
    listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
    return (
        <Link href={`/listing/${listing.id}`} className="block group animate-fade-in">
            <div className="h-full overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:shadow-xl hover:border-[var(--color-primary)]/20 hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-elevated)]">
                    <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {listing.featured && (
                        <div className="absolute top-2.5 left-2.5 bg-[var(--color-secondary)] text-gray-900 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm uppercase tracking-wider">
                            Vitrin
                        </div>
                    )}
                    {listing.listingType && (
                        <div className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 ${listing.listingType === 'rent' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                            <Tag size={10} />
                            {listing.listingType === 'rent' ? 'Kiralık' : 'Satılık'}
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs font-medium truncate">{listing.location.district}{listing.location.neighborhood ? ` / ${listing.location.neighborhood}` : ''}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-3.5 space-y-2.5">
                    <h3 className="line-clamp-2 text-sm font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] h-10 leading-5 transition-colors">
                        {listing.title}
                    </h3>

                    <p className="text-base font-bold text-[var(--color-primary)]">
                        {new Intl.NumberFormat('tr-TR').format(listing.price)} {listing.currency}
                    </p>

                    {/* Attributes */}
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
