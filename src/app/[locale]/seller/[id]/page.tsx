import { notFound } from 'next/navigation';
import ListingCard from '@/components/listing/ListingCard';
import Card from '@/components/ui/Card';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageBanner from '@/components/layout/PageBanner';
import EmptyState from '@/components/ui/EmptyState';
import { getUserById, getListingsByUserId } from '@/services/serverData';
import { MapPin, Phone, ShieldCheck, Star, Calendar, Store } from 'lucide-react';

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  const listings = await getListingsByUserId(id);

  return (
    <div className="space-y-6">
      <PageBanner
        icon={Store}
        title={user.storeName || user.name}
        subtitle={user.type === 'corporate' ? 'Kurumsal Üye' : 'Bireysel Üye'}
        badge={user.verified ? 'Doğrulanmış' : undefined}
      />

      <Breadcrumb items={[
        { label: 'Ana Sayfa', href: '/' },
        { label: user.storeName || user.name },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center text-[var(--color-primary)] font-bold text-2xl mx-auto mb-3">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-lg font-bold text-[var(--color-foreground)]">
                {user.storeName || user.name}
              </h2>
              <p className="text-sm text-[var(--color-muted)] capitalize">
                {user.type === 'corporate' ? 'Kurumsal Üye' : 'Bireysel Üye'}
              </p>
            </div>

            {user.type === 'corporate' && (
              <div className="flex items-center justify-center gap-1 text-xs text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full w-fit mx-auto mb-4">
                <ShieldCheck size={14} />
                Yetkili Emlak Ofisi
              </div>
            )}

            {user.verified && (
              <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit mx-auto mb-4">
                <Star size={14} />
                Doğrulanmış Üye
              </div>
            )}

            <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
                  <Phone size={16} className="text-[var(--color-muted)]" />
                  {user.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
                <Calendar size={16} className="text-[var(--color-muted)]" />
                Üyelik: {user.joinedAt ? new Date(user.joinedAt).getFullYear() : '2024'}
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
                <MapPin size={16} className="text-[var(--color-muted)]" />
                Türkiye
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-center">
              <p className="text-2xl font-bold text-[var(--color-primary)]">{listings.length}</p>
              <p className="text-xs text-[var(--color-muted)]">Aktif İlan</p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-border)]">
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">İlanları</h2>
            <span className="text-sm text-[var(--color-muted)] bg-[var(--color-background)] px-3 py-1 rounded-full font-medium border border-[var(--color-border)]">
              {listings.length} ilan
            </span>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showVerified />
              ))}
            </div>
          ) : (
            <EmptyState icon={Store} title="Henüz ilan yok" />
          )}
        </div>
      </div>
    </div>
  );
}
