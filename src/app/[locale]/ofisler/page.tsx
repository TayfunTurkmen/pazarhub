import ListingCard from '@/components/listing/ListingCard';
import Card from '@/components/ui/Card';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageBanner from '@/components/layout/PageBanner';
import EmptyState from '@/components/ui/EmptyState';
import { getAllUsers, getListingsByUserId } from '@/services/serverData';
import { Building2, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default async function OfficesPage() {
  const users = await getAllUsers();
  const offices = users.filter((u) => u.type === 'corporate' && u.status !== 'banned');

  const officesWithListings = await Promise.all(
    offices.map(async (office) => {
      const listings = (await getListingsByUserId(office.id)).filter((l) => l.status === 'active');
      return { office, listings };
    }),
  );

  const visible = officesWithListings.filter(({ listings }) => listings.length > 0);

  return (
    <div className="space-y-6">
      <PageBanner
        icon={Building2}
        title="Emlak Ofisleri"
        subtitle="Kurumsal emlak ofislerinin aktif ilanlarını inceleyin"
        badge={`${visible.length} ofis`}
      />

      <Breadcrumb items={[
        { label: 'Ana Sayfa', href: '/' },
        { label: 'Emlak Ofisleri' },
      ]} />

      {visible.length === 0 ? (
        <EmptyState icon={Building2} title="Henüz emlak ofisi ilanı yok" />
      ) : (
        <div className="space-y-10">
          {visible.map(({ office, listings }) => {
            const name = office.storeName || office.name;
            return (
              <section key={office.id} className="space-y-4">
                <Card className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-xl shrink-0">
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/seller/${office.id}`} className="text-lg font-bold text-[var(--color-foreground)] hover:text-[var(--color-primary)] truncate">
                        {name}
                      </Link>
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={12} /> Emlak Ofisi
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-muted)] flex items-center gap-1 mt-1">
                      <MapPin size={14} /> Türkiye · {listings.length} aktif ilan
                    </p>
                  </div>
                  <Link href={`/seller/${office.id}`} className="btn btn-secondary text-sm shrink-0">
                    Ofis sayfası
                  </Link>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {listings.slice(0, 4).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} showVerified />
                  ))}
                </div>
                {listings.length > 4 && (
                  <div className="text-center">
                    <Link href={`/seller/${office.id}`} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
                      Tüm {listings.length} ilanı gör →
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
