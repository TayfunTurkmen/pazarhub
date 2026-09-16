import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { verifyPaytrCallback } from '@/lib/payments/paytr';
import { markPaid } from '@/lib/payments/orders';

export const POST = withApiHandler(async (request: Request) => {
  const form = await request.formData();
  const params = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  if (!verifyPaytrCallback(params)) {
    return new NextResponse('PAYTR notification failed: bad hash', { status: 400 });
  }
  if (params.status === 'success') {
    await markPaid(params.merchant_oid);
  }
  return new NextResponse('OK', { status: 200 });
}, 'POST /api/payments/paytr/callback');
