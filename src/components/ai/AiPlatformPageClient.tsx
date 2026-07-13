'use client';

import {
  Bot, Sparkles, Home, FileText, ImageIcon, Target,
  Clock, ArrowRight,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import AiRecommendationsPanel from '@/components/ai/AiRecommendationsPanel';

const features = [
  { key: 'chat', icon: Bot, color: 'from-violet-500 to-purple-600', href: '#chat' },
  { key: 'recommend', icon: Home, color: 'from-blue-500 to-cyan-600', href: '#recommend' },
  { key: 'blog', icon: FileText, color: 'from-emerald-500 to-teal-600', href: '/blog' },
  { key: 'image', icon: ImageIcon, color: 'from-amber-500 to-orange-600', href: '/post-ad' },
  { key: 'lead', icon: Target, color: 'from-rose-500 to-pink-600', href: '/contact' },
] as const;

export default function AiPlatformPageClient() {
  const t = useTranslations('AI');

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-16 2xl:-mx-24 -mt-8 overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
            <Sparkles size={16} />
            {t('platform_badge')}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('platform_title')}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">{t('platform_desc')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="#recommend" className="px-6 py-3 rounded-xl bg-white text-violet-700 font-bold hover:bg-white/90 transition-colors">
              {t('platform_cta_recommend')}
            </Link>
            <Link href="/blog" className="px-6 py-3 rounded-xl bg-white/10 border border-white/30 font-semibold hover:bg-white/20 transition-colors">
              {t('platform_cta_blog')}
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8 text-[var(--color-foreground)]">{t('platform_features')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ key, icon: Icon, color, href }) => (
            <Link key={key} href={href}>
              <Card className="p-6 h-full hover:shadow-lg hover:border-violet-500/20 transition-all group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-[var(--color-foreground)] mb-2">{t(`feature_${key}_title`)}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{t(`feature_${key}_desc`)}</p>
                <span className="inline-flex items-center gap-1 text-sm text-violet-600 font-medium mt-4 group-hover:gap-2 transition-all">
                  {t('learn_more')} <ArrowRight size={14} />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 24/7 badge */}
      <section id="chat" className="flex items-center justify-center gap-3 py-6 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <Clock className="text-emerald-600" size={24} />
        <p className="text-emerald-700 dark:text-emerald-400 font-medium">{t('support_247')}</p>
      </section>

      {/* Recommendations */}
      <section id="recommend">
        <AiRecommendationsPanel />
      </section>
    </div>
  );
}
