import { getTranslations } from 'next-intl/server';
import { getPaginatedListings } from '@/services/serverData';
import { CATEGORIES } from '@/services/mockData';
import ListingCard from '@/components/listing/ListingCard';
import FilterSidebar from '@/components/listing/FilterSidebar';
import SearchResultsHeader from '@/components/listing/SearchResultsHeader';
import Pagination from '@/components/listing/Pagination';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { Search as SearchIcon, Building2 } from 'lucide-react';
import MapWrapper from '@/components/listing/MapWrapper';
import { parseFilterState } from '@/lib/filters';
import PageBanner from '@/components/layout/PageBanner';
import Breadcrumb from '@/components/layout/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string; locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const messages = await getMessages();
    const t = await getTranslations('Search');

    // Find category by slug
    const category = CATEGORIES.find(c => c.slug === slug);
    if (!category) {
        notFound();
    }

    // Get subcategories
    const subcategories = CATEGORIES.filter(c => c.parentId === category.id);

    // Find parent category if this is a subcategory
    const parentCategory = category.parentId ? CATEGORIES.find(c => c.id === category.parentId) : null;

    // Get listings for this category (includes children)
    const filter = parseFilterState({ ...resolvedSearchParams, category: category.id });
    const { items: listings, total } = await getPaginatedListings(filter);

    // Determine view Mode
    const viewMode = resolvedSearchParams.view === 'map' ? 'map' : resolvedSearchParams.view === 'list' ? 'list' : 'grid';

    return (
        <div className="space-y-6">
            <PageBanner
                icon={Building2}
                title={category.name}
                subtitle={parentCategory ? `${parentCategory.name} kategorisinde arama yapın` : 'Doğrulanmış ilanları keşfedin'}
            />

            <Breadcrumb items={[
                { label: 'Ana Sayfa', href: '/' },
                ...(parentCategory ? [{ label: parentCategory.name, href: `/category/${parentCategory.slug}` }] : []),
                { label: category.name },
            ]} />

            {/* Subcategories */}
            {subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {subcategories.map(sub => (
                        <Link
                            key={sub.id}
                            href={`/category/${sub.slug}`}
                            className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            {sub.name}
                        </Link>
                    ))}
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
                                <Pagination filter={filter} total={total} basePath={`/category/${slug}`} />
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
