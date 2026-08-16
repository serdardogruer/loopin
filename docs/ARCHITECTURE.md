# ♾️ Loopin V2 — Sistem Mimarisi ve Yazılım Tasarım Dokümanı (ARCHITECTURE.md)
**Sürüm:** 2.0.0  
**Tarih:** 2026-08-16  
**Hedef Production Domain:** [https://loopin.codapi.site](https://loopin.codapi.site)  
**Mimari Yaklaşım:** Modular Monolith (pnpm Monorepo)

---

## 1. Yönetici Özeti ve Mimari Vizyon

Loopin V2, kullanıcıların ortak ilgi alanları, lokasyon ve gerçek hayat aktiviteleri üzerinden bir araya gelmesini sağlayan sosyal etkinlik platformudur. Temel prensip: **"Önce etkinlik, sonra tanışma"**.

Mevcut prototip (`prototype/index.html`, `style.css`, `app.js`) harika bir UI/UX dili, karanlık mod estetiği ve kullanıcı akışı sunmaktadır. Loopin V2'nin amacı, **bu görsel kimliği ve kullanıcı deneyimini %100 koruyarak**, altyapıyı production-ready, tip güvenli, test edilebilir ve ölçeklenebilir modern bir **Modular Monolith** mimarisine dönüştürmektir.

---

## 2. Sistem Mimarisi ve Teknoloji Yığını

### 2.1 Teknoloji Tercihleri

| Katman | Teknoloji / Kütüphane | Açıklama / Sorumluluk |
|---|---|---|
| **Monorepo Yöneticisi** | `pnpm` (Workspaces) + `Turborepo` | Hızlı paket yönetimi, paylaşımlı paketler, optimize build önbelleği |
| **Web Uygulaması (Kullanıcı)** | `Next.js 14/15` (App Router) + React + TS | Mobile-First SSR/CSR sosyal platform, SEO, PWA desteği |
| **Admin Paneli** | `Next.js` (App Router) + Tailwind + TS | Moderasyon, kullanıcı/etkinlik yönetimi, finansal raporlama |
| **Backend API Server** | `NestJS 10` + TypeScript | Modular Monolith REST API & WebSocket Server |
| **Veritabanı & ORM** | `PostgreSQL 16` + `Prisma ORM` | İlişkisel veri modeli, ACID işlemler, Concurrency kontrolü |
| **Önbellek & Real-time PubSub** | `Redis 7` | Session, rate limiting, Socket.IO adapter, cache |
| **Real-time İletişim** | `Socket.IO` (NestJS Gateway) | Canlı sohbet, anlık bildirimler, online/typing durumları |
| **Medya Depolama** | `Cloudflare R2` / S3 Uyumlu Storage | S3 Client SDK + Presigned Upload URL mimarisi |
| **UI & Tasarım Sistemi** | Vanilla CSS / Tailwind + CSS Variables + Radix | Prototipteki özel karanlık temayı koruyan paylaşımlı UI paketi |
| **İstemci State Yönetimi** | `TanStack Query` (Server) + `Zustand` (UI) | Server state önbellekleme + Lokal/geçici UI state ayrımı |
| **Form & Validasyon** | `React Hook Form` + `Zod` (Client/Server) | Uçtan uca tip güvenli validasyon |
| **Ters Proxy & Yönlendirme** | `Nginx` + `Docker Compose` | SSL, Header güvenliği, path-based routing |

---

## 3. Production Deployment & Domain Topolojisi

Production adresi: **`https://loopin.codapi.site`**

```
                            INTERNET (Client / Browser / PWA)
                                           │
                                           ▼
                                 [ Cloudflare CDN & SSL ]
                                           │
                                           ▼ (HTTPS :443)
                         [ Nginx Reverse Proxy (VPS / Docker) ]
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼ (Path: /)                       ▼ (Path: /api/*)                  ▼ (Path: /socket.io/*)
┌───────────────────┐             ┌───────────────────┐             ┌───────────────────┐
│   apps/web        │             │   backend (NestJS)│             │   backend (NestJS)│
│   (Next.js App)   │             │   REST API        │             │   Socket.IO WSS   │
│   Port: 3000      │             │   Port: 4000      │             │   Port: 4000      │
└───────────────────┘             └─────────┬─────────┘             └─────────┬─────────┘
                                            │                                 │
                                            ├─────────────────┬───────────────┤
                                            ▼                 ▼               ▼
                                    ┌──────────────┐   ┌─────────────┐ ┌─────────────┐
                                    │  PostgreSQL  │   │    Redis    │ │Cloudflare R2│
                                    │  Port: 5432  │   │  Port: 6379 │ │  (S3 API)   │
                                    └──────────────┘   └─────────────┘ └─────────────┘
```

### Nginx Path Yönlendirmeleri
- `https://loopin.codapi.site/` ➡️ `apps/web` (Next.js Kullanıcı Arayüzü)
- `https://loopin.codapi.site/admin` ➡️ `apps/admin` (Admin Paneli)
- `https://loopin.codapi.site/api/v1/*` ➡️ `backend:4000` (NestJS REST API)
- `wss://loopin.codapi.site/socket.io/*` ➡️ `backend:4000` (NestJS WebSocket Gateway)

---

## 4. Monorepo Klasör Yapısı (pnpm Workspace)

```
loopin/
├── apps/
│   ├── web/                     # Next.js 14/15 Mobile-first Web & PWA
│   │   ├── app/
│   │   │   ├── (auth)/login, register, verify
│   │   │   ├── (app)/home, reels, events/[id], create, messages, profile
│   │   │   └── layout.tsx
│   │   ├── components/          # Web'e özgü kompozit bileşenler
│   │   ├── features/            # Feature bazlı kancalar ve servisler
│   │   ├── stores/              # Zustand UI store'ları
│   │   └── public/
│   │
│   └── admin/                   # Next.js Admin Yönetim Paneli
│       ├── app/
│       │   ├── dashboard, users, events, reports, moderation, credits, payments
│       │   └── layout.tsx
│       └── components/
│
├── backend/                     # NestJS Modular Monolith API
│   ├── src/
│   │   ├── core/                # Database (Prisma), Redis, Guards, Interceptors, Config
│   │   ├── modules/
│   │   │   ├── auth/            # JWT, Refresh Token, OTP, Password Hashing
│   │   │   ├── users/           # Kullanıcı profili, arama, takip
│   │   │   ├── events/          # Etkinlik CRUD, filtreleme, feed
│   │   │   ├── applications/   # Etkinliğe katılım başvuruları ve onay mekanizması
│   │   │   ├── reels/           # Reels & Fotoğraf/Video akışı
│   │   │   ├── comments/        # Yorum ve yanıt sistemi (Event & Reel)
│   │   │   ├── likes/           # Beğeni sistemi (Event & Reel)
│   │   │   ├── conversations/   # 1-1 ve Grup sohbet odaları
│   │   │   ├── messages/        # Real-time mesajlaşma (REST + Socket.IO)
│   │   │   ├── notifications/   # Push ve in-app bildirimler
│   │   │   ├── credits/         # Kredi cüzdanı, işlem geçmişi ve bakiye kilidi
│   │   │   ├── payments/        # İyzico / Stripe / Kredi paketi satın alımı
│   │   │   ├── uploads/         # Cloudflare R2 Presigned URL servisi
│   │   │   ├── reports/         # Raporlama ve moderasyon
│   │   │   └── admin/           # Admin metrikleri ve yönetim API'leri
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma        # Bütünleşik PostgreSQL şeması
│   │   └── migrations/
│   └── test/
│
├── packages/
│   ├── ui/                      # Paylaşımlı UI Tasarım Sistemi (Radix + Tailwind/CSS)
│   │   ├── src/
│   │   │   ├── components/      # Button, Modal, Drawer, Avatar, Card, Input, Badge
│   │   │   ├── styles/          # Global tokens, animasyonlar, ambient glow
│   │   │   └── index.ts
│   ├── types/                   # Paylaşımlı DTO & Entity Arayüzleri (Frontend & Backend)
│   ├── validation/              # Paylaşımlı Zod Validasyon Şemaları
│   ├── config/                  # ESLint, Prettier, TypeScript ayarları
│   └── utils/                   # Tarih, metin formatlama, para birimi vb.
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.web
│   │   ├── Dockerfile.admin
│   │   ├── Dockerfile.backend
│   │   └── Dockerfile.nginx
│   ├── nginx/
│   │   └── nginx.conf
│   └── scripts/
│       ├── seed.ts
│       └── deploy.sh
│
├── docs/                        # Proje Dokümantasyonu
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── AUTH.md
│   ├── DEPLOYMENT.md
│   ├── DESIGN_SYSTEM.md
│   ├── SECURITY.md
│   └── DEVELOPMENT.md
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## 5. Veritabanı ve Domain Modelleri

Tüm veri modeli `PostgreSQL 16` üzerinde `Prisma ORM` ile yönetilir.

### 5.1 Temel Varlıklar (Entities)
1. **Auth & Identity**: `User`, `UserCredential`, `RefreshToken`, `Session`, `VerificationCode`
2. **Profile & Social**: `Profile`, `Interest`, `UserInterest`, `Follow`, `Friendship`, `Block`
3. **Events**: `Event`, `EventImage`, `EventTag`, `EventApplication` (Pending, Approved, Rejected, Cancelled), `EventParticipant` (Approved attendees), `EventCheckIn` (QR code)
4. **Reels & Media**: `Reel`, `ReelMedia`
5. **Interactions**: `EventLike`, `EventComment`, `ReelLike`, `ReelComment`, `EventRating`
6. **Messaging**: `Conversation`, `ConversationParticipant`, `Message`, `MessageReadReceipt`
7. **Economy & Credits**: `CreditWallet`, `CreditTransaction`, `CreditPackage`, `Subscription`, `Payment`
8. **Trust & Moderation**: `TrustScoreHistory`, `Report`, `AuditLog`

### 5.2 Kredi Sistemi İş Mantığı (Credit Economy)
* **Kural**: Kredi bakiyesi doğrudan `UPDATE balance = balance - 5` şeklinde serbest bırakılmaz.
* **ACID Transaction**: `prisma.$transaction()` kullanılarak:
  1. `CreditWallet` satırı `SELECT ... FOR UPDATE` ile kilitlenir.
  2. Bakiye kontrolü yapılır (`wallet.balance >= cost`).
  3. `CreditTransaction` kaydı oluşturulur (Tutar: `-5`, Tip: `EVENT_CREATE` veya `PARTICIPANT_APPROVE`, Referans ID).
  4. Cüzdan bakiyesi güncellenir.
* **Ücretler**:
  * Etkinlik Oluşturma: **5 Kredi**
  * Katılımcı Onaylama: **5 Kredi / kişi**
  * Katılım Başvurusu Yapma: **Ücretsiz**

---

## 6. Güvenlik, Kimlik Doğrulama ve Yetkilendirme

1. **Authentication**:
   - Access Token (Kısa ömürlü: 15 dakika, JWT).
   - Refresh Token (Uzun ömürlü: 30 gün, HTTP-Only Cookie veya Güvenli Başlık, Redis'te hashli saklanır).
   - Şifreler: `argon2` veya `bcrypt` (work factor 12) ile hashlenir.
2. **Role-Based Access Control (RBAC)**:
   - Roller: `USER`, `MODERATOR`, `ADMIN`, `SUPER_ADMIN`.
   - NestJS `@Roles()` dekoratörü ve `RolesGuard` ile endpoint bazlı koruma.
3. **Production Güvenlik Önlemleri**:
   - `Helmet` ile HTTP güvenlik başlıkları.
   - `CORS` kuralları (yalnızca `https://loopin.codapi.site` ve yetkili staging domainleri).
   - `ThrottlerModule` (Rate Limiting) ile Brute-Force & DDoS önleme.
   - `ValidationPipe` + `ZodValidationPipe` ile SQL Injection ve XSS sanitizasyonu.

---

## 7. Medya Yükleme Mimarisi (Cloudflare R2 Abstraction)

Medya dosyaları doğrudan backend sunucu diskine yazılmaz:
1. **İstemci**, Backend'e istek atar: `POST /api/v1/uploads/presigned-url` (`filename`, `mimeType`, `fileSize`, `category`).
2. **Backend**, dosya boyutunu (max 10MB görsel, max 50MB video) ve MIME tipini doğrular, S3/R2 Presigned Put URL üretir.
3. **İstemci**, doğrudan `Cloudflare R2` bucket'ına `PUT` ile yükler.
4. **İstemci**, CDN URL'ini (`https://cdn.loopin.codapi.site/...`) veri kaydında (Event/Reel/Avatar) backend'e gönderir.

---

## 8. Real-time İletişim Mimarisi (Socket.IO + Redis)

* **Gateway**: `MessagesGateway` (`/socket.io`)
* **Eventler**:
  - `message:send` ➡️ `message:new` (Alıcı odasına emit)
  - `message:read` ➡️ `message:status_update` (Okundu bilgisi)
  - `typing:start` / `typing:stop` (Yazıyor... animasyonu)
  - `user:status` (Online / Offline varlık kontrolü)
* **Ölçeklenebilirlik**: Çoklu sunucu/worker senaryoları için Redis Adapter (`@socket.io/redis-adapter`) entegre edilir.

---

## 9. Prototip UI Bileşenleri ile Loopin V2 Eşleşme Tablosu (Migration Mapping)

| Prototip Yapısı (`prototype/`) | Loopin V2 Karşılığı | Açıklama / İyileştirme |
|---|---|---|
| `tab-home` (`events-snap-feed`) | `apps/web/app/(app)/home/page.tsx` + `EventSnapFeed.tsx` | Next.js Server Component + TanStack Query sonsuz kaydırma (Infinite Scroll) |
| `.event-card` | `packages/ui/src/components/EventCard/` | Alt parçalara ayrılmış modüler React bileşeni (`EventHeader`, `EventMedia`, `EventSideActions`, `EventDesc`, `EventCommentsPreview`) |
| `tab-reels` (`reels-snap-feed`) | `apps/web/app/(app)/reels/page.tsx` + `ReelsSnapFeed.tsx` | TikTok/Instagram tarzı dikey video/fotoğraf kaydırma deneyimi, video optimizasyonu |
| `tab-messages` & `active-chat-panel` | `apps/web/app/(app)/messages/page.tsx` & `[id]/page.tsx` | REST mesaj geçmişi + Socket.IO real-time canlı sohbet, anlık okundu durumu |
| `tab-profile` | `apps/web/app/(app)/profile/page.tsx` & `[username]/page.tsx` | Kullanıcı istatistikleri, güven skoru, PRO rozeti, Paylaşımlar (Grid) & Etkinlikler (List) sekmeleri |
| `#create-modal` (Bottom Sheet) | `apps/web/components/modals/CreateModal.tsx` | Reel ve Etkinlik oluşturma formu, Zod validasyonu, R2 presigned yükleme, kredi düşümü |
| `#edit-profile-modal` | `apps/web/components/modals/EditProfileModal.tsx` | Kullanıcı adı URL önizlemesi, biyografi karakter sayacı, avatar değiştirici |
| `#detail-modal` | `apps/web/components/modals/DetailLightboxModal.tsx` | Etkinlik/Reel detay penceresi, katılımcı avatarları listesi, katıl/iptal et butonları |
| `#comments-drawer-modal` | `apps/web/components/modals/CommentsDrawer.tsx` | Canlı yorumlar çekmecesi, anlık yorum paylaşımı |
| `style.css` CSS Değişkenleri | `packages/ui/src/styles/tokens.css` + `tailwind.config.js` | `--color-bg: #0A0A0A`, `--color-primary: #6366F1`, `--color-secondary: #10B981` ve neon ambient parlamalar korunur |
