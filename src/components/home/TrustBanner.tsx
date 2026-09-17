import { Link } from '@/i18n/navigation';
import { Shield } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function TrustBanner() {
  const t = await getTranslations('Home');

  return (
    <section className="relative full-bleed overflow-hidden">
      <div className="bg-[var(--color-navy)] full-bleed-pad py-8 sm:py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[var(--color-brand-accent)] flex items-center justify-center shrink-0 shadow-lg">
            <Shield size={36} className="text-[var(--color-navy)]" strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-center md:text-left min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2">
              {t('trust_title')}
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-2xl">
              {t('trust_desc')}
            </p>
          </div>
          <Link
            href="/param-guvende"
            className="shrink-0 w-full md:w-auto text-center bg-[var(--color-brand-yellow)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-navy)] font-extrabold px-6 py-3 rounded-xl text-sm shadow-lg"
          >
            {t('trust_cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
