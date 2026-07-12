'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/types';
import { MapPin, Phone, MessageSquare, Calendar, ShieldCheck, ChevronLeft, ChevronRight, Heart, Share2, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SecurityNote from '@/components/ui/SecurityNote';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function ListingDetailClient({ listing }: { listing: Listing }) {
    const t = useTranslations('Listing');
    const tCommon = useTranslations('Common');
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [currentImage, setCurrentImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [messageBody, setMessageBody] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetch(`/api/favorites/${listing.id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.success) setIsFavorite(json.data.isFavorite);
            })
            .catch(() => undefined);
    }, [isAuthenticated, listing.id]);

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % listing.images.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + listing.images.length) % listing.images.length);

    const toggleFavorite = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        const method = isFavorite ? 'DELETE' : 'POST';
        const url = isFavorite ? `/api/favorites/${listing.id}` : '/api/favorites';
        const res = await fetch(url, {
            method,
            headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
            body: method === 'POST' ? JSON.stringify({ listingId: listing.id }) : undefined,
        });
        const json = await res.json();
        if (json.success) setIsFavorite(!isFavorite);
    };

    const sendMessage = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (!messageBody.trim()) return;
        setSending(true);
        try {
            const res = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId: listing.id, body: messageBody.trim() }),
            });
            const json = await res.json();
            if (json.success) {
                setMessageBody('');
                router.push('/dashboard?tab=messages');
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <Breadcrumb items={[
                { label: tCommon('back'), href: '/' },
                { label: listing.category.name, href: `/category/${listing.category.slug}` },
                { label: listing.title },
            ]} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="border-b border-[var(--color-border)] pb-4">
                        <div className="flex items-start justify-between">
                            <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{listing.title}</h1>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                <button
                                    onClick={toggleFavorite}
                                    className={`p-2.5 rounded-xl border transition-colors ${isFavorite ? 'border-rose-300 text-rose-500 bg-rose-500/10' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-rose-500 hover:border-rose-200'}`}
                                >
                                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                                </button>
                                <button className="p-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/20 transition-colors">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center text-sm text-[var(--color-muted)] mt-2 gap-4">
                            <span className="flex items-center gap-1"><MapPin size={16} /> {listing.location.city} / {listing.location.district}</span>
                            <span className="flex items-center gap-1"><Calendar size={16} /> {t('ad_date')}: {new Date(listing.createdAt).toLocaleDateString('tr-TR')}</span>
                            <span className="text-[var(--color-primary)] font-medium">{t('ad_no')}: {listing.id}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="aspect-video bg-[var(--color-surface-elevated)] rounded-2xl overflow-hidden border border-[var(--color-border)] relative group">
                            <Image src={listing.images[currentImage]} alt={listing.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
                            {listing.images.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <Card className="p-6">
                        <h2 className="text-lg font-bold mb-4 border-b border-[var(--color-border)] pb-3 text-[var(--color-foreground)]">{t('description')}</h2>
                        <div className="text-[var(--color-foreground)] whitespace-pre-line leading-relaxed">{listing.description}</div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 sticky top-24">
                        <div className="text-3xl font-bold text-[var(--color-primary)] mb-1">
                            {listing.price.toLocaleString('tr-TR')} {listing.currency}
                        </div>
                        <div className="text-sm text-[var(--color-muted)] mb-6 flex items-center gap-1">
                            <MapPin size={14} />
                            {listing.location.city} / {listing.location.district}
                        </div>

                        <div className="space-y-3 mb-6">
                            <Button className="w-full justify-center gap-2" size="lg">
                                <Phone size={20} />
                                {listing.seller.phone || t('show_phone')}
                            </Button>
                        </div>

                        <SecurityNote
                            title="Güvenli Mesajlaşma"
                            description="Kişisel bilgilerinizi paylaşmadan önce satıcıyı doğrulayın."
                        />

                        <div className="space-y-2 mb-6">
                            <textarea
                                value={messageBody}
                                onChange={(e) => setMessageBody(e.target.value)}
                                placeholder={t('message_placeholder')}
                                className="w-full h-24 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                            <Button variant="secondary" className="w-full justify-center gap-2" size="lg" onClick={sendMessage} disabled={sending}>
                                <MessageSquare size={20} />
                                {sending ? t('sending') : t('send_message')}
                            </Button>
                        </div>

                        <div className="border-t border-[var(--color-border)] pt-4">
                            <h3 className="font-bold mb-3 text-[var(--color-foreground)]">{t('seller')}</h3>
                            <Link href={`/seller/${listing.seller.id}`} className="flex items-center gap-3 mb-3 group">
                                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] font-bold text-lg">
                                    {listing.seller.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">{listing.seller.storeName || listing.seller.name}</p>
                                    <p className="text-xs text-[var(--color-muted)] capitalize">{listing.seller.type === 'corporate' ? t('corporate_member') : t('individual_member')}</p>
                                </div>
                            </Link>
                            {listing.seller.verified && (
                                <div className="text-xs text-emerald-600 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit mt-2">
                                    <ShieldCheck size={14} />
                                    Doğrulanmış Satıcı
                                </div>
                            )}
                            {listing.seller.type === 'corporate' && (
                                <div className="text-xs text-[var(--color-primary)] flex items-center gap-1 bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full w-fit">
                                    <ShieldCheck size={14} />
                                    {t('authorized_office')}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
