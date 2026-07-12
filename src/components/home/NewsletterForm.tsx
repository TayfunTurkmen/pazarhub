'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isValidEmail } from '@/lib/sanitize';

export default function NewsletterForm() {
  const t = useTranslations('Footer');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus('error');
      return;
    }
    // Newsletter API not wired yet — show success without persisting PII client-side
    setStatus('success');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
          placeholder={t('newsletter_placeholder')}
          maxLength={254}
          autoComplete="email"
          aria-label={t('newsletter_placeholder')}
          className="flex-1 px-3 py-2.5 text-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
        />
        <button
          type="submit"
          aria-label={t('newsletter_submit')}
          className="w-10 h-10 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-blue-900 rounded-xl flex items-center justify-center shrink-0 transition-colors"
        >
          <ArrowRight size={18} />
        </button>
      </div>
      {status === 'error' && (
        <p className="text-xs text-red-500" role="alert">{t('newsletter_error')}</p>
      )}
      {status === 'success' && (
        <p className="text-xs text-emerald-600" role="status">{t('newsletter_success')}</p>
      )}
    </form>
  );
}
