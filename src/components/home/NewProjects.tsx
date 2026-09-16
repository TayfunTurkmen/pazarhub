import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { NEW_PROJECTS } from '@/lib/marketData';
import { formatTry } from '@/lib/format';

export default async function NewProjects() {
  const t = await getTranslations('Home');

  return (
    <section id="projeler">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-1">{t('projects_kicker')}</p>
          <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">{t('new_projects')}</h2>
          <p className="text-sm text-[var(--color-muted)] mt-1">{t('new_projects_desc')}</p>
        </div>
        <Link href="/search?tier=showcase" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
          {t('view_all')}
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {NEW_PROJECTS.map((project) => (
          <Link
            key={project.name}
            href={`/search?city=${encodeURIComponent(project.city)}&tier=showcase`}
            className="group overflow-hidden rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:shadow-xl transition-shadow"
          >
            <div className="relative aspect-[16/10]">
              <Image src={project.image} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 33vw" />
              <span className="absolute top-4 left-4 bg-[var(--color-navy)] text-[var(--color-brand-yellow)] text-[11px] font-bold px-3 py-1 rounded-full">
                {project.status}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-extrabold text-[var(--color-foreground)]">{project.name}</h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">{project.city} / {project.district} · {project.units}</p>
              <p className="mt-3 text-sm text-[var(--color-muted)]">{t('from_price')}</p>
              <p className="text-xl font-black text-[var(--color-primary)]">{formatTry(project.priceFrom)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
