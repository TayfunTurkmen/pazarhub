import { db } from '@/services/database';
import { jsonOk, jsonError, jsonRateLimited } from '@/lib/api-response';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { registerSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';

export const POST = withApiHandler(async (request: Request) => {
    const parsed = await parseValidatedBody(request, registerSchema);
    if ('error' in parsed) return parsed.error;
    const body = parsed.data;

    const limit = await rateLimit('auth', getRateLimitIdentifier(request, body.email));
    if (!limit.success) return jsonRateLimited(limit.retryAfter);

    try {
        const user = await db.users.register(body);
        return jsonOk(user, 201);
    } catch (err) {
        if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
            return jsonError('Bu e-posta adresi zaten kayitli', 409);
        }
        logger.error('Registration failed', { email: body.email, error: String(err) });
        return jsonError('Kayit islemi basarisiz', 500);
    }
}, 'POST /api/auth/register');
