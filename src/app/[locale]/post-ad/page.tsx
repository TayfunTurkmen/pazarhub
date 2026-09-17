'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import PostAdWizard from '@/components/listing/PostAdWizard';
import RouteGuard from '@/components/auth/RouteGuard';
import PageBanner from '@/components/layout/PageBanner';
import { PlusCircle, Edit } from 'lucide-react';

function PostAdContent() {
  const t = useTranslations('PostAd');
  const searchParams = useSearchParams();
  const isEdit = Boolean(searchParams.get('edit'));

  return (
    <>
      <PageBanner
        icon={isEdit ? Edit : PlusCircle}
        title={isEdit ? t('edit_title') : t('title')}
        subtitle={isEdit ? 'İlan bilgilerinizi güncelleyin.' : 'Ücretsiz hesapta 1 ilan, 30 gün. Daha fazlası için kurumsal plana geçin.'}
        badge={isEdit ? 'Düzenle' : '1 ilan / 30 gün'}
      />
      <div className="max-w-3xl mx-auto">
        <PostAdWizard />
      </div>
    </>
  );
}

export default function PostAdPage() {
  return (
    <RouteGuard requireAuth>
      <Suspense fallback={<p className="text-sm text-[var(--color-muted)]">Yükleniyor…</p>}>
        <PostAdContent />
      </Suspense>
    </RouteGuard>
  );
}
