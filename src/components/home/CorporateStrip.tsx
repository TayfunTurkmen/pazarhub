import { Link } from '@/i18n/navigation';
import { Building2, Zap, Shield } from 'lucide-react';

export default function CorporateStrip() {
  return (
    <section className="rounded-3xl overflow-hidden border border-[var(--color-navy)] bg-[var(--color-navy)] text-white">
      <div className="grid md:grid-cols-3">
        <Link href="/kurumsal" className="p-6 md:p-8 hover:bg-white/5 border-b md:border-b-0 md:border-r border-white/10">
          <Building2 className="text-[var(--color-brand-yellow)] mb-3" />
          <h3 className="font-black text-lg">Kurumsal üyelik</h3>
          <p className="text-sm text-white/70 mt-2">Ücretsiz 1 ilan / 30 gün. Ofisler için 15–sınırsız kota, aylık plan.</p>
        </Link>
        <Link href="/doping" className="p-6 md:p-8 hover:bg-white/5 border-b md:border-b-0 md:border-r border-white/10">
          <Zap className="text-[var(--color-brand-yellow)] mb-3" />
          <h3 className="font-black text-lg">Doping + Vitrin</h3>
          <p className="text-sm text-white/70 mt-2">Aramada üst sıra, sarı çerçeve ve anasayfa vitrini.</p>
        </Link>
        <Link href="/param-guvende" className="p-6 md:p-8 hover:bg-white/5">
          <Shield className="text-[var(--color-brand-yellow)] mb-3" />
          <h3 className="font-black text-lg">Param Güvende</h3>
          <p className="text-sm text-white/70 mt-2">PayTR / iyzico ile emanet ödeme. Teslim onayına kadar para güvende.</p>
        </Link>
      </div>
    </section>
  );
}
