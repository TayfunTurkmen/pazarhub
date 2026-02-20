'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Facebook, Twitter, Instagram, Youtube, Save, CheckCircle, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SocialLinks {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
}

const defaultLinks: SocialLinks = {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
};

export default function AdminSocialSettings() {
    const t = useTranslations('Admin');
    const [links, setLinks] = useState<SocialLinks>(defaultLinks);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('socialLinks');
        if (stored) {
            try {
                setLinks(JSON.parse(stored));
            } catch { }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('socialLinks', JSON.stringify(links));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const socials = [
        { key: 'facebook' as const, label: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-500/10', placeholder: 'https://facebook.com/sahibindenkonutal' },
        { key: 'twitter' as const, label: 'Twitter / X', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-500/10', placeholder: 'https://twitter.com/sahibindenkonutal' },
        { key: 'instagram' as const, label: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', placeholder: 'https://instagram.com/sahibindenkonutal' },
        { key: 'youtube' as const, label: 'YouTube', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', placeholder: 'https://youtube.com/@sahibindenkonutal' },
    ];

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Sosyal Medya Ayarları</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">Footer&apos;da görüntülenecek sosyal medya bağlantılarını yönetin</p>
                </div>
            </div>

            <Card className="p-6">
                <div className="space-y-5">
                    {socials.map((social) => (
                        <div key={social.key} className="flex items-start gap-4">
                            <div className={`w-11 h-11 ${social.bg} rounded-xl flex items-center justify-center shrink-0 mt-6`}>
                                <social.icon size={20} className={social.color} />
                            </div>
                            <div className="flex-1">
                                <Input
                                    label={social.label}
                                    value={links[social.key]}
                                    onChange={(e) => setLinks({ ...links, [social.key]: e.target.value })}
                                    placeholder={social.placeholder}
                                />
                            </div>
                            <a
                                href={links[social.key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-7 p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors shrink-0"
                                title="Önizle"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-5 border-t border-[var(--color-border)] flex items-center justify-between">
                    <div>
                        {saved && (
                            <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium animate-fade-in">
                                <CheckCircle size={16} />
                                Değişiklikler kaydedildi!
                            </div>
                        )}
                    </div>
                    <Button onClick={handleSave} className="flex items-center gap-2">
                        <Save size={18} />
                        Kaydet
                    </Button>
                </div>
            </Card>

            <Card className="p-5 bg-blue-500/5 border-blue-500/20">
                <p className="text-sm text-[var(--color-muted)]">
                    <strong className="text-[var(--color-foreground)]">💡 Bilgi:</strong> Sosyal medya linkleri sitenin footer bölümünde görüntülenir. Değişiklikler kaydedildikten sonra tüm sayfalarda otomatik olarak güncellenir.
                </p>
            </Card>
        </div>
    );
}
