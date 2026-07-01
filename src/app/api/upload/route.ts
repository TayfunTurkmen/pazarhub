import { requireAuth } from '@/lib/api-auth';
import { jsonError, jsonOk } from '@/lib/api-response';
import { uploadImage } from '@/lib/storage';
import { getRateLimitIdentifier, rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;

    const limit = await rateLimit('upload', getRateLimitIdentifier(request, authResult.userId));
    if (!limit.success) return jsonError('Cok fazla yukleme denemesi.', 429);

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
        return jsonError('Dosya gerekli', 422);
    }

    try {
        const url = await uploadImage(file);
        return jsonOk({ url }, 201);
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === 'INVALID_FILE_TYPE') return jsonError('Gecersiz dosya tipi', 422);
            if (err.message === 'FILE_TOO_LARGE') return jsonError('Dosya cok buyuk (max 5MB)', 422);
        }
        return jsonError('Yukleme basarisiz', 500);
    }
}
