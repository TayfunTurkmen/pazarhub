import { jsonError, jsonOk, jsonRateLimited } from '@/lib/api-response';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { z } from 'zod';
import { isValidTurkishMobile, normalizePhone } from '@/lib/phone';
import { getWhatsAppStatus, sendWhatsAppText } from '@/lib/evolution/client';
import { issueWhatsAppOtp } from '@/lib/evolution/otp';

export const GET = withApiHandler(async () => {
  const status = await getWhatsAppStatus();
  return jsonOk({ connected: status.connected, provider: status.provider });
}, 'GET /api/auth/whatsapp');

const sendSchema = z.object({
  phone: z.string().min(10).max(20),
});

export const POST = withApiHandler(async (request: Request) => {
  const limit = await rateLimit('auth', getRateLimitIdentifier(request));
  if (!limit.success) return jsonRateLimited(limit.retryAfter);

  const parsed = await parseValidatedBody(request, sendSchema);
  if ('error' in parsed) return parsed.error;
  if (!isValidTurkishMobile(parsed.data.phone)) return jsonError('Geçerli bir cep telefonu girin', 422);

  const status = await getWhatsAppStatus();
  if (!status.connected) {
    return jsonError('WhatsApp henüz bağlı değil. Yönetici QR ile giriş yapmalı.', 503);
  }

  const phone = normalizePhone(parsed.data.phone);
  const code = issueWhatsAppOtp(phone);
  try {
    await sendWhatsAppText(
      phone,
      `sendekonutal.com giriş kodunuz: ${code}\n5 dakika geçerlidir. Bu kodu kimseyle paylaşmayın.`,
    );
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'WhatsApp mesajı gönderilemedi', 503);
  }
  return jsonOk({ sent: true });
}, 'POST /api/auth/whatsapp');
