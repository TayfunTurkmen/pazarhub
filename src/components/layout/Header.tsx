'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, User, UserPlus, PlusCircle, Menu, X, ChevronDown, LayoutDashboard, Heart, MessageSquare, Settings, LogOut, Shield, Store } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ModeToggle } from '@/components/mode-toggle';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';

export default function Header() {
    const t = useTranslations('Header');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-[var(--color-surface)]/85 backdrop-blur-xl border-b border-[var(--color-border)]">
            {/* Top Bar */}
            <div className="container-custom h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-[var(--color-primary)] flex items-center gap-2.5 shrink-0 group">
                    <span className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-blue-700 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-lg shadow-[var(--color-primary)]/20 group-hover:shadow-[var(--color-primary)]/40 transition-shadow">S</span>
                    <span className="hidden sm:inline tracking-tight">SahibindenKonutAl</span>
                    <span className="sm:hidden font-black">SKA</span>
                </Link>

                {/* Search Bar - Desktop */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('search_placeholder')}
                        className="w-full pl-4 pr-12 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-sm transition-all"
                    />
                    <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors">
                        <Search size={18} />
                    </button>
                </form>

                {/* Actions - Desktop */}
                <div className="hidden md:flex items-center gap-2 shrink-0">
                    <UserActions />
                    <Link href="/post-ad" className="flex items-center gap-1.5 bg-gradient-to-r from-[var(--color-primary)] to-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[var(--color-primary)]/25 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        <PlusCircle size={16} />
                        <span>{t('post_ad')}</span>
                    </Link>
                    <div className="flex items-center gap-1.5 border-l border-[var(--color-border)] pl-2 ml-1">
                        <ModeToggle />
                        <LanguageSwitcher />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-[var(--color-foreground)] hover:text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary)]/10 transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Category Navigation Bar */}
            <div className="hidden md:block border-t border-[var(--color-border)] bg-[var(--color-surface)]/50">
                <div className="container-custom flex items-center gap-1 h-10 overflow-x-auto">
                    {[
                        { name: 'Emlak', slug: 'emlak', emoji: '🏠' },
                        { name: 'Vasıta', slug: 'vasita', emoji: '🚗' },
                        { name: 'Alışveriş', slug: 'alisveris', emoji: '🛍️' },
                    ].map(cat => (
                        <Link
                            key={cat.slug}
                            href={`/category/${cat.slug}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-lg transition-colors whitespace-nowrap"
                        >
                            <span>{cat.emoji}</span>
                            <span>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-4 animate-fade-in">
                    <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('search_placeholder')}
                            className="w-full pl-4 pr-12 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 text-sm"
                        />
                        <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-[var(--color-muted)]">
                            <Search size={18} />
                        </button>
                    </form>

                    {/* Mobile Categories */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { name: 'Emlak', slug: 'emlak', emoji: '🏠' },
                            { name: 'Vasıta', slug: 'vasita', emoji: '🚗' },
                            { name: 'Alışveriş', slug: 'alisveris', emoji: '🛍️' },
                        ].map(cat => (
                            <Link
                                key={cat.slug}
                                href={`/category/${cat.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl text-xs font-medium text-[var(--color-foreground)]"
                            >
                                <span>{cat.emoji}</span>
                                <span>{cat.name}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <UserActions mobile />
                        <Link href="/post-ad" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 justify-center bg-gradient-to-r from-[var(--color-primary)] to-blue-700 text-white px-4 py-3 rounded-xl text-sm font-semibold w-full">
                            <PlusCircle size={16} />
                            <span>{t('post_ad')}</span>
                        </Link>
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                        <span className="text-sm font-medium text-[var(--color-muted)]">{t('settings')}</span>
                        <div className="flex gap-3">
                            <ModeToggle />
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

function UserActions({ mobile }: { mobile?: boolean }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const t = useTranslations('Header');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    if (user) {
        if (mobile) {
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-elevated)] rounded-xl">
                        <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[var(--color-foreground)]">{user.name}</p>
                            <p className="text-xs text-[var(--color-muted)] capitalize">{user.type === 'corporate' ? t('corporate') : t('individual')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[var(--color-foreground)] border border-[var(--color-border)] py-2.5 px-3 rounded-xl justify-center">
                            <LayoutDashboard size={14} /> Panelim
                        </Link>
                        {user.type === 'corporate' && (
                            <Link href={`/seller/${user.id}`} className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] border border-[var(--color-primary)]/30 py-2.5 px-3 rounded-xl justify-center">
                                <Store size={14} /> Mağazam
                            </Link>
                        )}
                        {user.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] border border-[var(--color-primary)]/30 py-2.5 px-3 rounded-xl justify-center">
                                <Shield size={14} /> Admin
                            </Link>
                        )}
                    </div>
                    <button
                        onClick={() => { logout(); router.push('/'); }}
                        className="w-full text-sm text-rose-500 border border-rose-200 py-2.5 rounded-xl font-medium"
                    >
                        {t('logout')}
                    </button>
                </div>
            );
        }

        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors"
                >
                    <div className="w-8 h-8 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                        {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-foreground)] hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown size={14} className={`text-[var(--color-muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in">
                        <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                            <p className="text-sm font-semibold text-[var(--color-foreground)]">{user.name}</p>
                            <p className="text-xs text-[var(--color-muted)]">{user.email}</p>
                        </div>
                        <div className="p-1.5">
                            <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface-elevated)] rounded-xl transition-colors">
                                <LayoutDashboard size={16} className="text-[var(--color-muted)]" /> Panelim
                            </Link>
                            <Link href="/dashboard?tab=favorites" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface-elevated)] rounded-xl transition-colors">
                                <Heart size={16} className="text-[var(--color-muted)]" /> Favorilerim
                            </Link>
                            <Link href="/dashboard?tab=messages" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface-elevated)] rounded-xl transition-colors">
                                <MessageSquare size={16} className="text-[var(--color-muted)]" /> Mesajlarım
                            </Link>
                            {user.type === 'corporate' && (
                                <Link href={`/seller/${user.id}`} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-xl transition-colors">
                                    <Store size={16} /> Mağazam
                                </Link>
                            )}
                            {user.role === 'admin' && (
                                <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-xl transition-colors">
                                    <Shield size={16} /> Admin Paneli
                                </Link>
                            )}
                        </div>
                        <div className="p-1.5 border-t border-[var(--color-border)]">
                            <button
                                onClick={() => { logout(); router.push('/'); setDropdownOpen(false); }}
                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl w-full transition-colors"
                            >
                                <LogOut size={16} /> {t('logout')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 ${mobile ? 'flex-col w-full' : ''}`}>
            <Link href="/login" className={`flex items-center gap-1.5 text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors ${mobile ? 'w-full justify-center border border-[var(--color-border)] py-2.5 rounded-xl' : 'px-3 py-2 rounded-xl hover:bg-[var(--color-surface-elevated)]'}`}>
                <User size={16} />
                <span>{t('login')}</span>
            </Link>
            <Link href="/register" className={`text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors ${mobile ? 'w-full justify-center border border-[var(--color-border)] py-2.5 rounded-xl flex items-center gap-1.5' : 'hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-[var(--color-surface-elevated)]'}`}>
                <UserPlus size={16} />
                <span>{t('register')}</span>
            </Link>
        </div>
    );
}
