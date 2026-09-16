import 'server-only';

import { randomInt } from 'crypto';
import { normalizePhone } from '@/lib/phone';

type OtpRecord = { code: string; expiresAt: number; tries: number };

const g = globalThis as unknown as { skonutalWhatsappOtp?: Map<string, OtpRecord> };
if (!g.skonutalWhatsappOtp) g.skonutalWhatsappOtp = new Map();

export function issueWhatsAppOtp(phone: string): string {
  const code = String(randomInt(100000, 1000000));
  g.skonutalWhatsappOtp!.set(normalizePhone(phone), {
    code,
    expiresAt: Date.now() + 5 * 60_000,
    tries: 0,
  });
  return code;
}

export function consumeWhatsAppOtp(phone: string, code: string): boolean {
  const key = normalizePhone(phone);
  const rec = g.skonutalWhatsappOtp!.get(key);
  if (!rec) return false;
  rec.tries += 1;
  if (rec.tries > 5 || rec.expiresAt < Date.now()) {
    g.skonutalWhatsappOtp!.delete(key);
    return false;
  }
  if (rec.code !== code.trim()) return false;
  g.skonutalWhatsappOtp!.delete(key);
  return true;
}
