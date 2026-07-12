'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search, User, PlusCircle, Menu, X, ChevronDown,
  LayoutDashboard, Heart, MessageSquare, LogOut, Shield, Store,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { sanitizeSearchInput } from '@/lib/sanitize';

const NAV_CATEGORIES = [
  { name: 'Emlak', slug: 'emlak', emoji: '🏠' },
  { name: 'Vasıta', slug: 'vasita', emoji: '🚗' },
  { name: 'Alışveriş', slug: 'alisveris', emoji: '🛍️' },
  { name: 'İş İlanları', slug: 'is-ilanlari', emoji: '💼' },
  { name: 'Hizmetler', slug: 'yardimci-hizmetler', emoji: '🔧' },
  { name: 'Turlar', slug: 'turizm', emoji: '✈️' },
  { name: 'Yardım', slug: 'contact', emoji: '❓', isHelp: true },
];

export default function Header() {
  const t = useTranslations('Header');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const safe = sanitizeSearchInput(searchQuery);
    if (safe) {
      router.push(`/search?query=${encodeURIComponent(safe)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm">
      <div className="container-custom h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold text-[var(--color-primary)] flex items-center gap-2 shrink-0 group">
          <span className="w-9 h-9 bg-gradient-to-br from-[var(--color-secondary)] to-amber-400 text-blue-900 rounded-lg flex items-center justify-center text-sm font-black shadow-md">S</span>
          <span className="hidden sm:inline tracking-tight text-[var(--color-foreground)]">
            sahibinden<span className="text-[var(--color-primary)]">konutal</span>.com
          </span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            maxLength={120}
            autoComplete="off"
            className="w-full pl-4 pr-12 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-sm"
          />
          <button type="submit" aria-label={t('search_btn')} className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10">
            <Search size={18} />
          </button>
        </form>

        <div className="hidden md:flex items-center gap-1 shrink-0">
          <Link href="/post-ad" className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] px-3 py-2 rounded-lg transition-colors">
            {t('post_ad')}
          </Link>
          <Link href="/dashboard?tab=favorites" className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] px-3 py-2 rounded-lg transition-colors">
            {t('favorites')}
          </Link>
          <UserActions />
          <ModeToggle />
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-[var(--color-foreground)] hover:text-[var(--color-primary)] rounded-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="hidden md:block border-t border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="container-custom flex items-center gap-0.5 h-10 overflow-x-auto">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.isHelp ? '/contact' : `/category/${cat.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-4">
          <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              maxLength={120}
              className="w-full pl-4 pr-12 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-[var(--color-muted)]">
              <Search size={18} />
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.isHelp ? '/contact' : `/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs font-medium"
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-3">
            <UserActions mobile />
            <Link href="/post-ad" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 justify-center bg-[var(--color-primary)] text-white px-4 py-3 rounded-xl text-sm font-semibold w-full">
              <PlusCircle size={16} />
              {t('post_ad')}
            </Link>
          </div>

          <div className="flex justify-end border-t border-[var(--color-border)] pt-4">
            <LanguageSwitcher />
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
          <div className="flex items-center gap-3 p-3 bg-[var(--color-background)] rounded-xl">
            <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-[var(--color-muted)]">{user.type === 'corporate' ? t('corporate') : t('individual')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm border border-[var(--color-border)] py-2.5 px-3 rounded-xl justify-center">
              <LayoutDashboard size={14} /> Panelim
            </Link>
            {user.type === 'corporate' && (
              <Link href={`/seller/${user.id}`} className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] border border-[var(--color-primary)]/30 py-2.5 px-3 rounded-xl justify-center">
                <Store size={14} /> Mağazam
              </Link>
            )}
            {user.role === 'admin' && (
              <Link href="/admin" className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] border py-2.5 px-3 rounded-xl justify-center">
                <Shield size={14} /> Admin
              </Link>
            )}
          </div>
          <button type="button" onClick={() => { logout(); router.push('/'); }} className="w-full text-sm text-rose-500 border border-rose-200 py-2.5 rounded-xl font-medium">
            {t('logout')}
          </button>
        </div>
      );
    }

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--color-background)]"
          aria-expanded={dropdownOpen}
        >
          <div className="w-8 h-8 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <span className="text-sm font-medium hidden lg:inline max-w-[100px] truncate">{user.name}</span>
          <ChevronDown size={14} className={`text-[var(--color-muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden z-50">
            <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-background)]">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-[var(--color-muted)]">{user.email}</p>
            </div>
            <div className="p-1.5">
              <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-[var(--color-background)] rounded-xl">
                <LayoutDashboard size={16} className="text-[var(--color-muted)]" /> Panelim
              </Link>
              <Link href="/dashboard?tab=favorites" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-[var(--color-background)] rounded-xl">
                <Heart size={16} className="text-[var(--color-muted)]" /> {t('favorites')}
              </Link>
              <Link href="/dashboard?tab=messages" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-[var(--color-background)] rounded-xl">
                <MessageSquare size={16} className="text-[var(--color-muted)]" /> Mesajlarım
              </Link>
              {user.type === 'corporate' && (
                <Link href={`/seller/${user.id}`} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-xl">
                  <Store size={16} /> Mağazam
                </Link>
              )}
              {user.role === 'admin' && (
                <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-xl">
                  <Shield size={16} /> Admin Paneli
                </Link>
              )}
            </div>
            <div className="p-1.5 border-t border-[var(--color-border)]">
              <button type="button" onClick={() => { logout(); router.push('/'); setDropdownOpen(false); }} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl w-full">
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
      <Link href="/login" className={`text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] ${mobile ? 'w-full justify-center border border-[var(--color-border)] py-2.5 rounded-xl flex items-center gap-1.5' : 'px-3 py-2 rounded-lg'}`}>
        <User size={16} className="hidden sm:inline" />
        <span>{t('login')}</span>
      </Link>
      <Link
        href="/register"
        className={`text-sm font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl transition-colors ${mobile ? 'w-full justify-center py-2.5 flex items-center gap-1.5' : 'px-4 py-2'}`}
      >
        {t('register_free')}
      </Link>
    </div>
  );
}
