import { z } from 'zod';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { jsonOk } from '@/lib/api-response';
import { qualifyLead } from '@/lib/ai/leads';
import { prisma } from '@/lib/prisma';
import { isDatabaseEnabled } from '@/lib/env';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
  save: z.boolean().optional(),
});

export const POST = withApiHandler(async (request) => {
  const limit = await rateLimit('ai', getRateLimitIdentifier(request));
  if (!limit.success) {
    return jsonOk({
      score: 0,
      grade: 'cold',
      intent: 'info',
      summary: 'Rate limited',
      nextAction: 'Try again later',
      tags: [],
    }, 429);
  }

  const parsed = await parseValidatedBody(request, schema);
  if ('error' in parsed) return parsed.error;

  const qualification = await qualifyLead(parsed.data);

  if (parsed.data.save !== false && isDatabaseEnabled()) {
    await prisma.lead.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        subject: parsed.data.subject,
        message: parsed.data.message,
        score: qualification.score,
        grade: qualification.grade,
        intent: qualification.intent,
        summary: qualification.summary,
        nextAction: qualification.nextAction,
        tags: qualification.tags,
      },
    });
  }

  return jsonOk(qualification);
}, 'POST /api/ai/lead-qualify');

export const GET = withApiHandler(async (request) => {
  if (!isDatabaseEnabled()) return jsonOk({ leads: [] });

  const url = new URL(request.url);
  const grade = url.searchParams.get('grade');

  const leads = await prisma.lead.findMany({
    where: grade ? { grade } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return jsonOk({ leads });
}, 'GET /api/ai/lead-qualify');
