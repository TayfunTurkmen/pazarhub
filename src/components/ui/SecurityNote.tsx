import { ShieldCheck } from 'lucide-react';

interface SecurityNoteProps {
  title: string;
  description?: string;
}

export default function SecurityNote({ title, description }: SecurityNoteProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/15">
      <ShieldCheck size={20} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-[var(--color-foreground)]">{title}</p>
        {description && <p className="text-xs text-[var(--color-muted)] mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
