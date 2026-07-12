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
    <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-16 2xl:-mx-24 bg-white dark:bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-background)] transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <stat.icon size={22} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--color-foreground)] leading-tight">{stat.value}</p>
                <p className="text-xs text-[var(--color-muted)]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
