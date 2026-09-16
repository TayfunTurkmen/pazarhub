import { createHmac, randomBytes } from 'crypto';

function config() {
  return {
    apiKey: process.env.IYZICO_API_KEY ?? '',
    secretKey: process.env.IYZICO_SECRET_KEY ?? '',
    baseUrl: process.env.IYZICO_BASE_URL || (process.env.IYZICO_SANDBOX === '1'
      ? 'https://sandbox-api.iyzipay.com'
      : 'https://api.iyzipay.com'),
  };
}

export function isIyzicoConfigured(): boolean {
  const c = config();
  return Boolean(c.apiKey && c.secretKey);
}

function authorization(uri: string, body: string) {
  const c = config();
  const randomKey = randomBytes(8).toString('hex');
  const payload = randomKey + uri + body;
  const signature = createHmac('sha256', c.secretKey).update(payload).digest('hex');
  const auth = Buffer.from(`apiKey:${c.apiKey}&randomKey:${randomKey}&signature:${signature}`).toString('base64');
  return { authorization: `IYZWSv2 ${auth}`, randomKey };
}

export async function createIyzicoCheckout(input: {
  merchantOid: string;
  price: number;
  email: string;
  name: string;
  callbackUrl: string;
  basketName: string;
}): Promise<{ token: string; checkoutFormContent: string; paymentPageUrl?: string }> {
  const c = config();
  const uri = '/payment/iyzipos/checkoutform/initialize/auth/ecom';
  const bodyObj = {
    locale: 'tr',
    conversationId: input.merchantOid,
    price: input.price.toFixed(2),
    paidPrice: input.price.toFixed(2),
    currency: 'TRY',
    basketId: input.merchantOid,
    paymentGroup: 'PRODUCT',
    callbackUrl: input.callbackUrl,
    enabledInstallments: [1],
    buyer: {
      id: input.merchantOid,
      name: input.name.split(' ')[0] || 'Skonutal',
      surname: input.name.split(' ').slice(1).join(' ') || 'Üye',
      gsmNumber: '+905350000000',
      email: input.email,
      identityNumber: '11111111111',
      registrationAddress: 'Türkiye',
      ip: '127.0.0.1',
      city: 'Istanbul',
      country: 'Turkey',
    },
    shippingAddress: {
      contactName: input.name,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Türkiye',
    },
    billingAddress: {
      contactName: input.name,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Türkiye',
    },
    basketItems: [{
      id: input.merchantOid,
      name: input.basketName,
      category1: 'Emlak',
      itemType: 'VIRTUAL',
      price: input.price.toFixed(2),
    }],
  };
  const body = JSON.stringify(bodyObj);
  const auth = authorization(uri, body);
  const res = await fetch(`${c.baseUrl}${uri}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth.authorization,
      'x-iyzi-rnd': auth.randomKey,
    },
    body,
  });
  const json = await res.json() as {
    status?: string;
    errorMessage?: string;
    token?: string;
    checkoutFormContent?: string;
    paymentPageUrl?: string;
  };
  if (json.status !== 'success' || !json.token) {
    throw new Error(json.errorMessage || 'iyzico oturumu başlatılamadı');
  }
  return {
    token: json.token,
    checkoutFormContent: json.checkoutFormContent ?? '',
    paymentPageUrl: json.paymentPageUrl,
  };
}
