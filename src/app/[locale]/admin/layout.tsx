'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, Users, Shield, Share2, ListChecks, Sparkles, LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/auth/RouteGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const t = useTranslations('Admin');
    const { user } = useAuth();

    return (
        <RouteGuard requireAuth requireAdmin>
            <div className="flex h-screen bg-[var(--color-background)]">
                <aside className={`bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                    <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between h-16">
                        <div className={`flex items-center gap-2.5 ${!sidebarOpen && 'hidden'}`}>
                            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                                <Shield size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-lg text-[var(--color-foreground)]">{t('panel_title')}</span>
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-[var(--color-surface-elevated)] rounded-lg text-[var(--color-muted)] transition-colors">
                            <Menu size={20} />
                        </button>
                    </div>

                    {sidebarOpen && user && (
                        <div className="p-4 border-b border-[var(--color-border)]">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                    <span className="text-sm font-bold text-[var(--color-primary)]">{user.name.charAt(0)}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-[var(--color-foreground)] truncate">{user.name}</p>
                                    <p className="text-xs text-[var(--color-muted)]">{t('admin_role')}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <nav className="p-3 space-y-1">
                        <AdminLink href="/admin" icon={LayoutDashboard} label={t('dashboard')} collapsed={!sidebarOpen} />
                        <AdminLink href="/admin/listings" icon={ListChecks} label={t('listings')} collapsed={!sidebarOpen} />
                        <AdminLink href="/admin/users" icon={Users} label={t('users')} collapsed={!sidebarOpen} />
                        <AdminLink href="/admin/pages" icon={FileText} label={t('pages')} collapsed={!sidebarOpen} />
                        <AdminLink href="/admin/ai" icon={Sparkles} label={t('ai')} collapsed={!sidebarOpen} />
                        <AdminLink href="/admin/social" icon={Share2} label={t('social')} collapsed={!sidebarOpen} />
                        <AdminLink href="/admin/settings" icon={Settings} label={t('settings')} collapsed={!sidebarOpen} />
                        <div className="pt-3 mt-3 border-t border-[var(--color-border)]">
                            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors">
                                <LogOut size={20} />
                                {!sidebarOpen ? null : <span className="text-sm font-medium">{t('back_to_site')}</span>}
                            </Link>
                        </div>
                    </nav>
                </aside>

                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </RouteGuard>
    );
}

function AdminLink({ href, icon: Icon, label, collapsed }: { href: string; icon: LucideIcon; label: string; collapsed?: boolean }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2.5 text-[var(--color-foreground)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] rounded-xl transition-colors">
            <Icon size={20} />
            {collapsed ? null : <span className="text-sm">{label}</span>}
        </Link>
    );
}
