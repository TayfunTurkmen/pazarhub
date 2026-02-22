'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Users, Search, Shield, ShieldCheck, Ban, Eye, MoreVertical, UserPlus, Mail, Phone, Calendar, Building2, User as UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MockUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: 'individual' | 'corporate';
    role: 'user' | 'admin';
    status: 'active' | 'banned' | 'pending';
    storeName?: string;
    listingsCount: number;
    joinedAt: string;
}

const MOCK_USERS: MockUser[] = [
    { id: 'u1', name: 'Ahmet Yılmaz', email: 'ahmet@example.com', phone: '+90 555 111 22 33', type: 'individual', role: 'user', status: 'active', listingsCount: 8, joinedAt: '2025-06-15' },
    { id: 'u2', name: 'Emlak Plus Gayrimenkul', email: 'info@emlakplus.com', phone: '+90 212 333 44 55', type: 'corporate', role: 'user', status: 'active', storeName: 'Emlak Plus', listingsCount: 45, joinedAt: '2025-03-20' },
    { id: 'u3', name: 'Fatma Demir', email: 'fatma@example.com', phone: '+90 532 666 77 88', type: 'individual', role: 'user', status: 'active', listingsCount: 3, joinedAt: '2025-09-10' },
    { id: 'u4', name: 'AutoCenter İstanbul', email: 'info@autocenter.com', phone: '+90 216 999 00 11', type: 'corporate', role: 'user', status: 'active', storeName: 'AutoCenter', listingsCount: 67, joinedAt: '2025-01-05' },
    { id: 'u5', name: 'Admin Kullanıcı', email: 'admin@example.com', phone: '+90 555 000 00 00', type: 'individual', role: 'admin', status: 'active', listingsCount: 0, joinedAt: '2024-12-01' },
    { id: 'u6', name: 'Mehmet Kaya', email: 'mehmet@example.com', phone: '+90 544 222 33 44', type: 'individual', role: 'user', status: 'banned', listingsCount: 0, joinedAt: '2025-07-22' },
    { id: 'u7', name: 'Zeynep Arslan', email: 'zeynep@example.com', phone: '+90 533 444 55 66', type: 'individual', role: 'user', status: 'pending', listingsCount: 1, joinedAt: '2025-12-18' },
];

export default function AdminUsersPage() {
    const t = useTranslations('Admin');
    const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'individual' | 'corporate'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned' | 'pending'>('all');
    const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

    const filtered = users.filter(u => {
        const matchSearch = !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = filterType === 'all' || u.type === filterType;
        const matchStatus = filterStatus === 'all' || u.status === filterStatus;
        return matchSearch && matchType && matchStatus;
    });

    const toggleBan = (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' as any } : u));
    };

    const approveUser = (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' as any } : u));
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
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Kullanıcı Yönetimi</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">Toplam {users.length} kayıtlı kullanıcı</p>
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
                                placeholder="Ad veya e-posta ile ara..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] text-sm"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value as any)}
                    >
                        <option value="all">Tüm Tipler</option>
                        <option value="individual">Bireysel</option>
                        <option value="corporate">Kurumsal</option>
                    </select>
                    <select
                        className="px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] text-sm"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as any)}
                    >
                        <option value="all">Tüm Durumlar</option>
                        <option value="active">Aktif</option>
                        <option value="banned">Yasaklı</option>
                        <option value="pending">Onay Bekliyor</option>
                    </select>
                </div>
            </Card>

            {/* Users Table */}
            <Card className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]">
                            <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">Kullanıcı</th>
                            <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">Tip</th>
                            <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">İlan</th>
                            <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">Durum</th>
                            <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">Kayıt</th>
                            <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm text-right">İşlem</th>
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
                                        {user.type === 'corporate' ? 'Kurumsal' : 'Bireysel'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-[var(--color-foreground)]">{user.listingsCount}</td>
                                <td className="p-4">{statusBadge(user.status)}</td>
                                <td className="p-4 text-sm text-[var(--color-muted)]">{new Date(user.joinedAt).toLocaleDateString('tr-TR')}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                                            className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors"
                                            title="Detay"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {user.status === 'pending' && (
                                            <button
                                                onClick={() => approveUser(user.id)}
                                                className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                title="Onayla"
                                            >
                                                <ShieldCheck size={16} />
                                            </button>
                                        )}
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => toggleBan(user.id)}
                                                className={`p-2 rounded-lg transition-colors ${user.status === 'banned' ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-rose-500 hover:bg-rose-500/10'}`}
                                                title={user.status === 'banned' ? 'Yasağı Kaldır' : 'Yasakla'}
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
            </Card>

            {/* User Detail Drawer */}
            {selectedUser && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[var(--color-foreground)]">Kullanıcı Detayı</h3>
                        <button onClick={() => setSelectedUser(null)} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]">✕</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><span className="text-xs text-[var(--color-muted)] block">Ad Soyad</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.name}</span></div>
                        <div><span className="text-xs text-[var(--color-muted)] block">E-posta</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.email}</span></div>
                        <div><span className="text-xs text-[var(--color-muted)] block">Telefon</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.phone}</span></div>
                        <div><span className="text-xs text-[var(--color-muted)] block">İlan Sayısı</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.listingsCount}</span></div>
                        {selectedUser.storeName && <div><span className="text-xs text-[var(--color-muted)] block">Mağaza</span><span className="font-medium text-[var(--color-foreground)]">{selectedUser.storeName}</span></div>}
                        <div><span className="text-xs text-[var(--color-muted)] block">Kayıt Tarihi</span><span className="font-medium text-[var(--color-foreground)]">{new Date(selectedUser.joinedAt).toLocaleDateString('tr-TR')}</span></div>
                    </div>
                </Card>
            )}
        </div>
    );
}
