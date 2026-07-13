import { z } from 'zod';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { jsonOk } from '@/lib/api-response';
import { completeChat } from '@/lib/ai/client';
import { PLATFORM_CONTEXT } from '@/lib/ai/prompts';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1).max(2000),
    }),
  ).min(1).max(20),
  locale: z.string().optional(),
});

export const POST = withApiHandler(async (request) => {
  const limit = await rateLimit('ai', getRateLimitIdentifier(request));
  if (!limit.success) {
    return jsonOk({ reply: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.' }, 429);
  }

  const parsed = await parseValidatedBody(request, chatSchema);
  if ('error' in parsed) return parsed.error;

  const { messages, locale } = parsed.data;
  const langHint =
    locale === 'en' ? 'Respond in English.' :
    locale === 'de' ? 'Respond in German.' :
    locale === 'ru' ? 'Respond in Russian.' :
    'Respond in Turkish.';

  const reply = await completeChat(
    [
      { role: 'system', content: `${PLATFORM_CONTEXT}\n${langHint}` },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ],
    { temperature: 0.7, maxTokens: 800 },
  );

  return jsonOk({ reply });
}, 'POST /api/ai/chat');
