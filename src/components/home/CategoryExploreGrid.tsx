import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import {
  Building2, Car, Briefcase, Wrench, TreePalm,
  PawPrint, Home, Laptop, Package, RefreshCcw, Smartphone,
} from 'lucide-react';

const exploreItems = [
  { name: 'Konut', slug: 'konut', icon: Home, color: 'bg-blue-500' },
  { name: 'İş Yeri', slug: 'isyeri', icon: Building2, color: 'bg-violet-500' },
  { name: 'Otomobil', slug: 'otomobil', icon: Car, color: 'bg-red-500' },
  { name: 'İkinci El', slug: 'ikinci-el', icon: RefreshCcw, color: 'bg-amber-500' },
  { name: 'Sıfır Ürün', slug: 'sifir', icon: Package, color: 'bg-emerald-500' },
  { name: 'Telefon', slug: 'telefon', icon: Smartphone, color: 'bg-cyan-500' },
  { name: 'Bilgisayar', slug: 'bilgisayar', icon: Laptop, color: 'bg-sky-500' },
  { name: 'Turizm', slug: 'turizm', icon: TreePalm, color: 'bg-teal-500' },
  { name: 'Hizmetler', slug: 'yardimci-hizmetler', icon: Wrench, color: 'bg-orange-500' },
  { name: 'İş İlanları', slug: 'is-ilanlari', icon: Briefcase, color: 'bg-indigo-500' },
  { name: 'Sahiplendirme', slug: 'sahiplendirme', icon: PawPrint, color: 'bg-pink-500' },
];

export default async function CategoryExploreGrid() {
  const t = await getTranslations('Home');

  return (
    <section>
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-1">{t('explore_kicker')}</p>
        <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">{t('explore_categories')}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {exploreItems.map((item) => (
          <Link
            key={item.slug}
            href={`/category/${item.slug}`}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
              <item.icon size={22} />
            </div>
            <span className="text-xs font-semibold text-[var(--color-foreground)] text-center">{item.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
