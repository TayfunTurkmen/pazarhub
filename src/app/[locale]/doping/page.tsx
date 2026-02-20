import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import { Zap, TrendingUp, Eye, Star } from 'lucide-react';

export default async function DopingPage() {
    const t = await getTranslations('Pages');

    const features = [
        { icon: TrendingUp, label: t('doping_feature1'), desc: 'İlanınız arama sonuçlarında üst sıralarda yer alır.' },
        { icon: Star, label: t('doping_feature2'), desc: 'Renkli çerçeve ile ilanınız dikkat çeker.' },
        { icon: Eye, label: t('doping_feature3'), desc: 'Standart ilanlara göre 3 kat daha fazla görüntülenme alır.' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-4">
                    <Zap size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">{t('doping_title')}</h1>
                <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">{t('doping_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((f) => (
                    <Card key={f.label} className="p-6 text-center hover:shadow-lg transition-all">
                        <f.icon size={36} className="mx-auto mb-4 text-[var(--color-secondary)]" />
                        <h3 className="font-bold mb-2 text-[var(--color-foreground)]">{f.label}</h3>
                        <p className="text-sm text-[var(--color-muted)]">{f.desc}</p>
                    </Card>
                ))}
            </div>

            <Card className="p-8 text-center bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20">
                <h2 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Hemen Başlayın!</h2>
                <p className="text-[var(--color-muted)] mb-4">Doping hizmeti ile ilanınızı öne çıkarın.</p>
                <button className="btn btn-primary px-8 py-3 font-bold">Doping Paketleri</button>
            </Card>
        </div>
    );
}
