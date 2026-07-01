'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from 'next-intl';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const t = useTranslations('Auth');
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                router.push('/dashboard');
            } else {
                setError(t('login_error'));
            }
        } catch (err) {
            setError(t('error_generic'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <Card className="p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                        <LogIn size={24} className="text-[var(--color-primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('login_title')}</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">{t('login_subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('email')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="demo@example.com"
                        required
                    />
                    <Input
                        label={t('password')}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="demo"
                        required
                    />

                    {error && <p className="text-rose-500 text-sm bg-rose-500/10 px-3 py-2 rounded-xl">{error}</p>}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? t('logging_in') : t('login_button')}
                    </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-4 p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
                    <p className="text-xs font-semibold text-[var(--color-foreground)] mb-1.5">{t('demo_accounts')}</p>
                    <div className="space-y-1 text-xs text-[var(--color-muted)]">
                        <p>👤 demo@example.com / demo</p>
                        <p>🏢 corporate@example.com / corporate</p>
                        <p>🛡️ admin@example.com / admin</p>
                    </div>
                </div>

                <div className="mt-4 text-center text-sm">
                    <span className="text-[var(--color-muted)]">{t('no_account')} </span>
                    <Link href="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
                        {t('signup_now')}
                    </Link>
                </div>
            </Card>
        </div>
    );
}
