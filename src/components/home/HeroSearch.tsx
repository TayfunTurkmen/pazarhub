'use client';

import { useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { MapPinned, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { sanitizeSearchInput } from '@/lib/sanitize';
import LocationCascade, { type LocationValue } from '@/components/listing/LocationCascade';

interface HeroSearchProps {
  categories: { id: string; name: string; slug: string }[];
}

const ROOM_OPTIONS = ['1+0', '1+1', '2+1', '3+1', '4+1', '5+'];

export default function HeroSearch({ categories }: HeroSearchProps) {
  const t = useTranslations('Home');
  const router = useRouter();
  const [tab, setTab] = useState<'sale' | 'rent' | 'projects'>('sale');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState<LocationValue>({
    city: '',
    district: '',
    neighborhood: '',
  });
  const [rooms, setRooms] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeQuery = sanitizeSearchInput(query);
    const safeCity = sanitizeSearchInput(location.city);
    const safeDistrict = sanitizeSearchInput(location.district);
    const safeNeighborhood = sanitizeSearchInput(location.neighborhood);
    const safeCategory = categories.some((c) => c.slug === category) ? category : '';

    const params = new URLSearchParams();
    if (tab === 'projects') {
      params.set('tier', 'showcase');
    } else {
      params.set('listingType', tab);
    }
    if (safeQuery) params.set('query', safeQuery);
    if (safeCategory) params.set('category', safeCategory);
    if (safeCity) params.set('city', safeCity);
    if (safeDistrict) params.set('district', safeDistrict);
    if (safeNeighborhood) params.set('neighborhood', safeNeighborhood);
    if (rooms) params.set('roomCount', rooms);
    router.push(`/search?${params.toString()}`);
  };

  const selectCls =
    'px-4 py-3 text-sm text-[var(--color-foreground)] bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] focus:outline-none cursor-pointer';

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-end gap-1 px-1">
        {([
          ['sale', t('tab_sale')],
          ['rent', t('tab_rent')],
          ['projects', t('tab_projects')],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-5 py-2.5 rounded-t-xl text-sm font-bold transition-colors ${
              tab === id
                ? 'bg-white text-[var(--color-ink)] dark:bg-[var(--color-surface)] dark:text-white'
                : 'bg-black/25 text-white/85 hover:bg-black/35'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[var(--color-surface)] rounded-2xl rounded-tl-none shadow-2xl shadow-black/25 p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 border border-white/40 dark:border-[var(--color-border)]"
        noValidate
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search_what')}
          maxLength={120}
          autoComplete="off"
          className="lg:col-span-3 px-4 py-3 text-sm text-[var(--color-foreground)] placeholder-[var(--color-muted)] bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
        />
        <div className="lg:col-span-4">
          <LocationCascade
            value={location}
            onChange={setLocation}
            showNeighborhood
            compact
            selectClassName={selectCls}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`lg:col-span-2 ${selectCls}`}
          aria-label={t('search_type')}
        >
          <option value="">{t('search_type')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <select
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          className={`lg:col-span-1 ${selectCls}`}
          aria-label={t('search_rooms')}
        >
          <option value="">{t('search_rooms')}</option>
          {ROOM_OPTIONS.map((room) => (
            <option key={room} value={room}>{room}</option>
          ))}
        </select>
        <div className="lg:col-span-2 flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-brand-yellow)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-navy)] px-4 py-3 rounded-xl font-extrabold text-sm"
          >
            <Search size={18} />
            {t('search_btn')}
          </button>
          <Link
            href="/search?view=map"
            className="hidden sm:flex items-center justify-center w-12 rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
            aria-label={t('map_search')}
          >
            <MapPinned size={18} />
          </Link>
        </div>
      </form>
    </div>
  );
}
