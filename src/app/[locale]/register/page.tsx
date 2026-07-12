'use client';

import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import Card from '@/components/ui/Card';
import SecurityNote from '@/components/ui/SecurityNote';
import PhoneAuthForm from '@/components/auth/PhoneAuthForm';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';
import { useTranslations } from 'next-intl';
import { Smartphone } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const t = useTranslations('Auth');

    return (
        <div className="max-w-md mx-auto mt-10">
            <Card className="p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                        <Smartphone size={24} className="text-[var(--color-primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('register_title')}</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1 text-center">{t('register_subtitle')}</p>
                </div>

                <SocialAuthButtons />

                <SecurityNote
                    title={t('secure_register_title')}
                    description={t('secure_register_desc')}
                />

                <PhoneAuthForm mode="register" onSuccess={() => router.push('/dashboard')} />

                <div className="mt-4 text-center text-sm">
                    <span className="text-[var(--color-muted)]">{t('has_account')} </span>
                    <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
                        {t('login_now')}
                    </Link>
                </div>
            </Card>
        </div>
    );
}
