'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/services/mockData';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Check, ChevronRight, Upload } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function PostAdWizard() {
    const router = useRouter();
    const t = useTranslations('PostAd');
    const [step, setStep] = useState(1);
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
    const handleSubmit = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(t('success'));
        router.push('/');
    };

    const steps = [t('category'), t('details'), t('preview')];

    return (
        <div className="space-y-6">
            {/* Steps Indicator */}
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
                                    onClick={() => {
                                        setFormData({ ...formData, category: category.id });
                                        handleNext();
                                    }}
                                    className="p-4 border border-[var(--color-border)] rounded-lg text-left hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all flex justify-between items-center group"
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
                                className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent h-32 transition-colors"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder={t('description_placeholder')}
                            ></textarea>
                        </div>

                        {/* Image Upload Area */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">{t('photos')}</label>
                            <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                                <Upload size={32} className="mx-auto text-[var(--color-muted)] mb-2" />
                                <p className="text-sm text-[var(--color-muted)]">{t('drag_drop')}</p>
                                <p className="text-xs text-[var(--color-muted)]/70 mt-1">{t('max_photos')}</p>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>{t('back')}</Button>
                            <Button onClick={handleNext}>{t('next')}</Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-4 text-[var(--color-foreground)]">{t('preview_title')}</h2>
                        <div className="bg-[var(--color-surface-elevated)] p-6 rounded-lg space-y-3 text-sm border border-[var(--color-border)]">
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
                                    <p className="text-[var(--color-foreground)]">{formData.city || '-'}</p>
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
                        <p className="text-xs text-[var(--color-muted)]">
                            {t('terms_agree')}
                        </p>
                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>{t('back')}</Button>
                            <Button onClick={handleSubmit} className="px-8 font-bold">{t('publish')}</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
