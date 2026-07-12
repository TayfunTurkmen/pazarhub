import 'server-only';

import { isDatabaseEnabled } from '@/lib/env';

export interface AuthSettings {
  smsVerificationEnabled: boolean;
  googleAuthEnabled: boolean;
  facebookAuthEnabled: boolean;
}

const DEFAULTS: AuthSettings = {
  smsVerificationEnabled: false,
  googleAuthEnabled: true,
  facebookAuthEnabled: true,
};

const KEYS = {
  smsVerificationEnabled: 'auth.smsVerificationEnabled',
  googleAuthEnabled: 'auth.googleAuthEnabled',
  facebookAuthEnabled: 'auth.facebookAuthEnabled',
} as const;

let memoryCache: AuthSettings = { ...DEFAULTS };

export async function getAuthSettings(): Promise<AuthSettings> {
  if (!isDatabaseEnabled()) return memoryCache;

  try {
    const { prisma } = await import('@/lib/prisma');
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: Object.values(KEYS) } },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      smsVerificationEnabled: map[KEYS.smsVerificationEnabled] === 'true',
      googleAuthEnabled: map[KEYS.googleAuthEnabled] !== 'false',
      facebookAuthEnabled: map[KEYS.facebookAuthEnabled] !== 'false',
    };
  } catch {
    return memoryCache;
  }
}

export async function saveAuthSettings(settings: Partial<AuthSettings>): Promise<AuthSettings> {
  const merged = { ...await getAuthSettings(), ...settings };
  memoryCache = merged;

  if (!isDatabaseEnabled()) return merged;

  const { prisma } = await import('@/lib/prisma');
  const entries: [string, string][] = [
    [KEYS.smsVerificationEnabled, String(merged.smsVerificationEnabled)],
    [KEYS.googleAuthEnabled, String(merged.googleAuthEnabled)],
    [KEYS.facebookAuthEnabled, String(merged.facebookAuthEnabled)],
  ];

  for (const [key, value] of entries) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  return merged;
}
