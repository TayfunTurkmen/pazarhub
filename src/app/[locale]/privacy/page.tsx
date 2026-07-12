import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import PageHero from '@/components/layout/PageHero';
import { Shield } from 'lucide-react';

export default async function PrivacyPage() {
  const t = await getTranslations('Pages');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHero icon={Shield} title={t('privacy_title')} iconClassName="bg-gradient-to-br from-blue-600 to-indigo-700 text-white" />
      <Card className="p-8 prose dark:prose-invert max-w-none">
        <h2>1. Toplanan Veriler</h2>
        <p>Üyelik ve ilan yayınlama sürecinde ad, soyad, e-posta, telefon numarası gibi kişisel bilgilerinizi toplamaktayız. Bu veriler hizmet sunumu için gereklidir.</p>
        <h2>2. Verilerin Kullanımı</h2>
        <p>Toplanan veriler; hizmet sunumu, güvenlik, iletişim ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılmaktadır.</p>
        <h2>3. Veri Güvenliği</h2>
        <p>Verileriniz endüstri standartlarında şifreleme ve güvenlik önlemleriyle korunmaktadır. Yetkisiz erişime karşı teknik ve idari tedbirler alınmaktadır.</p>
        <h2>4. Üçüncü Taraflar</h2>
        <p>Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. Hizmet ortaklarımız gizlilik sözleşmesi kapsamında çalışmaktadır.</p>
        <h2>5. Haklarınız</h2>
        <p>KVKK kapsamında verilerinize erişme, düzeltme, silme ve işlemeye itiraz etme haklarına sahipsiniz. Bu haklarınızı kullanmak için iletişim sayfamızdan bize ulaşabilirsiniz.</p>
        <h2>6. Güncellemeler</h2>
        <p>Bu politika gerektiğinde güncellenebilir. Önemli değişiklikler kullanıcılara bildirilir.</p>
      </Card>
    </div>
  );
}
