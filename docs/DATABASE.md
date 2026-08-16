# ♾️ Loopin V2 — Veritabanı Mimarisi (DATABASE.md)

**Veritabanı Motoru:** PostgreSQL 16  
**ORM:** Prisma 5.x  
**Karakter Seti:** UTF-8  

---

## 1. Veri Modeli ve Varlıklar (Entities)

### 1.1 `User` (Kullanıcı Çekirdeği)
- `id` (UUID, Primary Key)
- `email` (VarChar, Unique, Indexed)
- `phone` (VarChar, Unique, Nullable)
- `passwordHash` (VarChar, bcrypt/argon2)
- `role` (Enum: `USER`, `MODERATOR`, `ADMIN`, `SUPER_ADMIN`)
- `isVerified` (Boolean, Default: `false`)
- `isPro` (Boolean, Default: `false`)
- `isBanned` (Boolean, Default: `false`)
- `createdAt`, `updatedAt` (Timestamp)

### 1.2 `Profile` (Zengin Profil Bilgileri)
- `id` (UUID, PK)
- `userId` (UUID, FK -> `User.id`, 1-to-1, Cascade)
- `username` (VarChar, Unique, Indexed, `@` olmadan saklanır)
- `name` (VarChar)
- `avatarUrl` (Text, Nullable)
- `bio` (VarChar(500), Nullable)
- `trustScore` (Integer, Default: 95, Indexed)
- `badgeTitle` (VarChar, Default: "Süper Organizatör")

### 1.3 `Event` (Etkinlikler)
- `id` (UUID, PK)
- `hostId` (UUID, FK -> `User.id`, Indexed)
- `title` (VarChar)
- `category` (VarChar, Indexed)
- `dateText` (VarChar, Okunabilir format: "24 Temmuz Cuma, 21:00")
- `eventDate` (Timestamp, Filtreleme ve sıralama için)
- `location` (VarChar, Mekan / Konum)
- `maxCapacity` (Integer)
- `currentCapacity` (Integer, Default: 0)
- `isFull` (Boolean, Default: false)
- `priceType` (VarChar, "Ücretsiz" / "Herkes Kendi Öder" / "Organizatör Öder")
- `imageUrl` (Text, R2 / CDN linki)
- `description` (Text)
- `isCancelled` (Boolean, Default: false)

### 1.4 `EventParticipant` (Etkinlik Katılımcıları)
- `id` (UUID, PK)
- `eventId` (UUID, FK -> `Event.id`, Compound Unique `[eventId, userId]`)
- `userId` (UUID, FK -> `User.id`)
- `joinedAt` (Timestamp)

### 1.5 `Reel` (Dikey Görsel/Video Paylaşımları)
- `id` (UUID, PK)
- `userId` (UUID, FK -> `User.id`, Indexed)
- `caption` (VarChar(1000))
- `mediaUrl` (Text)
- `mediaType` (Enum: `IMAGE`, `VIDEO`)
- `createdAt` (Timestamp)

### 1.6 `Conversation` & `Message` (Mesajlaşma)
- `Conversation`: `id`, `isGroup`, `title`, `updatedAt`
- `ConversationParticipant`: `conversationId`, `userId`, `lastReadAt`, `unreadCount`
- `Message`: `id`, `conversationId`, `senderId`, `text`, `isRead`, `createdAt`

### 1.7 `CreditWallet` & `CreditTransaction` (Kredi Sistemi)
- `CreditWallet`: `id`, `userId` (Unique), `balance` (Integer, Default: 10)
- `CreditTransaction`: `id`, `walletId`, `amount` (Integer), `balanceAfter` (Integer), `type` (Enum), `referenceId`, `description`, `createdAt`

---

## 2. İndeksleme ve Performans Stratejisi
- `User(email)`: B-Tree Index (Giriş performansı için)
- `Profile(username)`: B-Tree Index (Profil URL sorguları için)
- `Event(hostId, eventDate, category)`: Çoklu ve tekil indeksler (Feed ve filtreleme için)
- `Message(conversationId, createdAt)`: Mesajlaşma geçmişini geriye doğru hızlı çekebilmek için compound index.
- `EventParticipant(eventId, userId)`: Hızlı katılım durumu doğrulaması.
