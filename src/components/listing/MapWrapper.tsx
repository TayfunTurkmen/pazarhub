'use client';

import dynamic from 'next/dynamic';
import { Listing } from '@/types';

// MapComponent'i client-side modunda güvenli bir şekilde yüklemek için Wrapper
const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => <div className="w-full h-[min(55dvh,480px)] min-h-[240px] sm:min-h-[320px] bg-[var(--color-surface)] animate-pulse rounded-2xl border border-[var(--color-border)]"></div>
});

interface MapWrapperProps {
    listings: Listing[];
}

export default function MapWrapper({ listings }: MapWrapperProps) {
    return <MapComponent listings={listings} />;
}
