'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[locale-error]', error);
  }, [error]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Sayfa yüklenemedi</h2>
        <p className="text-sm text-[var(--color-muted)]">Geçici bir sorun oluşmuş olabilir.</p>
        <div className="flex gap-2 justify-center">
          <button type="button" onClick={reset} className="btn btn-primary px-4 py-2 text-sm font-semibold">
            Yenile
          </button>
          <Link href="/" className="btn px-4 py-2 text-sm border border-[var(--color-border)] rounded-xl">
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
