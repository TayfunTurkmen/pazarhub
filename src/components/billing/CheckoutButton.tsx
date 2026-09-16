'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import Button from '@/components/ui/Button';
import { createCheckout, persistCheckoutSession, type CheckoutPayload, type PaymentProvider } from './checkout';

export default function CheckoutButton({
  payload,
  label,
  className = '',
  variant = 'primary',
  disabled = false,
}: {
  payload: CheckoutPayload;
  label: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<PaymentProvider | 'AUTO'>('AUTO');
  const [error, setError] = useState('');

  const start = async () => {
    setBusy(true);
    setError('');
    try {
      const session = await createCheckout({
        ...payload,
        provider: provider === 'AUTO' ? undefined : provider,
      });
      persistCheckoutSession(session);
      if (session.paymentPageUrl) {
        window.location.href = session.paymentPageUrl;
        return;
      }
      router.push(`/odeme?oid=${encodeURIComponent(session.orderId)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ödeme başlatılamadı';
      if (message === 'LOGIN_REQUIRED') {
        router.push('/login');
        return;
      }
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value as PaymentProvider | 'AUTO')}
        className="w-full text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1.5"
      >
        <option value="AUTO">Otomatik (PayTR / iyzico / Demo)</option>
        <option value="PAYTR">PayTR</option>
        <option value="IYZICO">iyzico</option>
        <option value="DEMO">Demo ödeme</option>
      </select>
      <Button type="button" variant={variant} className={`w-full font-extrabold ${className}`} onClick={start} disabled={busy || disabled}>
        {busy ? 'Yönlendiriliyor…' : label}
      </Button>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
