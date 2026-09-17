import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { NEIGHBORHOOD_GUIDES } from '@/lib/marketData';
import { formatTry } from '@/lib/format';

export default async function NeighborhoodGuides() {
  const t = await getTranslations('Home');

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-1">{t('guide_kicker')}</p>
          <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">{t('neighborhoods')}</h2>
        </div>
        <Link href="/blog" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
          {t('neighborhood_cta')}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {NEIGHBORHOOD_GUIDES.map((item) => (
          <Link
            key={item.name}
            href={`/search?city=${encodeURIComponent(item.city)}&query=${encodeURIComponent(item.name)}`}
            className="group relative overflow-hidden rounded-3xl min-h-[280px]"
          >
            <Image src={item.image} alt={`${item.city} ${item.name}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 25vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4 bg-[var(--color-brand-accent)] text-white text-xs font-black px-2.5 py-1 rounded-full">
              {item.score}/10
            </div>
            <div className="absolute bottom-0 p-5 text-white">
              <p className="text-xs text-white/70">{item.city}</p>
              <h3 className="text-xl font-extrabold">{item.name}</h3>
              <p className="text-sm text-white/80 mt-1 line-clamp-2">{item.blurb}</p>
              <p className="mt-3 text-sm font-bold">{formatTry(item.saleAvg)} <span className="font-medium text-white/70">m²</span></p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
