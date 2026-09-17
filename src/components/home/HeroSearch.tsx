'use client';

import { useMemo, useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { MapPinned, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { sanitizeSearchInput } from '@/lib/sanitize';
import LocationCascade, { type LocationValue } from '@/components/listing/LocationCascade';
import { CATEGORIES } from '@/services/mockData';
import {
  SEARCH_VERTICALS,
  getChildCategories,
  getFilterConfig,
  type VerticalId,
} from '@/lib/categoryTree';

const ROOM_OPTIONS = ['1+0', '1+1', '2+1', '3+1', '4+1', '5+'];

const PLACEHOLDERS: Record<VerticalId, string> = {
  emlak: 'Daire, villa, mahalle...',
  vasita: 'Marka, model, yıl...',
  'ikinci-el': 'Telefon, bilgisayar, mobilya...',
  sifir: 'Yeni ürün, marka, model...',
  turizm: 'Otel, yazlık, kamp...',
  hizmet: 'Nakliyat, temizlik, tadilat...',
  is: 'Pozisyon, şirket, remote...',
};

export default function HeroSearch() {
  const t = useTranslations('Home');
  const router = useRouter();
  const [vertical, setVertical] = useState<VerticalId>('emlak');
  const [tab, setTab] = useState<'sale' | 'rent' | 'projects'>('sale');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState<LocationValue>({
    city: '',
    district: '',
    neighborhood: '',
  });
  const [rooms, setRooms] = useState('');
  const [condition, setCondition] = useState('');

  const verticalMeta = SEARCH_VERTICALS.find((v) => v.id === vertical)!;
  const filterProfile = getFilterConfig(verticalMeta.rootSlug);
  const childCategories = useMemo(
    () => getChildCategories(CATEGORIES, verticalMeta.rootSlug),
    [verticalMeta.rootSlug],
  );

  const handleVerticalChange = (id: VerticalId) => {
    setVertical(id);
    setCategory('');
    setRooms('');
    setCondition('');
    setLocation({ city: '', district: '', neighborhood: '' });
    if (id !== 'emlak' && id !== 'turizm') setTab('sale');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeQuery = sanitizeSearchInput(query);
    const safeCity = sanitizeSearchInput(location.city);
    const safeDistrict = sanitizeSearchInput(location.district);
    const safeNeighborhood = sanitizeSearchInput(location.neighborhood);
    const allowedSlugs = new Set(childCategories.map((c) => c.slug));
    const safeCategory = allowedSlugs.has(category) ? category : verticalMeta.rootSlug;

    const params = new URLSearchParams();
    params.set('category', safeCategory);

    if (vertical === 'emlak' || vertical === 'turizm') {
      if (tab === 'projects') params.set('tier', 'showcase');
      else params.set('listingType', tab);
    }

    if (safeQuery) params.set('query', safeQuery);
    if (safeCity) params.set('city', safeCity);
    if (safeDistrict) params.set('district', safeDistrict);
    if (safeNeighborhood) params.set('neighborhood', safeNeighborhood);
    if (rooms && filterProfile.showRoomCount) params.set('roomCount', rooms);
    if (condition) params.set('condition', condition);
    if (vertical === 'ikinci-el') params.set('condition', 'İkinci El');
    if (vertical === 'sifir') params.set('condition', 'Sıfır');

    router.push(`/search?${params.toString()}`);
  };

  const selectCls =
    'w-full min-w-0 max-w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[var(--color-foreground)] bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] focus:outline-none cursor-pointer';

  const showListingTabs = vertical === 'emlak' || vertical === 'turizm';

  return (
    <div className="w-full max-w-5xl mx-auto min-w-0 overflow-x-clip">
      {/* Mobile: wrapped chips that never force page overflow */}
      <div className="flex flex-wrap gap-1.5 sm:hidden mb-2 max-w-full">
        {SEARCH_VERTICALS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleVerticalChange(item.id)}
            className={`max-w-full px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
              vertical === item.id
                ? 'bg-[var(--color-brand-yellow)] text-[var(--color-navy)]'
                : 'bg-black/30 text-white/90'
            }`}
          >
            {t(item.labelKey as 'vertical_emlak')}
          </button>
        ))}
      </div>

      {/* Desktop/tablet: horizontal rail */}
      <div className="hidden sm:flex gap-1.5 overflow-x-auto pb-1 max-w-full min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SEARCH_VERTICALS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleVerticalChange(item.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              vertical === item.id
                ? 'bg-[var(--color-brand-yellow)] text-[var(--color-navy)]'
                : 'bg-black/30 text-white/90 hover:bg-black/40'
            }`}
          >
            {t(item.labelKey as 'vertical_emlak')}
          </button>
        ))}
      </div>

      {showListingTabs && (
        <>
          {/* Mobile: compact select instead of tabs */}
          <div className="sm:hidden mb-2 min-w-0 max-w-full">
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as 'sale' | 'rent' | 'projects')}
              className="w-full min-w-0 max-w-full rounded-xl bg-black/35 text-white border border-white/20 px-3 py-2 text-sm font-semibold"
              aria-label={t('tab_sale')}
            >
              <option value="sale">{t('tab_sale')}</option>
              <option value="rent">{t('tab_rent')}</option>
              {vertical === 'emlak' && <option value="projects">{t('tab_projects')}</option>}
            </select>
          </div>

          <div className="hidden sm:flex items-end gap-1 px-1 mt-2 overflow-x-auto max-w-full">
            {([
              ['sale', t('tab_sale')],
              ['rent', t('tab_rent')],
              ...(vertical === 'emlak' ? [['projects', t('tab_projects')] as const] : []),
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`shrink-0 px-5 py-2 rounded-t-xl text-sm font-bold transition-colors ${
                  tab === id
                    ? 'bg-white text-[var(--color-ink)] dark:bg-[var(--color-surface)] dark:text-white'
                    : 'bg-black/25 text-white/85 hover:bg-black/35'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className={`bg-white dark:bg-[var(--color-surface)] rounded-2xl ${showListingTabs ? 'sm:rounded-tl-none' : ''} shadow-xl sm:shadow-2xl shadow-black/25 p-2.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 border border-white/40 dark:border-[var(--color-border)] w-full min-w-0 max-w-full overflow-x-clip [&>*]:min-w-0`}
        noValidate
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={PLACEHOLDERS[vertical]}
          maxLength={120}
          autoComplete="off"
          className="lg:col-span-3 min-w-0 max-w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[var(--color-foreground)] placeholder-[var(--color-muted)] bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
        />

        <div className="lg:col-span-3 min-w-0 max-w-full">
          <LocationCascade
            value={location}
            onChange={setLocation}
            showNeighborhood={false}
            compact
            selectClassName={selectCls}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`lg:col-span-2 ${selectCls}`}
          aria-label={t('search_category')}
        >
          <option value="">{t('search_category')}</option>
          {childCategories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        {filterProfile.showRoomCount ? (
          <select
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className={`hidden sm:block lg:col-span-2 ${selectCls}`}
            aria-label={t('search_rooms')}
          >
            <option value="">{t('search_rooms')}</option>
            {ROOM_OPTIONS.map((room) => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>
        ) : filterProfile.showCondition && vertical !== 'ikinci-el' && vertical !== 'sifir' ? (
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className={`hidden sm:block lg:col-span-2 ${selectCls}`}
            aria-label={t('search_condition')}
          >
            <option value="">{t('search_condition')}</option>
            <option value="Sıfır">Sıfır</option>
            <option value="İkinci El">İkinci El</option>
          </select>
        ) : (
          <div className="lg:col-span-2 hidden lg:block" />
        )}

        <div className="lg:col-span-2 flex gap-2 min-w-0 sm:col-span-2">
          <button
            type="submit"
            className="flex-1 min-w-0 flex items-center justify-center gap-2 bg-[var(--color-brand-yellow)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-navy)] px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-extrabold text-sm"
          >
            <Search size={18} className="shrink-0" />
            {t('search_btn')}
          </button>
          <Link
            href={`/search?view=map&category=${verticalMeta.rootSlug}`}
            className="flex items-center justify-center w-11 sm:w-12 shrink-0 rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
            aria-label={t('map_search')}
            title={t('map_search')}
          >
            <MapPinned size={18} />
          </Link>
        </div>
      </form>
    </div>
  );
}
