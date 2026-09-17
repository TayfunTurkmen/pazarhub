import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { CATEGORIES, LISTINGS, USERS } from '../src/services/mockDb';

const PASSWORDS: Record<string, string> = {
    'demo@example.com': 'demo',
    'corporate@example.com': 'corporate',
    'galeri@example.com': 'galeri123',
    'zeynep@example.com': 'zeynep123',
    'admin@example.com': 'admin',
};

async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required for seeding');
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

    console.log('Seeding database...');

    // Drop obsolete category rows (e.g. old sifir-bilgisayar under bilgisayar)
    const keepIds = CATEGORIES.map((c) => c.id);
    const obsolete = await prisma.category.findMany({
        where: { id: { notIn: keepIds } },
        select: { id: true },
    });
    if (obsolete.length) {
        const obsoleteIds = obsolete.map((c) => c.id);
        await prisma.listing.updateMany({
            where: { categoryId: { in: obsoleteIds } },
            data: { categoryId: '3' },
        });
        await prisma.category.deleteMany({ where: { id: { in: obsoleteIds } } });
    }

    // Clear slug collisions before upserting renamed/moved categories
    for (const category of CATEGORIES) {
        await prisma.category.updateMany({
            where: { slug: category.slug, NOT: { id: category.id } },
            data: { slug: `${category.slug}-legacy-${Date.now()}` },
        });
    }

    for (const category of CATEGORIES) {
        await prisma.category.upsert({
            where: { id: category.id },
            update: {
                name: category.name,
                slug: category.slug,
                parentId: category.parentId ?? null,
                icon: category.icon ?? null,
            },
            create: {
                id: category.id,
                name: category.name,
                slug: category.slug,
                parentId: category.parentId ?? null,
                icon: category.icon ?? null,
            },
        });
    }

    for (const user of USERS) {
        const password = PASSWORDS[user.email.toLowerCase()] ?? 'demo1234';
        const passwordHash = await bcrypt.hash(password, 12);
        await prisma.user.upsert({
            where: { id: user.id },
            update: {
                name: user.name,
                email: user.email.toLowerCase(),
                phone: user.phone ?? null,
                type: user.type === 'corporate' ? 'CORPORATE' : 'INDIVIDUAL',
                role: user.role === 'admin' ? 'ADMIN' : 'USER',
                storeName: user.storeName ?? null,
                verified: user.verified ?? false,
                status: 'ACTIVE',
                image: user.avatar ?? null,
                passwordHash,
            },
            create: {
                id: user.id,
                name: user.name,
                email: user.email.toLowerCase(),
                phone: user.phone ?? null,
                type: user.type === 'corporate' ? 'CORPORATE' : 'INDIVIDUAL',
                role: user.role === 'admin' ? 'ADMIN' : 'USER',
                storeName: user.storeName ?? null,
                verified: user.verified ?? false,
                status: 'ACTIVE',
                image: user.avatar ?? null,
                passwordHash,
            },
        });
    }

    for (const listing of LISTINGS) {
        const existing = await prisma.listing.findUnique({ where: { id: listing.id } });
        if (existing) {
            await prisma.listing.update({
                where: { id: listing.id },
                data: {
                    title: listing.title,
                    description: listing.description,
                    price: listing.price,
                    currency: listing.currency,
                    status: listing.status.toUpperCase() as 'ACTIVE' | 'PASSIVE' | 'SOLD',
                    featured: listing.featured,
                    tier: (listing.tier ?? 'standard').toUpperCase() as 'STANDARD' | 'PREMIUM' | 'SHOWCASE',
                    listingType: listing.listingType?.toUpperCase() as 'SALE' | 'RENT' | undefined,
                    roomCount: listing.roomCount ?? null,
                    netArea: listing.netArea ?? null,
                    floor: listing.floor ?? null,
                    heating: listing.heating ?? null,
                    city: listing.location.city,
                    district: listing.location.district,
                    neighborhood: listing.location.neighborhood ?? null,
                    street: listing.location.street ?? null,
                    lat: listing.location.lat ?? null,
                    lng: listing.location.lng ?? null,
                    attributes: listing.attributes,
                    categoryId: listing.category.id,
                    sellerId: listing.seller.id,
                },
            });
            continue;
        }

        await prisma.listing.create({
            data: {
                id: listing.id,
                title: listing.title,
                description: listing.description,
                price: listing.price,
                currency: listing.currency,
                status: listing.status.toUpperCase() as 'ACTIVE' | 'PASSIVE' | 'SOLD',
                featured: listing.featured,
                tier: (listing.tier ?? 'standard').toUpperCase() as 'STANDARD' | 'PREMIUM' | 'SHOWCASE',
                listingType: listing.listingType?.toUpperCase() as 'SALE' | 'RENT' | undefined,
                roomCount: listing.roomCount ?? null,
                netArea: listing.netArea ?? null,
                floor: listing.floor ?? null,
                heating: listing.heating ?? null,
                city: listing.location.city,
                district: listing.location.district,
                neighborhood: listing.location.neighborhood ?? null,
                street: listing.location.street ?? null,
                lat: listing.location.lat ?? null,
                lng: listing.location.lng ?? null,
                attributes: listing.attributes,
                categoryId: listing.category.id,
                sellerId: listing.seller.id,
                images: {
                    create: listing.images.map((url, order) => ({ url, order })),
                },
            },
        });
    }

    const authDefaults: [string, string][] = [
        ['auth.smsVerificationEnabled', 'false'],
        ['auth.googleAuthEnabled', 'true'],
        ['auth.facebookAuthEnabled', 'true'],
    ];
    for (const [key, value] of authDefaults) {
        await prisma.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    console.log(`Seeded ${CATEGORIES.length} categories, ${USERS.length} users, ${LISTINGS.length} listings.`);
    await prisma.$disconnect();
    await pool.end();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
