import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import { Shield, Lock, CheckCircle, ArrowRight } from 'lucide-react';

export default async function SafePaymentPage() {
    const t = await getTranslations('Pages');

    const steps = [
        { title: 'Alıcı ödemeyi yapar', desc: 'Ödeme güvenli hesapta tutulur.', icon: Lock },
        { title: 'Ürün teslim edilir', desc: 'Satıcı ürünü kargolar veya teslim eder.', icon: CheckCircle },
        { title: 'Ödeme serbest bırakılır', desc: 'Alıcı onay verdikten sonra ödeme satıcıya aktarılır.', icon: Shield },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white mb-4">
                    <Shield size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">{t('safe_payment_title')}</h1>
                <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">{t('safe_payment_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                        <Card className="p-6 w-full hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <step.icon size={24} className="text-green-500" />
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
