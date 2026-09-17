'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import Card from '@/components/ui/Card';
import RouteGuard from '@/components/auth/RouteGuard';
import { BOOSTS } from '@/lib/billing/plans';
import CheckoutButton from '@/components/billing/CheckoutButton';
import { Listing } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Crown, Zap } from 'lucide-react';

function DopingInner() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselect = searchParams.get('listingId') ?? '';
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingId, setListingId] = useState(preselect);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/users/${user.id}/listings`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setListings(json.data);
          if (!preselect && json.data[0]?.id) setListingId(json.data[0].id);
        }
      })
      .catch(() => undefined);
  }, [user?.id, preselect]);

  const packs = [
    { code: 'DOPING_7' as const, kind: 'DOPING' as const, icon: Zap, hint: 'Arama sonuçlarında öne çıkar' },
    { code: 'DOPING_15' as const, kind: 'DOPING' as const, icon: Sparkles, hint: '2 haftalık premium çerçeve' },
    { code: 'SHOWCASE_7' as const, kind: 'SHOWCASE' as const, icon: Crown, hint: 'Anasayfa vitrin bandı' },
    { code: 'SHOWCASE_30' as const, kind: 'SHOWCASE' as const, icon: Crown, hint: '30 gün vitrin + öne çıkan rozet' },
  ];

  return (
    <RouteGuard requireAuth>
      <div className="space-y-8">
        <section className="rounded-3xl bg-[var(--color-navy)] text-white px-6 py-10">
          <p className="text-[var(--color-brand-accent)] text-xs font-black uppercase tracking-[0.2em] mb-2">Doping & Vitrin</p>
          <h1 className="text-3xl md:text-4xl font-black">İlanınızı sarı vitrine taşıyın</h1>
          <p className="mt-3 text-white/75 max-w-2xl">
            Doping arama sıralamasını yükseltir, vitrin anasayfada ve kategori tepesinde gösterir. Ücret PayTR veya iyzico ile alınır.
          </p>
        </section>

        <Card className="p-5">
          <label className="text-sm font-bold block mb-2">Hangi ilan?</label>
          {listings.length === 0 ? (
            <div className="text-sm text-[var(--color-muted)]">
              Önce ilan verin.{' '}
              <button type="button" className="underline" onClick={() => router.push('/post-ad')}>İlan ver</button>
            </div>
          ) : (
            <select
              value={listingId}
              onChange={(e) => setListingId(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm"
            >
              {listings.map((listing) => (
                <option key={listing.id} value={listing.id}>{listing.title}</option>
              ))}
            </select>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {packs.map((pack) => {
            const meta = BOOSTS[pack.code];
            return (
              <Card key={pack.code} className="p-6">
                <pack.icon className="text-[var(--color-navy)] mb-3" />
                <h2 className="font-black">{meta.name}</h2>
                <p className="text-2xl font-black mt-1">{meta.price.toLocaleString('tr-TR')} ₺</p>
                <p className="text-xs text-[var(--color-muted)] mb-4">{pack.hint}</p>
                <CheckoutButton
                  variant={meta.tier === 'showcase' ? 'secondary' : 'primary'}
                  label="Satın al"
                  disabled={!listingId}
                  payload={{ kind: pack.kind, productCode: pack.code, listingId }}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </RouteGuard>
  );
}

export default function DopingPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--color-muted)]">Paketler yükleniyor…</p>}>
      <DopingInner />
    </Suspense>
  );
}
