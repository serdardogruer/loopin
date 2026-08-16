// Roles & Auth
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  phone?: string | null;
  username: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  isVerified: boolean;
  isPro: boolean;
  role: UserRole;
  trustScore: number;
  badgeTitle?: string | null;
  creditBalance?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Events
export type EventCategory =
  | 'Müzik & Konser'
  | 'Kahve & Yemek'
  | 'Doğa & Spor'
  | 'Sinema & Kültür'
  | 'Teknoloji & Hobi'
  | 'Gece Hayatı & Parti'
  | 'Gönüllülük & Topluluk'
  | 'Diğer';

export type EventPriceType =
  | 'Ücretsiz'
  | 'Herkes Kendi Öder'
  | 'Etkinlik Sahibi İkram Eder';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface EventAttendee {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  joinedAt: string | Date;
}

export interface EventComment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  text: string;
  createdAt: string | Date;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  rawDate?: string | Date;
  location: string;
  maxCapacity: number;
  currentCapacity: number;
  isFull: boolean;
  price: EventPriceType;
  imageUrl: string;
  description: string;
  hostId: string;
  hostName: string;
  hostUsername: string;
  hostAvatar?: string | null;
  hostTrustScore: string;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isJoined?: boolean;
  applicationStatus?: ApplicationStatus;
  attendees: EventAttendee[];
  comments: EventComment[];
  createdAt: string | Date;
}

// Reels
export interface ReelComment {
  id: string;
  reelId: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  text: string;
  createdAt: string | Date;
}

export interface ReelItem {
  id: string;
  publisherId: string;
  publisherName: string;
  publisherUsername: string;
  publisherAvatar?: string | null;
  caption: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isFollowingPublisher?: boolean;
  isSelf?: boolean;
  createdAt: string | Date;
}

// Messaging & Conversations
export type MessageSenderType = 'sent' | 'received';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string | null;
  text: string;
  senderType: MessageSenderType;
  createdAt: string;
  isRead: boolean;
}

export interface ConversationItem {
  id: string;
  participantId: string;
  participantName: string;
  participantUsername: string;
  participantAvatar?: string | null;
  isOnline: boolean;
  lastActiveText: string;
  unreadCount: number;
  lastMessage?: {
    text: string;
    time: string;
    isUnread: boolean;
  } | null;
  messages: ChatMessage[];
}

// Credits & Economy
export type CreditTransactionType =
  | 'INITIAL_GRANT'
  | 'EVENT_CREATE'
  | 'PARTICIPANT_APPROVE'
  | 'PACKAGE_PURCHASE'
  | 'REFERRAL_BONUS'
  | 'ADMIN_ADJUSTMENT';

export interface CreditWallet {
  id: string;
  userId: string;
  balance: number;
  updatedAt: string | Date;
}

export interface CreditTransaction {
  id: string;
  walletId: string;
  amount: number; // e.g. -5, +50
  balanceAfter: number;
  type: CreditTransactionType;
  referenceId?: string | null;
  description: string;
  createdAt: string | Date;
}

export interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  maxApprovedParticipantsPerEvent: number; // -1 for unlimited
  description: string;
  popularBadge?: string;
}

// API General Response Format
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNextPage?: boolean;
  };
}
