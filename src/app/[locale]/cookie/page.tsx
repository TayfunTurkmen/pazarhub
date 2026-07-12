import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import PageHero from '@/components/layout/PageHero';
import { Cookie } from 'lucide-react';

export default async function CookiePage() {
  const t = await getTranslations('Pages');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHero icon={Cookie} title={t('cookie_title')} iconClassName="bg-gradient-to-br from-amber-500 to-orange-500 text-white" />
      <Card className="p-8 prose dark:prose-invert max-w-none">
        <h2>Çerez Nedir?</h2>
        <p>Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük veri dosyalarıdır. Deneyiminizi kişiselleştirmek ve site performansını artırmak için kullanılır.</p>
        <h2>Kullandığımız Çerez Türleri</h2>
        <ul>
          <li><strong>Zorunlu Çerezler:</strong> Sitenin temel işlevleri için gereklidir.</li>
          <li><strong>Tercih Çerezleri:</strong> Dil, tema gibi tercihlerinizi hatırlar.</li>
          <li><strong>Analitik Çerezler:</strong> Ziyaretçi davranışlarını anonimleştirerek analiz eder.</li>
          <li><strong>Pazarlama Çerezleri:</strong> Size özel reklamlar sunmak için kullanılır.</li>
        </ul>
        <h2>Çerez Yönetimi</h2>
        <p>Tarayıcınızın ayarlarından çerezleri kontrol edebilir, silebilir veya devre dışı bırakabilirsiniz. Ancak bazı çerezlerin devre dışı bırakılması sitemizin işlevselliğini etkileyebilir.</p>
      </Card>
    </div>
  );
}
