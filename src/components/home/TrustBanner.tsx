import { Link } from '@/i18n/navigation';
import { Shield } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function TrustBanner() {
  const t = await getTranslations('Home');

  return (
    <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-16 2xl:-mx-24 overflow-hidden">
      <div className="bg-[var(--color-navy)] px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-brand-accent)] flex items-center justify-center shrink-0 shadow-lg">
            <Shield size={40} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              {t('trust_title')}
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-2xl">
              {t('trust_desc')}
            </p>
          </div>
          <Link
            href="/param-guvende"
            className="shrink-0 bg-[var(--color-brand-accent)] hover:bg-[var(--color-secondary-dark)] text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-lg"
          >
            {t('trust_cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
