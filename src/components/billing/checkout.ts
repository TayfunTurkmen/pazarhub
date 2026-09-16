'use client';

export type CheckoutKind = 'SUBSCRIPTION' | 'DOPING' | 'SHOWCASE' | 'ESCROW';
export type PaymentProvider = 'PAYTR' | 'IYZICO' | 'DEMO';

export interface CheckoutPayload {
  kind: CheckoutKind;
  provider?: PaymentProvider;
  plan?: 'CORPORATE_STARTER' | 'CORPORATE_PRO' | 'CORPORATE_AGENCY';
  productCode?: 'DOPING_7' | 'DOPING_15' | 'SHOWCASE_7' | 'SHOWCASE_30';
  listingId?: string;
}

export interface CheckoutSession {
  orderId: string;
  provider: PaymentProvider;
  amount: number;
  basket: string;
  iframeUrl?: string;
  checkoutFormContent?: string;
  paymentPageUrl?: string;
  demoUrl?: string;
}

export async function createCheckout(payload: CheckoutPayload): Promise<CheckoutSession> {
  const res = await fetch('/api/payments/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.status === 401) {
    throw new Error('LOGIN_REQUIRED');
  }
  const json = await res.json() as { success: boolean; data?: CheckoutSession; error?: string };
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Ödeme oturumu açılamadı');
  }
  return json.data;
}

export function persistCheckoutSession(session: CheckoutSession) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`checkout:${session.orderId}`, JSON.stringify(session));
}

export function readCheckoutSession(orderId: string): CheckoutSession | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(`checkout:${orderId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CheckoutSession;
  } catch {
    return null;
  }
}
