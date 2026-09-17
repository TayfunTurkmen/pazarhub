import type { Category } from '@/types';

export type FilterConfig = {
  showListingType: boolean;
  showRoomCount: boolean;
  showArea: boolean;
  showHeating: boolean;
  showFloor: boolean;
  showVehicle: boolean;
  showElectronics: boolean;
  showCondition: boolean;
  showJob: boolean;
  showServices: boolean;
};

const REAL_ESTATE: FilterConfig = {
  showListingType: true,
  showRoomCount: true,
  showArea: true,
  showHeating: true,
  showFloor: true,
  showVehicle: false,
  showElectronics: false,
  showCondition: false,
  showJob: false,
  showServices: false,
};

const VEHICLE: FilterConfig = {
  showListingType: false,
  showRoomCount: false,
  showArea: false,
  showHeating: false,
  showFloor: false,
  showVehicle: true,
  showElectronics: false,
  showCondition: true,
  showJob: false,
  showServices: false,
};

const SHOPPING: FilterConfig = {
  showListingType: false,
  showRoomCount: false,
  showArea: false,
  showHeating: false,
  showFloor: false,
  showVehicle: false,
  showElectronics: true,
  showCondition: true,
  showJob: false,
  showServices: false,
};

const TOURISM: FilterConfig = {
  showListingType: true,
  showRoomCount: false,
  showArea: true,
  showHeating: false,
  showFloor: false,
  showVehicle: false,
  showElectronics: false,
  showCondition: false,
  showJob: false,
  showServices: false,
};

const SERVICES: FilterConfig = {
  showListingType: false,
  showRoomCount: false,
  showArea: false,
  showHeating: false,
  showFloor: false,
  showVehicle: false,
  showElectronics: false,
  showCondition: false,
  showJob: false,
  showServices: true,
};

const JOBS: FilterConfig = {
  showListingType: false,
  showRoomCount: false,
  showArea: false,
  showHeating: false,
  showFloor: false,
  showVehicle: false,
  showElectronics: false,
  showCondition: false,
  showJob: true,
  showServices: false,
};

const GENERAL: FilterConfig = {
  showListingType: false,
  showRoomCount: false,
  showArea: false,
  showHeating: false,
  showFloor: false,
  showVehicle: false,
  showElectronics: false,
  showCondition: false,
  showJob: false,
  showServices: false,
};

/** Slug → filter profile (leaf and parent). */
const BY_SLUG: Record<string, FilterConfig> = {
  emlak: REAL_ESTATE,
  konut: REAL_ESTATE,
  satilik: { ...REAL_ESTATE, showListingType: false },
  kiralik: { ...REAL_ESTATE, showListingType: false },
  isyeri: { ...REAL_ESTATE, showRoomCount: false },
  arsa: { ...REAL_ESTATE, showRoomCount: false, showHeating: false, showFloor: false },
  devremulk: REAL_ESTATE,
  vasita: VEHICLE,
  otomobil: VEHICLE,
  'satilik-otomobil': VEHICLE,
  'kiralik-otomobil': VEHICLE,
  'arazi-suv-pickup': VEHICLE,
  motosiklet: VEHICLE,
  'minivan-panelvan': VEHICLE,
  'ticari-araclar': VEHICLE,
  'ikinci-el': { ...SHOPPING, showCondition: false },
  sifir: { ...SHOPPING, showCondition: false },
  alisveris: SHOPPING,
  bilgisayar: SHOPPING,
  telefon: SHOPPING,
  'ev-esyalari': SHOPPING,
  'giyim-aksesuar': SHOPPING,
  'spor-hobi': SHOPPING,
  'sifir-bilgisayar': SHOPPING,
  'sifir-telefon': SHOPPING,
  'sifir-ev-esyalari': SHOPPING,
  'sifir-giyim': SHOPPING,
  'sifir-spor': SHOPPING,
  turizm: TOURISM,
  'otel-pansiyon': TOURISM,
  'apart-yazlik': TOURISM,
  'tur-gezi': TOURISM,
  'kamp-alani': TOURISM,
  'yardimci-hizmetler': SERVICES,
  nakliyat: SERVICES,
  'tadilat-dekorasyon': SERVICES,
  temizlik: SERVICES,
  'tamir-bakim': SERVICES,
  'ozel-ders': SERVICES,
  'is-ilanlari': JOBS,
  'tam-zamanli': JOBS,
  'yari-zamanli': JOBS,
  freelance: JOBS,
  staj: JOBS,
  sahiplendirme: GENERAL,
  default: GENERAL,
};

export type VerticalId = 'emlak' | 'vasita' | 'ikinci-el' | 'sifir' | 'turizm' | 'hizmet' | 'is';

export const SEARCH_VERTICALS: {
  id: VerticalId;
  rootSlug: string;
  labelKey: string;
}[] = [
  { id: 'emlak', rootSlug: 'emlak', labelKey: 'vertical_emlak' },
  { id: 'vasita', rootSlug: 'vasita', labelKey: 'vertical_vasita' },
  { id: 'ikinci-el', rootSlug: 'ikinci-el', labelKey: 'vertical_ikinci_el' },
  { id: 'sifir', rootSlug: 'sifir', labelKey: 'vertical_sifir' },
  { id: 'turizm', rootSlug: 'turizm', labelKey: 'vertical_turizm' },
  { id: 'hizmet', rootSlug: 'yardimci-hizmetler', labelKey: 'vertical_hizmet' },
  { id: 'is', rootSlug: 'is-ilanlari', labelKey: 'vertical_is' },
];

export function getFilterConfig(slug?: string | null): FilterConfig {
  if (!slug) return BY_SLUG.default;
  return BY_SLUG[slug] || BY_SLUG.default;
}

export function getCategoryTrail(categories: Category[], slugOrId: string): Category[] {
  const start =
    categories.find((c) => c.slug === slugOrId || c.id === slugOrId) || null;
  if (!start) return [];
  const trail: Category[] = [start];
  let current = start;
  while (current.parentId) {
    const parent = categories.find((c) => c.id === current.parentId);
    if (!parent) break;
    trail.unshift(parent);
    current = parent;
  }
  return trail;
}

export function getRootCategory(categories: Category[], slugOrId: string): Category | null {
  const trail = getCategoryTrail(categories, slugOrId);
  return trail[0] || null;
}

/** Resolve filter config from path slug or ?category= using ancestry. */
export function resolveFilterConfig(
  categories: Category[],
  pathSlug?: string | null,
  queryCategory?: string | null,
): FilterConfig {
  const key = pathSlug && pathSlug !== 'default' ? pathSlug : queryCategory;
  if (!key) return BY_SLUG.default;

  const direct = BY_SLUG[key];
  if (direct) return direct;

  const root = getRootCategory(categories, key);
  if (root && BY_SLUG[root.slug]) return BY_SLUG[root.slug];

  return BY_SLUG.default;
}

export function getDescendantIds(categories: Category[], rootIdOrSlug: string): string[] {
  const root = categories.find((c) => c.id === rootIdOrSlug || c.slug === rootIdOrSlug);
  if (!root) return [rootIdOrSlug];

  const ids = new Set<string>([root.id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const cat of categories) {
      if (cat.parentId && ids.has(cat.parentId) && !ids.has(cat.id)) {
        ids.add(cat.id);
        changed = true;
      }
    }
  }
  return [...ids];
}

export function getDescendantSlugs(categories: Category[], rootIdOrSlug: string): string[] {
  const ids = new Set(getDescendantIds(categories, rootIdOrSlug));
  return categories.filter((c) => ids.has(c.id)).map((c) => c.slug);
}

export function getChildCategories(categories: Category[], parentSlug: string): Category[] {
  const parent = categories.find((c) => c.slug === parentSlug);
  if (!parent) return [];
  return categories.filter((c) => c.parentId === parent.id);
}
