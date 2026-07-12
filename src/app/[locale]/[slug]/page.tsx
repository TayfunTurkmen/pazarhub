import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/services/cmsData';
import { sanitizeHtml } from '@/lib/sanitize';
import Card from '@/components/ui/Card';
import PageHero from '@/components/layout/PageHero';
import { FileText } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: 'Not Found' };
  return { title: page.title };
}

export default async function CMSPageRenderer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHero icon={FileText} title={page.title} />
      <Card className="p-8">
        <div
          className="prose dark:prose-invert max-w-none text-[var(--color-foreground)]"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
        />
      </Card>
    </div>
  );
}
