import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getFeaturedListings, getListings } from '@/services/serverData';
import { CATEGORIES } from '@/services/mockData';
import ListingCard from '@/components/listing/ListingCard';
import CategorySidebar from '@/components/home/CategorySidebar';
import { Building2, Car, ShoppingBag, UserPlus, FileText, MessageCircle, ArrowRight, Star, Sparkles, Crown, Flame, TreePalm, Wrench, PawPrint, Briefcase } from 'lucide-react';

const categoryIcons: Record<string, any> = {
  'Building2': Building2,
  'Car': Car,
  'ShoppingBag': ShoppingBag,
  'Palmtree': TreePalm,
  'Wrench': Wrench,
  'PawPrint': PawPrint,
  'Briefcase': Briefcase,
};

export default async function HomePage() {
  const allListings = await getListings({});
  const t = await getTranslations('Home');

  const rootCategories = CATEGORIES.filter(c => !c.parentId);
  const showcaseListings = allListings.filter(l => l.tier === 'showcase');
  const premiumListings = allListings.filter(l => l.tier === 'premium');
  const standardListings = allListings.filter(l => l.tier === 'standard');

  return (
    <div className="space-y-8">
      {/* Hero Section — full viewport width */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-16 2xl:-mx-24 -mt-8 overflow-hidden" style={{ minHeight: '420px' }}>
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-950" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* Antalya SVG Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 w-full opacity-[0.13] pointer-events-none select-none" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice" className="w-full" fill="white">
            {/* Mountains in the back */}
            <path d="M0,220 L0,160 L80,100 L160,140 L240,80 L320,120 L400,60 L480,110 L560,50 L640,90 L720,40 L800,85 L880,55 L960,100 L1040,70 L1120,110 L1200,80 L1280,130 L1360,90 L1440,120 L1440,220 Z" opacity="0.4" />
            {/* Distant buildings */}
            <path d="M0,220 L0,180 L60,180 L60,165 L80,165 L80,155 L90,155 L90,165 L110,165 L110,180 L150,180 L150,170 L200,170 L200,180 L260,180 L260,168 L280,168 L280,160 L290,160 L290,168 L320,168 L320,180 L380,180 L380,172 L430,172 L430,180 L500,180 L500,165 L530,165 L530,175 L560,175 L560,180 L620,180 L620,170 L660,170 L660,180 L720,180 L720,168 L750,168 L750,175 L780,175 L780,180 L840,180 L840,170 L880,170 L880,160 L900,160 L900,170 L940,170 L940,180 L1000,180 L1000,172 L1040,172 L1040,180 L1100,180 L1100,168 L1130,168 L1130,178 L1160,178 L1160,180 L1220,180 L1220,170 L1260,170 L1260,180 L1320,180 L1320,168 L1360,168 L1360,180 L1440,180 L1440,220 Z" opacity="0.5" />
            {/* Yivli Minare (fluted minaret) - landmark left */}
            <path d="M120,220 L120,90 L124,85 L126,75 L128,65 L130,55 L132,65 L134,75 L136,85 L140,90 L140,220 Z" />
            <path d="M125,55 L135,55 L132,45 L128,40 L124,45 Z" />
            {/* Minaret cap */}
            <ellipse cx="130" cy="40" rx="4" ry="7" />
            {/* Balconies on minaret */}
            <rect x="118" y="100" width="24" height="3" rx="1" />
            <rect x="119" y="120" width="22" height="3" rx="1" />
            {/* Mosque dome */}
            <path d="M80,220 L80,185 Q80,165 100,165 Q120,165 120,185 L120,220 Z" />
            <ellipse cx="100" cy="165" rx="20" ry="12" />
            {/* Old town buildings cluster */}
            <path d="M150,220 L150,175 L195,175 L195,165 L205,158 L215,165 L215,175 L270,175 L270,185 L300,185 L300,170 L340,170 L340,190 L370,190 L370,175 L400,175 L400,185 L440,185 L440,220 Z" />
            {/* Another minaret - center */}
            <path d="M480,220 L480,110 L483,105 L485,95 L487,85 L489,75 L491,85 L493,95 L495,105 L498,110 L498,220 Z" />
            <ellipse cx="489" cy="75" rx="3" ry="6" />
            <rect x="478" y="120" width="22" height="3" rx="1" />
            <rect x="479" y="140" width="20" height="3" rx="1" />
            {/* Hadrian's Gate arch */}
            <path d="M540,220 L540,150 L545,150 L545,145 Q555,130 565,145 L565,150 L575,150 L575,145 Q585,130 595,145 L595,150 L600,150 L600,220 Z" />
            {/* Gate towers */}
            <rect x="535" y="140" width="10" height="80" rx="1" />
            <rect x="600" y="140" width="10" height="80" rx="1" />
            {/* Palm trees */}
            <rect x="650" y="200" width="5" height="20" rx="2" />
            <path d="M652,200 Q640,185 635,175 Q645,180 652,195 Q659,180 669,175 Q664,185 652,200 Z" />
            <rect x="700" y="195" width="5" height="25" rx="2" />
            <path d="M702,195 Q690,178 685,168 Q695,174 702,190 Q709,174 719,168 Q714,178 702,195 Z" />
            <rect x="730" y="205" width="4" height="15" rx="2" />
            <path d="M732,205 Q723,192 719,184 Q727,189 732,202 Q737,189 745,184 Q741,192 732,205 Z" />
            {/* Coastline / sea cliff buildings */}
            <path d="M760,220 L760,170 L800,170 L800,155 L850,155 L850,165 L880,165 L880,145 L920,145 L920,155 L960,155 L960,170 L1000,170 L1000,180 L1050,180 L1050,220 Z" />
            {/* Another minaret right side */}
            <path d="M1100,220 L1100,105 L1103,100 L1105,90 L1107,80 L1109,70 L1111,80 L1113,90 L1115,100 L1118,105 L1118,220 Z" />
            <ellipse cx="1109" cy="70" rx="3" ry="6" />
            <rect x="1098" y="115" width="22" height="3" rx="1" />
            {/* Lighthouse / Hidirlik Tower */}
            <path d="M1200,220 L1200,150 L1210,150 L1210,140 L1218,140 L1218,130 L1222,130 L1222,140 L1230,140 L1230,150 L1240,150 L1240,220 Z" />
            <ellipse cx="1220" cy="130" rx="8" ry="5" />
            {/* More buildings */}
            <path d="M1260,220 L1260,175 L1310,175 L1310,160 L1360,160 L1360,175 L1440,175 L1440,220 Z" />
            {/* Sea waves hint */}
            <path d="M0,215 Q180,205 360,215 Q540,225 720,215 Q900,205 1080,215 Q1260,225 1440,215 L1440,220 L0,220 Z" opacity="0.6" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 pt-16 pb-32">
          <div className="max-w-7xl mx-auto text-center text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Hayalindeki <span className="text-[var(--color-secondary)]">Eve</span> Kavuş
            </h1>
            <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
              Türkiye&apos;nin en güvenilir emlak platformunda binlerce ilan arasından size özel fırsatları keşfedin
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-10">
              <form action="/tr/search" method="get" className="flex bg-white/95 dark:bg-[var(--color-surface)]/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-white/20">
                <input
                  type="text"
                  name="query"
                  placeholder="Konum, ilan no veya anahtar kelime..."
                  className="flex-1 px-6 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none bg-transparent text-sm"
                />
                <button type="submit" className="bg-gradient-to-r from-[var(--color-primary)] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 font-medium flex items-center gap-2 shrink-0 transition-all">
                  <span className="hidden sm:inline text-sm">Ara</span>
                </button>
              </form>
            </div>

            {/* Quick Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {rootCategories.map(cat => {
                const Icon = categoryIcons[cat.icon || ''] || Building2;
                return (
                  <Link key={cat.id} href={`/category/${cat.slug}`} className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-sm text-white/90 font-medium transition-colors border border-white/10">
                    <Icon size={14} />
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Categories + All Listings */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sticky Category Sidebar — same height as listings */}
        <div className="hidden md:block md:col-span-3 h-full">
          <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-6rem)]">
            <CategorySidebar rootCategories={rootCategories} allCategories={CATEGORIES} />
          </div>
        </div>

        {/* All listings on the right */}
        <div className="md:col-span-9 space-y-8">
          {/* Showcase Tier */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold">
                <Crown size={14} />
                VİTRİN
              </div>
              <span className="text-xs text-[var(--color-muted)]">Öne çıkarılmış ilanlar</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {showcaseListings.map((listing) => (
                <div key={listing.id} className="relative">
                  <div className="absolute -top-1 -right-1 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                    VİTRİN
                  </div>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </div>

          {/* Premium Tier */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 bg-violet-500/10 text-violet-600 px-3 py-1.5 rounded-full text-xs font-bold">
                <Sparkles size={14} />
                PREMIUM
              </div>
              <span className="text-xs text-[var(--color-muted)]">Doping uygulanmış ilanlar</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {premiumListings.map((listing) => (
                <div key={listing.id} className="relative">
                  <div className="absolute -top-1 -right-1 z-10 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                    PREMIUM
                  </div>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </div>

          {/* Standard Listings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full text-xs font-bold">
                  <Flame size={14} />
                  SON İLANLAR
                </div>
              </div>
              <Link href="/search" className="text-sm text-[var(--color-primary)] hover:underline font-medium flex items-center gap-1">
                {t('view_all')}
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {standardListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-10 text-[var(--color-foreground)]">{t('how_it_works')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: UserPlus, title: t('step1_title'), desc: t('step1_desc'), color: 'text-blue-500 bg-blue-500/10', step: '01' },
            { icon: FileText, title: t('step2_title'), desc: t('step2_desc'), color: 'text-emerald-500 bg-emerald-500/10', step: '02' },
            { icon: MessageCircle, title: t('step3_title'), desc: t('step3_desc'), color: 'text-violet-500 bg-violet-500/10', step: '03' },
          ].map((item) => (
            <div key={item.step} className="relative bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-primary)]/20 group text-center transition-all">
              <div className="absolute -top-3 -right-3 w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">{item.step}</div>
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
  );
}
