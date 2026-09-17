import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getListings } from '@/services/serverData';
import ListingCard from '@/components/listing/ListingCard';
import HeroSearch from '@/components/home/HeroSearch';
import StatsBar from '@/components/home/StatsBar';
import ListingCarousel from '@/components/home/ListingCarousel';
import TrustBanner from '@/components/home/TrustBanner';
import CorporateStrip from '@/components/home/CorporateStrip';
import CategoryExploreGrid from '@/components/home/CategoryExploreGrid';
import MarketIndex from '@/components/home/MarketIndex';
import NeighborhoodGuides from '@/components/home/NeighborhoodGuides';
import NewProjects from '@/components/home/NewProjects';
import ExpertInsights from '@/components/home/ExpertInsights';
import {
  UserPlus, FileText, MessageCircle,
  ArrowRight, ShieldCheck, Sparkles, Bot, Home, Target, ImageIcon,
} from 'lucide-react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1920&auto=format&fit=crop';

export default async function HomePage() {
  const allListings = await getListings({});
  const t = await getTranslations('Home');
  const tAi = await getTranslations('AI');

  const isProperty = (listing: (typeof allListings)[number]) =>
    Boolean(listing.roomCount || listing.netArea) || listing.category.slug === 'konut' || listing.category.parentId === '1';
  const isVehicle = (listing: (typeof allListings)[number]) =>
    listing.category.id === '2' || listing.category.parentId === '2' || ['otomobil', 'motosiklet', 'arazi-suv-pickup'].includes(listing.category.slug);
  const isShopping = (listing: (typeof allListings)[number]) =>
    ['3', '8'].includes(listing.category.id) ||
    ['3', '8'].includes(listing.category.parentId || '') ||
    ['telefon', 'bilgisayar', 'ev-esyalari', 'sifir-telefon', 'sifir-bilgisayar'].includes(listing.category.slug);

  const showcaseListings = allListings.filter((l) => l.tier === 'showcase').slice(0, 12);
  const premiumListings = allListings.filter((l) => l.tier === 'premium').slice(0, 8);
  const saleListings = allListings.filter((l) => l.listingType === 'sale' && isProperty(l)).slice(0, 8);
  const rentListings = allListings.filter((l) => l.listingType === 'rent' && isProperty(l)).slice(0, 4);
  const vehicleListings = allListings.filter(isVehicle).slice(0, 4);
  const shoppingListings = allListings.filter(isShopping).slice(0, 4);

  return (
    <div className="space-y-0 min-w-0 max-w-full overflow-x-clip">
      <section className="relative full-bleed -mt-4 sm:-mt-8 overflow-x-clip">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,40,88,0.88)_0%,rgba(47,40,88,0.62)_50%,rgba(18,15,36,0.94)_100%)]" />
        </div>

        <div className="relative full-bleed-pad pt-5 sm:pt-10 pb-6 sm:pb-12 max-w-full">
          <div className="max-w-7xl mx-auto min-w-0 w-full">
            <div className="flex justify-between items-center mb-3 sm:mb-6 gap-2 min-w-0">
              <p className="text-[var(--color-brand-yellow)] text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.18em] truncate min-w-0">
                {t('hero_kicker')}
              </p>
              <div className="hidden sm:flex items-center gap-2 bg-white/95 dark:bg-[var(--color-surface)]/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg shrink-0">
                <ShieldCheck size={18} className="text-[var(--color-primary)] shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-[var(--color-foreground)]">{t('security_badge_title')}</p>
                  <p className="text-[10px] text-[var(--color-muted)]">{t('security_badge_desc')}</p>
                </div>
              </div>
            </div>

            <div className="text-white space-y-1.5 sm:space-y-3 mb-3 sm:mb-6 max-w-3xl min-w-0">
              <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-[56px] font-black leading-[1.15] sm:leading-[1.08] tracking-tight break-words">
                {t('hero_title_1')}{' '}
                <span className="text-[var(--color-brand-yellow)]">{t('hero_title_2')}</span>{' '}
                {t('hero_title_3')}
              </h1>
              <p className="hidden sm:block text-white/80 text-base md:text-lg max-w-2xl">{t('hero_subtitle')}</p>
            </div>

            <HeroSearch />

            <div className="mt-3 sm:mt-5 flex gap-1.5 overflow-x-auto max-w-full pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
              {[
                { label: t('quick_istanbul'), href: '/search?city=İstanbul&listingType=sale&category=emlak' },
                { label: t('quick_vehicles'), href: '/category/otomobil' },
                { label: t('quick_used'), href: '/category/ikinci-el' },
                { label: t('quick_new_goods'), href: '/category/sifir' },
                { label: t('quick_rent'), href: '/search?listingType=rent&category=emlak' },
                { label: t('map_search'), href: '/search?view=map', accent: true },
              ].map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] sm:text-sm font-semibold border ${
                    'accent' in chip && chip.accent
                      ? 'bg-[var(--color-brand-yellow)] text-[var(--color-navy)] border-transparent font-extrabold'
                      : 'bg-white/12 text-white border-white/20'
                  }`}
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StatsBar />

      <div className="space-y-12 py-10 min-w-0 max-w-full">
        <CategoryExploreGrid />

        <section className="min-w-0 max-w-full">
          <div className="flex items-center justify-between mb-4 gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-1">{t('featured')}</p>
              <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">{t('featured_listings')}</h2>
            </div>
            <Link href="/search?tier=showcase" className="text-sm text-[var(--color-primary)] hover:underline font-semibold flex items-center gap-1 shrink-0">
              {t('view_all')} <ArrowRight size={14} />
            </Link>
          </div>
          <ListingCarousel listings={showcaseListings} badge="showcase" />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-[var(--color-foreground)]">{t('section_vehicles')}</h2>
              <Link href="/category/vasita" className="text-sm text-[var(--color-primary)] hover:underline font-semibold">{t('view_all')}</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {vehicleListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showVerified />
              ))}
            </div>
          </section>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-[var(--color-foreground)]">{t('section_shopping')}</h2>
              <Link href="/category/ikinci-el" className="text-sm text-[var(--color-primary)] hover:underline font-semibold">{t('view_all')}</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {shoppingListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showVerified />
              ))}
            </div>
          </section>
        </div>

        <NewProjects />
        <MarketIndex />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">{t('latest_sale')}</h2>
              <Link href="/search?listingType=sale&category=emlak" className="text-sm text-[var(--color-primary)] hover:underline font-semibold flex items-center gap-1">
                {t('view_all')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {saleListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showVerified />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-[var(--color-foreground)]">{t('latest_rent')}</h2>
              <Link href="/search?listingType=rent&category=emlak" className="text-sm text-[var(--color-primary)] hover:underline font-semibold">
                {t('view_all')}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
              {rentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showVerified />
              ))}
            </div>
          </div>
        </div>

        <NeighborhoodGuides />

        {premiumListings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">{t('premium_listings')}</h2>
              <Link href="/search?tier=premium" className="text-sm text-[var(--color-primary)] hover:underline font-semibold flex items-center gap-1">
                {t('view_all')} <ArrowRight size={14} />
              </Link>
            </div>
            <ListingCarousel listings={premiumListings} badge="premium" />
          </section>
        )}

        <ExpertInsights />
        <CorporateStrip />
        <TrustBanner />

        <section className="relative overflow-hidden rounded-3xl border border-[var(--color-navy)]/15 bg-gradient-to-br from-[var(--color-navy)]/8 via-[var(--color-brand-accent)]/10 to-transparent p-8 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wide">
                <Sparkles size={14} /> {tAi('platform_badge')}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-foreground)]">{tAi('platform_title')}</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">{tAi('platform_desc')}</p>
              <Link href="/ai" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-navy)] text-[var(--color-brand-accent)] font-semibold">
                {tAi('learn_more')} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 max-w-lg">
              {[
                { icon: Bot, label: tAi('feature_chat_title') },
                { icon: Home, label: tAi('feature_recommend_title') },
                { icon: FileText, label: tAi('feature_blog_title') },
                { icon: ImageIcon, label: tAi('feature_image_title') },
                { icon: Target, label: tAi('feature_lead_title') },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
                  <Icon size={22} className="mx-auto text-[var(--color-primary)] mb-2" />
                  <p className="text-[11px] font-medium text-[var(--color-foreground)] leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-center mb-10 text-[var(--color-foreground)]">{t('how_it_works')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: UserPlus, title: t('step1_title'), desc: t('step1_desc'), color: 'text-teal-600 bg-teal-500/10', step: '01' },
              { icon: FileText, title: t('step2_title'), desc: t('step2_desc'), color: 'text-amber-600 bg-amber-500/10', step: '02' },
              { icon: MessageCircle, title: t('step3_title'), desc: t('step3_desc'), color: 'text-sky-600 bg-sky-500/10', step: '03' },
            ].map((item) => (
              <div key={item.step} className="relative bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:shadow-lg text-center group">
                <div className="absolute -top-3 -right-3 w-9 h-9 bg-[var(--color-navy)] text-[var(--color-brand-accent)] rounded-full flex items-center justify-center text-xs font-black shadow-lg">
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
