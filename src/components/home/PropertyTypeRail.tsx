import { Link } from '@/i18n/navigation';
import { PROPERTY_TYPES } from '@/lib/marketData';
import { getTranslations } from 'next-intl/server';

export default async function PropertyTypeRail() {
  const t = await getTranslations('Home');

  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-1">{t('explore_kicker')}</p>
          <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">{t('explore_categories')}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PROPERTY_TYPES.map((item) => (
          <Link
            key={item.slug}
            href={`/category/${item.slug}`}
            className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-primary)] hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            <span className="text-2xl">{item.emoji}</span>
            <p className="mt-3 font-bold text-[var(--color-foreground)]">{item.name}</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">{item.hint}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
