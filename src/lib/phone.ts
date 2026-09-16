/** Normalize Turkish mobile numbers to 05XXXXXXXXX */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('90') && digits.length === 12) return `0${digits.slice(2)}`;
  if (digits.length === 10 && digits.startsWith('5')) return `0${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return digits;
  return digits;
}

export function isValidTurkishMobile(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^05\d{9}$/.test(normalized);
}

export function phoneToEmail(phone: string): string {
  return `${normalizePhone(phone)}@phone.skonutal.local`;
}
