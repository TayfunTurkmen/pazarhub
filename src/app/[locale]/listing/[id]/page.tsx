import { getListingById } from '@/services/serverData';
import { notFound } from 'next/navigation';
import ListingDetailClient from '@/components/listing/ListingDetailClient';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export default async function ListingDetailPage({
    params
}: {
    params: Promise<{ id: string, locale: string }>
}) {
    const { id } = await params;
    const listing = await getListingById(id);
    const messages = await getMessages();

    if (!listing) {
        notFound();
    }

    return (
        <NextIntlClientProvider messages={messages}>
            <ListingDetailClient listing={listing} />
        </NextIntlClientProvider>
    );
}
