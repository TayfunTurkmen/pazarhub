import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Sparkles, Calendar } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';
import { isDatabaseEnabled } from '@/lib/env';

function renderMarkdown(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<ul class="list-disc space-y-1 my-4">${m}</ul>`)
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    .replace(/Meta description:.+$/im, '');
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isDatabaseEnabled()) return { title: 'Blog' };

  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: 'Blog' };

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslations('AI');

  if (!isDatabaseEnabled()) notFound();

  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) notFound();

  const html = renderMarkdown(post.content);

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <Link href="/blog" className="text-sm text-violet-600 hover:underline">← {t('blog_back')}</Link>

      {post.aiGenerated && (
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-violet-600 bg-violet-500/10 px-3 py-1 rounded-full">
          <Sparkles size={12} /> AI SEO Blog
        </span>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">{post.title}</h1>

      <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
        {post.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.keywords.map((kw) => (
              <span key={kw} className="px-2 py-0.5 rounded-full bg-[var(--color-surface-elevated)] text-xs">{kw}</span>
            ))}
          </div>
        )}
      </div>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none text-[var(--color-foreground)]"
        dangerouslySetInnerHTML={{ __html: `<p class="mb-4 leading-relaxed">${html}</p>` }}
      />
    </article>
  );
}
