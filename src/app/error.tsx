'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app-error]', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Bir hata oluştu</h1>
        <p className="text-[var(--color-muted)]">
          Beklenmeyen bir sorun yaşandı. Lütfen tekrar deneyin veya ana sayfaya dönün.
        </p>
        <div className="flex gap-3 justify-center">
          <button type="button" onClick={reset} className="btn btn-primary px-6 py-2.5 font-semibold">
            Tekrar Dene
          </button>
          <Link href="/" className="btn px-6 py-2.5 font-semibold border border-[var(--color-border)] rounded-xl">
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
