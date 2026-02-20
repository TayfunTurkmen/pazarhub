'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { register } from '@/services/auth';
import { User as UserIcon, Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
    const router = useRouter();
    const t = useTranslations('Auth');
    const [type, setType] = useState<'individual' | 'corporate'>('individual');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await register({ type, email: 'test@test.com', name: 'Test User' });
        setLoading(false);
        alert('Kayıt Başarılı! (Mock)');
        router.push('/login');
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <Card className="p-8">
                <h1 className="text-2xl font-bold text-center mb-8 text-[var(--color-primary)]">{t('register_title')}</h1>

                {/* Membership Type Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        type="button"
                        onClick={() => setType('individual')}
                        className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${type === 'individual'
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30 text-[var(--color-foreground)]'
                            }`}
                    >
                        <UserIcon size={32} />
                        <span className="font-bold">{t('individual')}</span>
                        <span className="text-xs text-center text-[var(--color-muted)]">{t('individual_desc')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('corporate')}
                        className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${type === 'corporate'
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30 text-[var(--color-foreground)]'
                            }`}
                    >
                        <Building2 size={32} />
                        <span className="font-bold">{t('corporate')}</span>
                        <span className="text-xs text-center text-[var(--color-muted)]">{t('corporate_desc')}</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label={t('name')} placeholder={t('name')} required />
                        <Input label={t('email')} type="email" placeholder="ornek@email.com" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label={t('password')} type="password" required />
                        <Input label={t('password_confirm')} type="password" required />
                    </div>

                    {type === 'corporate' && (
                        <div className="border-t border-[var(--color-border)] pt-4 mt-4">
                            <h3 className="font-bold mb-4 text-[var(--color-foreground)]">{t('store_info')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label={t('store_name')} placeholder={t('store_name')} required />
                                <Input label={t('trade_name')} required />
                                <Input label={t('tax_no')} required />
                                <Input label={t('phone')} type="tel" required />
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full btn-primary py-3 font-bold"
                            disabled={loading}
                        >
                            {loading ? t('registering') : t('register_button')}
                        </Button>
                    </div>
                </form>

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
