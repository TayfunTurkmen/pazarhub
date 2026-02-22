'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LISTINGS } from '@/services/mockData';
import { Search, CheckCircle, XCircle, Eye, Clock, Crown, Sparkles, Filter, Trash2 } from 'lucide-react';
import Image from 'next/image';

type StatusFilter = 'all' | 'active' | 'pending' | 'rejected';

export default function AdminListingsPage() {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Create mock statuses for demo
    const [listingStatuses, setListingStatuses] = useState<Record<string, 'active' | 'pending' | 'rejected'>>(() => {
        const statuses: Record<string, string> = {};
        LISTINGS.forEach((l, i) => {
            statuses[l.id] = i % 5 === 0 ? 'pending' : i % 7 === 0 ? 'rejected' : 'active';
        });
        return statuses as any;
    });

    const filtered = LISTINGS.filter(l => {
        const matchSearch = !searchQuery || l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.id.includes(searchQuery);
        const matchStatus = statusFilter === 'all' || listingStatuses[l.id] === statusFilter;
        return matchSearch && matchStatus;
    });

    const approveListing = (id: string) => setListingStatuses(prev => ({ ...prev, [id]: 'active' }));
    const rejectListing = (id: string) => setListingStatuses(prev => ({ ...prev, [id]: 'rejected' }));

    const pendingCount = Object.values(listingStatuses).filter(s => s === 'pending').length;

    const tierBadge = (tier: string) => {
        if (tier === 'showcase') return <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-full"><Crown size={10} />VİTRİN</span>;
        if (tier === 'premium') return <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-violet-600 bg-violet-500/10 px-1.5 py-0.5 rounded-full"><Sparkles size={10} />PREMIUM</span>;
        return null;
    };

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: 'bg-emerald-500/10 text-emerald-600',
            pending: 'bg-amber-500/10 text-amber-600',
            rejected: 'bg-rose-500/10 text-rose-600',
        };
        const labels: Record<string, string> = { active: 'Aktif', pending: 'Onay Bekliyor', rejected: 'Reddedildi' };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">İlan Yönetimi</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">
                        Toplam {LISTINGS.length} ilan • <span className="text-amber-500 font-medium">{pendingCount} onay bekliyor</span>
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                            <input
                                type="text"
                                placeholder="İlan başlığı veya numarası ile ara..."
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
                                {s === 'all' ? 'Tümü' : s === 'pending' ? `Bekleyen (${pendingCount})` : s === 'active' ? 'Aktif' : 'Reddedilen'}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Listings */}
            <div className="space-y-3">
                {filtered.map(listing => {
                    const status = listingStatuses[listing.id] || 'active';
                    return (
                        <Card key={listing.id} className={`p-4 ${status === 'pending' ? 'border-amber-500/30' : ''}`}>
                            <div className="flex gap-4 items-center">
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative bg-[var(--color-surface-elevated)]">
                                    <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="80px" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-[var(--color-muted)] font-mono">#{listing.id}</span>
                                        {listing.tier && tierBadge(listing.tier)}
                                        {statusBadge(status)}
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
                                    {status === 'pending' && (
                                        <>
                                            <Button size="sm" onClick={() => approveListing(listing.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs">
                                                <CheckCircle size={14} /> Onayla
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => rejectListing(listing.id)} className="text-rose-500 border-rose-500/30 hover:bg-rose-500/10 text-xs">
                                                <XCircle size={14} /> Reddet
                                            </Button>
                                        </>
                                    )}
                                    {status === 'rejected' && (
                                        <Button size="sm" onClick={() => approveListing(listing.id)} className="text-xs">
                                            <CheckCircle size={14} /> Tekrar Onayla
                                        </Button>
                                    )}
                                    {status === 'active' && (
                                        <Button size="sm" variant="ghost" onClick={() => rejectListing(listing.id)} className="text-rose-500 text-xs">
                                            <Trash2 size={14} /> Kaldır
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
