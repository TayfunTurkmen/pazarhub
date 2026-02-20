'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    const t = useTranslations('Common');

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center space-y-6">
                <div className="relative">
                    <span className="text-[10rem] font-black text-[var(--color-border)] leading-none select-none">404</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl animate-[float_3s_ease-in-out_infinite]">
                            <Home size={40} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mt-4">
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('not_found_title')}</h1>
                    <p className="text-[var(--color-muted)] max-w-sm mx-auto">{t('not_found_desc')}</p>
                </div>

                <Link href="/" className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 font-bold">
                    <ArrowLeft size={18} />
                    {t('go_home')}
                </Link>
            </div>
        </div>
    );
}
