import { z } from 'zod';

const email = z.string().email().max(254).transform((v) => v.toLowerCase().trim());
const password = z.string().min(8).max(128);
const shortText = z.string().trim().min(1).max(120);
const mediumText = z.string().trim().min(1).max(500);
const longText = z.string().trim().max(5000);

export const registerSchema = z.object({
  type: z.enum(['individual', 'corporate']),
  email,
  name: shortText,
  password,
  phone: z.string().trim().max(20).optional(),
  storeName: z.string().trim().max(120).optional(),
}).refine(
  (data) => data.type !== 'corporate' || Boolean(data.storeName?.trim()),
  { message: 'Kurumsal hesaplar icin magaza adi gerekli', path: ['storeName'] },
);

export const createListingSchema = z.object({
  title: mediumText,
  description: longText.optional().default(''),
  price: z.coerce.number().positive().max(999_999_999_999),
  categoryId: z.string().min(1).max(64),
  city: shortText,
  district: z.string().trim().max(120).optional().default(''),
  neighborhood: z.string().trim().max(120).optional(),
  roomCount: z.string().trim().max(20).optional(),
  netArea: z.coerce.number().int().positive().max(100_000).optional(),
  floor: z.coerce.number().int().min(-5).max(200).optional(),
  heating: z.string().trim().max(60).optional(),
  images: z.array(z.string().url().max(2048)).max(20).optional(),
});

export const favoriteSchema = z.object({
  listingId: z.string().min(1).max(64),
});

export const messageSchema = z.object({
  listingId: z.string().min(1).max(64),
  body: z.string().trim().min(1).max(2000),
});
