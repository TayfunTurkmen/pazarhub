import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { markPaid } from '@/lib/payments/orders';
import { originFromRequest } from '@/lib/payments/crypto';

export const POST = withApiHandler(async (request: Request) => {
  const form = await request.formData();
  const conversationId = String(form.get('conversationId') ?? form.get('merchantOid') ?? '');
  const status = String(form.get('status') ?? '');
  const origin = originFromRequest(request);
  if (status === 'success' && conversationId) {
    await markPaid(conversationId);
    return NextResponse.redirect(`${origin}/odeme?status=ok&oid=${conversationId}`, 303);
  }
  return NextResponse.redirect(`${origin}/odeme?status=fail&oid=${conversationId}`, 303);
}, 'POST /api/payments/iyzico/callback');
