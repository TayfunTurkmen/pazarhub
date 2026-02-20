'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Edit, Eye, PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getPages, CMSPage } from '@/services/cmsData';

export default function AdminPages() {
    const t = useTranslations('Admin');
    const [pages, setPages] = useState<CMSPage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPages().then(data => {
            setPages(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-[var(--color-muted)]">
                Yükleniyor...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('page_management')}</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">{t('page_management_desc')}</p>
                </div>
                <Button className="flex items-center gap-2">
                    <PlusCircle size={18} />
                    {t('add_new_page')}
                </Button>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]">
                            <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">{t('page_title')}</th>
                            <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">{t('page_slug')}</th>
                            <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm">{t('page_status')}</th>
                            <th className="p-4 font-semibold text-[var(--color-foreground)] text-sm text-right">{t('page_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map((page) => (
                            <tr key={page.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                                <td className="p-4 font-medium text-[var(--color-foreground)]">{page.title}</td>
                                <td className="p-4 text-[var(--color-muted)] font-mono text-sm">/{page.slug}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${page.status === 'published'
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                        }`}>
                                        {page.status === 'published' ? t('published') : t('draft')}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/${page.slug}`} target="_blank" className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors">
                                            <Eye size={18} />
                                        </Link>
                                        <Link href={`/admin/pages/${page.id}`} className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
