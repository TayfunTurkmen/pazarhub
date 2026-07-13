import { getTranslations } from 'next-intl/server';
import AiPlatformPageClient from '@/components/ai/AiPlatformPageClient';

export async function generateMetadata() {
  const t = await getTranslations('AI');
  return {
    title: t('platform_title'),
    description: t('platform_desc'),
  };
}

export default function AiPlatformPage() {
  return <AiPlatformPageClient />;
}
