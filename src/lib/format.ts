export function formatTry(value: number): string {
  return `${new Intl.NumberFormat('tr-TR').format(value)} ₺`;
}

export function formatPerM2(price: number, netArea?: number): string | null {
  if (!netArea || netArea <= 0) return null;
  return `${new Intl.NumberFormat('tr-TR').format(Math.round(price / netArea))} ₺/m²`;
}
