'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  Building2, Car, ShoppingBag, ChevronRight, TreePalm,
  Wrench, PawPrint, Briefcase, PlusCircle, Package, RefreshCcw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

const categoryIcons: Record<string, LucideIcon> = {
  Building2, Car, ShoppingBag, Palmtree: TreePalm, Wrench, PawPrint, Briefcase, Package, RefreshCcw,
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

function SubCategoryItem({ sub, children }: { sub: Category; children: Category[] }) {
  const [open, setOpen] = useState(false);
  const hasChildren = children.length > 0;

  return (
    <li>
      <div className="flex items-center">
        <Link
          href={`/category/${sub.slug}`}
          className="flex-1 text-[12px] py-1 px-2 rounded text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
        >
          {sub.name}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="p-0.5 rounded text-[var(--color-muted)] hover:text-[var(--color-primary)]"
          >
            <ChevronRight size={10} className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>
      {hasChildren && (
        <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="ml-3 border-l border-[var(--color-border)]/40 pl-2 space-y-0">
            {children.map((leaf) => (
              <li key={leaf.id}>
                <Link href={`/category/${leaf.slug}`} className="text-[11px] py-0.5 px-1.5 rounded block text-[var(--color-muted)]/70 hover:text-[var(--color-primary)]">
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

function RootCategoryItem({ category, allCategories }: { category: Category; allCategories: Category[] }) {
  const Icon = categoryIcons[category.icon || ''] || Building2;
  const subcategories = allCategories.filter((c) => c.parentId === category.id);

  return (
    <li className="pb-1.5 mb-1.5 border-b border-[var(--color-border)]/30 last:border-0 last:mb-0 last:pb-0">
      <Link
        href={`/category/${category.slug}`}
        className="group flex items-center gap-2 py-1.5 px-2 rounded-lg text-[13px] text-[var(--color-foreground)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
      >
        <Icon size={13} className="text-[var(--color-primary)] shrink-0" />
        <span className="font-semibold">{category.name}</span>
      </Link>
      {subcategories.length > 0 && (
        <ul className="ml-5 mt-0.5 space-y-0">
          {subcategories.map((sub) => {
            const subChildren = allCategories.filter((c) => c.parentId === sub.id);
            return <SubCategoryItem key={sub.id} sub={sub} children={subChildren} />;
          })}
        </ul>
      )}
    </li>
  );
}

export default function CategorySidebar({ rootCategories, allCategories }: CategorySidebarProps) {
  const t = useTranslations('Home');

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm text-sm">
        <div className="px-3 py-2.5 border-b border-[var(--color-border)]">
          <h2 className="font-bold text-[var(--color-foreground)] text-xs uppercase tracking-wider">
            {t('categories')}
          </h2>
        </div>
        <div className="px-2 py-2">
          <ul className="space-y-0">
            {rootCategories.map((category) => (
              <RootCategoryItem key={category.id} category={category} allCategories={allCategories} />
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[var(--color-navy)] to-[#3b325e] rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-accent)]/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h3 className="font-bold text-lg mb-1">{t('cta_title')}</h3>
          <p className="text-white/65 text-xs mb-4">{t('cta_desc')}</p>
          <Link
            href="/post-ad"
            className="inline-flex items-center gap-2 bg-[var(--color-brand-yellow)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-navy)] font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <PlusCircle size={16} />
            {t('cta_btn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
