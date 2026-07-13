import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import PageHero from '@/components/layout/PageHero';
import { prisma } from '@/lib/prisma';
import { isDatabaseEnabled } from '@/lib/env';

export async function generateMetadata() {
  const t = await getTranslations('AI');
  return { title: t('blog_page_title'), description: t('blog_page_desc') };
}

export default async function BlogPage() {
  const t = await getTranslations('AI');

  const posts = isDatabaseEnabled()
    ? await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })
    : [];

  return (
    <div className="space-y-8">
       <PageHero icon={Sparkles} title={t('blog_page_title')} description={t('blog_page_desc')} />

      {posts.length === 0 ? (
        <Card className="p-12 text-center">
          <Sparkles size={40} className="mx-auto text-violet-500 mb-4" />
          <p className="text-[var(--color-muted)]">{t('blog_empty')}</p>
          <Link href="/ai" className="inline-flex items-center gap-1 text-violet-600 font-medium mt-4 hover:underline">
            {t('platform_title')} <ArrowRight size={14} />
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="p-6 h-full hover:shadow-lg hover:border-violet-500/20 transition-all group">
                {post.aiGenerated && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded-full mb-3">
                    <Sparkles size={10} /> AI SEO
                  </span>
                )}
                <h2 className="font-bold text-lg text-[var(--color-foreground)] group-hover:text-violet-600 mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-[var(--color-muted)] line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                  <Calendar size={12} />
                  {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
