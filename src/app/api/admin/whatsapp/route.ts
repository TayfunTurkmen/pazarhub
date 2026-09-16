import { jsonError, jsonOk, jsonRateLimited } from '@/lib/api-response';
import { requireAdmin } from '@/lib/api-auth';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { z } from 'zod';
import { getWhatsAppStatus, logoutWhatsApp, startWhatsAppLogin, sendWhatsAppText } from '@/lib/evolution/client';

export const GET = withApiHandler(async (request: Request) => {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;
  const limit = await rateLimit('read', getRateLimitIdentifier(request, auth.userId));
  if (!limit.success) return jsonRateLimited(limit.retryAfter);
  return jsonOk(await getWhatsAppStatus());
}, 'GET /api/admin/whatsapp');

const postSchema = z.object({
  action: z.enum(['connect', 'logout', 'refresh', 'test']),
  phone: z.string().min(10).max(20).optional(),
  text: z.string().min(1).max(500).optional(),
});

export const POST = withApiHandler(async (request: Request) => {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;
  const limit = await rateLimit('auth', getRateLimitIdentifier(request, auth.userId));
  if (!limit.success) return jsonRateLimited(limit.retryAfter);
  const parsed = await parseValidatedBody(request, postSchema);
  if ('error' in parsed) return parsed.error;

  if (parsed.data.action === 'logout') {
    await logoutWhatsApp();
    return jsonOk(await getWhatsAppStatus());
  }
  if (parsed.data.action === 'test') {
    if (!parsed.data.phone) return jsonError('Telefon gerekli', 422);
    try {
      await sendWhatsAppText(parsed.data.phone, parsed.data.text || 'skonutal.com WhatsApp bağlantısı çalışıyor.');
    } catch (err) {
      return jsonError(err instanceof Error ? err.message : 'Gönderilemedi', 503);
    }
    return jsonOk({ sent: true });
  }
  if (parsed.data.action === 'connect') {
    return jsonOk(await startWhatsAppLogin());
  }
  return jsonOk(await getWhatsAppStatus());
}, 'POST /api/admin/whatsapp');
