import { getTranslations } from 'next-intl/server';
import { getListings, CATEGORIES } from '@/services/mockData';
import ListingCard from '@/components/listing/ListingCard';
import FilterSidebar from '@/components/listing/FilterSidebar';
import SearchResultsHeader from '@/components/listing/SearchResultsHeader';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { Search as SearchIcon, ChevronRight } from 'lucide-react';

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
    const listings = await getListings({ ...resolvedSearchParams, category: category.id });

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Ana Sayfa</Link>
                <ChevronRight size={14} />
                {parentCategory && (
                    <>
                        <Link href={`/category/${parentCategory.slug}`} className="hover:text-[var(--color-primary)] transition-colors">{parentCategory.name}</Link>
                        <ChevronRight size={14} />
                    </>
                )}
                <span className="text-[var(--color-foreground)] font-medium">{category.name}</span>
            </nav>

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
                        <SearchResultsHeader count={listings.length} />
                    </NextIntlClientProvider>

                    {listings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {listings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[var(--color-surface)] p-12 rounded-2xl text-center text-[var(--color-muted)] border border-[var(--color-border)]">
                            <SearchIcon size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium mb-2 text-[var(--color-foreground)]">{t('no_results')}</p>
                            <p className="text-sm">{t('try_different')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
