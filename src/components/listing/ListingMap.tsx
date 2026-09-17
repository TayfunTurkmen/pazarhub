'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from 'next-themes';

function FixIcons() {
  useEffect(() => {
    // @ts-expect-error leaflet default icon patch
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

interface ListingMapProps {
  lat: number;
  lng: number;
  title?: string;
  className?: string;
}

export default function ListingMap({ lat, lng, className }: ListingMapProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={`w-full h-[280px] sm:h-[360px] bg-[var(--color-surface)] animate-pulse rounded-2xl border border-[var(--color-border)] ${className || ''}`} />
    );
  }

  return (
    <div className={`w-full h-[280px] sm:h-[360px] rounded-2xl overflow-hidden border border-[var(--color-border)] relative ${resolvedTheme === 'dark' ? 'dark-map' : ''} ${className || ''}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .dark-map .leaflet-layer,
          .dark-map .leaflet-control-zoom-in,
          .dark-map .leaflet-control-zoom-out,
          .dark-map .leaflet-control-attribution {
            filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
          }
        `,
      }} />
      <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="w-full h-full z-0 outline-none">
        <FixIcons />
        <Recenter lat={lat} lng={lng} />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Circle
          center={[lat, lng]}
          radius={350}
          pathOptions={{ color: 'var(--color-primary)', fillColor: 'var(--color-primary)', fillOpacity: 0.12 }}
        />
        <Marker position={[lat, lng]} />
      </MapContainer>
    </div>
  );
}
