import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="bg-[var(--color-surface)] p-12 rounded-2xl text-center border border-[var(--color-border)]">
      <Icon size={48} className="mx-auto mb-4 text-[var(--color-muted)] opacity-40" />
      <p className="text-lg font-medium mb-2 text-[var(--color-foreground)]">{title}</p>
      {description && <p className="text-sm text-[var(--color-muted)]">{description}</p>}
    </div>
  );
}
