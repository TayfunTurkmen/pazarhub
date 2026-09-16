import { Link } from '@/i18n/navigation';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { EXPERT_INSIGHTS } from '@/lib/marketData';

export default async function ExpertInsights() {
  const t = await getTranslations('Home');

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-1">{t('expert_kicker')}</p>
          <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">{t('expert_title')}</h2>
          <p className="text-sm text-[var(--color-muted)] mt-1">{t('expert_desc')}</p>
        </div>
        <Link href="/blog" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
          {t('view_all')}
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXPERT_INSIGHTS.map((item, index) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-2xl bg-[var(--color-background)] p-5 hover:bg-[var(--color-navy)] hover:text-white transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-[var(--color-primary)] group-hover:text-[var(--color-brand-yellow)]">
              <span>{item.tag}</span>
              <span>0{index + 1}</span>
            </div>
            <h3 className="mt-3 font-bold leading-snug group-hover:text-white">{item.title}</h3>
            <p className="mt-4 text-xs text-[var(--color-muted)] group-hover:text-white/70 inline-flex items-center gap-1">
              {item.read} <ArrowUpRight size={14} />
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
