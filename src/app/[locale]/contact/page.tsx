'use client';

import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PageHero from '@/components/layout/PageHero';
import SecurityNote from '@/components/ui/SecurityNote';
import { Mail, Phone, MapPin, Send, Sparkles, Flame, Thermometer, Snowflake, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LeadResult {
  score: number;
  grade: 'hot' | 'warm' | 'cold';
  summary: string;
  nextAction: string;
}

const gradeConfig = {
  hot: { icon: Flame, color: 'text-rose-600 bg-rose-500/10', labelKey: 'lead_hot' as const },
  warm: { icon: Thermometer, color: 'text-amber-600 bg-amber-500/10', labelKey: 'lead_warm' as const },
  cold: { icon: Snowflake, color: 'text-blue-600 bg-blue-500/10', labelKey: 'lead_cold' as const },
};

export default function ContactPage() {
  const t = useTranslations('Pages');
  const tAi = useTranslations('AI');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState<LeadResult | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai/lead-qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, save: true }),
      });
      const json = await res.json() as { success: boolean; data?: LeadResult };
      if (json.success && json.data) setLead(json.data);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const grade = lead ? gradeConfig[lead.grade] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHero icon={Mail} title={t('contact_title')} description={t('contact_desc')} />

      <SecurityNote
        title="Güvenli İletişim"
        description="Mesajlarınız şifreli kanallar üzerinden iletilir. AI lead kalifikasyonu ile talebiniz önceliklendirilir."
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
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Send size={28} className="text-emerald-500" />
              </div>
              <p className="text-lg font-semibold text-[var(--color-foreground)]">Mesajınız gönderildi!</p>
              {lead && grade && (
                <div className={`w-full max-w-md p-4 rounded-2xl border border-[var(--color-border)] ${grade.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} />
                    <span className="font-bold text-sm">{tAi('lead_qualified')}: {lead.score}/100</span>
                    <grade.icon size={16} />
                    <span className="text-xs font-medium">{tAi(grade.labelKey)}</span>
                  </div>
                  <p className="text-sm">{lead.summary}</p>
                  <p className="text-xs mt-2 opacity-80">{tAi('lead_next_action')}: {lead.nextAction}</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t('contact_name')} placeholder={t('contact_name')} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label={t('contact_email')} type="email" placeholder="email@example.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <Input label={t('contact_phone')} placeholder="+90 5XX XXX XX XX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label={t('contact_subject')} placeholder={t('contact_subject')} required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">{t('contact_message')}</label>
                <textarea
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] h-32 transition-colors"
                  placeholder={t('contact_message')}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full py-3 font-bold" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Sparkles size={16} className="mr-2" />}
                {t('contact_send')}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
