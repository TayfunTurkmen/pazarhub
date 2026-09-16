import 'server-only';

export function evolutionConfig() {
  return {
    url: (process.env.EVOLUTION_API_URL || 'http://127.0.0.1:8080').replace(/\/$/, ''),
    apiKey: process.env.EVOLUTION_API_KEY || process.env.AUTHENTICATION_API_KEY || 'skonutal-evolution-key',
    instance: process.env.EVOLUTION_INSTANCE || 'skonutal',
  };
}

export function phoneToWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('90') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 11) return `90${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith('5')) return `90${digits}`;
  return digits;
}
