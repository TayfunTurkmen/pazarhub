import { db } from '@/services/database';
import { requireAuth } from '@/lib/api-auth';
import { jsonOk, jsonError, parseBody } from '@/lib/api-response';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const { id } = await params;
    const messages = await db.messages.getMessages(id, authResult.userId);
    return jsonOk(messages);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const limit = await rateLimit('message', getRateLimitIdentifier(request, authResult.userId));
    if (!limit.success) return jsonError('Cok fazla mesaj denemesi.', 429);

    const { id } = await params;
    const body = await parseBody<{ body: string }>(request);
    if (!body?.body?.trim()) return jsonError('Mesaj gerekli', 422);

    try {
        const message = await db.messages.sendMessage(id, authResult.userId, body.body.trim());
        return jsonOk(message, 201);
    } catch {
        return jsonError('Mesaj gonderilemedi', 403);
    }
}
