import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/services/cmsData';

// Generate static params if needed, but for now dynamic
// export async function generateStaticParams() { ... }

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
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">{page.title}</h1>
            <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </div>
    );
}
