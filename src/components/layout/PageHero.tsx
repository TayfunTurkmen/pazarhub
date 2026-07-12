import { LucideIcon } from 'lucide-react';

interface PageHeroProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconClassName?: string;
}

export default function PageHero({ icon: Icon, title, description, iconClassName }: PageHeroProps) {
  return (
    <div className="text-center space-y-4 mb-8">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 shadow-lg ${iconClassName ?? 'bg-gradient-to-br from-[var(--color-primary)] to-blue-700 text-white'}`}>
        <Icon size={32} />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">{title}</h1>
      {description && (
        <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">{description}</p>
      )}
    </div>
  );
}
