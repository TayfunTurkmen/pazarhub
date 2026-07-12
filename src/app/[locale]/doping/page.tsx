import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import PageHero from '@/components/layout/PageHero';
import { Link } from '@/i18n/navigation';
import { Zap, TrendingUp, Eye, Star } from 'lucide-react';

export default async function DopingPage() {
  const t = await getTranslations('Pages');

  const features = [
    { icon: TrendingUp, label: t('doping_feature1'), desc: 'İlanınız arama sonuçlarında üst sıralarda yer alır.' },
    { icon: Star, label: t('doping_feature2'), desc: 'Renkli çerçeve ile ilanınız dikkat çeker.' },
    { icon: Eye, label: t('doping_feature3'), desc: 'Standart ilanlara göre 3 kat daha fazla görüntülenme alır.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <PageHero
        icon={Zap}
        title={t('doping_title')}
        description={t('doping_desc')}
        iconClassName="bg-gradient-to-br from-[var(--color-secondary)] to-amber-500 text-blue-900"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <Card key={f.label} className="p-6 text-center hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center mx-auto mb-4">
              <f.icon size={24} className="text-[var(--color-secondary-dark)]" />
            </div>
            <h3 className="font-bold mb-2 text-[var(--color-foreground)]">{f.label}</h3>
            <p className="text-sm text-[var(--color-muted)]">{f.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-blue-900/5 to-indigo-900/5 border-[var(--color-primary)]/20">
        <h2 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Hemen Başlayın!</h2>
        <p className="text-[var(--color-muted)] mb-4">Doping hizmeti ile ilanınızı öne çıkarın.</p>
        <Link href="/post-ad" className="btn btn-primary inline-flex px-8 py-3 font-bold">
          Doping Paketleri
        </Link>
      </Card>
    </div>
  );
}
