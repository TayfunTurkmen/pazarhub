import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import PageHero from '@/components/layout/PageHero';
import { FileText } from 'lucide-react';

export default async function TermsPage() {
  const t = await getTranslations('Pages');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHero icon={FileText} title={t('terms_title')} />
      <Card className="p-8 prose dark:prose-invert max-w-none">
        <h2>1. Genel Hükümler</h2>
        <p>Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş olursunuz. sendekonutal.com, Türkiye merkezli bir emlak platformu olup, kullanıcılara satılık ve kiralık konut, iş yeri, arsa ve proje hizmeti sunmaktadır.</p>
        <h2>2. Üyelik</h2>
        <p>Siteye üye olmak ücretsizdir. Üyelik sırasında verilen bilgilerin doğruluğundan kullanıcı sorumludur. Yanıltıcı bilgi veren kullanıcıların hesapları kapatılabilir.</p>
        <h2>3. İlan Kuralları</h2>
        <p>İlanlar yasa ve ahlaka aykırı içerik barındıramaz. Gerçeğe aykırı, yanıltıcı veya sahte ilanlar yayınlanamaz. Site yönetimi uygunsuz ilanları kaldırma hakkını saklı tutar.</p>
        <h2>4. Gizlilik</h2>
        <p>Kullanıcı bilgileri gizlilik politikamıza uygun olarak saklanır ve işlenir. Detaylar için Gizlilik Politikası sayfamızı ziyaret ediniz.</p>
        <h2>5. Sorumluluk Sınırları</h2>
        <p>sendekonutal.com, kullanıcılar arasında gerçekleşen işlemlerden doğrudan sorumlu değildir. Platform sadece aracılık hizmeti sunmakta olup, alıcı ve satıcı arasındaki anlaşmazlıklarda taraf değildir.</p>
        <h2>6. Fikri Mülkiyet</h2>
        <p>Site içeriği, tasarım, logo ve yazılımlar sendekonutal.com&apos;a aittir. İzinsiz kopyalama, çoğaltma veya dağıtma yasaktır.</p>
        <h2>7. Değişiklikler</h2>
        <p>Bu koşullar önceden bildirim yapılmaksızın değiştirilebilir. Güncel koşullar her zaman bu sayfada yayınlanır.</p>
      </Card>
    </div>
  );
}
