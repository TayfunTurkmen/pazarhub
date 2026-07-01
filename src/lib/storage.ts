import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function uploadImage(file: File): Promise<string> {
    if (!ALLOWED_TYPES.has(file.type)) {
        throw new Error('INVALID_FILE_TYPE');
    }
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('FILE_TOO_LARGE');
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`listings/${Date.now()}-${file.name}`, file, { access: 'public' });
        return blob.url;
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    await writeFile(path.join(uploadsDir, filename), bytes);
    return `/uploads/${filename}`;
}
