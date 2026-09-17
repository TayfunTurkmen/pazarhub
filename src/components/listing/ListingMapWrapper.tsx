'use client';

import dynamic from 'next/dynamic';

const ListingMap = dynamic(() => import('./ListingMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] sm:h-[360px] bg-[var(--color-surface)] animate-pulse rounded-2xl border border-[var(--color-border)]" />
  ),
});

export default function ListingMapWrapper(props: { lat: number; lng: number; title?: string }) {
  return <ListingMap {...props} />;
}
