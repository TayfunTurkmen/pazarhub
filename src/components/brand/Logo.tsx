import { Link } from '@/i18n/navigation';

interface LogoProps {
  compact?: boolean;
  inverted?: boolean;
}

export default function Logo({ compact = false, inverted = false }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="skonutal.com ana sayfa">
      <span className="relative w-9 h-9 bg-[var(--color-brand-yellow)] text-[var(--color-ink)] rounded-lg flex items-center justify-center text-[15px] font-black shadow-[0_2px_0_#c9a400] group-hover:-translate-y-0.5 transition-transform">
        S
      </span>
      {!compact && (
        <span className={`hidden sm:flex items-baseline tracking-tight font-extrabold text-lg ${inverted ? 'text-white' : 'text-[var(--color-ink)] dark:text-white'}`}>
          skonutal
          <span className={inverted ? 'text-white/70' : 'text-[var(--color-muted)]'}>.com</span>
        </span>
      )}
    </Link>
  );
}
