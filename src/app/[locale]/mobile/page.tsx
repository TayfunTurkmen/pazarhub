import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import PageHero from '@/components/layout/PageHero';
import { Smartphone, Apple, Download } from 'lucide-react';

export default async function MobilePage() {
  const t = await getTranslations('Pages');

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <PageHero
        icon={Smartphone}
        title={t('mobile_title')}
        description={t('mobile_desc')}
        iconClassName="bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 text-center hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all group">
          <Apple size={48} className="mx-auto mb-4 text-[var(--color-foreground)] group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">iOS</h3>
          <p className="text-[var(--color-muted)] mb-4">iPhone ve iPad için App Store&apos;dan indirin</p>
          <button type="button" className="btn btn-primary inline-flex items-center gap-2">
            <Download size={18} />
            App Store
          </button>
        </Card>
        <Card className="p-8 text-center hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all group">
          <Smartphone size={48} className="mx-auto mb-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Android</h3>
          <p className="text-[var(--color-muted)] mb-4">Android cihazlar için Google Play&apos;den indirin</p>
          <button type="button" className="btn btn-primary inline-flex items-center gap-2">
            <Download size={18} />
            Google Play
          </button>
        </Card>
      </div>

      <Card className="p-6 text-center">
        <h3 className="font-bold text-[var(--color-foreground)] mb-2">QR Kod ile İndirin</h3>
        <p className="text-sm text-[var(--color-muted)]">Kameranızla QR kodu tarayarak hemen indirin.</p>
        <div className="w-32 h-32 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl mx-auto mt-4 flex items-center justify-center text-[var(--color-muted)] font-mono text-sm">
          QR
        </div>
      </Card>
    </div>
  );
}
