'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PageHero from '@/components/layout/PageHero';
import SecurityNote from '@/components/ui/SecurityNote';
import { ShieldCheck, Phone, Mail, FileText, type LucideIcon } from 'lucide-react';

export default function VerifyPage() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHero
        icon={ShieldCheck}
        title="Hesap Doğrulama"
        description="Güvenli alışveriş için hesabınızı doğrulayın. Tüm bilgileriniz şifreli olarak saklanır."
        iconClassName="bg-gradient-to-br from-emerald-500 to-green-600 text-white"
      />

      <SecurityNote
        title="Güvenli Doğrulama Süreci"
        description="Kimlik bilgileriniz yalnızca doğrulama amacıyla kullanılır ve üçüncü taraflarla paylaşılmaz."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StepCard icon={Phone} title="SMS Doğrulama" active={step === 1} done={step > 1} />
        <StepCard icon={Mail} title="E-Posta Onayı" active={step === 2} done={step > 2} />
        <StepCard icon={FileText} title="Kimlik Yükleme" active={step === 3} done={step > 3} />
      </div>

      <Card className="p-8">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">Telefonunuza gelen kodu giriniz</h2>
            <p className="text-[var(--color-muted)] text-sm">0555 *** ** 67 numaralı telefona gönderilen 4 haneli kodu giriniz.</p>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Kod: 1234"
              className="text-center text-2xl tracking-widest"
              maxLength={4}
              inputMode="numeric"
            />
            <Button className="w-full" onClick={() => { setCode(''); setStep(2); }}>Doğrula</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">E-Posta Adresinizi Doğrulayın</h2>
            <p className="text-[var(--color-muted)] text-sm">ahmet@example.com adresine bir doğrulama linki gönderdik.</p>
            <div className="bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 p-4 rounded-xl text-sm text-[var(--color-foreground)]">
              Simülasyon: E-postadaki linke tıklandığını varsayıyoruz.
            </div>
            <Button className="w-full" onClick={() => setStep(3)}>Onayladım</Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">Kimlik Belgesi Yükle</h2>
            <p className="text-[var(--color-muted)] text-sm">Yasal zorunluluk gereği kimlik doğrulaması yapmamız gerekmektedir.</p>
            <div className="border-2 border-dashed border-[var(--color-border)] rounded-2xl p-8 text-center hover:bg-[var(--color-background)] cursor-pointer transition-colors">
              <ShieldCheck size={48} className="mx-auto text-[var(--color-muted)] mb-2" />
              <p className="font-medium text-[var(--color-foreground)]">Kimlik Ön Yüzünü Sürükleyin</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">veya seçmek için tıklayın</p>
            </div>
            <Button className="w-full" onClick={() => alert('Doğrulama Talebi Alındı! Yöneticiler tarafından incelenecek.')}>
              Gönder ve Tamamla
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function StepCard({ icon: Icon, title, active, done }: { icon: LucideIcon; title: string; active: boolean; done: boolean }) {
  return (
    <Card className={`p-4 flex flex-col items-center gap-2 transition-all ${active ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20' : ''} ${done ? 'bg-emerald-500/5 border-emerald-500/30' : ''}`}>
      <Icon size={24} className={done ? 'text-emerald-600' : active ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} />
      <span className={`font-medium text-sm ${done ? 'text-emerald-700 dark:text-emerald-400' : active ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'}`}>{title}</span>
    </Card>
  );
}
