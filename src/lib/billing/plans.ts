export type PlanCode = 'FREE' | 'CORPORATE_STARTER' | 'CORPORATE_PRO' | 'CORPORATE_AGENCY';
export type BoostCode = 'DOPING_7' | 'DOPING_15' | 'SHOWCASE_7' | 'SHOWCASE_30';

export interface Plan {
  code: PlanCode;
  name: string;
  monthlyPrice: number;
  listingQuota: number;
  listingDays: number;
  dopingPerMonth: number;
  showcasePerMonth: number;
  storefront: boolean;
  highlight: boolean;
  bullets: string[];
}

export const PLANS: Plan[] = [
  {
    code: 'FREE',
    name: 'Bireysel',
    monthlyPrice: 0,
    listingQuota: 1,
    listingDays: 30,
    dopingPerMonth: 0,
    showcasePerMonth: 0,
    storefront: false,
    highlight: false,
    bullets: ['1 aktif ilan', '30 gün yayında kalır', 'Standart sıralama'],
  },
  {
    code: 'CORPORATE_STARTER',
    name: 'Kurumsal Başlangıç',
    monthlyPrice: 1490,
    listingQuota: 15,
    listingDays: 60,
    dopingPerMonth: 2,
    showcasePerMonth: 0,
    storefront: true,
    highlight: false,
    bullets: ['15 ilan', '60 gün süre', 'Mağaza sayfası', '2 doping / ay'],
  },
  {
    code: 'CORPORATE_PRO',
    name: 'Kurumsal Pro',
    monthlyPrice: 3490,
    listingQuota: 50,
    listingDays: 90,
    dopingPerMonth: 8,
    showcasePerMonth: 2,
    storefront: true,
    highlight: true,
    bullets: ['50 ilan', '90 gün süre', '8 doping + 2 vitrin', 'Öne çıkan ofis rozeti'],
  },
  {
    code: 'CORPORATE_AGENCY',
    name: 'Kurumsal Ajans',
    monthlyPrice: 7990,
    listingQuota: 999,
    listingDays: 120,
    dopingPerMonth: 20,
    showcasePerMonth: 8,
    storefront: true,
    highlight: true,
    bullets: ['Sınırsız ilana yakın kota', '120 gün süre', '20 doping + 8 vitrin', 'Öncelikli destek'],
  },
];

export const BOOSTS: Record<BoostCode, { name: string; price: number; days: number; tier: 'premium' | 'showcase' }> = {
  DOPING_7: { name: 'Doping 7 gün', price: 149, days: 7, tier: 'premium' },
  DOPING_15: { name: 'Doping 15 gün', price: 249, days: 15, tier: 'premium' },
  SHOWCASE_7: { name: 'Vitrin 7 gün', price: 499, days: 7, tier: 'showcase' },
  SHOWCASE_30: { name: 'Vitrin 30 gün', price: 1190, days: 30, tier: 'showcase' },
};

export const ESCROW_FEE_RATE = 0.015;

export function getPlan(code?: string | null): Plan {
  return PLANS.find((p) => p.code === code) ?? PLANS[0];
}

export function addDays(from: Date, days: number): Date {
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
}
