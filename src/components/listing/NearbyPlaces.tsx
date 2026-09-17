'use client';

import {
  GraduationCap, Bus, ShoppingBasket, Hospital, Trees, Coffee, ExternalLink, MapPinned,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getNearbyPlaces, googleMapsBrowseUrl, googleMapsEmbedUrl } from '@/lib/nearbyPlaces';

const ICONS = {
  school: GraduationCap,
  transit: Bus,
  market: ShoppingBasket,
  hospital: Hospital,
  park: Trees,
  cafe: Coffee,
} as const;

interface NearbyPlacesProps {
  lat?: number | null;
  lng?: number | null;
  title?: string;
}

export default function NearbyPlaces({ lat, lng, title }: NearbyPlacesProps) {
  const t = useTranslations('Listing');
  const places = getNearbyPlaces(lat, lng);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedUrl = lat != null && lng != null ? googleMapsEmbedUrl(lat, lng, apiKey) : null;

  if (!places.length || lat == null || lng == null) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm text-[var(--color-muted)]">
        {t('nearby_unavailable')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-foreground)]">{t('nearby_title')}</h2>
          <p className="text-sm text-[var(--color-muted)]">{t('nearby_desc')}</p>
        </div>
        <a
          href={googleMapsBrowseUrl(lat, lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-navy)] text-[var(--color-brand-yellow)] text-sm font-bold hover:opacity-95"
        >
          <MapPinned size={16} />
          {t('open_google_maps')}
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {places.map((place) => {
          const Icon = ICONS[place.type];
          return (
            <div
              key={place.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-foreground)] truncate">
                  {t(place.labelKey as 'nearby_school')}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {place.distanceKm.toFixed(1)} km · ~{place.walkMinutes} {t('nearby_min_walk')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {embedUrl && (
        <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] aspect-[16/9] sm:aspect-[21/9]">
          <iframe
            title={title || t('map_view')}
            src={embedUrl}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
