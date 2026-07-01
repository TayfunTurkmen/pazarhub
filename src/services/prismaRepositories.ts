import 'server-only';

import bcrypt from 'bcryptjs';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import {
  FilterState,
  Listing,
  PaginatedResult,
  RegisterInput,
  User,
  Conversation,
  Message,
} from '@/types';
import {
  ICategoryRepository,
  IDatabase,
  IFavoriteRepository,
  IListingRepository,
  IMessageRepository,
  IUserRepository,
} from './repository';
import { listingInclude, mapCategory, mapConversation, mapListing, mapMessage, mapUser } from './mappers';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/lib/constants';

function buildListingWhere(filter?: FilterState): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {};

  if (filter?.adminAll) {
    if (filter.status) {
      where.status = filter.status.toUpperCase() as Prisma.EnumListingStatusFilter['equals'];
    }
  } else {
    where.status = 'ACTIVE';
  }

  if (!filter) return where;

  if (filter.minPrice) where.price = { ...(where.price as object), gte: filter.minPrice };
  if (filter.maxPrice) where.price = { ...(where.price as object), lte: filter.maxPrice };
  if (filter.city) {
    where.OR = [
      { city: { contains: filter.city, mode: 'insensitive' } },
      { district: { contains: filter.city, mode: 'insensitive' } },
    ];
  }
  if (filter.district) where.district = { contains: filter.district, mode: 'insensitive' };
  if (filter.neighborhood) where.neighborhood = { contains: filter.neighborhood, mode: 'insensitive' };
  if (filter.query) {
    where.OR = [
      { title: { contains: filter.query, mode: 'insensitive' } },
      { description: { contains: filter.query, mode: 'insensitive' } },
      { seller: { name: { contains: filter.query, mode: 'insensitive' } } },
    ];
  }
  if (filter.listingId) where.id = filter.listingId;
  if (filter.sellerName) {
    where.seller = {
      OR: [
        { name: { contains: filter.sellerName, mode: 'insensitive' } },
        { storeName: { contains: filter.sellerName, mode: 'insensitive' } },
      ],
    };
  }
  if (filter.category) where.categoryId = filter.category;
  if (filter.listingType) where.listingType = filter.listingType.toUpperCase() as 'SALE' | 'RENT';
  if (filter.roomCount?.length) where.roomCount = { in: filter.roomCount };
  if (filter.minArea) where.netArea = { ...(where.netArea as object), gte: filter.minArea };
  if (filter.maxArea) where.netArea = { ...(where.netArea as object), lte: filter.maxArea };
  if (filter.heating) where.heating = { contains: filter.heating, mode: 'insensitive' };

  return where;
}

function buildListingOrder(filter?: FilterState): Prisma.ListingOrderByWithRelationInput {
  if (filter?.sort === 'price_asc') return { price: 'asc' };
  if (filter?.sort === 'price_desc') return { price: 'desc' };
  return { createdAt: 'desc' };
}

class PrismaListingRepository implements IListingRepository {
  async getAll(filter?: FilterState): Promise<Listing[]> {
    const rows = await prisma.listing.findMany({
      where: buildListingWhere(filter),
      include: listingInclude,
      orderBy: buildListingOrder(filter),
    });
    return rows.map(mapListing);
  }

  async getPaginated(filter?: FilterState): Promise<PaginatedResult<Listing>> {
    const page = Math.max(1, filter?.page ?? 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, filter?.limit ?? DEFAULT_PAGE_SIZE));
    const where = buildListingWhere(filter);

    const [total, rows] = await Promise.all([
      prisma.listing.count({ where }),
      prisma.listing.findMany({
        where,
        include: listingInclude,
        orderBy: buildListingOrder(filter),
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { items: rows.map(mapListing), total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  }

  async getFeatured(): Promise<Listing[]> {
    const rows = await prisma.listing.findMany({ where: { featured: true, status: 'ACTIVE' }, include: listingInclude, take: 12 });
    return rows.map(mapListing);
  }

  async getById(id: string): Promise<Listing | null> {
    const row = await prisma.listing.findUnique({ where: { id }, include: listingInclude });
    return row ? mapListing(row) : null;
  }

  async getByUserId(userId: string): Promise<Listing[]> {
    const rows = await prisma.listing.findMany({ where: { sellerId: userId }, include: listingInclude, orderBy: { createdAt: 'desc' } });
    return rows.map(mapListing);
  }

  async create(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
    const row = await prisma.listing.create({
      data: {
        title: listing.title,
        description: listing.description,
        price: listing.price,
        currency: listing.currency,
        status: listing.status.toUpperCase() as 'ACTIVE' | 'PASSIVE' | 'SOLD' | 'PENDING' | 'REJECTED',
        featured: listing.featured,
        tier: (listing.tier ?? 'standard').toUpperCase() as 'STANDARD' | 'PREMIUM' | 'SHOWCASE',
        listingType: listing.listingType?.toUpperCase() as 'SALE' | 'RENT' | undefined,
        roomCount: listing.roomCount,
        netArea: listing.netArea,
        floor: listing.floor,
        heating: listing.heating,
        city: listing.location.city,
        district: listing.location.district,
        neighborhood: listing.location.neighborhood,
        street: listing.location.street,
        lat: listing.location.lat,
        lng: listing.location.lng,
        attributes: listing.attributes,
        categoryId: listing.category.id,
        sellerId: listing.seller.id,
        images: {
          create: listing.images.map((url, order) => ({ url, order })),
        },
      },
      include: listingInclude,
    });
    return mapListing(row);
  }

  async update(id: string, data: Partial<Listing>): Promise<Listing | null> {
    const row = await prisma.listing.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        status: data.status?.toUpperCase() as 'ACTIVE' | 'PASSIVE' | 'SOLD' | 'PENDING' | 'REJECTED' | undefined,
        featured: data.featured,
      },
      include: listingInclude,
    }).catch(() => null);
    return row ? mapListing(row) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.listing.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async count(filter?: FilterState): Promise<number> {
    return prisma.listing.count({ where: buildListingWhere(filter) });
  }
}

class PrismaUserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    const rows = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map(mapUser);
  }

  async getById(id: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? mapUser(row) : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    return row ? mapUser(row) : null;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const row = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email.toLowerCase(),
        phone: user.phone,
        type: user.type === 'corporate' ? 'CORPORATE' : 'INDIVIDUAL',
        role: user.role === 'admin' ? 'ADMIN' : 'USER',
        storeName: user.storeName,
        verified: user.verified ?? false,
        status: (user.status ?? 'active').toUpperCase() as 'ACTIVE' | 'BANNED' | 'PENDING',
        image: user.avatar,
      },
    });
    return mapUser(row);
  }

  async register(input: RegisterInput): Promise<User> {
    const existing = await this.getByEmail(input.email);
    if (existing) throw new Error('EMAIL_EXISTS');

    const passwordHash = await bcrypt.hash(input.password, 12);
    const row = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        storeName: input.storeName,
        type: input.type === 'corporate' ? 'CORPORATE' : 'INDIVIDUAL',
        passwordHash,
        status: 'PENDING',
        verified: false,
      },
    });
    return mapUser(row);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const row = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        status: data.status?.toUpperCase() as 'ACTIVE' | 'BANNED' | 'PENDING' | undefined,
        verified: data.verified,
        storeName: data.storeName,
      },
    }).catch(() => null);
    return row ? mapUser(row) : null;
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!row?.passwordHash || row.status === 'BANNED') return null;
    const valid = await bcrypt.compare(password, row.passwordHash);
    return valid ? mapUser(row) : null;
  }

  async getListingCount(userId: string): Promise<number> {
    return prisma.listing.count({ where: { sellerId: userId } });
  }
}

class PrismaCategoryRepository implements ICategoryRepository {
  async getAll() {
    const rows = await prisma.category.findMany();
    return rows.map(mapCategory);
  }
  async getById(id: string) {
    const row = await prisma.category.findUnique({ where: { id } });
    return row ? mapCategory(row) : null;
  }
  async getBySlug(slug: string) {
    const row = await prisma.category.findUnique({ where: { slug } });
    return row ? mapCategory(row) : null;
  }
  async getChildren(parentId: string) {
    const rows = await prisma.category.findMany({ where: { parentId } });
    return rows.map(mapCategory);
  }
  async getRoots() {
    const rows = await prisma.category.findMany({ where: { parentId: null } });
    return rows.map(mapCategory);
  }
}

class PrismaFavoriteRepository implements IFavoriteRepository {
  async getByUserId(userId: string): Promise<Listing[]> {
    const rows = await prisma.favorite.findMany({
      where: { userId },
      include: { listing: { include: listingInclude } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((f) => mapListing(f.listing));
  }

  async isFavorite(userId: string, listingId: string): Promise<boolean> {
    const row = await prisma.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });
    return Boolean(row);
  }

  async add(userId: string, listingId: string): Promise<void> {
    await prisma.favorite.upsert({
      where: { userId_listingId: { userId, listingId } },
      create: { userId, listingId },
      update: {},
    });
  }

  async remove(userId: string, listingId: string): Promise<void> {
    await prisma.favorite.deleteMany({ where: { userId, listingId } });
  }
}

class PrismaMessageRepository implements IMessageRepository {
  async getConversationsForUser(userId: string): Promise<Conversation[]> {
    const rows = await prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      include: {
        listing: { include: listingInclude },
        participants: { include: { user: true } },
        messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((c) => mapConversation(c, userId));
  }

  async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    const participant = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId } });
    if (!participant) return [];

    await prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });

    const rows = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(mapMessage);
  }

  async sendMessage(conversationId: string, senderId: string, body: string): Promise<Message> {
    const participant = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId: senderId } });
    if (!participant) throw new Error('FORBIDDEN');

    const row = await prisma.message.create({
      data: { conversationId, senderId, body },
      include: { sender: true },
    });
    await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
    return mapMessage(row);
  }

  async startConversation(listingId: string, buyerId: string, body: string): Promise<Conversation> {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new Error('LISTING_NOT_FOUND');
    if (listing.sellerId === buyerId) throw new Error('SELF_MESSAGE');

    const existing = await prisma.conversation.findFirst({
      where: {
        listingId,
        AND: [
          { participants: { some: { userId: buyerId } } },
          { participants: { some: { userId: listing.sellerId } } },
        ],
      },
      include: {
        listing: { include: listingInclude },
        participants: { include: { user: true } },
        messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } },
      },
    });

    if (existing) {
      await this.sendMessage(existing.id, buyerId, body);
      return mapConversation(existing, buyerId);
    }

    const conversation = await prisma.conversation.create({
      data: {
        listingId,
        participants: {
          create: [{ userId: buyerId }, { userId: listing.sellerId }],
        },
        messages: {
          create: { senderId: buyerId, body },
        },
      },
      include: {
        listing: { include: listingInclude },
        participants: { include: { user: true } },
        messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } },
      },
    });

    return mapConversation(conversation, buyerId);
  }
}

export function createPrismaDb(): IDatabase {
  const listings = new PrismaListingRepository();
  return {
    listings,
    users: new PrismaUserRepository(),
    categories: new PrismaCategoryRepository(),
    favorites: new PrismaFavoriteRepository(),
    messages: new PrismaMessageRepository(),
  };
}
