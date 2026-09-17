'use client';

import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildFilterQueryString } from '@/lib/filters';
import { FilterState } from '@/types';

interface PaginationProps {
    filter: FilterState;
    total: number;
    basePath?: string;
}

export default function Pagination({ filter, total, basePath = '/search' }: PaginationProps) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 24;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    if (totalPages <= 1) return null;

    const prevFilter = { ...filter, page: Math.max(1, page - 1) };
    const nextFilter = { ...filter, page: Math.min(totalPages, page + 1) };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)]">
                Toplam <span className="font-semibold text-[var(--color-foreground)]">{total}</span> ilan
                <span className="sm:inline">{' · '}Sayfa {page} / {totalPages}</span>
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                {page > 1 ? (
                    <Link
                        href={`${basePath}${buildFilterQueryString(prevFilter)}`}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Önceki
                    </Link>
                ) : (
                    <span className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-muted)] opacity-50 cursor-not-allowed">
                        <ChevronLeft size={16} />
                        Önceki
                    </span>
                )}
                {page < totalPages ? (
                    <Link
                        href={`${basePath}${buildFilterQueryString(nextFilter)}`}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Sonraki
                        <ChevronRight size={16} />
                    </Link>
                ) : (
                    <span className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-[var(--color-primary)]/40 text-white text-sm opacity-50 cursor-not-allowed">
                        Sonraki
                        <ChevronRight size={16} />
                    </span>
                )}
            </div>
        </div>
    );
}
