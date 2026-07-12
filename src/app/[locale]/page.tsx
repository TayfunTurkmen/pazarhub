import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getListings } from '@/services/serverData';
import { CATEGORIES } from '@/services/mockData';
import ListingCard from '@/components/listing/ListingCard';
import CategorySidebar from '@/components/home/CategorySidebar';
import HeroSearch from '@/components/home/HeroSearch';
import StatsBar from '@/components/home/StatsBar';
import ListingCarousel from '@/components/home/ListingCarousel';
import CategoryExploreGrid from '@/components/home/CategoryExploreGrid';
import TrustBanner from '@/components/home/TrustBanner';
import {
  Building2, Car, ShoppingBag, UserPlus, FileText, MessageCircle,
  ArrowRight, ShieldCheck, TreePalm, Wrench, PawPrint, Briefcase,
  type LucideIcon,
} from 'lucide-react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1920&auto=format&fit=crop';

const categoryIcons: Record<string, LucideIcon> = {
  Building2, Car, ShoppingBag, Palmtree: TreePalm, Wrench, PawPrint, Briefcase,
};

export default async function HomePage() {
  const allListings = await getListings({});
  const t = await getTranslations('Home');

  const rootCategories = CATEGORIES.filter((c) => !c.parentId);
  const showcaseListings = allListings.filter((l) => l.tier === 'showcase');
  const premiumListings = allListings.filter((l) => l.tier === 'premium');
  const standardListings = allListings.filter((l) => l.tier === 'standard').slice(0, 8);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-16 2xl:-mx-24 -mt-8 overflow-hidden min-h-[480px]">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/50 to-blue-900/80" />

        <div className="relative px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 pt-12 pb-10">
          <div className="max-w-7xl mx-auto">
            {/* Security badge */}
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-2 bg-white/95 dark:bg-[var(--color-surface)]/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg border border-white/30">
                <ShieldCheck size={20} className="text-[var(--color-primary)]" />
                <div className="text-left">
                  <p className="text-xs font-bold text-[var(--color-foreground)]">{t('security_badge_title')}</p>
                  <p className="text-[10px] text-[var(--color-muted)]">{t('security_badge_desc')}</p>
                </div>
              </div>
            </div>

            <div className="text-center text-white space-y-4 mb-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                {t('hero_title_1')}{' '}
                <span className="text-[var(--color-secondary)]">{t('hero_title_2')}</span>{' '}
                {t('hero_title_3')}
              </h1>
            </div>

            <HeroSearch categories={rootCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))} />

            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {rootCategories.slice(0, 6).map((cat) => {
                const Icon = categoryIcons[cat.icon || ''] || Building2;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full text-sm text-white/90 font-medium border border-white/20 transition-colors"
                  >
                    <Icon size={14} />
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <StatsBar />

      <div className="space-y-10 py-8">
        {/* Main content */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="hidden md:block md:col-span-3">
            <div className="sticky top-24">
              <CategorySidebar rootCategories={rootCategories} allCategories={CATEGORIES} />
            </div>
          </div>

          <div className="md:col-span-9 space-y-10">
            {/* Showcase */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--color-foreground)]">{t('featured_listings')}</h2>
                <Link href="/search?tier=showcase" className="text-sm text-[var(--color-primary)] hover:underline font-medium flex items-center gap-1">
                  {t('view_all')} <ArrowRight size={14} />
                </Link>
              </div>
              <ListingCarousel listings={showcaseListings} badge="showcase" />
            </div>

            {/* Premium */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--color-foreground)]">{t('premium_listings')}</h2>
                <Link href="/search?tier=premium" className="text-sm text-[var(--color-primary)] hover:underline font-medium flex items-center gap-1">
                  {t('view_all')} <ArrowRight size={14} />
                </Link>
              </div>
              <ListingCarousel listings={premiumListings} badge="premium" />
            </div>

            <CategoryExploreGrid />

            {/* Latest listings */}
            {standardListings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[var(--color-foreground)]">{t('latest_listings')}</h2>
                  <Link href="/search" className="text-sm text-[var(--color-primary)] hover:underline font-medium flex items-center gap-1">
                    {t('view_all')} <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {standardListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} showVerified />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <TrustBanner />

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-10 text-[var(--color-foreground)]">{t('how_it_works')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: UserPlus, title: t('step1_title'), desc: t('step1_desc'), color: 'text-blue-500 bg-blue-500/10', step: '01' },
              { icon: FileText, title: t('step2_title'), desc: t('step2_desc'), color: 'text-emerald-500 bg-emerald-500/10', step: '02' },
              { icon: MessageCircle, title: t('step3_title'), desc: t('step3_desc'), color: 'text-violet-500 bg-violet-500/10', step: '03' },
            ].map((item) => (
              <div key={item.step} className="relative bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-primary)]/20 text-center transition-all group">
                <div className="absolute -top-3 -right-3 w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                  {item.step}
                </div>
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-[var(--color-foreground)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
