import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { APP_DOMAIN } from '@/lib/constants';

interface LogoProps {
  compact?: boolean;
  inverted?: boolean;
}

export default function Logo({ compact = false, inverted = false }: LogoProps) {
  // On navy surfaces the full lockup's navy bar disappears — use mark + yellow wordmark
  if (inverted) {
    return (
      <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label={APP_DOMAIN}>
        <Image
          src="/brand/sendekonutal-mark.png"
          alt=""
          width={52}
          height={40}
          className="h-10 w-auto object-contain group-hover:-translate-y-0.5 transition-transform"
        />
        {!compact && (
          <span className="hidden sm:block font-extrabold text-lg tracking-tight text-[var(--color-brand-yellow)]">
            sendekonutal
            <span className="text-white/70">.com</span>
          </span>
        )}
      </Link>
    );
  }

  if (compact) {
    return (
      <Link href="/" className="flex items-center shrink-0 group" aria-label={APP_DOMAIN}>
        <Image
          src="/brand/sendekonutal-mark.png"
          alt=""
          width={48}
          height={36}
          className="h-9 w-auto object-contain group-hover:-translate-y-0.5 transition-transform"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center shrink-0 group" aria-label={`${APP_DOMAIN} ana sayfa`}>
      <Image
        src="/brand/sendekonutal-logo-transparent.png"
        alt={APP_DOMAIN}
        width={240}
        height={80}
        priority
        className="h-11 sm:h-12 w-auto max-w-[220px] sm:max-w-[260px] object-contain object-left"
      />
    </Link>
  );
}
