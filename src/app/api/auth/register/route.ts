import { db } from '@/services/database';
import { jsonOk, jsonError, parseBody } from '@/lib/api-response';
import { RegisterInput } from '@/types';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const body = await parseBody<RegisterInput>(request);
    if (!body?.email || !body?.password || !body?.name) {
        return jsonError('Ad, e-posta ve sifre gerekli', 422);
    }

    const limit = await rateLimit('auth', getRateLimitIdentifier(request, body.email.toLowerCase()));
    if (!limit.success) return jsonError('Cok fazla kayit denemesi. Lutfen bekleyin.', 429);

    try {
        const user = await db.users.register(body);
        return jsonOk(user, 201);
    } catch (err) {
        if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
            return jsonError('Bu e-posta adresi zaten kayitli', 409);
        }
        return jsonError('Kayit islemi basarisiz', 500);
    }
}
