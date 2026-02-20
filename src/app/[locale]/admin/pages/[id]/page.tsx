'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { getPages, updatePage, CMSPage } from '@/services/cmsData';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Save, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

const fetchPage = async (id: string) => {
    const pages = await getPages();
    return pages.find(p => p.id === id);
};

export default function PageEditor({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const t = useTranslations('Admin');
    const tCommon = useTranslations('Common');
    const [page, setPage] = useState<CMSPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');

    useEffect(() => {
        params.then(async (resolvedParams) => {
            const p = await fetchPage(resolvedParams.id);
            if (p) {
                setPage(p);
                setContent(p.content);
            }
            setLoading(false);
        });
    }, [params]);

    const handleSave = async () => {
        if (!page) return;
        await updatePage(page.id, { content });
        alert(t('page_saved'));
    };

    if (loading) return <div className="flex items-center justify-center h-64 text-[var(--color-muted)]">{tCommon('loading')}</div>;
    if (!page) return <div className="flex items-center justify-center h-64 text-[var(--color-muted)]">{t('page_not_found')}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button onClick={() => router.back()} variant="outline" className="p-2.5">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('edit_page')}: {page.title}</h1>
                        <p className="text-sm text-[var(--color-muted)]">/{page.slug}</p>
                    </div>
                </div>
                <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save size={18} />
                    {tCommon('save')}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-5">
                        <label className="block text-sm font-medium mb-2 text-[var(--color-foreground)]">{t('content_html')}</label>
                        <textarea
                            className="w-full h-96 p-4 border border-[var(--color-border)] rounded-xl font-mono text-sm bg-[var(--color-surface)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-colors resize-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                        <p className="text-xs text-[var(--color-muted)] mt-2">{t('html_hint')}</p>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-5 space-y-4">
                        <h3 className="font-bold border-b border-[var(--color-border)] pb-3 text-[var(--color-foreground)]">{t('page_settings')}</h3>
                        <Input label={t('page_title')} value={page.title} readOnly />
                        <Input label={t('page_slug')} value={page.slug} readOnly />
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">{t('page_status')}</label>
                            <select className="w-full border border-[var(--color-border)] rounded-xl p-2.5 bg-[var(--color-surface)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-colors" defaultValue={page.status}>
                                <option value="published">{t('published')}</option>
                                <option value="draft">{t('draft')}</option>
                            </select>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
