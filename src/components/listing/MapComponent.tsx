'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Listing } from '@/types';
import L from 'leaflet';
import { useTheme } from 'next-themes';
import { Link } from '@/i18n/navigation';


// A custom map icon using HTML/CSS for better styling
const createCustomIcon = (price: number, currency: string) => {
    const formattedPrice = new Intl.NumberFormat('tr-TR', {
        maximumFractionDigits: 0,
    }).format(price);

    return L.divIcon({
        className: 'custom-map-marker',
        html: `
            <div class="bg-[var(--color-primary)] text-white font-bold text-xs px-2 py-1 rounded-lg shadow-lg border-2 border-white whitespace-nowrap text-center transition-transform hover:scale-110">
                ${formattedPrice} ${currency}
            </div>
            <div class="w-3 h-3 bg-[var(--color-primary)] transform rotate-45 mx-auto -mt-2 border-r-2 border-b-2 border-white"></div>
        `,
        iconSize: [60, 30],
        iconAnchor: [30, 30],
        popupAnchor: [0, -30],
    });
};

interface MapComponentProps {
    listings: Listing[];
}

// Helper to center the map on the listings if they exist
function MapAutoCenter({ listings }: { listings: Listing[] }) {
    const map = useMap();

    useEffect(() => {
        if (listings.length > 0) {
            const lats = listings.map(l => l.location.lat).filter(Boolean) as number[];
            const lngs = listings.map(l => l.location.lng).filter(Boolean) as number[];

            if (lats.length > 0 && lngs.length > 0) {
                const minLat = Math.min(...lats);
                const maxLat = Math.max(...lats);
                const minLng = Math.min(...lngs);
                const maxLng = Math.max(...lngs);

                map.fitBounds([
                    [minLat - 0.05, minLng - 0.05],
                    [maxLat + 0.05, maxLng + 0.05]
                ], { padding: [50, 50] });
            }
        }
    }, [listings, map]);

    return null;
}

export default function MapComponent({ listings }: MapComponentProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Fix for default Leaflet icon not showing up in Next.js
        if (typeof window !== 'undefined') {
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
        }
    }, []);

    if (!mounted) {
        return <div className="w-full h-[600px] bg-[var(--color-surface)] animate-pulse rounded-2xl border border-[var(--color-border)]"></div>;
    }

    // Default center (Turkey approximate)
    const center: [number, number] = [39.0, 35.0];

    // Determine custom theme map URL (Using standard OSM, but we apply CSS filters for dark mode in index.css)
    const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    return (
        <div className={`w-full h-[600px] rounded-2xl overflow-hidden border border-[var(--color-border)] relative shadow-xl map-wrapper ${resolvedTheme === 'dark' ? 'dark-map' : ''}`}>
            {/* Inject small style block for dark mode filter support */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .dark-map .leaflet-layer,
                .dark-map .leaflet-control-zoom-in,
                .dark-map .leaflet-control-zoom-out,
                .dark-map .leaflet-control-attribution {
                    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                }
                .leaflet-popup-content-wrapper {
                    background-color: var(--color-surface);
                    color: var(--color-foreground);
                    border: 1px solid var(--color-border);
                    border-radius: 1rem;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    padding: 0;
                    overflow:hidden;
                }
                .leaflet-popup-tip {
                    background-color: var(--color-surface);
                    border: 1px solid var(--color-border);
                }
                .leaflet-popup-content {
                    margin: 0;
                    width: 240px !important;
                }
            `}} />

            <MapContainer
                center={center}
                zoom={6}
                scrollWheelZoom={true}
                className="w-full h-full z-0 outline-none"
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CART0</a>'
                    url={tileUrl}
                />

                <MapAutoCenter listings={listings} />

                {listings.map((listing) => {
                    if (!listing.location.lat || !listing.location.lng) return null;

                    return (
                        <Marker
                            key={listing.id}
                            position={[listing.location.lat, listing.location.lng]}
                            icon={createCustomIcon(listing.price, listing.currency)}
                        >
                            <Popup closeButton={false} className="custom-popup">
                                <Link href={`/listing/${listing.id}`} className="block group">
                                    <div className="relative h-32 w-full bg-neutral-200">
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {listing.listingType && (
                                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                                                {listing.listingType === 'sale' ? 'SATILIK' : 'KİRALIK'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <div className="text-base font-bold text-[var(--color-primary)] mb-1">
                                            {new Intl.NumberFormat('tr-TR').format(listing.price)} {listing.currency}
                                        </div>
                                        <h3 className="text-sm font-semibold text-[var(--color-foreground)] line-clamp-1 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                                            {listing.title}
                                        </h3>
                                        <div className="text-xs text-[var(--color-muted)] truncate">
                                            {listing.location.district}, {listing.location.city}
                                        </div>
                                    </div>
                                </Link>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
