'use client';

import { useTranslations } from 'next-intl';
import PostAdWizard from '@/components/listing/PostAdWizard';
import RouteGuard from '@/components/auth/RouteGuard';

export default function PostAdPage() {
    const t = useTranslations('PostAd');

    return (
        <RouteGuard requireAuth>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 border-b border-[var(--color-border)] pb-4 text-[var(--color-foreground)]">{t('title')}</h1>
                <PostAdWizard />
            </div>
        </RouteGuard>
    );
}
