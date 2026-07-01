'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
    const router = useRouter();
    const t = useTranslations('Auth');
    const { register } = useAuth();
    const [type, setType] = useState<'individual' | 'corporate'>('individual');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        phone: '',
        storeName: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.passwordConfirm) {
            setError(t('password_mismatch'));
            return;
        }
        if (form.password.length < 4) {
            setError(t('password_too_short'));
            return;
        }

        setLoading(true);
        try {
            await register({
                type,
                email: form.email.trim(),
                name: form.name.trim(),
                password: form.password,
                phone: form.phone || undefined,
                storeName: type === 'corporate' ? form.storeName : undefined,
            });
            router.push('/dashboard');
        } catch {
            setError(t('register_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <Card className="p-8">
                <h1 className="text-2xl font-bold text-center mb-8 text-[var(--color-primary)]">{t('register_title')}</h1>

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
                        <Input
                            label={t('name')}
                            placeholder={t('name')}
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <Input
                            label={t('email')}
                            type="email"
                            placeholder="ornek@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={t('password')}
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <Input
                            label={t('password_confirm')}
                            type="password"
                            value={form.passwordConfirm}
                            onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
                            required
                        />
                    </div>

                    {type === 'corporate' && (
                        <div className="border-t border-[var(--color-border)] pt-4 mt-4">
                            <h3 className="font-bold mb-4 text-[var(--color-foreground)]">{t('store_info')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label={t('store_name')}
                                    placeholder={t('store_name')}
                                    value={form.storeName}
                                    onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                                    required
                                />
                                <Input
                                    label={t('phone')}
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {error && <p className="text-rose-500 text-sm bg-rose-500/10 px-3 py-2 rounded-xl">{error}</p>}

                    <div className="pt-4">
                        <Button type="submit" className="w-full btn-primary py-3 font-bold" disabled={loading}>
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
