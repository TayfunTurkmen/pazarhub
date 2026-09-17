import { PLANS } from '@/lib/billing/plans';
import CheckoutButton from '@/components/billing/CheckoutButton';
import Card from '@/components/ui/Card';
import { Building2, Check } from 'lucide-react';

export default function CorporatePlansPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-[var(--color-navy)] text-white px-6 py-12 md:px-12">
        <p className="text-[var(--color-brand-accent)] text-xs font-black uppercase tracking-[0.2em] mb-3">Kurumsal üyelik</p>
        <h1 className="text-3xl md:text-5xl font-black max-w-3xl leading-tight">
          Ofisinizi <span className="text-[var(--color-brand-accent)]">sendekonutal.com</span> vitrinine taşıyın
        </h1>
        <p className="mt-4 text-white/75 max-w-2xl">
          Ücretsiz hesapta 1 ilan / 30 gün. Kurumsal aylık planlarla kota, doping, vitrin ve mağaza sayfası açılır.
          Ödeme PayTR veya iyzico ile tahsil edilir; anahtar yoksa demo ödeme devreye girer.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {PLANS.map((plan) => {
          const featured = plan.code === 'CORPORATE_PRO';
          return (
            <Card
              key={plan.code}
              className={`p-6 flex flex-col ${featured ? 'ring-2 ring-[var(--color-brand-accent)] border-[var(--color-navy)]' : ''}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={18} className="text-[var(--color-navy)]" />
                <h2 className="font-black text-[var(--color-navy)] dark:text-[var(--color-brand-accent)]">{plan.name}</h2>
              </div>
              <p className="text-3xl font-black mb-1">
                {plan.monthlyPrice === 0 ? 'Ücretsiz' : `${plan.monthlyPrice.toLocaleString('tr-TR')} ₺`}
                {plan.monthlyPrice > 0 && <span className="text-sm font-semibold text-[var(--color-muted)]"> / ay</span>}
              </p>
              <p className="text-xs text-[var(--color-muted)] mb-4">
                {plan.listingQuota} ilan · {plan.listingDays} gün yayında
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2 text-sm text-[var(--color-foreground)]">
                    <Check size={16} className="text-[var(--color-brand-accent)] shrink-0 mt-0.5" />
                    {bullet}
                  </li>
                ))}
              </ul>
              {plan.code === 'FREE' ? (
                <p className="text-xs text-center text-[var(--color-muted)]">Kayıt ile otomatik başlar</p>
              ) : (
                <CheckoutButton
                  variant={featured ? 'secondary' : 'primary'}
                  label={`${plan.name} satın al`}
                  payload={{ kind: 'SUBSCRIPTION', plan: plan.code as 'CORPORATE_STARTER' | 'CORPORATE_PRO' | 'CORPORATE_AGENCY' }}
                />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
