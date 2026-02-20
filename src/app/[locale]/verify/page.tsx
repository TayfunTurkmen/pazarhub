'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ShieldCheck, Phone, Mail, FileText } from 'lucide-react';

export default function VerifyPage() {
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">Hesap Doğrulama</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StepCard
                    icon={Phone}
                    title="SMS Doğrulama"
                    active={step === 1}
                    done={step > 1}
                />
                <StepCard
                    icon={Mail}
                    title="E-Posta Onayı"
                    active={step === 2}
                    done={step > 2}
                />
                <StepCard
                    icon={FileText}
                    title="Kimlik Yükleme"
                    active={step === 3}
                    done={step > 3}
                />
            </div>

            <Card className="p-8">
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Telefonunuza gelen kodu giriniz</h2>
                        <p className="text-gray-500 text-sm">0555 *** ** 67 numaralı telefona gönderilen 4 haneli kodu giriniz.</p>
                        <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Kod: 1234"
                            className="text-center text-2xl tracking-widest"
                            maxLength={4}
                        />
                        <Button className="w-full btn-primary" onClick={() => { setCode(''); setStep(2); }}>Doğrula</Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">E-Posta Adresinizi Doğrulayın</h2>
                        <p className="text-gray-500 text-sm">ahmet@example.com adresine bir doğrulama linki gönderdik.</p>
                        <div className="bg-yellow-50 p-4 rounded text-sm text-yellow-800">
                            Simülasyon: E-postadaki linke tıklandığını varsayıyoruz.
                        </div>
                        <Button className="w-full btn-primary" onClick={() => setStep(3)}>Onayladım</Button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Kimlik Belgesi Yükle</h2>
                        <p className="text-gray-500 text-sm">Yasal zorunluluk gereği kimlik doğrulaması yapmamız gerekmektedir.</p>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                            <ShieldCheck size={48} className="mx-auto text-gray-400 mb-2" />
                            <p className="font-medium text-gray-700">Kimlik Ön Yüzünü Sürükleyin</p>
                            <p className="text-xs text-gray-500 mt-1">veya seçmek için tıklayın</p>
                        </div>

                        <Button className="w-full btn-primary" onClick={() => alert('Doğrulama Talebi Alındı! Yöneticiler tarafından incelenecek.')}>
                            Gönder ve Tamamla
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}

function StepCard({ icon: Icon, title, active, done }: any) {
    return (
        <Card className={`p-4 flex flex-col items-center gap-2 transition-all ${active ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' : ''} ${done ? 'bg-green-50 border-green-200' : ''}`}>
            <Icon size={24} className={done ? 'text-green-600' : active ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
            <span className={`font-medium ${done ? 'text-green-700' : active ? 'text-[var(--color-primary)]' : 'text-gray-500'}`}>{title}</span>
        </Card>
    );
}
