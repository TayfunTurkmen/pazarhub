'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from 'next-intl';
import SecurityNote from '@/components/ui/SecurityNote';
import PhoneAuthForm from '@/components/auth/PhoneAuthForm';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';
import DemoAccountsCard, { type DemoAccount } from '@/components/auth/DemoAccountsCard';
import { LogIn, ChevronDown, ChevronUp } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const t = useTranslations('Auth');
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmailLogin, setShowEmailLogin] = useState(true);

    const fillDemo = (account: DemoAccount) => {
        setEmail(account.email);
        setPassword(account.password);
        setShowEmailLogin(true);
        setError('');
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                router.push(email.toLowerCase().startsWith('admin@') ? '/admin' : '/dashboard');
            } else {
                setError(t('login_error'));
            }
        } catch {
            setError(t('error_generic'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <Card className="p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-navy)] text-[var(--color-brand-yellow)] flex items-center justify-center mb-4">
                        <LogIn size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('login_title')}</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">{t('login_subtitle')}</p>
                </div>

                <DemoAccountsCard onSelect={fillDemo} />

                <div className="mt-6">
                    <SocialAuthButtons />
                </div>

                <SecurityNote
                    title={t('secure_login_title')}
                    description={t('secure_login_desc')}
                />

                <PhoneAuthForm mode="login" onSuccess={() => router.push('/dashboard')} />

                <button
                    type="button"
                    onClick={() => setShowEmailLogin(!showEmailLogin)}
                    className="mt-4 w-full flex items-center justify-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                    {t('email_login')}
                    {showEmailLogin ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showEmailLogin && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4 pt-4 border-t border-[var(--color-border)]">
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
                            required
                        />
                        {error && <p className="text-rose-500 text-sm bg-rose-500/10 px-3 py-2 rounded-xl">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? t('logging_in') : t('login_button')}
                        </Button>
                    </form>
                )}

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
