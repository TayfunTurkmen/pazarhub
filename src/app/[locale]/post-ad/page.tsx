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
      <PageBanner icon={PlusCircle} title={t('title')} subtitle="Ücretsiz ilan verin, doğrulanmış alıcılara ulaşın" badge="Güvenli" />
      <div className="max-w-3xl mx-auto">
        <PostAdWizard />
      </div>
    </RouteGuard>
  );
}
