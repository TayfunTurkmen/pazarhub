'use client';

import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
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
            <div className="text-center space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">{t('contact_title')}</h1>
                <p className="text-[var(--color-muted)] max-w-2xl mx-auto">{t('contact_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Info */}
                <div className="space-y-4">
                    <Card className="p-6 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <MapPin size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1 text-[var(--color-foreground)]">{t('contact_address')}</h3>
                            <p className="text-sm text-[var(--color-muted)]">Levent Mah. Büyükdere Cad. No:123, Beşiktaş / İstanbul</p>
                        </div>
                    </Card>
                    <Card className="p-6 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                            <Phone size={20} className="text-green-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1 text-[var(--color-foreground)]">{t('contact_phone')}</h3>
                            <p className="text-sm text-[var(--color-muted)]">+90 (212) 555 00 00</p>
                        </div>
                    </Card>
                    <Card className="p-6 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                            <Mail size={20} className="text-purple-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1 text-[var(--color-foreground)]">{t('contact_email_label')}</h3>
                            <p className="text-sm text-[var(--color-muted)]">info@sahibindenkonutal.com</p>
                        </div>
                    </Card>
                </div>

                {/* Contact Form */}
                <Card className="p-6 md:col-span-2">
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                <Send size={28} className="text-green-500" />
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
                                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">{t('contact_message')}</label>
                                <textarea
                                    className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] h-32 transition-colors"
                                    placeholder={t('contact_message')}
                                    required
                                ></textarea>
                            </div>
                            <Button type="submit" className="w-full py-3 font-bold">{t('contact_send')}</Button>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}
