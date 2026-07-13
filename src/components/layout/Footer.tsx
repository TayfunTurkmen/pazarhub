'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import NewsletterForm from '@/components/home/NewsletterForm';
import { isSafeExternalUrl } from '@/lib/sanitize';

interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

const DEFAULT_SOCIAL: SocialLinks = {
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
};

export default function Footer() {
  const t = useTranslations('Footer');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(DEFAULT_SOCIAL);

  useEffect(() => {
    const stored = localStorage.getItem('socialLinks');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Partial<SocialLinks>;
      setSocialLinks({
        facebook: isSafeExternalUrl(parsed.facebook ?? '') ? parsed.facebook! : DEFAULT_SOCIAL.facebook,
        twitter: isSafeExternalUrl(parsed.twitter ?? '') ? parsed.twitter! : DEFAULT_SOCIAL.twitter,
        instagram: isSafeExternalUrl(parsed.instagram ?? '') ? parsed.instagram! : DEFAULT_SOCIAL.instagram,
        youtube: isSafeExternalUrl(parsed.youtube ?? '') ? parsed.youtube! : DEFAULT_SOCIAL.youtube,
      });
    } catch {
      // ignore malformed localStorage
    }
  }, []);

  const socials = [
    { icon: Facebook, href: socialLinks.facebook, label: 'Facebook' },
    { icon: Twitter, href: socialLinks.twitter, label: 'Twitter' },
    { icon: Instagram, href: socialLinks.instagram, label: 'Instagram' },
    { icon: Youtube, href: socialLinks.youtube, label: 'YouTube' },
  ];

  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 bg-gradient-to-br from-[var(--color-secondary)] to-amber-400 text-blue-900 rounded-lg flex items-center justify-center text-sm font-black">S</span>
              <span className="font-bold text-[var(--color-foreground)]">sahibindenkonutal.com</span>
            </Link>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
              {t('tagline')}
            </p>
            <div className="flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg flex items-center justify-center hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white text-[var(--color-muted)] transition-colors"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--color-foreground)] mb-4">{t('corporate')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('about')}</Link></li>
              <li><Link href="/media" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('press')}</Link></li>
              <li><Link href="/contact" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--color-foreground)] mb-4">{t('services')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/ai" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('ai_platform')}</Link></li>
              <li><Link href="/blog" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('ai_blog')}</Link></li>
              <li><Link href="/doping" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('doping')}</Link></li>
              <li><Link href="/safe-payment" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('safe_payment')}</Link></li>
              <li><Link href="/mobile" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('mobile_apps')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--color-foreground)] mb-4">{t('help')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/contact" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('faq')}</Link></li>
              <li><Link href="/terms" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('terms')}</Link></li>
              <li><Link href="/privacy" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('privacy')}</Link></li>
              <li><Link href="/cookie" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{t('cookies')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--color-foreground)] mb-4">{t('follow_us')}</h3>
            <p className="text-sm text-[var(--color-muted)] mb-3">{t('newsletter_desc')}</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="bg-blue-950 dark:bg-slate-950 py-4">
        <div className="container-custom text-center text-sm text-blue-200/70">
          &copy; {new Date().getFullYear()} SahibindenKonutAl.com — {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
