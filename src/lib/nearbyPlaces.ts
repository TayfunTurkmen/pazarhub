export type NearbyPlace = {
  id: string;
  labelKey: string;
  type: 'school' | 'transit' | 'market' | 'hospital' | 'park' | 'cafe';
  distanceKm: number;
  walkMinutes: number;
};

function hashCoord(lat: number, lng: number): number {
  const raw = Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

/** Deterministic nearby amenities from listing coordinates (no external API required). */
export function getNearbyPlaces(lat?: number | null, lng?: number | null): NearbyPlace[] {
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return [];

  const seed = hashCoord(lat, lng);
  const catalog: Array<Omit<NearbyPlace, 'distanceKm' | 'walkMinutes'> & { base: number }> = [
    { id: 'school', labelKey: 'nearby_school', type: 'school', base: 0.35 },
    { id: 'transit', labelKey: 'nearby_transit', type: 'transit', base: 0.22 },
    { id: 'market', labelKey: 'nearby_market', type: 'market', base: 0.28 },
    { id: 'hospital', labelKey: 'nearby_hospital', type: 'hospital', base: 0.85 },
    { id: 'park', labelKey: 'nearby_park', type: 'park', base: 0.45 },
    { id: 'cafe', labelKey: 'nearby_cafe', type: 'cafe', base: 0.18 },
  ];

  return catalog.map((item, index) => {
    const jitter = ((seed * (index + 3)) % 1) * 0.55;
    const distanceKm = Math.round((item.base + jitter) * 100) / 100;
    const walkMinutes = Math.max(2, Math.round(distanceKm * 12));
    return {
      id: item.id,
      labelKey: item.labelKey,
      type: item.type,
      distanceKm,
      walkMinutes,
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}

export function googleMapsBrowseUrl(lat: number, lng: number, zoom = 14): string {
  return `https://www.google.com/maps/@${lat},${lng},${zoom}z`;
}

export function googleMapsPlaceUrl(lat: number, lng: number, label?: string): string {
  const q = label ? encodeURIComponent(label) : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=`;
}

export function googleMapsEmbedUrl(lat: number, lng: number, apiKey?: string): string | null {
  if (!apiKey) return null;
  return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=15&maptype=roadmap`;
}
