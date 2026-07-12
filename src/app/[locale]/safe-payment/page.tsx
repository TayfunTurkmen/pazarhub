import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import PageHero from '@/components/layout/PageHero';
import { Shield, Lock, CheckCircle, ArrowRight } from 'lucide-react';

export default async function SafePaymentPage() {
  const t = await getTranslations('Pages');

  const steps = [
    { title: 'Alıcı ödemeyi yapar', desc: 'Ödeme güvenli hesapta tutulur.', icon: Lock },
    { title: 'Ürün teslim edilir', desc: 'Satıcı ürünü kargolar veya teslim eder.', icon: CheckCircle },
    { title: 'Ödeme serbest bırakılır', desc: 'Alıcı onay verdikten sonra ödeme satıcıya aktarılır.', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <PageHero
        icon={Shield}
        title={t('safe_payment_title')}
        description={t('safe_payment_desc')}
        iconClassName="bg-gradient-to-br from-emerald-500 to-green-600 text-white"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div key={step.title} className="flex flex-col items-center text-center">
            <Card className="p-6 w-full hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <step.icon size={24} className="text-emerald-500" />
              </div>
              <div className="text-sm font-bold text-[var(--color-primary)] mb-1">Adım {i + 1}</div>
              <h3 className="font-bold text-[var(--color-foreground)] mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--color-muted)]">{step.desc}</p>
            </Card>
            {i < steps.length - 1 && (
              <ArrowRight size={24} className="text-[var(--color-border)] my-4 md:hidden" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
