import { db } from '@/services/database';
import { requireAuth } from '@/lib/api-auth';
import { jsonOk, jsonError, parseBody } from '@/lib/api-response';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';

export async function GET() {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const conversations = await db.messages.getConversationsForUser(authResult.userId);
    return jsonOk(conversations);
}

export async function POST(request: Request) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const limit = await rateLimit('message', getRateLimitIdentifier(request, authResult.userId));
    if (!limit.success) return jsonError('Cok fazla mesaj denemesi.', 429);

    const body = await parseBody<{ listingId: string; body: string }>(request);
    if (!body?.listingId || !body?.body?.trim()) {
        return jsonError('listingId ve mesaj gerekli', 422);
    }

    try {
        const conversation = await db.messages.startConversation(body.listingId, authResult.userId, body.body.trim());
        return jsonOk(conversation, 201);
    } catch (err) {
        if (err instanceof Error && err.message === 'SELF_MESSAGE') {
            return jsonError('Kendi ilaniniza mesaj gonderemezsiniz', 422);
        }
        return jsonError('Mesaj gonderilemedi', 500);
    }
}
