import { getTranslations } from 'next-intl/server';
import { getPaginatedListings } from '@/services/serverData';
import { CATEGORIES } from '@/services/mockData';
import ListingCard from '@/components/listing/ListingCard';
import FilterSidebar from '@/components/listing/FilterSidebar';
import SearchResultsHeader from '@/components/listing/SearchResultsHeader';
import Pagination from '@/components/listing/Pagination';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Search as SearchIcon, FolderOpen, ChevronRight, Hash, User, Store, Type } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import MapWrapper from '@/components/listing/MapWrapper';
import { parseFilterState } from '@/lib/filters';
import PageBanner from '@/components/layout/PageBanner';
import EmptyState from '@/components/ui/EmptyState';
function getMatchingCategories(query: string) {
    if (!query) return [];
    const q = query.toLowerCase();
    const allCats = CATEGORIES;
    const matched = allCats.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
    );
    const parentIds = new Set(matched.filter(c => c.parentId).map(c => c.parentId!));
    const parents = allCats.filter(c => parentIds.has(c.id) && !matched.includes(c));
    return [...matched, ...parents].slice(0, 8);
}

function getCategoryBreadcrumb(cat: typeof CATEGORIES[0]): typeof CATEGORIES[0][] {
    const trail: typeof CATEGORIES[0][] = [cat];
    let current = cat;
    while (current.parentId) {
        const parent = CATEGORIES.find(c => c.id === current.parentId);
        if (!parent) break;
        trail.unshift(parent);
        current = parent;
    }
    return trail;
}

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const filter = parseFilterState(resolvedParams);
    const { items: listings, total } = await getPaginatedListings(filter);
    const messages = await getMessages();
    const t = await getTranslations('Search');
    const viewMode = resolvedParams.view === 'map' ? 'map' : resolvedParams.view === 'list' ? 'list' : 'grid';

    const query = typeof resolvedParams.query === 'string' ? resolvedParams.query : '';
    const listingId = typeof resolvedParams.listingId === 'string' ? resolvedParams.listingId : '';
    const sellerName = typeof resolvedParams.sellerName === 'string' ? resolvedParams.sellerName : '';
    const matchingCategories = getMatchingCategories(query);
    const popularCategories = !query && !listingId && !sellerName ? CATEGORIES.filter(c => !c.parentId) : [];

    const hasAdvancedSearch = query || listingId || sellerName;

    return (
        <div className="space-y-4">
            <PageBanner
                icon={SearchIcon}
                title={t('results')}
                subtitle="Güvenli arama ile doğrulanmış ilanları keşfedin"
                badge="Doğrulanmış"
            />

            {/* Advanced Search Form */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <SearchIcon size={18} className="text-[var(--color-primary)]" />
                    <h2 className="text-sm font-bold text-[var(--color-foreground)]">Gelişmiş Arama</h2>
                </div>
                <form action="" method="get" className="space-y-3">
                    {/* Row 1: Query + Listing ID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] mb-1.5">
                                <Type size={12} />
                                Kelime veya Anahtar Sözcük
                            </label>
                            <input
                                type="text"
                                name="query"
                                defaultValue={query}
                                placeholder="Örn: 3+1 daire, BMW, Samsung..."
                                className="w-full border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] mb-1.5">
                                <Hash size={12} />
                                İlan Numarası
                            </label>
                            <input
                                type="text"
                                name="listingId"
                                defaultValue={listingId}
                                placeholder="Örn: 1001, 1013..."
                                className="w-full border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
                            />
                        </div>
                    </div>
                    {/* Row 2: Seller Name + Search Button */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] mb-1.5">
                                <Store size={12} />
                                Mağaza / İlan Veren Adı
                            </label>
                            <input
                                type="text"
                                name="sellerName"
                                defaultValue={sellerName}
                                placeholder="Örn: Ahmet, Emlak Ofisi..."
                                className="w-full border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/20"
                            >
                                <SearchIcon size={16} />
                                Ara
                            </button>
                        </div>
                    </div>
                    {/* Active search indicators */}
                    {hasAdvancedSearch && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--color-border)]">
                            <span className="text-xs text-[var(--color-muted)]">Aktif filtreler:</span>
                            {query && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-medium">
                                    <Type size={10} />
                                    &ldquo;{query}&rdquo;
                                </span>
                            )}
                            {listingId && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-medium">
                                    <Hash size={10} />
                                    #{listingId}
                                </span>
                            )}
                            {sellerName && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-medium">
                                    <User size={10} />
                                    {sellerName}
                                </span>
                            )}
                            <Link href="/search" className="text-xs text-[var(--color-muted)] hover:text-red-500 ml-auto transition-colors">
                                Temizle ×
                            </Link>
                        </div>
                    )}
                </form>
            </div>

            {/* Category suggestions */}
            {(matchingCategories.length > 0 || popularCategories.length > 0) && (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FolderOpen size={16} className="text-[var(--color-primary)]" />
                        <span className="text-sm font-semibold text-[var(--color-foreground)]">
                            {query ? `"${query}" için kategoriler` : 'Popüler Kategoriler'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(matchingCategories.length > 0 ? matchingCategories : popularCategories).map(cat => {
                            const breadcrumb = getCategoryBreadcrumb(cat);
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    className="flex items-center gap-1 px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors group"
                                >
                                    {breadcrumb.map((crumb, i) => (
                                        <span key={crumb.id} className="flex items-center gap-1">
                                            {i > 0 && <ChevronRight size={10} className="text-[var(--color-muted)]" />}
                                            <span className={i === breadcrumb.length - 1 ? 'font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)]' : 'text-[var(--color-muted)]'}>
                                                {crumb.name}
                                            </span>
                                        </span>
                                    ))}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Sidebar */}
                <div className="md:col-span-3">
                    <NextIntlClientProvider messages={messages}>
                        <FilterSidebar />
                    </NextIntlClientProvider>
                </div>

                {/* Results */}
                <div className="md:col-span-9">
                    <NextIntlClientProvider messages={messages}>
                        <SearchResultsHeader count={total} />
                    </NextIntlClientProvider>

                    {listings.length > 0 ? (
                        viewMode === 'map' ? (
                            <MapWrapper listings={listings} />
                        ) : (
                            <>
                                <div className={`grid gap-4 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                                    {listings.map((listing) => (
                                        <ListingCard key={listing.id} listing={listing} showVerified />
                                    ))}
                                </div>
                                <Pagination filter={filter} total={total} basePath="/search" />
                            </>
                        )
                    ) : (
                        <EmptyState icon={SearchIcon} title={t('no_results')} description={t('try_different')} />
                    )}
                </div>
            </div>
        </div>
    );
}
