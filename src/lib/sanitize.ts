/** Max length for free-text search inputs */
export const SEARCH_MAX_LENGTH = 120;

/** Strip control chars and trim; cap length for URL/query safety */
export function sanitizeSearchInput(value: string): string {
  return value
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
    .slice(0, SEARCH_MAX_LENGTH);
}

/** Basic email validation for newsletter (client-side UX only) */
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/** Only allow http(s) URLs for external links loaded from storage */
export function isSafeExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

const ALLOWED_IMAGE_HOSTS = new Set([
  'images.unsplash.com',
  'i.pravatar.cc',
]);

/** Validate listing image URLs — allow configured CDNs and blob storage */
export function isAllowedImageUrl(url: string): boolean {
  if (!isSafeExternalUrl(url)) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (ALLOWED_IMAGE_HOSTS.has(parsed.hostname)) return true;
    if (parsed.hostname.endsWith('.blob.vercel-storage.com')) return true;
    if (parsed.hostname.endsWith('.public.blob.vercel-storage.com')) return true;
    return false;
  } catch {
    return false;
  }
}

export function filterAllowedImageUrls(urls: string[]): string[] {
  return urls.filter(isAllowedImageUrl).slice(0, 20);
}

/** Strip dangerous HTML before rendering CMS content */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
}

export function sanitizeText(value: string, maxLength = 5000): string {
  return value.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLength);
}
