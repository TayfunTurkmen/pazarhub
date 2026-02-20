import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <h2 className="text-6xl font-bold text-[var(--color-primary)] mb-4">404</h2>
            <p className="text-2xl font-semibold mb-6">Sayfa Bulunamadı</p>
            <p className="text-[var(--color-muted)] max-w-md mb-8">
                Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
                Ana Sayfaya Dön
            </Link>
        </div>
    );
}
