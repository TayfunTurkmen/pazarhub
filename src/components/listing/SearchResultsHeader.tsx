'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowUpDown, LayoutGrid, List, Map as MapIcon } from 'lucide-react';

export default function SearchResultsHeader({ count }: { count: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('Search');
    const viewMode = searchParams.get('view') || 'grid';

    const currentSort = searchParams.get('sort') || 'newest';

    const handleSort = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', sort);
        router.replace(`?${params.toString()}`);
    };

    const handleViewMode = (mode: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', mode);
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-[var(--color-foreground)]">{t('results')}</h1>
                <span className="text-sm text-[var(--color-muted)] bg-[var(--color-surface-elevated)] px-3 py-1 rounded-full font-medium">
                    {count} {t('found')}
                </span>
            </div>

            <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                    <select
                        value={currentSort}
                        onChange={(e) => handleSort(e.target.value)}
                        className="appearance-none bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl pl-8 pr-4 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 cursor-pointer"
                    >
                        <option value="newest">{t('newest')}</option>
                        <option value="price_asc">{t('price_asc')}</option>
                        <option value="price_desc">{t('price_desc')}</option>
                    </select>
                    <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]">
                    <button
                        onClick={() => handleViewMode('grid')}
                        className={`p-2.5 ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white shadow-inner' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]'} transition-colors`}
                        title="Izgara Görünümü"
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button
                        onClick={() => handleViewMode('list')}
                        className={`p-2.5 border-l border-[var(--color-border)] ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white shadow-inner' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]'} transition-colors`}
                        title="Liste Görünümü"
                    >
                        <List size={16} />
                    </button>
                    <button
                        onClick={() => handleViewMode('map')}
                        className={`p-2.5 border-l border-[var(--color-border)] ${viewMode === 'map' ? 'bg-[var(--color-primary)] text-white shadow-inner' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]'} transition-colors`}
                        title="Harita Görünümü"
                    >
                        <MapIcon size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
