import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import {
  Building2, Car, ShoppingBag, Briefcase, Wrench, TreePalm,
  PawPrint, MapPin, Home, Laptop,
} from 'lucide-react';

const exploreItems = [
  { name: 'Konut', slug: 'konut', icon: Home, color: 'bg-blue-500' },
  { name: 'Arsa', slug: 'arsa', icon: MapPin, color: 'bg-emerald-500' },
  { name: 'İş Yeri', slug: 'isyeri', icon: Building2, color: 'bg-violet-500' },
  { name: 'Otomobil', slug: 'otomobil', icon: Car, color: 'bg-red-500' },
  { name: 'Alışveriş', slug: 'alisveris', icon: ShoppingBag, color: 'bg-amber-500' },
  { name: 'Bilgisayar', slug: 'bilgisayar', icon: Laptop, color: 'bg-cyan-500' },
  { name: 'İş İlanları', slug: 'is-ilanlari', icon: Briefcase, color: 'bg-indigo-500' },
  { name: 'Hizmetler', slug: 'yardimci-hizmetler', icon: Wrench, color: 'bg-orange-500' },
  { name: 'Turizm', slug: 'turizm', icon: TreePalm, color: 'bg-teal-500' },
  { name: 'Sahiplendirme', slug: 'sahiplendirme', icon: PawPrint, color: 'bg-pink-500' },
];

export default async function CategoryExploreGrid() {
  const t = await getTranslations('Home');

  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-4">
        {t('explore_categories')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
