'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import RouteGuard from '@/components/auth/RouteGuard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { readCheckoutSession, type CheckoutSession } from '@/components/billing/checkout';
import { CheckCircle2, Shield } from 'lucide-react';

function PaymentInner() {
  const params = useSearchParams();
  const oid = params.get('oid') ?? '';
  const status = params.get('status');
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(status === 'ok');
  const [error, setError] = useState(status === 'fail' ? 'Ödeme tamamlanamadı.' : '');

  useEffect(() => {
    if (!oid) return;
    setSession(readCheckoutSession(oid));
    fetch(`/api/payments/${encodeURIComponent(oid)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.status === 'PAID') setDone(true);
      })
      .catch(() => undefined);
  }, [oid]);

  const confirmDemo = async () => {
    if (!oid) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/payments/demo/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantOid: oid }),
      });
      const json = await res.json() as { success: boolean; error?: string };
      if (!json.success) throw new Error(json.error || 'Onaylanamadı');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onaylanamadı');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Card className="p-10 text-center max-w-xl mx-auto">
        <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={40} />
        <h1 className="text-2xl font-black">Ödeme alındı</h1>
        <p className="text-sm text-[var(--color-muted)] mt-2">Üyelik, doping veya Param Güvende bakiyeniz güncellendi.</p>
        <div className="flex justify-center gap-3 mt-6">
          <Link href="/dashboard" className="btn btn-primary">Hesabım</Link>
          <Link href="/param-guvende" className="btn btn-secondary">Param Güvende</Link>
        </div>
      </Card>
    );
  }

  const provider = session?.provider;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <section className="rounded-3xl bg-[var(--color-navy)] text-white px-6 py-8">
        <p className="text-[var(--color-brand-yellow)] text-xs font-black uppercase tracking-[0.2em]">Güvenli ödeme</p>
        <h1 className="text-3xl font-black mt-2">PayTR · iyzico · Demo</h1>
        {session && (
          <p className="mt-2 text-white/75">{session.basket} — {session.amount.toLocaleString('tr-TR')} ₺</p>
        )}
      </section>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {provider === 'PAYTR' && session?.iframeUrl && (
        <iframe title="PayTR" src={session.iframeUrl} className="w-full min-h-[720px] rounded-2xl border border-[var(--color-border)] bg-white" />
      )}

      {provider === 'IYZICO' && session?.checkoutFormContent && (
        <Card className="p-4 overflow-hidden">
          <div dangerouslySetInnerHTML={{ __html: session.checkoutFormContent }} />
        </Card>
      )}

      {(!session || session.provider === 'DEMO') && oid && (
        <Card className="p-8 space-y-4">
          <div className="flex items-center gap-2 text-[var(--color-navy)]">
            <Shield size={20} />
            <h2 className="font-black">Demo ödeme</h2>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            PayTR veya iyzico anahtarı tanımlı değil. Bu ortamda ödemeyi demo olarak onaylayabilirsiniz.
          </p>
          <Button onClick={confirmDemo} disabled={busy || !oid} className="font-extrabold">
            {busy ? 'Onaylanıyor…' : 'Demo ödemeyi onayla'}
          </Button>
        </Card>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <RouteGuard requireAuth>
      <Suspense fallback={<p className="text-sm text-[var(--color-muted)]">Ödeme yükleniyor…</p>}>
        <PaymentInner />
      </Suspense>
    </RouteGuard>
  );
}
