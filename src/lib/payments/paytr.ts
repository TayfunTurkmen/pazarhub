import { hmacBase64, safeEqual } from './crypto';

function config() {
  return {
    merchantId: process.env.PAYTR_MERCHANT_ID ?? '',
    merchantKey: process.env.PAYTR_MERCHANT_KEY ?? '',
    merchantSalt: process.env.PAYTR_MERCHANT_SALT ?? '',
    testMode: process.env.PAYTR_TEST_MODE === '1' ? '1' : '0',
  };
}

export function isPaytrConfigured(): boolean {
  const c = config();
  return Boolean(c.merchantId && c.merchantKey && c.merchantSalt);
}

export async function createPaytrToken(input: {
  merchantOid: string;
  email: string;
  amountKurus: number;
  userIp: string;
  userName: string;
  basketName: string;
  okUrl: string;
  failUrl: string;
  callbackUrl: string;
}): Promise<{ token: string; iframeUrl: string }> {
  const c = config();
  const userBasket = Buffer.from(JSON.stringify([[input.basketName, (input.amountKurus / 100).toFixed(2), 1]])).toString('base64');
  const noInstallment = '0';
  const maxInstallment = '0';
  const currency = 'TL';
  const hashStr = `${c.merchantId}${input.userIp}${input.merchantOid}${input.email}${input.amountKurus}${userBasket}${noInstallment}${maxInstallment}${currency}${c.testMode}`;
  const paytrToken = hmacBase64(c.merchantKey, `${hashStr}${c.merchantSalt}`);

  const body = new URLSearchParams({
    merchant_id: c.merchantId,
    user_ip: input.userIp,
    merchant_oid: input.merchantOid,
    email: input.email,
    payment_amount: String(input.amountKurus),
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: c.testMode,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: input.userName,
    merchant_ok_url: input.okUrl,
    merchant_fail_url: input.failUrl,
    timeout_limit: '30',
    currency,
    test_mode: c.testMode,
    lang: 'tr',
  });

  const res = await fetch('https://www.paytr.com/odeme/api/get-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await res.json() as { status?: string; token?: string; reason?: string };
  if (json.status !== 'success' || !json.token) {
    throw new Error(json.reason || 'PayTR token alınamadı');
  }
  return { token: json.token, iframeUrl: `https://www.paytr.com/odeme/guvenli/${json.token}` };
}

export function verifyPaytrCallback(params: Record<string, string>): boolean {
  const c = config();
  const hash = hmacBase64(c.merchantKey, `${params.merchant_oid}${c.merchantSalt}${params.status}${params.total_amount}`);
  return safeEqual(hash, params.hash ?? '');
}
