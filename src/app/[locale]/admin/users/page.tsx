'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Search, Shield, ShieldCheck, Ban, Eye, Building2, User as UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { User } from '@/types';

interface AdminUser extends User {
    listingsCount: number;
}

export default function AdminUsersPage() {
    const t = useTranslations('Admin');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'individual' | 'corporate'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned' | 'pending'>('all');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(json => {
                if (json.success) setUsers(json.data);
            })
            .finally(() => setLoading(false));
    }, []);

    const updateUserStatus = async (userId: string, status: 'active' | 'banned' | 'pending') => {
        const res = await fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        const json = await res.json();
        if (json.success) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...json.data, listingsCount: u.listingsCount } : u));
        }
    };

    const filtered = users.filter(u => {
        const matchSearch = !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = filterType === 'all' || u.type === filterType;
        const matchStatus = filterStatus === 'all' || (u.status ?? 'active') === filterStatus;
        return matchSearch && matchType && matchStatus;
    });

    const toggleBan = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;
        const nextStatus = user.status === 'banned' ? 'active' : 'banned';
        updateUserStatus(userId, nextStatus);
    };

    const approveUser = (userId: string) => {
        updateUserStatus(userId, 'active');
    };

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: 'bg-emerald-500/10 text-emerald-600',
            banned: 'bg-rose-500/10 text-rose-600',
            pending: 'bg-amber-500/10 text-amber-600',
        };
        const labels: Record<string, string> = { active: 'Aktif', banned: 'Yasaklı', pending: 'Onay Bekliyor' };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('user_management')}</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">{t('total_users', { count: users.length })}</p>
                </div>
            </div>

            <Card className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                            <input
                                type="text"
                                placeholder={t('search_users')}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] text-sm"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value as 'all' | 'individual' | 'corporate')}
                    >
                        <option value="all">{t('all_types')}</option>
                        <option value="individual">{t('individual')}</option>
                        <option value="corporate">{t('corporate')}</option>
                    </select>
                    <select
                        className="px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] text-sm"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as 'all' | 'active' | 'banned' | 'pending')}
                    >
                        <option value="all">{t('all_statuses')}</option>
                        <option value="active">{t('status_active')}</option>
                        <option value="banned">{t('status_banned')}</option>
                        <option value="pending">{t('status_pending')}</option>
                    </select>
                </div>
            </Card>

            <Card className="overflow-hidden">
                {loading ? (
                    <p className="p-8 text-center text-[var(--color-muted)]">{t('loading')}</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]">
                                <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">{t('user_column')}</th>
                                <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">{t('type_column')}</th>
                                <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">{t('listings_column')}</th>
                                <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">{t('status_column')}</th>
                                <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">{t('joined_column')}</th>
                                <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm text-right">{t('actions_column')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => (
                                <tr key={user.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-violet-500/10' : 'bg-[var(--color-primary)]/10'}`}>
                                                {user.role === 'admin' ? <Shield size={16} className="text-violet-500" /> : <UserIcon size={16} className="text-[var(--color-primary)]" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--color-foreground)] text-sm">{user.name}</p>
                                                <p className="text-xs text-[var(--color-muted)]">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${user.type === 'corporate' ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-500/10 text-slate-600'}`}>
                                            {user.type === 'corporate' ? <Building2 size={10} /> : <UserIcon size={10} />}
                                            {user.type === 'corporate' ? t('corporate') : t('individual')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-[var(--color-foreground)]">{user.listingsCount}</td>
                                    <td className="p-4">{statusBadge(user.status ?? 'active')}</td>
                                    <td className="p-4 text-sm text-[var(--color-muted)]">
                                        {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('tr-TR') : '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                                                className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors"
                                                title={t('view_detail')}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {user.status === 'pending' && (
                                                <button
                                                    onClick={() => approveUser(user.id)}
                                                    className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                    title={t('approve')}
                                                >
                                                    <ShieldCheck size={16} />
                                                </button>
                                            )}
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => toggleBan(user.id)}
                                                    className={`p-2 rounded-lg transition-colors ${user.status === 'banned' ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-rose-500 hover:bg-rose-500/10'}`}
                                                    title={user.status === 'banned' ? t('unban') : t('ban')}
                                                >
                                                    {user.status === 'banned' ? <ShieldCheck size={16} /> : <Ban size={16} />}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>

            {selectedUser && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[var(--color-foreground)]">{t('user_detail')}</h3>
                        <button onClick={() => setSelectedUser(null)} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]">✕</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><span className="text-xs text-[var(--color-muted)] block">{t('name_label')}</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.name}</span></div>
                        <div><span className="text-xs text-[var(--color-muted)] block">{t('email_label')}</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.email}</span></div>
                        <div><span className="text-xs text-[var(--color-muted)] block">{t('phone_label')}</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.phone || '-'}</span></div>
                        <div><span className="text-xs text-[var(--color-muted)] block">{t('listings_column')}</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.listingsCount}</span></div>
                        {selectedUser.storeName && <div><span className="text-xs text-[var(--color-muted)] block">{t('store_label')}</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.storeName}</span></div>}
                        <div><span className="text-xs text-[var(--color-muted)] block">{t('joined_column')}</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.joinedAt ? new Date(selectedUser.joinedAt).toLocaleDateString('tr-TR') : '-'}</span></div>
                    </div>
                </Card>
            )}
        </div>
    );
}
