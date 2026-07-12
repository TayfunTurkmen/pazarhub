'use client';

import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PageHero from '@/components/layout/PageHero';
import SecurityNote from '@/components/ui/SecurityNote';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const t = useTranslations('Pages');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHero icon={Mail} title={t('contact_title')} description={t('contact_desc')} />

      <SecurityNote
        title="Güvenli İletişim"
        description="Mesajlarınız şifreli kanallar üzerinden iletilir. Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          {[
            { icon: MapPin, title: t('contact_address'), text: 'Levent Mah. Büyükdere Cad. No:123, Beşiktaş / İstanbul', color: 'bg-blue-500/10 text-blue-500' },
            { icon: Phone, title: t('contact_phone'), text: '+90 (212) 555 00 00', color: 'bg-emerald-500/10 text-emerald-500' },
            { icon: Mail, title: t('contact_email_label'), text: 'info@sahibindenkonutal.com', color: 'bg-violet-500/10 text-violet-500' },
          ].map((item) => (
            <Card key={item.title} className="p-5 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-[var(--color-foreground)]">{item.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">{item.text}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 md:col-span-2">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Send size={28} className="text-emerald-500" />
              </div>
              <p className="text-lg font-semibold text-[var(--color-foreground)]">Mesajınız gönderildi!</p>
              <p className="text-sm text-[var(--color-muted)] mt-2">En kısa sürede size dönüş yapacağız.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t('contact_name')} placeholder={t('contact_name')} required />
                <Input label={t('contact_email')} type="email" placeholder="email@example.com" required />
              </div>
              <Input label={t('contact_subject')} placeholder={t('contact_subject')} required />
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">{t('contact_message')}</label>
                <textarea
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] h-32 transition-colors"
                  placeholder={t('contact_message')}
                  required
                />
              </div>
              <Button type="submit" className="w-full py-3 font-bold">{t('contact_send')}</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
