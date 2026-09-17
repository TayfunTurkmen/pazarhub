// Turkey location hierarchy: City (il) → District (ilçe) → Neighborhood (mahalle)
// Full dataset: public/data/turkey-locations.json (81 provinces)

export interface NeighborhoodData {
  id: string;
  name: string;
  streets?: { id: string; name: string }[];
}

export interface DistrictData {
  id: string;
  name: string;
  neighborhoods?: NeighborhoodData[];
}

export interface CityData {
  id: string;
  name: string;
  districts?: DistrictData[];
}

type RawCity = {
  id: string;
  name: string;
  districts: { name: string; neighborhoods: string[] }[];
};

let cache: CityData[] | null = null;
let loadPromise: Promise<CityData[]> | null = null;

function hydrate(raw: RawCity[]): CityData[] {
  return raw.map((city) => ({
    id: city.id,
    name: city.name,
    districts: city.districts.map((dist, di) => ({
      id: `${city.id}-${di + 1}`,
      name: dist.name,
      neighborhoods: dist.neighborhoods.map((name, ni) => ({
        id: `${city.id}-${di + 1}-${ni + 1}`,
        name,
      })),
    })),
  }));
}

/** Load full Turkey location tree (cached). Safe for client & server. */
export async function loadLocationData(): Promise<CityData[]> {
  if (cache) return cache;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    if (typeof window === 'undefined') {
      const { readFile } = await import('fs/promises');
      const { join } = await import('path');
      const file = join(process.cwd(), 'public/data/turkey-locations.json');
      const raw = JSON.parse(await readFile(file, 'utf8')) as RawCity[];
      cache = hydrate(raw);
      return cache;
    }

    const res = await fetch('/data/turkey-locations.json');
    if (!res.ok) throw new Error('Failed to load location data');
    const raw = (await res.json()) as RawCity[];
    cache = hydrate(raw);
    return cache;
  })();

  try {
    return await loadPromise;
  } catch (err) {
    loadPromise = null;
    throw err;
  }
}

/** Sync accessor after loadLocationData() has resolved at least once. */
export function getLocationDataSync(): CityData[] {
  return cache ?? [];
}

export function findCity(cities: CityData[], name: string): CityData | undefined {
  return cities.find((c) => c.name === name);
}

export function findDistrict(city: CityData | undefined, name: string): DistrictData | undefined {
  return city?.districts?.find((d) => d.name === name);
}

export function findNeighborhood(
  district: DistrictData | undefined,
  name: string,
): NeighborhoodData | undefined {
  return district?.neighborhoods?.find((n) => n.name === name);
}

/** @deprecated Prefer loadLocationData() — kept for gradual migration */
export const LOCATION_DATA: CityData[] = [];
