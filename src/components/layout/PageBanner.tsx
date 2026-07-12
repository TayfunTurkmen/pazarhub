import { LucideIcon } from 'lucide-react';

interface PageBannerProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function PageBanner({ icon: Icon, title, subtitle, badge }: PageBannerProps) {
  return (
    <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-16 2xl:-mx-24 -mt-8 mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-950 px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 py-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center shrink-0 shadow-md">
              <Icon size={24} className="text-blue-900" />
            </div>
          )}
          <div>
            {badge && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white/90 px-2.5 py-0.5 rounded-full mb-1">
                {badge}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-blue-100/70 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
