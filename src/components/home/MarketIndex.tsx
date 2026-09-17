import { Link } from '@/i18n/navigation';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { MARKET_INDEX } from '@/lib/marketData';
import { formatTry } from '@/lib/format';

export default async function MarketIndex() {
  const t = await getTranslations('Home');

  return (
    <section id="endeks" className="rounded-3xl bg-[var(--color-navy)] text-white overflow-hidden">
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-brand-accent)] mb-2">{t('market_kicker')}</p>
          <h2 className="text-2xl md:text-3xl font-extrabold">{t('market_index')}</h2>
          <p className="text-white/70 mt-2 max-w-xl">{t('market_index_desc')}</p>
        </div>
        <Link href="/blog" className="text-sm font-semibold text-[var(--color-brand-accent)] hover:underline">
          {t('view_all')}
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-6 border-t border-white/10">
        {MARKET_INDEX.map((row) => {
          const up = row.change >= 0;
          return (
            <Link
              key={row.city}
              href={`/search?city=${encodeURIComponent(row.city)}&listingType=sale`}
              className="p-5 border-white/10 border-r border-b last:border-r-0 hover:bg-white/5 transition-colors"
            >
              <p className="font-bold">{row.city}</p>
              <p className="text-lg font-extrabold mt-2 text-[var(--color-brand-accent)]">{formatTry(row.sale)}</p>
              <p className="text-[11px] text-white/60">{t('price_per_m2')}</p>
              <p className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-300' : 'text-rose-300'}`}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {up ? '+' : ''}{row.change}%
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
