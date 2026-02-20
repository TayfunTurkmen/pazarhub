'use client';

import { useTranslations } from 'next-intl';
import PostAdWizard from '@/components/listing/PostAdWizard';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { useEffect } from 'react';

export default function PostAdPage() {
    const t = useTranslations('PostAd');
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 border-b border-[var(--color-border)] pb-4 text-[var(--color-foreground)]">{t('title')}</h1>
            <PostAdWizard />
        </div>
    );
}
