'use client';

import { Link } from '@/i18n/navigation';
import { LISTINGS } from '@/services/mockData';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Edit, Trash2, MessageSquare, Eye, PlusCircle, Settings, Heart, BarChart3, User, Shield, Bell, Lock, Save, Star, Clock, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useState } from 'react';

type Tab = 'listings' | 'messages' | 'favorites' | 'settings';

export default function DashboardPage() {
    const t = useTranslations('Common');
    const tDash = useTranslations('Dashboard');
    const { user } = useAuth();
    const myListings = LISTINGS.filter(l => l.seller.id === 'u1');
    const [activeTab, setActiveTab] = useState<Tab>('listings');
    const [settingsSaved, setSettingsSaved] = useState(false);

    const stats = [
        { label: tDash('active_count'), value: myListings.length, icon: BarChart3, color: 'text-blue-500' },
        { label: tDash('views'), value: 1247, icon: Eye, color: 'text-emerald-500' },
        { label: tDash('favorites_count'), value: 34, icon: Heart, color: 'text-rose-500' },
        { label: tDash('messages_count'), value: 8, icon: MessageSquare, color: 'text-violet-500' },
    ];

    const mockMessages = [
        { id: 1, name: 'Mehmet K.', message: tDash('sample_msg_1'), time: tDash('time_10min'), listing: 'Kadıköy 3+1 Daire', unread: true },
        { id: 2, name: 'Ayşe B.', message: tDash('sample_msg_2'), time: tDash('time_1hr'), listing: 'BMW 320i 2022', unread: true },
        { id: 3, name: 'Ali R.', message: 'Ürün hala satılık mı?', time: '3 saat önce', listing: 'Samsung Galaxy S24', unread: false },
        { id: 4, name: 'Fatma D.', message: 'Fiyatta pazarlık payı var mı?', time: '1 gün önce', listing: 'Volkswagen Golf', unread: false },
        { id: 5, name: 'Emre S.', message: 'İlan açıklamasını inceledim, birkaç sorum olacak.', time: '2 gün önce', listing: 'Kadıköy Daire', unread: false },
    ];

    const mockFavorites = LISTINGS.slice(0, 6);

    const handleSaveSettings = () => {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2000);
    };

    const tabs: { key: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
        { key: 'listings', label: t('my_listings'), icon: BarChart3 },
        { key: 'messages', label: t('messages'), icon: MessageSquare, badge: 2 },
        { key: 'favorites', label: t('favorites'), icon: Heart },
        { key: 'settings', label: t('settings'), icon: Settings },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-5">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <User size={24} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('my_account')}</h1>
                        <p className="text-sm text-[var(--color-muted)] mt-0.5">
                            {user?.name || 'Kullanıcı'} — {user?.type === 'corporate' ? t('corporate_account') : t('individual_account')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {user?.role === 'admin' && (
                        <Link href="/admin">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Shield size={16} />
                                {tDash('admin_panel')}
                            </Button>
                        </Link>
                    )}
                    <Link href="/post-ad">
                        <Button className="flex items-center gap-2">
                            <PlusCircle size={18} />
                            {t('post_ad')}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-5 text-center hover:shadow-lg hover:border-[var(--color-primary)]/20 group">
                        <stat.icon size={24} className={`mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform`} />
                        <p className="text-2xl font-bold text-[var(--color-foreground)]">{stat.value.toLocaleString()}</p>
                        <p className="text-xs text-[var(--color-muted)] mt-1">{stat.label}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <Card className="p-0 overflow-hidden md:col-span-1 h-fit">
                    <nav className="flex flex-col">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-3 text-left flex items-center gap-2 transition-colors ${activeTab === tab.key
                                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium border-l-4 border-[var(--color-primary)]'
                                    : 'hover:bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] border-l-4 border-transparent'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                {tab.badge && (
                                    <span className="ml-auto bg-rose-500 text-white text-xs px-1.5 rounded-full">{tab.badge}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </Card>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    {/* ═══ MY LISTINGS TAB ═══ */}
                    {activeTab === 'listings' && (
                        <Card className="p-6">
                            <h2 className="text-lg font-bold mb-4 text-[var(--color-foreground)]">{t('active_listings')}</h2>
                            {myListings.length > 0 ? (
                                <div className="space-y-4">
                                    {myListings.map(listing => (
                                        <div key={listing.id} className="flex gap-4 border border-[var(--color-border)] p-3 rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors">
                                            <div className="w-24 h-24 bg-[var(--color-surface-elevated)] rounded-xl flex-shrink-0 overflow-hidden relative">
                                                <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="96px" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-bold text-[var(--color-primary)] mb-1 truncate">{listing.title}</h3>
                                                <p className="text-sm text-[var(--color-muted)] mb-2">{listing.price.toLocaleString('tr-TR')} {listing.currency}</p>
                                                <div className="flex gap-2 text-xs">
                                                    <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-medium">{t('active')}</span>
                                                    <span className="text-[var(--color-muted)] flex items-center gap-1">
                                                        <Eye size={12} /> {Math.floor(Math.random() * 500) + 50}
                                                    </span>
                                                    <span className="text-[var(--color-muted)] flex items-center gap-1">
                                                        <Heart size={12} /> {Math.floor(Math.random() * 30) + 2}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 justify-center flex-shrink-0">
                                                <Button size="sm" variant="outline" className="text-xs"><Edit size={14} /> {t('edit')}</Button>
                                                <Button size="sm" variant="ghost" className="text-rose-500 hover:text-rose-700"><Trash2 size={14} /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-[var(--color-muted)]">
                                    {t('no_listings')}
                                    <div className="mt-4">
                                        <Link href="/post-ad" className="btn btn-primary">{t('post_ad_now')}</Link>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* ═══ MESSAGES TAB ═══ */}
                    {activeTab === 'messages' && (
                        <Card className="p-6">
                            <h2 className="text-lg font-bold mb-4 text-[var(--color-foreground)]">{t('messages')}</h2>
                            <div className="space-y-2">
                                {mockMessages.map((msg) => (
                                    <div key={msg.id} className={`flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl cursor-pointer transition-all hover:shadow-md ${msg.unread ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20' : 'hover:bg-[var(--color-surface-elevated)]'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.unread ? 'bg-[var(--color-primary)]/15' : 'bg-[var(--color-surface-elevated)]'}`}>
                                            <MessageSquare size={16} className={msg.unread ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className={`text-sm ${msg.unread ? 'font-bold text-[var(--color-foreground)]' : 'font-medium text-[var(--color-foreground)]'}`}>{msg.name}</p>
                                                {msg.unread && <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full" />}
                                            </div>
                                            <p className="text-xs text-[var(--color-muted)] truncate">{msg.message}</p>
                                            <p className="text-[10px] text-[var(--color-muted)]/60 mt-0.5 flex items-center gap-1">
                                                <ArrowRight size={8} /> {msg.listing}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="text-xs text-[var(--color-muted)]">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* ═══ FAVORITES TAB ═══ */}
                    {activeTab === 'favorites' && (
                        <Card className="p-6">
                            <h2 className="text-lg font-bold mb-4 text-[var(--color-foreground)]">{t('favorites')}</h2>
                            {mockFavorites.length > 0 ? (
                                <div className="space-y-3">
                                    {mockFavorites.map(listing => (
                                        <div key={listing.id} className="flex gap-4 border border-[var(--color-border)] p-3 rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors">
                                            <div className="w-20 h-20 bg-[var(--color-surface-elevated)] rounded-xl flex-shrink-0 overflow-hidden relative">
                                                <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="80px" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-bold text-[var(--color-foreground)] text-sm truncate">{listing.title}</h3>
                                                <p className="text-sm font-semibold text-[var(--color-primary)] mt-0.5">{listing.price.toLocaleString('tr-TR')} {listing.currency}</p>
                                                <p className="text-xs text-[var(--color-muted)] mt-1">{listing.location.city}, {listing.location.district}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 justify-center flex-shrink-0">
                                                <Link href={`/listing/${listing.id}`}>
                                                    <Button size="sm" variant="outline" className="text-xs"><Eye size={14} /> Görüntüle</Button>
                                                </Link>
                                                <Button size="sm" variant="ghost" className="text-rose-500 hover:text-rose-700 text-xs">
                                                    <Heart size={14} fill="currentColor" /> Kaldır
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-[var(--color-muted)]">
                                    <Heart size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Henüz favori ilanınız yok.</p>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* ═══ SETTINGS TAB ═══ */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            {/* Profile Settings */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <User size={18} className="text-[var(--color-primary)]" />
                                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">Profil Bilgileri</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Ad Soyad" defaultValue={user?.name || 'Demo Kullanıcı'} />
                                    <Input label="E-posta" defaultValue={user?.email || 'demo@example.com'} type="email" />
                                    <Input label="Telefon" defaultValue="+90 (555) 123 45 67" type="tel" />
                                    <Input label="Şehir" defaultValue="İstanbul" />
                                </div>
                            </Card>

                            {/* Notification Settings */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <Bell size={18} className="text-[var(--color-primary)]" />
                                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">Bildirim Ayarları</h2>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'E-posta bildirimleri', desc: 'Yeni mesaj ve ilan güncellemelerini e-posta ile al', default: true },
                                        { label: 'SMS bildirimleri', desc: 'Önemli ilan değişiklikleri için SMS al', default: false },
                                        { label: 'Favori ilan değişiklikleri', desc: 'Favori ilanlarındaki fiyat değişikliklerini bildir', default: true },
                                        { label: 'Pazarlama e-postaları', desc: 'Kampanya ve fırsat bildirimleri', default: false },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-foreground)]">{item.label}</p>
                                                <p className="text-xs text-[var(--color-muted)]">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/20 rounded-full peer peer-checked:bg-[var(--color-primary)] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Password Change */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <Lock size={18} className="text-[var(--color-primary)]" />
                                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">Şifre Değiştir</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input label="Mevcut Şifre" type="password" placeholder="••••••••" />
                                    <Input label="Yeni Şifre" type="password" placeholder="••••••••" />
                                    <Input label="Yeni Şifre (Tekrar)" type="password" placeholder="••••••••" />
                                </div>
                            </Card>

                            {/* Save Button */}
                            <div className="flex justify-end gap-3">
                                {settingsSaved && (
                                    <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium animate-pulse">
                                        <Star size={14} /> Ayarlar kaydedildi!
                                    </span>
                                )}
                                <Button onClick={handleSaveSettings} className="flex items-center gap-2 px-8">
                                    <Save size={16} />
                                    Kaydet
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
