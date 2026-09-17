import { LucideIcon } from 'lucide-react';

interface PageBannerProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function PageBanner({ icon: Icon, title, subtitle, badge }: PageBannerProps) {
  return (
    <section className="relative full-bleed -mt-8 mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-[var(--color-navy)] via-[#3b325e] to-[#2f2858] full-bleed-pad py-6 sm:py-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4 min-w-0">
          {Icon && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-brand-yellow)] flex items-center justify-center shrink-0 shadow-md">
              <Icon size={22} className="text-[var(--color-navy)]" />
            </div>
          )}
          <div className="min-w-0">
            {badge && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white/90 px-2.5 py-0.5 rounded-full mb-1">
                {badge}
              </span>
            )}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white break-words">{title}</h1>
            {subtitle && <p className="text-white/65 text-sm mt-1 line-clamp-2">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
