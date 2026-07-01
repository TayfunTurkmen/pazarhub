'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { BarChart3, Users, FileText, Clock, Eye, TrendingUp, ArrowUpRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface AdminStats {
    listingCount: number;
    userCount: number;
    pendingCount: number;
    showcaseCount: number;
    corporateUsers: number;
    dailyViews: number;
    recentListings: { id: string; title: string; status: string; createdAt: string; sellerName: string }[];
    recentUsers: { id: string; name: string; type: string; joinedAt?: string }[];
}

export default function AdminDashboard() {
    const t = useTranslations('Admin');
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadStats = useCallback(async () => {
        setRefreshing(true);
        try {
            const res = await fetch('/api/admin/stats');
            const json = await res.json();
            if (json.success) {
                setStats(json.data);
                setLastRefresh(new Date());
            }
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, [loadStats]);

    const listingCount = stats?.listingCount ?? 0;
    const userCount = stats?.userCount ?? 0;
    const pendingCount = stats?.pendingCount ?? 0;
    const dailyViews = stats?.dailyViews ?? 0;

    const statCards = [
        { title: t('total_listings'), value: listingCount.toLocaleString('tr-TR'), icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: t('showcase_trend', { count: stats?.showcaseCount ?? 0 }) },
        { title: t('registered_users'), value: userCount.toLocaleString('tr-TR'), icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: t('corporate_trend', { count: stats?.corporateUsers ?? 0 }) },
        { title: t('pending_approval'), value: pendingCount.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '' },
        { title: t('daily_views'), value: dailyViews.toLocaleString('tr-TR'), icon: Eye, color: 'text-violet-500', bg: 'bg-violet-500/10', trend: '+18%' },
    ];

    const activities = [
        stats?.recentListings[0] ? { type: 'listing', text: t('activity_new_listing'), detail: stats.recentListings[0].title, time: t('activity_5min'), color: 'bg-emerald-500' } : null,
        stats?.recentUsers[0] ? { type: 'user', text: t('activity_new_user'), detail: stats.recentUsers[0].name, time: t('activity_15min'), color: 'bg-blue-500' } : null,
        stats?.recentListings.find(l => l.status === 'pending') ? { type: 'approval', text: t('activity_pending'), detail: stats.recentListings.find(l => l.status === 'pending')!.title, time: t('activity_30min'), color: 'bg-amber-500' } : null,
        stats?.recentUsers.find(u => u.type === 'corporate') ? { type: 'verify', text: t('activity_verified'), detail: stats.recentUsers.find(u => u.type === 'corporate')!.name, time: t('activity_1hr'), color: 'bg-violet-500' } : null,
    ].filter(Boolean) as { type: string; text: string; detail: string; time: string; color: string }[];

    if (loading) {
        return <div className="p-8 text-center text-[var(--color-muted)]">{t('loading')}</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('dashboard')}</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">{t('dashboard_desc')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadStats}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-colors"
                    >
                        <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                        {t('refresh')}
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                        <ShieldCheck size={16} />
                        {t('system_active')}
                    </div>
                </div>
            </div>

            <p className="text-xs text-[var(--color-muted)] -mt-4">
                {t('last_refresh', { time: lastRefresh.toLocaleTimeString('tr-TR') })}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="p-5 hover:shadow-lg hover:border-[var(--color-primary)]/20 group">
                        <div className="flex items-start justify-between">
                            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                <stat.icon size={20} className={stat.color} />
                            </div>
                            {stat.trend && (
                                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-500">
                                    <TrendingUp size={12} />
                                    {stat.trend}
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-bold mt-3 text-[var(--color-foreground)]">{stat.value}</p>
                        <p className="text-sm text-[var(--color-muted)] mt-1">{stat.title}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-[var(--color-foreground)]">{t('recent_activities')}</h2>
                        <Link href="/admin/listings" className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1">
                            {t('view_all')} <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {activities.length === 0 ? (
                            <p className="text-sm text-[var(--color-muted)]">{t('no_activities')}</p>
                        ) : activities.map((activity, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="relative mt-1">
                                    <span className={`w-2.5 h-2.5 rounded-full ${activity.color} block`}></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[var(--color-foreground)]">
                                        {activity.text}: <span className="font-semibold">&quot;{activity.detail}&quot;</span>
                                    </p>
                                    <p className="text-xs text-[var(--color-muted)] mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-lg font-bold mb-5 text-[var(--color-foreground)]">{t('quick_actions')}</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: FileText, label: t('manage_pages'), color: 'text-blue-500', bg: 'bg-blue-500/10', href: '/admin/pages' },
                            { icon: Users, label: t('manage_users'), color: 'text-emerald-500', bg: 'bg-emerald-500/10', href: '/admin/users' },
                            { icon: BarChart3, label: t('view_reports'), color: 'text-violet-500', bg: 'bg-violet-500/10', href: '/admin/listings' },
                            { icon: Clock, label: t('review_pending'), color: 'text-amber-500', bg: 'bg-amber-500/10', href: '/admin/listings' },
                        ].map((action) => (
                            <Link key={action.label} href={action.href} className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)]/20 transition-all text-left group">
                                <div className={`w-9 h-9 ${action.bg} rounded-lg flex items-center justify-center`}>
                                    <action.icon size={18} className={action.color} />
                                </div>
                                <span className="text-sm font-medium text-[var(--color-foreground)]">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}