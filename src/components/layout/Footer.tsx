'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import NewsletterForm from '@/components/home/NewsletterForm';
import { isSafeExternalUrl } from '@/lib/sanitize';
import Logo from '@/components/brand/Logo';

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
    <footer className="bg-[var(--color-navy)] text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <Logo inverted />
            <p className="text-sm text-white/70 leading-relaxed mt-4 mb-4">
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
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[var(--color-brand-accent)] hover:text-white text-white/80"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('corporate')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('about')}</Link></li>
              <li><Link href="/media" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('press')}</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('services')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/ai" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('ai_platform')}</Link></li>
              <li><Link href="/blog" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('ai_blog')}</Link></li>
              <li><Link href="/kurumsal" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('corporate_membership')}</Link></li>
              <li><Link href="/doping" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('doping')}</Link></li>
              <li><Link href="/param-guvende" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('escrow')}</Link></li>
              <li><Link href="/safe-payment" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('safe_payment')}</Link></li>
              <li><Link href="/mobile" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('mobile_apps')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('help')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/contact" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('faq')}</Link></li>
              <li><Link href="/terms" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('terms')}</Link></li>
              <li><Link href="/privacy" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('privacy')}</Link></li>
              <li><Link href="/cookie" className="text-white/70 hover:text-[var(--color-primary-light)]">{t('cookies')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('follow_us')}</h3>
            <p className="text-sm text-white/70 mb-3">{t('newsletter_desc')}</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="bg-black/30 py-4">
        <div className="container-custom text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} skonutal.com — {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
