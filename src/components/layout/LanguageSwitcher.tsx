'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'tr', label: 'Türkçe' },
        { code: 'en', label: 'English' },
        { code: 'de', label: 'Deutsch' },
        { code: 'ru', label: 'Русский' },
    ];

    const handleLanguageChange = (code: string) => {
        router.replace(pathname, { locale: code });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 flex items-center gap-1.5 text-sm active:scale-95"
            >
                <Globe size={14} />
                <span className="uppercase text-xs font-medium">{locale}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[var(--color-surface-elevated)] rounded-xl shadow-lg border border-[var(--color-border)] py-1.5 z-50 overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-background)] ${locale === lang.code ? 'font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'text-[var(--color-text-secondary)]'
                                }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
