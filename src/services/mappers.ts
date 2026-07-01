import {
  User as PrismaUser,
  Category as PrismaCategory,
  Listing as PrismaListing,
  ListingImage,
  Message as PrismaMessage,
  Conversation as PrismaConversation,
} from '@/generated/prisma/client';
import { Conversation, Listing, Message, User, Category } from '@/types';

type ListingWithRelations = PrismaListing & {
  category: PrismaCategory;
  seller: PrismaUser;
  images: ListingImage[];
};

type ConversationWithRelations = PrismaConversation & {
  listing: ListingWithRelations;
  messages: (PrismaMessage & { sender: PrismaUser })[];
  participants: { user: PrismaUser }[];
};

export function mapUser(user: PrismaUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.image ?? undefined,
    phone: user.phone ?? undefined,
    type: user.type === 'CORPORATE' ? 'corporate' : 'individual',
    role: user.role === 'ADMIN' ? 'admin' : 'user',
    storeName: user.storeName ?? undefined,
    verified: user.verified,
    status: user.status.toLowerCase() as User['status'],
    joinedAt: user.createdAt.toISOString(),
  };
}

export function mapCategory(category: PrismaCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parentId ?? undefined,
    icon: category.icon ?? undefined,
  };
}

export function mapListing(listing: ListingWithRelations): Listing {
  const attributes = (listing.attributes ?? {}) as Record<string, string | number | boolean>;
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: Number(listing.price),
    currency: listing.currency as Listing['currency'],
    category: mapCategory(listing.category),
    location: {
      city: listing.city,
      district: listing.district,
      neighborhood: listing.neighborhood ?? undefined,
      street: listing.street ?? undefined,
      lat: listing.lat ?? undefined,
      lng: listing.lng ?? undefined,
    },
    images: listing.images.length
      ? listing.images.sort((a, b) => a.order - b.order).map((img) => img.url)
      : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop'],
    attributes,
    seller: mapUser(listing.seller),
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
    status: listing.status.toLowerCase() as Listing['status'],
    featured: listing.featured,
    listingType: listing.listingType ? (listing.listingType.toLowerCase() as Listing['listingType']) : undefined,
    tier: listing.tier.toLowerCase() as Listing['tier'],
    roomCount: listing.roomCount ?? undefined,
    netArea: listing.netArea ?? undefined,
    floor: listing.floor ?? undefined,
    heating: listing.heating ?? undefined,
  };
}

export function mapMessage(message: PrismaMessage & { sender: PrismaUser }): Message {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    senderName: message.sender.name,
    body: message.body,
    readAt: message.readAt?.toISOString(),
    createdAt: message.createdAt.toISOString(),
  };
}

export function mapConversation(conversation: ConversationWithRelations, currentUserId: string): Conversation {
  const otherParticipant = conversation.participants.find((p) => p.user.id !== currentUserId)?.user
    ?? conversation.participants[0]?.user;
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return {
    id: conversation.id,
    listingId: conversation.listingId,
    listingTitle: conversation.listing.title,
    otherUserName: otherParticipant?.name ?? 'Kullanici',
    lastMessage: lastMessage?.body,
    lastMessageAt: lastMessage?.createdAt.toISOString(),
    unread: conversation.messages.some((m) => m.senderId !== currentUserId && !m.readAt),
  };
}

export const listingInclude = {
  category: true,
  seller: true,
  images: { orderBy: { order: 'asc' as const } },
} as const;
