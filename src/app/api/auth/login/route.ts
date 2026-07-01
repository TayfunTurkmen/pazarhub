import { signIn } from '@/auth';
import { jsonOk, jsonError, parseBody } from '@/lib/api-response';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const body = await parseBody<{ email: string; password: string }>(request);
    if (!body?.email || !body?.password) {
        return jsonError('E-posta ve sifre gerekli', 422);
    }

    const limit = await rateLimit('auth', getRateLimitIdentifier(request, body.email.toLowerCase()));
    if (!limit.success) return jsonError('Cok fazla giris denemesi. Lutfen bekleyin.', 429);

    const result = await signIn('credentials', {
        email: body.email.toLowerCase(),
        password: body.password,
        redirect: false,
    });

    if (!result || result.error) {
        return jsonError('Gecersiz kimlik bilgileri', 401);
    }

    return jsonOk({ ok: true });
}
