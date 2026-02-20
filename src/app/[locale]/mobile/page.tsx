import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import { Smartphone, Apple, Download } from 'lucide-react';

export default async function MobilePage() {
    const t = await getTranslations('Pages');

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white mb-4">
                    <Smartphone size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">{t('mobile_title')}</h1>
                <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">{t('mobile_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 text-center hover:shadow-lg transition-all group cursor-pointer">
                    <Apple size={48} className="mx-auto mb-4 text-[var(--color-foreground)] group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">iOS</h3>
                    <p className="text-[var(--color-muted)] mb-4">iPhone ve iPad için App Store'dan indirin</p>
                    <button className="btn btn-primary flex items-center gap-2 mx-auto">
                        <Download size={18} />
                        App Store
                    </button>
                </Card>
                <Card className="p-8 text-center hover:shadow-lg transition-all group cursor-pointer">
                    <Smartphone size={48} className="mx-auto mb-4 text-green-600 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Android</h3>
                    <p className="text-[var(--color-muted)] mb-4">Android cihazlar için Google Play'den indirin</p>
                    <button className="btn btn-primary flex items-center gap-2 mx-auto">
                        <Download size={18} />
                        Google Play
                    </button>
                </Card>
            </div>

            <Card className="p-6 text-center">
                <h3 className="font-bold text-[var(--color-foreground)] mb-2">QR Kod ile İndirin</h3>
                <p className="text-sm text-[var(--color-muted)]">Kameranızla QR kodu tarayarak hemen indirin.</p>
                <div className="w-32 h-32 bg-[var(--color-border)]/30 rounded-lg mx-auto mt-4 flex items-center justify-center text-[var(--color-muted)]">
                    QR
                </div>
            </Card>
        </div>
    );
}
