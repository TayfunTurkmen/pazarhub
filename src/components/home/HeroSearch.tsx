'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { sanitizeSearchInput } from '@/lib/sanitize';

interface HeroSearchProps {
  categories: { id: string; name: string; slug: string }[];
}

export default function HeroSearch({ categories }: HeroSearchProps) {
  const t = useTranslations('Home');
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeQuery = sanitizeSearchInput(query);
    const safeLocation = sanitizeSearchInput(location);
    const safeCategory = categories.some((c) => c.slug === category) ? category : '';

    if (!safeQuery && !safeCategory && !safeLocation) {
      setError(t('search_error_empty'));
      return;
    }

    setError('');
    const params = new URLSearchParams();
    if (safeQuery) params.set('query', safeQuery);
    if (safeCategory) params.set('category', safeCategory);
    if (safeLocation) params.set('city', safeLocation);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[var(--color-surface)] rounded-2xl shadow-2xl shadow-black/20 p-2 flex flex-col sm:flex-row gap-2 border border-white/40"
        noValidate
      >
        <div className="flex-1 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-[var(--color-border)]">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(''); }}
            placeholder={t('search_what')}
            maxLength={120}
            autoComplete="off"
            className="flex-1 px-4 py-3.5 text-sm text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none bg-transparent rounded-xl sm:rounded-none sm:rounded-l-xl"
          />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setError(''); }}
            className="flex-1 px-4 py-3.5 text-sm text-[var(--color-foreground)] bg-transparent focus:outline-none cursor-pointer"
            aria-label={t('search_category')}
          >
            <option value="">{t('search_category')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={location}
            onChange={(e) => { setLocation(e.target.value); setError(''); }}
            placeholder={t('search_location')}
            maxLength={120}
            autoComplete="off"
            className="flex-1 px-4 py-3.5 text-sm text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors shrink-0"
        >
          <Search size={18} />
          {t('search_btn')}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-200 text-center" role="alert">{error}</p>
      )}
    </div>
  );
}
