'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Search, CheckCircle, XCircle, Crown, Sparkles, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Listing } from '@/types';

type StatusFilter = 'all' | 'active' | 'pending' | 'rejected';

export default function AdminListingsPage() {
    const t = useTranslations('Admin');
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const loadListings = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ adminAll: 'true', limit: '100' });
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (searchQuery.trim()) params.set('query', searchQuery.trim());

            const res = await fetch(`/api/admin/listings?${params}`);
            const json = await res.json();
            if (json.success) setListings(json.data.items);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchQuery]);

    useEffect(() => {
        const timer = setTimeout(loadListings, searchQuery ? 300 : 0);
        return () => clearTimeout(timer);
    }, [loadListings, searchQuery]);

    const updateStatus = async (id: string, status: Listing['status']) => {
        const res = await fetch(`/api/listings/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        const json = await res.json();
        if (json.success) {
            setListings(prev => prev.map(l => l.id === id ? json.data : l));
        }
    };

    const pendingCount = listings.filter(l => l.status === 'pending').length;

    const filtered = listings.filter(l => {
        const matchSearch = !searchQuery || l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.id.includes(searchQuery);
        const matchStatus = statusFilter === 'all' || l.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const tierBadge = (tier: string) => {
        if (tier === 'showcase') return <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-full"><Crown size={10} />{t('tier_showcase')}</span>;
        if (tier === 'premium') return <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-violet-600 bg-violet-500/10 px-1.5 py-0.5 rounded-full"><Sparkles size={10} />{t('tier_premium')}</span>;
        return null;
    };

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: 'bg-emerald-500/10 text-emerald-600',
            pending: 'bg-amber-500/10 text-amber-600',
            rejected: 'bg-rose-500/10 text-rose-600',
            passive: 'bg-slate-500/10 text-slate-600',
            sold: 'bg-blue-500/10 text-blue-600',
        };
        const labels: Record<string, string> = {
            active: t('listing_status_active'),
            pending: t('listing_status_pending'),
            rejected: t('listing_status_rejected'),
            passive: t('listing_status_passive'),
            sold: t('listing_status_sold'),
        };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] ?? styles.passive}`}>{labels[status] ?? status}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('listing_management')}</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">
                        {t('listing_summary', { total: listings.length, pending: pendingCount })}
                    </p>
                </div>
            </div>

            <Card className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                            <input
                                type="text"
                                placeholder={t('search_listings')}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'pending', 'active', 'rejected'] as StatusFilter[]).map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${statusFilter === s
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
                                    }`}
                            >
                                {s === 'all' ? t('filter_all') : s === 'pending' ? t('filter_pending', { count: pendingCount }) : s === 'active' ? t('listing_status_active') : t('listing_status_rejected')}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {loading ? (
                <div className="text-center py-12 text-[var(--color-muted)]">{t('loading')}</div>
            ) : (
                <div className="space-y-3">
                    {filtered.length === 0 ? (
                        <Card className="p-8 text-center text-[var(--color-muted)]">{t('no_listings_found')}</Card>
                    ) : filtered.map(listing => (
                        <Card key={listing.id} className={`p-4 ${listing.status === 'pending' ? 'border-amber-500/30' : ''}`}>
                            <div className="flex gap-4 items-center">
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative bg-[var(--color-surface-elevated)]">
                                    <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="80px" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-[var(--color-muted)] font-mono">#{listing.id}</span>
                                        {listing.tier && tierBadge(listing.tier)}
                                        {statusBadge(listing.status)}
                                    </div>
                                    <h3 className="font-semibold text-[var(--color-foreground)] text-sm truncate">{listing.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-muted)]">
                                        <span className="font-semibold text-[var(--color-primary)]">{listing.price.toLocaleString('tr-TR')} {listing.currency}</span>
                                        <span>•</span>
                                        <span>{listing.seller.name}</span>
                                        <span>•</span>
                                        <span>{listing.location.city}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {listing.status === 'pending' && (
                                        <>
                                            <Button size="sm" onClick={() => updateStatus(listing.id, 'active')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs">
                                                <CheckCircle size={14} /> {t('approve')}
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => updateStatus(listing.id, 'rejected')} className="text-rose-500 border-rose-500/30 hover:bg-rose-500/10 text-xs">
                                                <XCircle size={14} /> {t('reject')}
                                            </Button>
                                        </>
                                    )}
                                    {listing.status === 'rejected' && (
                                        <Button size="sm" onClick={() => updateStatus(listing.id, 'active')} className="text-xs">
                                            <CheckCircle size={14} /> {t('reapprove')}
                                        </Button>
                                    )}
                                    {listing.status === 'active' && (
                                        <Button size="sm" variant="ghost" onClick={() => updateStatus(listing.id, 'rejected')} className="text-rose-500 text-xs">
                                            <Trash2 size={14} /> {t('remove')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}