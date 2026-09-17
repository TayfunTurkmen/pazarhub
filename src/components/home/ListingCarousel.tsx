'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ListingCard from '@/components/listing/ListingCard';
import { Listing } from '@/types';

interface ListingCarouselProps {
  listings: Listing[];
  badge?: 'showcase' | 'premium';
}

export default function ListingCarousel({ listings, badge }: ListingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (listings.length === 0) return null;

  return (
    <div className="relative group/carousel w-full min-w-0 max-w-full">
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Önceki ilanlar"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-9 h-9 bg-white dark:bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-md flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden sm:flex"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-1 scrollbar-thin w-full min-w-0 max-w-full"
        style={{ scrollbarWidth: 'thin' }}
      >
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="snap-start shrink-0 w-[min(260px,75vw)] sm:w-[280px]"
          >
            <ListingCard listing={listing} badge={badge} showVerified />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Sonraki ilanlar"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-9 h-9 bg-white dark:bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-md flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden sm:flex"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
