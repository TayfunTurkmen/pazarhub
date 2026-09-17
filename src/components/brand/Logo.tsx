'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { APP_DOMAIN } from '@/lib/constants';

interface LogoProps {
  compact?: boolean;
  inverted?: boolean;
}

export default function Logo({ compact = false, inverted = false }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dark = inverted || (mounted && resolvedTheme === 'dark') || (!mounted && true);

  // Full lockup (navy bar + yellow text) reads on light backgrounds only
  if (!dark && !compact) {
    return (
      <Link href="/" className="flex items-center shrink-0 group" aria-label={`${APP_DOMAIN} ana sayfa`}>
        <Image
          src="/brand/sendekonutal-logo-transparent.png"
          alt={APP_DOMAIN}
          width={240}
          height={80}
          priority
          className="h-9 sm:h-11 md:h-12 w-auto max-w-[150px] sm:max-w-[220px] md:max-w-[260px] object-contain object-left"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label={APP_DOMAIN}>
      <Image
        src="/brand/sendekonutal-mark.png"
        alt=""
        width={56}
        height={42}
        priority
        className="h-9 w-auto object-contain group-hover:-translate-y-0.5 transition-transform drop-shadow-sm"
      />
      {!compact && (
        <span className="flex items-baseline font-extrabold text-sm sm:text-lg tracking-tight text-[var(--color-brand-yellow)] truncate max-w-[140px] sm:max-w-none">
          sendekonutal
          <span className="text-white/75">.com</span>
        </span>
      )}
    </Link>
  );
}
