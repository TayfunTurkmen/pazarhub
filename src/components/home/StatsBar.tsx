import { Building2, Users, ShieldCheck, Star } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function StatsBar() {
  const t = await getTranslations('Home');

  const stats = [
    { icon: Building2, value: '1.5M+', label: t('stats_active_listings') },
    { icon: Users, value: '120K+', label: t('stats_registered_users') },
    { icon: ShieldCheck, value: '35K+', label: t('stats_verified_sellers') },
    { icon: Star, value: '98%', label: t('stats_satisfaction') },
  ];

  return (
    <section className="relative full-bleed bg-white dark:bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm">
      <div className="full-bleed-pad py-5 sm:py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[var(--color-navy)]/8 dark:bg-[var(--color-brand-yellow)]/10 flex items-center justify-center shrink-0">
                <stat.icon size={18} className="text-[var(--color-navy)] dark:text-[var(--color-brand-yellow)]" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-xl font-black text-[var(--color-foreground)] leading-tight truncate">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-[var(--color-muted)] leading-snug line-clamp-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
