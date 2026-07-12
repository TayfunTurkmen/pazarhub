'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from 'next-intl';
import { isValidTurkishMobile, normalizePhone } from '@/lib/phone';

export interface AuthConfig {
  smsVerificationEnabled: boolean;
  googleAuthEnabled: boolean;
  facebookAuthEnabled: boolean;
  phoneAuthEnabled: boolean;
}

interface PhoneAuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

export default function PhoneAuthForm({ mode, onSuccess }: PhoneAuthFormProps) {
  const t = useTranslations('Auth');
  const { loginWithPhone } = useAuth();
  const [config, setConfig] = useState<AuthConfig | null>(null);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/config')
      .then((r) => r.json())
      .then((data: { data?: AuthConfig }) => setConfig(data.data ?? null))
      .catch(() => setConfig({
        smsVerificationEnabled: false,
        googleAuthEnabled: false,
        facebookAuthEnabled: false,
        phoneAuthEnabled: true,
      }));
  }, []);

  const needsCode = config?.smsVerificationEnabled ?? false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidTurkishMobile(phone)) {
      setError(t('phone_invalid'));
      return;
    }

    if (needsCode && !code.trim()) {
      setError(t('code_required'));
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError(t('name_required'));
      return;
    }

    setLoading(true);
    try {
      const success = await loginWithPhone(
        normalizePhone(phone),
        needsCode ? code.trim() : undefined,
        mode === 'register' ? name.trim() : undefined,
      );
      if (success) {
        onSuccess?.();
      } else {
        setError(needsCode ? t('phone_login_error_code') : t('phone_login_error'));
      }
    } catch {
      setError(t('error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'register' && (
        <Input
          label={t('name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('name')}
          required
        />
      )}
      <Input
        label={t('phone')}
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="05XX XXX XX XX"
        required
      />
      {needsCode && (
        <Input
          label={t('sms_code')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="••••"
          maxLength={6}
          required
        />
      )}
      {error && (
        <p className="text-rose-500 text-sm bg-rose-500/10 px-3 py-2 rounded-xl">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={loading || config === null}>
        {loading
          ? t('logging_in')
          : mode === 'register'
            ? t('register_button')
            : t('login_button')}
      </Button>
      {!needsCode && (
        <p className="text-xs text-center text-[var(--color-muted)]">{t('phone_fast_hint')}</p>
      )}
    </form>
  );
}
