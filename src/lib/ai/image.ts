import { completeChat } from './client';
import { IMAGE_OPTIMIZE_PROMPT } from './prompts';

export interface ImageOptimizeInput {
  fileName: string;
  fileSize: number;
  mimeType: string;
  listingTitle?: string;
}

export interface ImageOptimizationResult {
  score: number;
  issues: string[];
  suggestions: string[];
  altText: string;
  caption: string;
}

function heuristicOptimize(input: ImageOptimizeInput): ImageOptimizationResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 75;

  if (input.fileSize > 3 * 1024 * 1024) {
    score -= 20;
    issues.push('Dosya boyutu 3 MB üzerinde');
    suggestions.push('Görseli sıkıştırarak 1-2 MB altına indirin');
  }

  if (!/^image\/(jpeg|jpg|png|webp)$/i.test(input.mimeType)) {
    score -= 15;
    issues.push('Web için ideal olmayan format');
    suggestions.push('JPEG veya WebP formatına dönüştürün');
  }

  if (input.fileName.length < 5 || /^(img|image|photo|dsc)/i.test(input.fileName)) {
    score -= 5;
    suggestions.push('Dosya adını anlamlı yapın (örn: salon-gunesli-daire.jpg)');
  }

  suggestions.push('Doğal ışıkta, geniş açı çekilmiş fotoğraflar tercih edin');
  suggestions.push('Odaları dağınık olmadan, dikey çizgiler düz çekin');

  const title = input.listingTitle ?? 'Emlak ilanı';
  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    suggestions: suggestions.slice(0, 4),
    altText: `${title} — emlak fotoğrafı`,
    caption: `${title} için profesyonel emlak görseli`,
  };
}

export async function optimizeImageMeta(input: ImageOptimizeInput): Promise<ImageOptimizationResult> {
  try {
    const raw = await completeChat(
      [
        { role: 'system', content: IMAGE_OPTIMIZE_PROMPT },
        {
          role: 'user',
          content: JSON.stringify({
            fileName: input.fileName,
            fileSizeKb: Math.round(input.fileSize / 1024),
            mimeType: input.mimeType,
            listingTitle: input.listingTitle,
          }),
        },
      ],
      { temperature: 0.4, maxTokens: 512 },
    );

    const parsed = JSON.parse(raw) as ImageOptimizationResult;
    if (typeof parsed.score === 'number') {
      return {
        score: Math.min(100, Math.max(0, parsed.score)),
        issues: parsed.issues ?? [],
        suggestions: parsed.suggestions ?? [],
        altText: parsed.altText ?? `${input.listingTitle ?? 'İlan'} fotoğrafı`,
        caption: parsed.caption ?? '',
      };
    }
  } catch {
    // fallback
  }

  return heuristicOptimize(input);
}
