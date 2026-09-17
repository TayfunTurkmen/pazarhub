'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Listing } from '@/types';
import L from 'leaflet';
import { useTheme } from 'next-themes';
import { Link } from '@/i18n/navigation';
import { ExternalLink, MapPinned } from 'lucide-react';
import { googleMapsBrowseUrl } from '@/lib/nearbyPlaces';

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

function MapAutoCenter({ listings }: { listings: Listing[] }) {
  const map = useMap();

  useEffect(() => {
    if (listings.length === 0) return;
    const lats = listings.map((l) => l.location.lat).filter(Boolean) as number[];
    const lngs = listings.map((l) => l.location.lng).filter(Boolean) as number[];
    if (lats.length === 0 || lngs.length === 0) return;

    map.fitBounds(
      [
        [Math.min(...lats) - 0.05, Math.min(...lngs) - 0.05],
        [Math.max(...lats) + 0.05, Math.max(...lngs) + 0.05],
      ],
      { padding: [40, 40] },
    );
  }, [listings, map]);

  return null;
}

export default function MapComponent({ listings }: MapComponentProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [useGoogle, setUseGoogle] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mappable = useMemo(
    () => listings.filter((l) => l.location.lat != null && l.location.lng != null),
    [listings],
  );

  const center = useMemo<[number, number]>(() => {
    if (mappable.length === 0) return [39.0, 35.0];
    const lat = mappable.reduce((s, l) => s + (l.location.lat || 0), 0) / mappable.length;
    const lng = mappable.reduce((s, l) => s + (l.location.lng || 0), 0) / mappable.length;
    return [lat, lng];
  }, [mappable]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      // @ts-expect-error leaflet default icon patch
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }
  }, []);

  if (!mounted) {
    return <div className="w-full h-[min(70vh,560px)] min-h-[320px] bg-[var(--color-surface)] animate-pulse rounded-2xl border border-[var(--color-border)]" />;
  }

  const googleBrowse = googleMapsBrowseUrl(center[0], center[1], 12);
  const googleEmbed = apiKey
    ? `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${center[0]},${center[1]}&zoom=12&maptype=roadmap`
    : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[var(--color-muted)]">
          {mappable.length} konum haritada
        </p>
        <div className="flex flex-wrap gap-2">
          {googleEmbed && (
            <button
              type="button"
              onClick={() => setUseGoogle((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
            >
              <MapPinned size={14} />
              {useGoogle ? 'Harita (Leaflet)' : 'Google Maps'}
            </button>
          )}
          <a
            href={googleBrowse}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-navy)] text-[var(--color-brand-yellow)] text-xs font-bold"
          >
            Google Maps&apos;te gez
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {useGoogle && googleEmbed ? (
        <div className="w-full h-[min(70vh,560px)] min-h-[320px] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-xl">
          <iframe title="Google Maps" src={googleEmbed} className="w-full h-full border-0" loading="lazy" allowFullScreen />
        </div>
      ) : (
        <div className={`w-full h-[min(70vh,560px)] min-h-[320px] rounded-2xl overflow-hidden border border-[var(--color-border)] relative shadow-xl map-wrapper ${resolvedTheme === 'dark' ? 'dark-map' : ''}`}>
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
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                padding: 0;
                overflow: hidden;
              }
              .leaflet-popup-tip { background-color: var(--color-surface); border: 1px solid var(--color-border); }
              .leaflet-popup-content { margin: 0; width: 240px !important; }
            `,
          }} />

          <MapContainer center={center} zoom={6} scrollWheelZoom className="w-full h-full z-0 outline-none">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <MapAutoCenter listings={mappable} />
            {mappable.map((listing) => (
              <Marker
                key={listing.id}
                position={[listing.location.lat!, listing.location.lng!]}
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
                    </div>
                    <div className="p-3">
                      <div className="text-base font-bold text-[var(--color-primary)] mb-1">
                        {new Intl.NumberFormat('tr-TR').format(listing.price)} {listing.currency}
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--color-foreground)] line-clamp-1 mb-1 group-hover:text-[var(--color-primary)]">
                        {listing.title}
                      </h3>
                      <div className="text-xs text-[var(--color-muted)] truncate">
                        {listing.location.district}, {listing.location.city}
                      </div>
                    </div>
                  </Link>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
