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
import Logo from '@/components/brand/Logo';

export default function Header() {
  const t = useTranslations('Header');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const NAV_CATEGORIES = [
    { name: t('nav_sale'), href: '/search?listingType=sale' },
    { name: t('nav_rent'), href: '/search?listingType=rent' },
    { name: t('nav_housing'), href: '/category/konut' },
    { name: t('nav_commercial'), href: '/category/isyeri' },
    { name: t('nav_land'), href: '/category/arsa' },
    { name: t('nav_projects'), href: '/#projeler' },
    { name: t('nav_corporate'), href: '/kurumsal' },
    { name: t('nav_doping'), href: '/doping' },
    { name: t('nav_escrow'), href: '/param-guvende' },
    { name: t('nav_blog'), href: '/blog' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const safe = sanitizeSearchInput(searchQuery);
    if (safe) {
      router.push(`/search?query=${encodeURIComponent(safe)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[var(--color-navy)] text-white border-b border-white/10">
        <div className="container-custom h-8 flex items-center justify-between text-[11px] font-semibold">
          <p className="truncate text-white/90">{t('topbar')}</p>
          <div className="hidden sm:flex items-center gap-4 text-white/80">
            <Link href="/about" className="hover:text-[var(--color-primary-light)]">{t('about_short')}</Link>
            <Link href="/contact" className="hover:text-[var(--color-primary-light)]">{t('help_short')}</Link>
            <span>444 76 66</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="container-custom h-16 flex items-center justify-between gap-4">
          <Logo />

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
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
            <Link href="/dashboard?tab=favorites" className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] px-3 py-2 rounded-lg">
              {t('favorites')}
            </Link>
            <UserActions />
            <Link href="/post-ad" className="ml-1 inline-flex items-center gap-1.5 bg-[var(--color-brand-accent)] hover:bg-[var(--color-secondary-dark)] text-white px-4 py-2 rounded-xl text-sm font-extrabold">
              <PlusCircle size={16} />
              {t('post_ad')}
            </Link>
            <ModeToggle />
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-[var(--color-foreground)] rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t('menu_close') : t('menu_open')}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className="hidden md:block bg-[var(--color-navy)]">
        <div className="container-custom flex items-center gap-1 h-11 overflow-x-auto">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-[var(--color-primary-light)] whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-4">
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
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="space-y-3">
            <UserActions mobile />
            <Link href="/post-ad" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 justify-center bg-[var(--color-brand-accent)] text-white px-4 py-3 rounded-xl text-sm font-extrabold w-full">
              <PlusCircle size={16} />
              {t('post_ad')}
            </Link>
          </div>

          <div className="flex justify-end border-t border-[var(--color-border)] pt-4 gap-2">
            <ModeToggle />
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
        className={`text-sm font-semibold border border-[var(--color-navy)] text-[var(--color-navy)] dark:text-white dark:border-white/30 rounded-xl ${mobile ? 'w-full justify-center py-2.5 flex items-center gap-1.5' : 'px-4 py-2'}`}
      >
        {t('register_free')}
      </Link>
    </div>
  );
}
