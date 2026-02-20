'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Building2, Car, ShoppingBag, ChevronRight, TreePalm, Wrench, PawPrint, Briefcase } from 'lucide-react';
import { useTranslations } from 'next-intl';

const categoryIcons: Record<string, any> = {
    'Building2': Building2,
    'Car': Car,
    'ShoppingBag': ShoppingBag,
    'Palmtree': TreePalm,
    'Wrench': Wrench,
    'PawPrint': PawPrint,
    'Briefcase': Briefcase,
};

interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    parentId?: string | null;
}

interface CategorySidebarProps {
    rootCategories: Category[];
    allCategories: Category[];
}

/* ── sub-category (collapsible children) ────────── */
function SubCategoryItem({ sub, children }: { sub: Category; children: Category[] }) {
    const [open, setOpen] = useState(false);
    const hasChildren = children.length > 0;

    return (
        <li>
            <div className="flex items-center">
                <Link
                    href={`/category/${sub.slug}`}
                    className="flex-1 text-[12px] py-1 px-2 rounded text-[var(--color-muted)]
                        hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
                >
                    {sub.name}
                </Link>
                {hasChildren && (
                    <button
                        onClick={() => setOpen(!open)}
                        className="p-0.5 rounded text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        <ChevronRight size={10} className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
                    </button>
                )}
            </div>
            {hasChildren && (
                <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className="ml-3 border-l border-[var(--color-border)]/40 pl-2 space-y-0">
                        {children.map(leaf => (
                            <li key={leaf.id}>
                                <Link href={`/category/${leaf.slug}`}
                                    className="text-[11px] py-0.5 px-1.5 rounded block text-[var(--color-muted)]/70
                                        hover:text-[var(--color-primary)] transition-colors">
                                    {leaf.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
}

/* ── root category ─────────────────────────────── */
function RootCategoryItem({ category, allCategories }: { category: Category; allCategories: Category[] }) {
    const Icon = categoryIcons[category.icon || ''] || Building2;
    const subcategories = allCategories.filter(c => c.parentId === category.id);

    return (
        <li className="pb-1.5 mb-1.5 border-b border-[var(--color-border)]/30 last:border-0 last:mb-0 last:pb-0">
            <Link
                href={`/category/${category.slug}`}
                className="group flex items-center gap-2 py-1.5 px-2 rounded-lg text-[13px]
                    text-[var(--color-foreground)] hover:text-[var(--color-primary)]
                    hover:bg-[var(--color-primary)]/5 transition-colors"
            >
                <Icon size={13} className="text-[var(--color-primary)] shrink-0" />
                <span className="font-semibold">{category.name}</span>
            </Link>
            {subcategories.length > 0 && (
                <ul className="ml-5 mt-0.5 space-y-0">
                    {subcategories.map(sub => {
                        const subChildren = allCategories.filter(c => c.parentId === sub.id);
                        return <SubCategoryItem key={sub.id} sub={sub} children={subChildren} />;
                    })}
                </ul>
            )}
        </li>
    );
}

/* ═══════════════ MAIN ═══════════════ */
export default function CategorySidebar({ rootCategories, allCategories }: CategorySidebarProps) {
    const t = useTranslations('Home');

    return (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm text-sm">
            <div className="px-3 py-2.5 border-b border-[var(--color-border)]">
                <h2 className="font-bold text-[var(--color-foreground)] text-xs uppercase tracking-wider">
                    {t('categories')}
                </h2>
            </div>
            <div className="px-2 py-2">
                <ul className="space-y-0">
                    {rootCategories.map(category => (
                        <RootCategoryItem key={category.id} category={category} allCategories={allCategories} />
                    ))}
                </ul>
            </div>
        </div>
    );
}
