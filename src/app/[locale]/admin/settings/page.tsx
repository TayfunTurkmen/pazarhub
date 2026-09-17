'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Save, CheckCircle, Globe, Bell, Shield, Database, Palette, KeyRound } from 'lucide-react';

interface AuthSettingsState {
    smsVerificationEnabled: boolean;
    googleAuthEnabled: boolean;
    facebookAuthEnabled: boolean;
}

export default function AdminSettingsPage() {
    const [saved, setSaved] = useState(false);
    const [authSettings, setAuthSettings] = useState<AuthSettingsState>({
        smsVerificationEnabled: false,
        googleAuthEnabled: true,
        facebookAuthEnabled: true,
    });
    const [settings, setSettings] = useState({
        siteName: 'sendekonutal.com',
        siteDesc: 'Türkiye\'nin yeni nesil emlak platformu',
        contactEmail: 'info@sendekonutal.com',
        contactPhone: '+90 (212) 555 00 00',
        maxListingsPerUser: '50',
        maxPhotosPerListing: '20',
        autoApprove: true,
        maintenanceMode: false,
        emailNotifications: true,
        smsNotifications: false,
        listingDuration: '30',
        dopingPrice: '99',
        premiumPrice: '199',
        showcasePrice: '499',
    });

    useEffect(() => {
        fetch('/api/admin/auth-settings')
            .then((r) => r.json())
            .then((data: { data?: AuthSettingsState }) => {
                if (data.data) setAuthSettings(data.data);
            })
            .catch(() => undefined);
    }, []);

    const handleSave = async () => {
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        try {
            await fetch('/api/admin/auth-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authSettings),
            });
        } catch {
            // local settings still saved
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const updateAuthSetting = (key: keyof AuthSettingsState, value: boolean) => {
        setAuthSettings((prev) => ({ ...prev, [key]: value }));
    };

    const updateSetting = (key: string, value: string | boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Site Ayarları</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">Genel site yapılandırması ve tercihler</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium animate-pulse">
                            <CheckCircle size={14} /> Kaydedildi!
                        </span>
                    )}
                    <Button onClick={handleSave} className="flex items-center gap-2">
                        <Save size={18} />
                        Kaydet
                    </Button>
                </div>
            </div>

            {/* General Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Globe size={18} className="text-[var(--color-primary)]" />
                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">Genel Ayarlar</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Site Adı" value={settings.siteName} onChange={e => updateSetting('siteName', e.target.value)} />
                    <Input label="Site Açıklaması" value={settings.siteDesc} onChange={e => updateSetting('siteDesc', e.target.value)} />
                    <Input label="İletişim E-postası" value={settings.contactEmail} onChange={e => updateSetting('contactEmail', e.target.value)} type="email" />
                    <Input label="İletişim Telefonu" value={settings.contactPhone} onChange={e => updateSetting('contactPhone', e.target.value)} type="tel" />
                </div>
            </Card>

            {/* Listing Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Database size={18} className="text-[var(--color-primary)]" />
                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">İlan Ayarları</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <Input label="Kullanıcı Başına Maks. İlan" type="number" value={settings.maxListingsPerUser} onChange={e => updateSetting('maxListingsPerUser', e.target.value)} />
                    <Input label="İlan Başına Maks. Fotoğraf" type="number" value={settings.maxPhotosPerListing} onChange={e => updateSetting('maxPhotosPerListing', e.target.value)} />
                    <Input label="İlan Süresi (gün)" type="number" value={settings.listingDuration} onChange={e => updateSetting('listingDuration', e.target.value)} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)]">
                    <div>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">Otomatik İlan Onayı</p>
                        <p className="text-xs text-[var(--color-muted)]">Yeni ilanlar otomatik olarak yayınlansın</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.autoApprove} onChange={e => updateSetting('autoApprove', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/20 rounded-full peer peer-checked:bg-[var(--color-primary)] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Palette size={18} className="text-[var(--color-primary)]" />
                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">Doping Fiyatlandırma (TL)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border-2 border-blue-500/20 bg-blue-500/5">
                        <p className="text-xs font-bold text-blue-600 mb-2">DOPING</p>
                        <Input type="number" value={settings.dopingPrice} onChange={e => updateSetting('dopingPrice', e.target.value)} />
                    </div>
                    <div className="p-4 rounded-xl border-2 border-violet-500/20 bg-violet-500/5">
                        <p className="text-xs font-bold text-violet-600 mb-2">PREMIUM</p>
                        <Input type="number" value={settings.premiumPrice} onChange={e => updateSetting('premiumPrice', e.target.value)} />
                    </div>
                    <div className="p-4 rounded-xl border-2 border-amber-500/20 bg-amber-500/5">
                        <p className="text-xs font-bold text-amber-600 mb-2">VİTRİN</p>
                        <Input type="number" value={settings.showcasePrice} onChange={e => updateSetting('showcasePrice', e.target.value)} />
                    </div>
                </div>
            </Card>

            {/* Auth Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                    <KeyRound size={18} className="text-[var(--color-primary)]" />
                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">Giriş & Kayıt Ayarları</h2>
                </div>
                <div className="space-y-3">
                    {[
                        {
                            key: 'smsVerificationEnabled' as const,
                            label: 'SMS Doğrulama',
                            desc: 'Açıkken girişte SMS kodu istenir. Kapalıyken telefon ile anında giriş yapılır.',
                        },
                        {
                            key: 'googleAuthEnabled' as const,
                            label: 'Google ile Giriş',
                            desc: 'Google OAuth butonunu giriş/kayıt sayfalarında göster',
                        },
                        {
                            key: 'facebookAuthEnabled' as const,
                            label: 'Facebook ile Giriş',
                            desc: 'Facebook OAuth butonunu giriş/kayıt sayfalarında göster',
                        },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)]">
                            <div>
                                <p className="text-sm font-medium text-[var(--color-foreground)]">{item.label}</p>
                                <p className="text-xs text-[var(--color-muted)]">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={authSettings[item.key]}
                                    onChange={(e) => updateAuthSetting(item.key, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/20 rounded-full peer peer-checked:bg-[var(--color-primary)] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                            </label>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-[var(--color-muted)]">
                    Admin girişi: 05001234567 + SMS kodu 1337 (SMS doğrulama açık olsa bile geçerlidir).
                </p>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Bell size={18} className="text-[var(--color-primary)]" />
                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">Bildirimler</h2>
                </div>
                <div className="space-y-3">
                    {[
                        { key: 'emailNotifications', label: 'E-posta Bildirimleri', desc: 'Yeni ilanlar, kullanıcılar ve sistem uyarıları' },
                        { key: 'smsNotifications', label: 'SMS Bildirimleri', desc: 'Acil güvenlik uyarıları SMS ile gönderilsin' },
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)]">
                            <div>
                                <p className="text-sm font-medium text-[var(--color-foreground)]">{item.label}</p>
                                <p className="text-xs text-[var(--color-muted)]">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={(settings as Record<string, string | boolean>)[item.key] as boolean} onChange={e => updateSetting(item.key, e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/20 rounded-full peer peer-checked:bg-[var(--color-primary)] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                            </label>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Maintenance */}
            <Card className="p-6 border-rose-500/20">
                <div className="flex items-center gap-2 mb-5">
                    <Shield size={18} className="text-rose-500" />
                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">Tehlikeli Bölge</h2>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
                    <div>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">Bakım Modu</p>
                        <p className="text-xs text-[var(--color-muted)]">Site ziyaretçilere kapatılır, sadece adminler erişebilir</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.maintenanceMode} onChange={e => updateSetting('maintenanceMode', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:ring-2 peer-focus:ring-rose-500/20 rounded-full peer peer-checked:bg-rose-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                </div>
            </Card>
        </div>
    );
}
