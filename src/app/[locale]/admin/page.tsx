'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { BarChart3, Users, FileText, Clock, Eye, TrendingUp, ArrowUpRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { LISTINGS, CATEGORIES } from '@/services/mockData';
import { getPages } from '@/services/cmsData';

export default function AdminDashboard() {
    const t = useTranslations('Admin');
    const [listingCount, setListingCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [dailyViews, setDailyViews] = useState(0);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);

    const loadStats = async () => {
        setRefreshing(true);
        // Real-time counts from mock data
        setListingCount(LISTINGS.length);
        setCategoryCount(CATEGORIES.filter(c => !c.parentId).length);
        const pages = await getPages();
        setPageCount(pages.length);
        // Simulated user count (from mock data we have 5 users)
        setUserCount(5);
        // Simulated daily views - random realistic number
        setDailyViews(Math.floor(Math.random() * 5000) + 3000);
        setLastRefresh(new Date());
        setTimeout(() => setRefreshing(false), 500);
    };

    useEffect(() => {
        loadStats();
        // Auto-refresh every 30 seconds
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const pendingListings = LISTINGS.filter(l => l.status === 'active').length;

    const stats = [
        { title: t('total_listings'), value: listingCount.toLocaleString('tr-TR'), icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: `${LISTINGS.filter(l => l.tier === 'showcase').length} vitrin` },
        { title: t('registered_users'), value: userCount.toLocaleString('tr-TR'), icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: `${LISTINGS.filter(l => l.seller.type === 'corporate').length} kurumsal` },
        { title: t('pending_approval'), value: pendingListings.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '' },
        { title: t('daily_views'), value: dailyViews.toLocaleString('tr-TR'), icon: Eye, color: 'text-violet-500', bg: 'bg-violet-500/10', trend: '+18%' },
    ];

    const activities = [
        { type: 'listing', text: t('activity_new_listing'), detail: LISTINGS[0]?.title || 'Yeni İlan', time: t('activity_5min'), color: 'bg-emerald-500' },
        { type: 'user', text: t('activity_new_user'), detail: 'Ayşe Demir (Bireysel)', time: t('activity_15min'), color: 'bg-blue-500' },
        { type: 'approval', text: t('activity_pending'), detail: LISTINGS[1]?.title || 'Bekleyen İlan', time: t('activity_30min'), color: 'bg-amber-500' },
        { type: 'verify', text: t('activity_verified'), detail: 'Emlak Plus Gayrimenkul', time: t('activity_1hr'), color: 'bg-violet-500' },
    ];

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
                        Yenile
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                        <ShieldCheck size={16} />
                        {t('system_active')}
                    </div>
                </div>
            </div>

            {/* Last refresh info */}
            <p className="text-xs text-[var(--color-muted)] -mt-4">
                Son güncelleme: {lastRefresh.toLocaleTimeString('tr-TR')} • Otomatik yenileme: 30sn
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
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
                {/* Recent Activities */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-[var(--color-foreground)]">{t('recent_activities')}</h2>
                        <button className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1">
                            {t('view_all')} <ArrowUpRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {activities.map((activity, i) => (
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

                {/* Quick Actions */}
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
