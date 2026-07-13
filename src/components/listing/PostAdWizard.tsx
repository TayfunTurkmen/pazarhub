'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/services/mockData';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Check, ChevronRight, Upload } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import AiImageOptimizer from '@/components/ai/AiImageOptimizer';
import { Listing } from '@/types';

export default function PostAdWizard() {
    const router = useRouter();
    const t = useTranslations('PostAd');
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        price: '',
        description: '',
        city: '',
        district: '',
        roomCount: '',
        netArea: '',
        floor: '',
        heating: '',
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleImageUpload = async (files: FileList | null) => {
        if (!files?.length) return;
        setUploading(true);
        try {
            const uploaded: string[] = [];
            for (const file of Array.from(files).slice(0, 10)) {
                const form = new FormData();
                form.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: form });
                const json = await res.json() as { success: boolean; data?: { url: string } };
                if (json.success && json.data?.url) uploaded.push(json.data.url);
            }
            setImages((prev) => [...prev, ...uploaded].slice(0, 20));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    price: Number(formData.price),
                    categoryId: formData.category,
                    city: formData.city,
                    district: formData.district,
                    roomCount: formData.roomCount || undefined,
                    netArea: formData.netArea ? Number(formData.netArea) : undefined,
                    floor: formData.floor ? Number(formData.floor) : undefined,
                    heating: formData.heating || undefined,
                    images,
                }),
            });
            const json = await res.json() as { success: boolean; data?: Listing; error?: string };
            if (!json.success || !json.data) {
                throw new Error(json.error || 'Publish failed');
            }
            router.push(`/listing/${json.data.id}`);
        } catch {
            alert(t('error'));
        } finally {
            setSubmitting(false);
        }
    };

    const steps = [t('category'), t('details'), t('preview')];

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-8">
                {steps.map((label, i) => {
                    const s = i + 1;
                    const isActive = s <= step;
                    const isCompleted = s < step;
                    return (
                        <div key={s} className="flex-1 flex items-center">
                            <div className="flex flex-col items-center w-full">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isActive ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'bg-[var(--color-border)] text-[var(--color-muted)]'}`}>
                                    {isCompleted ? <Check size={18} /> : s}
                                </div>
                                <span className={`text-xs font-medium mt-2 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'}`}>
                                    {label}
                                </span>
                            </div>
                            {s < steps.length && (
                                <div className={`flex-1 h-0.5 mx-2 -mt-4 transition-colors ${isActive ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            <Card className="p-6 min-h-[400px]">
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-4 text-[var(--color-foreground)]">{t('select_category')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {CATEGORIES.filter(c => !c.parentId).map(category => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, category: category.id });
                                        handleNext();
                                    }}
                                    className="p-4 border border-[var(--color-border)] rounded-xl text-left hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all flex justify-between items-center group"
                                >
                                    <span className="font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-primary)]">{category.name}</span>
                                    <ChevronRight size={16} className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-4 text-[var(--color-foreground)]">{t('listing_details')}</h2>

                        <Input
                            label={t('listing_title')}
                            placeholder={t('title_placeholder')}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label={t('price_label')}
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                            <Input
                                label={t('city')}
                                placeholder={t('city')}
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>

                        <Input
                            label={t('district')}
                            placeholder={t('district')}
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label={t('room_count')}
                                placeholder="3+1"
                                value={formData.roomCount}
                                onChange={(e) => setFormData({ ...formData, roomCount: e.target.value })}
                            />
                            <Input
                                label={t('net_area')}
                                type="number"
                                placeholder="120"
                                value={formData.netArea}
                                onChange={(e) => setFormData({ ...formData, netArea: e.target.value })}
                            />
                            <Input
                                label={t('floor')}
                                type="number"
                                value={formData.floor}
                                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">{t('description')}</label>
                            <textarea
                                className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] h-32 transition-colors"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder={t('description_placeholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">{t('photos')}</label>
                            <label className="border-2 border-dashed border-[var(--color-border)] rounded-2xl p-8 text-center hover:border-[var(--color-primary)] hover:bg-[var(--color-background)] transition-colors cursor-pointer block">
                                <Upload size={32} className="mx-auto text-[var(--color-muted)] mb-2" />
                                <p className="text-sm text-[var(--color-muted)]">{uploading ? t('uploading') : t('drag_drop')}</p>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                                    const files = e.target.files;
                                    if (files?.[0]) setPendingFile(files[0]);
                                    handleImageUpload(files);
                                }} />
                            </label>
                            {pendingFile && (
                                <AiImageOptimizer file={pendingFile} listingTitle={formData.title || undefined} />
                            )}
                            {images.length > 0 && (
                                <p className="text-xs text-[var(--color-muted)] mt-2">{images.length} {t('photos_selected')}</p>
                            )}
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>{t('back')}</Button>
                            <Button onClick={handleNext} disabled={!formData.title || !formData.price || !formData.city}>{t('next')}</Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-4 text-[var(--color-foreground)]">{t('preview_title')}</h2>
                        <div className="bg-[var(--color-background)] p-6 rounded-2xl space-y-3 text-sm border border-[var(--color-border)]">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-bold text-[var(--color-muted)] text-xs uppercase">{t('listing_title')}</span>
                                    <p className="font-medium text-[var(--color-foreground)]">{formData.title || '-'}</p>
                                </div>
                                <div>
                                    <span className="font-bold text-[var(--color-muted)] text-xs uppercase">{t('price_label')}</span>
                                    <p className="font-bold text-[var(--color-primary)] text-lg">{formData.price ? `${Number(formData.price).toLocaleString('tr-TR')} TL` : '-'}</p>
                                </div>
                                <div>
                                    <span className="font-bold text-[var(--color-muted)] text-xs uppercase">{t('city')}</span>
                                    <p className="text-[var(--color-foreground)]">{formData.city || '-'}{formData.district ? `, ${formData.district}` : ''}</p>
                                </div>
                                <div>
                                    <span className="font-bold text-[var(--color-muted)] text-xs uppercase">{t('room_count')}</span>
                                    <p className="text-[var(--color-foreground)]">{formData.roomCount || '-'}</p>
                                </div>
                            </div>
                            {formData.description && (
                                <div className="pt-3 border-t border-[var(--color-border)]">
                                    <span className="font-bold text-[var(--color-muted)] text-xs uppercase">{t('description')}</span>
                                    <p className="text-[var(--color-foreground)] mt-1">{formData.description}</p>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-[var(--color-muted)]">{t('terms_agree')}</p>
                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>{t('back')}</Button>
                            <Button onClick={handleSubmit} disabled={submitting} className="px-8 font-bold">
                                {submitting ? t('publishing') : t('publish')}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
