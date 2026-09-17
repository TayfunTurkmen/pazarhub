'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import RouteGuard from '@/components/auth/RouteGuard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Shield } from 'lucide-react';
import { ESCROW_FEE_RATE } from '@/lib/billing/plans';

interface EscrowItem {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  fee: number;
  status: string;
}

const LABELS: Record<string, string> = {
  AWAITING_PAYMENT: 'Ödeme bekleniyor',
  HELD: 'Param güvende tutuluyor',
  DELIVERED: 'Teslim edildi, onay bekleniyor',
  COMPLETED: 'Tamamlandı',
  DISPUTED: 'İtiraz açık',
  REFUNDED: 'İade',
  CANCELED: 'İptal',
};

export default function ParamGuvendePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<EscrowItem[]>([]);
  const [busyId, setBusyId] = useState('');

  const load = () => {
    fetch('/api/escrow')
      .then((res) => res.json())
      .then((json) => { if (json.success) setItems(json.data); })
      .catch(() => undefined);
  };

  useEffect(() => { load(); }, []);

  const act = async (id: string, action: 'deliver' | 'confirm' | 'dispute' | 'cancel') => {
    setBusyId(id);
    try {
      const res = await fetch('/api/escrow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      const json = await res.json();
      if (json.success) load();
    } finally {
      setBusyId('');
    }
  };

  return (
    <RouteGuard requireAuth>
      <div className="space-y-8">
        <section className="rounded-3xl bg-[var(--color-navy)] text-white px-6 py-10">
          <p className="text-[var(--color-brand-accent)] text-xs font-black uppercase tracking-[0.2em] mb-2">Param Güvende</p>
          <h1 className="text-3xl md:text-4xl font-black">Tapu / teslim olana kadar para emanette</h1>
          <p className="mt-3 text-white/75 max-w-2xl">
            Alıcı PayTR veya iyzico ile öder. Tutar emanet hesabında tutulur; satıcı teslim işaretler, alıcı onaylayınca satıcıya geçer.
            Hizmet bedeli %{((ESCROW_FEE_RATE) * 100).toFixed(1)}.
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {['1. Alıcı ödemeyi yapar', '2. Satıcı teslim eder', '3. Alıcı onaylar, para çözülür'].map((step) => (
            <Card key={step} className="p-5 font-bold text-[var(--color-navy)] dark:text-[var(--color-brand-accent)]">{step}</Card>
          ))}
        </div>

        <div className="space-y-3">
          {items.length === 0 && (
            <Card className="p-8 text-center text-sm text-[var(--color-muted)]">
              Henüz emanet işleminiz yok. Bir ilan sayfasından Param Güvende ile satın alın.
            </Card>
          )}
          {items.map((item) => {
            const isBuyer = item.buyerId === user?.id;
            const isSeller = item.sellerId === user?.id;
            return (
              <Card key={item.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <p className="font-black">{item.amount.toLocaleString('tr-TR')} ₺</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {LABELS[item.status] ?? item.status} · komisyon {item.fee.toLocaleString('tr-TR')} ₺ · {isBuyer ? 'Alıcı' : 'Satıcı'}
                  </p>
                  <Link href={`/listing/${item.listingId}`} className="text-xs underline">İlanı gör</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isSeller && item.status === 'HELD' && (
                    <Button size="sm" disabled={busyId === item.id} onClick={() => act(item.id, 'deliver')}>Teslim ettim</Button>
                  )}
                  {isBuyer && item.status === 'DELIVERED' && (
                    <Button size="sm" variant="secondary" disabled={busyId === item.id} onClick={() => act(item.id, 'confirm')}>Onayla, parayı çöz</Button>
                  )}
                  {(isBuyer || isSeller) && ['HELD', 'DELIVERED'].includes(item.status) && (
                    <Button size="sm" variant="outline" disabled={busyId === item.id} onClick={() => act(item.id, 'dispute')}>İtiraz</Button>
                  )}
                  {isBuyer && item.status === 'AWAITING_PAYMENT' && (
                    <Button size="sm" variant="ghost" disabled={busyId === item.id} onClick={() => act(item.id, 'cancel')}>İptal</Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </RouteGuard>
  );
}
