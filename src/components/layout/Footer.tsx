'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SocialLinks {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
}

export default function Footer() {
    const t = useTranslations('Footer');
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
    });

    useEffect(() => {
        // Load social links from localStorage (set via admin panel)
        const stored = localStorage.getItem('socialLinks');
        if (stored) {
            try {
                setSocialLinks(JSON.parse(stored));
            } catch { }
        }
    }, []);

    const socials = [
        { icon: Facebook, href: socialLinks.facebook, label: 'Facebook' },
        { icon: Twitter, href: socialLinks.twitter, label: 'Twitter' },
        { icon: Instagram, href: socialLinks.instagram, label: 'Instagram' },
        { icon: Youtube, href: socialLinks.youtube, label: 'YouTube' },
    ];

    return (
        <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto py-12">
            <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-semibold text-[var(--color-foreground)] mb-4">{t('corporate')}</h3>
                    <ul className="space-y-2.5 text-sm">
                        <li><Link href="/about" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">{t('about')}</Link></li>
                        <li><Link href="/media" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">{t('press')}</Link></li>
                        <li><Link href="/contact" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">{t('contact')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-[var(--color-foreground)] mb-4">{t('services')}</h3>
                    <ul className="space-y-2.5 text-sm">
                        <li><Link href="/doping" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">{t('doping')}</Link></li>
                        <li><Link href="/safe-payment" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">{t('safe_payment')}</Link></li>
                        <li><Link href="/mobile" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">{t('mobile_apps')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-[var(--color-foreground)] mb-4">{t('privacy_title')}</h3>
                    <ul className="space-y-2.5 text-sm">
                        <li><Link href="/terms" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">{t('terms')}</Link></li>
                        <li><Link href="/privacy" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">{t('privacy')}</Link></li>
                        <li><Link href="/cookie" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">{t('cookies')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-[var(--color-foreground)] mb-4">{t('follow_us')}</h3>
                    <div className="flex gap-3">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className="w-10 h-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-center hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white text-[var(--color-muted)] cursor-pointer transition-all hover:scale-110 hover:shadow-lg hover:shadow-[var(--color-primary)]/20"
                            >
                                <social.icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            <div className="container-custom mt-10 pt-8 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-muted)]">
                &copy; {new Date().getFullYear()} SahibindenKonutAl.com - {t('copyright')}
            </div>
        </footer>
    );
}
