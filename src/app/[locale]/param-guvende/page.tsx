import { redirect } from '@/i18n/navigation';

export default async function ParamGuvendeRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: '/sendeode', locale });
}
