'use client';

import { useTranslations } from 'next-intl';
import { Building2, Shield, User } from 'lucide-react';

export type DemoAccount = {
  id: 'user' | 'corporate' | 'admin';
  email: string;
  password: string;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { id: 'user', email: 'demo@example.com', password: 'demo' },
  { id: 'corporate', email: 'corporate@example.com', password: 'corporate' },
  { id: 'admin', email: 'admin@example.com', password: 'admin' },
];

type Props = {
  onSelect?: (account: DemoAccount) => void;
};

const ICONS = {
  user: User,
  corporate: Building2,
  admin: Shield,
} as const;

export default function DemoAccountsCard({ onSelect }: Props) {
  const t = useTranslations('Auth');

  return (
    <div className="mt-4 p-4 rounded-xl bg-[var(--color-navy)]/5 border border-[var(--color-navy)]/15 dark:bg-[var(--color-brand-yellow)]/5 dark:border-[var(--color-brand-yellow)]/20">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-navy)] dark:text-[var(--color-brand-yellow)] mb-3">
        {t('demo_accounts')}
      </p>
      <div className="space-y-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = ICONS[account.id];
          return (
            <button
              key={account.id}
              type="button"
              onClick={() => onSelect?.(account)}
              className="w-full text-left p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-brand-yellow)] hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-[var(--color-navy)] text-[var(--color-brand-yellow)] flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--color-foreground)]">
                    {t(`demo_${account.id}_label`)}
                  </p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5 truncate">
                    {account.email} · {t('password')}: <span className="font-mono text-[var(--color-foreground)]">{account.password}</span>
                  </p>
                  <p className="text-[11px] text-[var(--color-muted)] mt-1">{t(`demo_${account.id}_hint`)}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-[var(--color-muted)] mt-3">{t('demo_click_hint')}</p>
    </div>
  );
}
