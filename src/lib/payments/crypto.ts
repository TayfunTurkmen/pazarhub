import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

export function hmacBase64(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64');
}

export function merchantOid(): string {
  return `SKN${Date.now()}${randomBytes(3).toString('hex')}`.slice(0, 64);
}

export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function originFromRequest(request: Request): string {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || new URL(request.url).origin;
}
