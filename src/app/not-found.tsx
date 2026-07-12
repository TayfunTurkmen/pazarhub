import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative mb-6">
        <span className="text-[8rem] font-black text-[var(--color-border)] leading-none select-none">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-blue-700 flex items-center justify-center shadow-xl">
            <Home size={36} className="text-white" />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Sayfa Bulunamadı</h2>
      <p className="text-[var(--color-muted)] max-w-md mb-8">
        Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
      </p>
      <Link href="/" className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 font-bold">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
