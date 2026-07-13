import { z } from 'zod';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { jsonOk, jsonError } from '@/lib/api-response';
import { generateBlogPost } from '@/lib/ai/blog';
import { requireAdmin } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import { isDatabaseEnabled } from '@/lib/env';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';

const generateSchema = z.object({
  topic: z.string().min(3).max(200),
  keywords: z.array(z.string()).max(10).optional(),
  locale: z.string().optional(),
  publish: z.boolean().optional(),
});

export const GET = withApiHandler(async () => {
  if (!isDatabaseEnabled()) {
    return jsonOk({ posts: [] });
  }

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      metaDescription: true,
      keywords: true,
      aiGenerated: true,
      createdAt: true,
    },
  });

  return jsonOk({ posts });
}, 'GET /api/ai/blog');

export const POST = withApiHandler(async (request) => {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const limit = await rateLimit('ai', getRateLimitIdentifier(request, auth.userId));
  if (!limit.success) return jsonError('Cok fazla istek', 429);

  const parsed = await parseValidatedBody(request, generateSchema);
  if ('error' in parsed) return parsed.error;

  const generated = await generateBlogPost(parsed.data);

  if (parsed.data.publish && isDatabaseEnabled()) {
    const uniqueSlug = await ensureUniqueSlug(generated.slug);
    const post = await prisma.blogPost.create({
      data: {
        title: generated.title,
        slug: uniqueSlug,
        excerpt: generated.excerpt,
        content: generated.content,
        metaDescription: generated.metaDescription,
        keywords: generated.keywords,
        published: true,
        aiGenerated: true,
      },
    });
    return jsonOk({ post, generated });
  }

  return jsonOk({ generated });
}, 'POST /api/ai/blog');

async function ensureUniqueSlug(base: string): Promise<string> {
  if (!isDatabaseEnabled()) return base;
  let slug = base;
  let i = 0;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}
