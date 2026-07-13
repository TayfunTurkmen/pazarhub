import { z } from 'zod';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { jsonOk } from '@/lib/api-response';
import { optimizeImageMeta } from '@/lib/ai/image';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  fileName: z.string().min(1).max(255),
  fileSize: z.number().min(1).max(20 * 1024 * 1024),
  mimeType: z.string().min(1),
  listingTitle: z.string().optional(),
});

export const POST = withApiHandler(async (request) => {
  const limit = await rateLimit('ai', getRateLimitIdentifier(request));
  if (!limit.success) {
    return jsonOk({
      score: 0,
      issues: ['Çok fazla istek'],
      suggestions: ['Lütfen biraz bekleyin'],
      altText: '',
      caption: '',
    }, 429);
  }

  const parsed = await parseValidatedBody(request, schema);
  if ('error' in parsed) return parsed.error;

  const result = await optimizeImageMeta(parsed.data);
  return jsonOk(result);
}, 'POST /api/ai/image-optimize');
