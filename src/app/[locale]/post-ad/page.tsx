'use client';

import { useTranslations } from 'next-intl';
import PostAdWizard from '@/components/listing/PostAdWizard';
import RouteGuard from '@/components/auth/RouteGuard';
import PageBanner from '@/components/layout/PageBanner';
import { PlusCircle } from 'lucide-react';

export default function PostAdPage() {
  const t = useTranslations('PostAd');

  return (
    <RouteGuard requireAuth>
      <PageBanner icon={PlusCircle} title={t('title')} subtitle="Ücretsiz hesapta 1 ilan, 30 gün. Daha fazlası için kurumsal plana geçin." badge="1 ilan / 30 gün" />
      <div className="max-w-3xl mx-auto">
        <PostAdWizard />
      </div>
    </RouteGuard>
  );
}
