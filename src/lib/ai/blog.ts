import { completeChat } from './client';
import { BLOG_SYSTEM_PROMPT } from './prompts';

export interface BlogGenerateInput {
  topic: string;
  keywords?: string[];
  locale?: string;
}

export interface GeneratedBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaDescription: string;
  keywords: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ğ]/g, 'g')
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function extractTitle(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? fallback;
}

function extractMeta(content: string): string {
  const match = content.match(/meta description[:\s]*(.+)/i);
  if (match) return match[1].trim().slice(0, 160);
  const plain = content.replace(/[#*`]/g, '').replace(/\n+/g, ' ').trim();
  return plain.slice(0, 157) + '...';
}

function fallbackBlog(input: BlogGenerateInput): GeneratedBlog {
  const title = input.topic;
  const keywords = input.keywords ?? ['emlak', 'konut', 'Türkiye'];
  const content = `# ${title}

## Giriş
${title} konusunda emlak piyasasında bilinçli kararlar almak, doğru lokasyon ve bütçe planlamasıyla mümkündür.

## Neden Önemli?
Türkiye emlak piyasasında ${keywords.join(', ')} anahtar kelimeleriyle arama yapan kullanıcılar artan bir talep göstermektedir. Doğru bilgi, yatırım ve yaşam kalitesi açısından kritik rol oynar.

## Uzman Önerileri
- Bölge altyapısını ve ulaşım imkânlarını inceleyin
- Doğrulanmış ilanları tercih edin
- Fiyat karşılaştırması yapın ve piyasa analizi kullanın
- Profesyonel ekspertiz ve tapu kontrolü yaptırın

## Sonuç
${title} hakkında daha fazla bilgi için platformumuzdaki güncel ilanları inceleyebilir veya AI asistanımızdan 7/24 destek alabilirsiniz.

Meta description: ${title} rehberi — emlak alım-satım ve kiralama ipuçları, güncel piyasa bilgileri ve uzman tavsiyeleri.`;

  return {
    title,
    slug: slugify(title),
    excerpt: `${title} — emlak sektöründe bilmeniz gerekenler ve pratik öneriler.`,
    content,
    metaDescription: extractMeta(content),
    keywords,
  };
}

export async function generateBlogPost(input: BlogGenerateInput): Promise<GeneratedBlog> {
  const kw = input.keywords?.length ? input.keywords.join(', ') : 'emlak, konut, yatırım';
  const prompt = `Konu: ${input.topic}
Anahtar kelimeler: ${kw}
Dil: ${input.locale === 'en' ? 'English' : input.locale === 'de' ? 'Deutsch' : input.locale === 'ru' ? 'Русский' : 'Türkçe'}`;

  const content = await completeChat(
    [
      { role: 'system', content: BLOG_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.8, maxTokens: 2048 },
  );

  if (!content || content.length < 100) {
    return fallbackBlog(input);
  }

  const title = extractTitle(content, input.topic);
  return {
    title,
    slug: slugify(title),
    excerpt: content.replace(/[#*`]/g, '').replace(/\n+/g, ' ').trim().slice(0, 200) + '...',
    content,
    metaDescription: extractMeta(content),
    keywords: input.keywords ?? ['emlak', 'konut'],
  };
}
