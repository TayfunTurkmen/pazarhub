import { Link } from '@/i18n/navigation';
import { Shield } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function TrustBanner() {
  const t = await getTranslations('Home');

  return (
    <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-16 2xl:-mx-24 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-950 px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-secondary)] flex items-center justify-center shrink-0 shadow-lg shadow-[var(--color-secondary)]/30">
            <Shield size={40} className="text-blue-900" strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t('trust_title')}
            </h2>
            <p className="text-blue-100/80 text-sm md:text-base max-w-2xl">
              {t('trust_desc')}
            </p>
          </div>
          <Link
            href="/safe-payment"
            className="shrink-0 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-blue-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg"
          >
            {t('trust_cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
