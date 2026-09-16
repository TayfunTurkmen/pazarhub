import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import PageHero from '@/components/layout/PageHero';
import { Newspaper, ExternalLink } from 'lucide-react';

export default async function MediaPage() {
  const t = await getTranslations('Pages');

  const articles = [
    { title: 'skonutal.com, 1 Milyon Aktif İlana Ulaştı', source: 'Hürriyet Ekonomi', date: '15 Ocak 2026' },
    { title: 'Emlak Sektöründe Dijital Dönüşümün Yeni Yüzü', source: 'Bloomberg HT', date: '8 Ocak 2026' },
    { title: 'Güvenli Ödeme Sistemi ile Dolandırıcılığa Son', source: 'Sabah Teknoloji', date: '22 Aralık 2025' },
    { title: 'Mobil Uygulama İndirme Rekoru Kırdı', source: 'Webrazzi', date: '10 Aralık 2025' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHero
        icon={Newspaper}
        title={t('media_title')}
        description={t('media_desc')}
        iconClassName="bg-gradient-to-br from-violet-500 to-purple-600 text-white"
      />

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.title} className="p-6 flex items-center justify-between hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all cursor-pointer group">
            <div>
              <h3 className="font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">{article.title}</h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-[var(--color-muted)]">
                <span className="font-medium text-[var(--color-primary)]">{article.source}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>
            </div>
            <ExternalLink size={20} className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors shrink-0" />
          </Card>
        ))}
      </div>
    </div>
  );
}
