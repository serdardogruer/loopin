# LOOPIN V2 — PROFESYONEL YAZILIM MİMARİSİ

## 1. PROJE TALİMATI

Bu proje **Loopin** isimli sosyal etkinlik platformunun V2 sürümüdür.

Çalışacağın mevcut referans dosyası:

**`Loopin.zip`**

Bu ZIP dosyasını mutlaka incele ve mevcut sistemi anlamadan yeni mimariye geçme.

`Loopin.zip` içindeki:

* HTML
* CSS
* JavaScript
* görsel dosyaları
* ekranlar
* UI bileşenleri
* modal yapıları
* navigation
* event kartları
* profil ekranları
* mesajlaşma ekranları
* reels
* mevcut kullanıcı akışları
* mevcut mock data
* dokümantasyon dosyaları

referans alınacaktır.

### ÖNEMLİ

Mevcut HTML/CSS/JS kodunu olduğu gibi büyütme.

Mevcut tasarımı ve kullanıcı deneyimini koruyarak sistemi **profesyonel, ölçeklenebilir ve production-ready bir mimariyle yeniden oluştur.**

ZIP dosyası:

> **UI/UX + mevcut özellikler + kullanıcı akışları için referans kaynaktır.**

Ancak ZIP'teki mevcut JavaScript mimarisini production kodu olarak kullanma.

---

# 2. PRODUCTION DOMAIN

Uygulamanın production adresi:

**https://loopin.codapi.site**

Bütün mimari ve deployment kararları bu domain dikkate alınarak tasarlanacaktır.

Hedef:

```text
https://loopin.codapi.site
```

Web uygulamasını açacak.

API için:

```text
https://loopin.codapi.site/api
```

kullanılabilir.

WebSocket:

```text
wss://loopin.codapi.site/socket.io
```

üzerinden çalışacak şekilde tasarlanmalıdır.

---

# 3. ANA TEKNOLOJİ STACK

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React
* TanStack Query
* Zustand
* React Hook Form
* Zod

## Backend

* NestJS
* TypeScript
* Prisma
* PostgreSQL
* Redis
* Socket.IO

## Storage

Dosya ve medya depolama için:

* Cloudflare R2 veya S3 uyumlu storage

kullanılabilecek şekilde abstraction oluştur.

## Infrastructure

* Docker
* Docker Compose
* Nginx
* Cloudflare
* GitHub Actions

---

# 4. MİMARİ KARARI

İlk sürümde microservice architecture kullanma.

**Modular Monolith** kullan.

Backend tek NestJS uygulaması olacak fakat domain'ler modüler şekilde ayrılacak.

Hedef:

```text
Loopin
│
├── Web
├── Admin
├── API
└── Shared
```

Backend:

```text
API
│
├── Auth
├── Users
├── Profiles
├── Events
├── Applications
├── Reels
├── Comments
├── Likes
├── Friendships
├── Conversations
├── Messages
├── Notifications
├── Ratings
├── Credits
├── Payments
├── Subscriptions
├── Uploads
├── Search
├── Recommendations
├── Reports
├── Moderation
└── Admin
```

İleride ihtiyaç oluşursa modüller microservice'e ayrılabilecek şekilde tasarla.

---

# 5. MONOREPO YAPISI

Tercihen pnpm workspace kullan.

Önerilen yapı:

```text
loopin/
│
├── apps/
│   ├── web/
│   └── admin/
│
├── backend/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── validation/
│   ├── config/
│   └── utils/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   └── scripts/
│
├── docs/
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

# 6. WEB UYGULAMASI

Web uygulaması Next.js + TypeScript olacaktır.

Önerilen yapı:

```text
apps/web/

app/
├── (auth)/
│   ├── login/
│   ├── register/
│   └── verify/
│
├── (app)/
│   ├── home/
│   ├── events/
│   ├── events/[id]/
│   ├── reels/
│   ├── create/
│   ├── messages/
│   ├── messages/[id]/
│   ├── profile/
│   ├── profile/[username]/
│   └── notifications/
│
└── layout.tsx
```

Components:

```text
components/
├── ui/
├── navigation/
├── events/
├── reels/
├── messages/
├── profile/
├── comments/
├── notifications/
└── modals/
```

Features:

```text
features/
├── auth/
├── events/
├── applications/
├── reels/
├── messaging/
├── profile/
├── notifications/
├── credits/
├── ratings/
└── search/
```

---

# 7. STATE MANAGEMENT

Server state için:

**TanStack Query**

kullan.

Client/UI state için:

**Zustand**

kullan.

Her şeyi global state'e koyma.

Örnek:

```text
TanStack Query
    ↓
API'den gelen server data

Zustand
    ↓
UI state
Modal
Active chat
Theme
Navigation
Temporary state
```

---

# 8. BACKEND MİMARİSİ

NestJS modular architecture kullan.

Örnek:

```text
backend/src/events/

├── events.module.ts
├── events.controller.ts
├── events.service.ts
├── events.repository.ts
│
├── dto/
│   ├── create-event.dto.ts
│   ├── update-event.dto.ts
│   └── event-filter.dto.ts
│
├── policies/
│   └── event.policy.ts
│
└── types/
```

Katmanlar:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL
```

Controller içinde database işlemleri yapma.

Business logic controller'a koyma.

---

# 9. DATABASE

PostgreSQL + Prisma kullan.

Ana entity'ler:

```text
User
Profile
Interest
Event
EventImage
EventApplication
EventParticipant
EventComment
EventLike
EventRating
Friendship
Follow
Reel
ReelLike
ReelComment
Conversation
ConversationParticipant
Message
Notification
CreditWallet
CreditTransaction
CreditPackage
Payment
Subscription
Report
Block
CheckIn
```

İlişkileri düzgün tasarla.

Foreign key'leri kullan.

Index'leri özellikle:

* userId
* eventId
* conversationId
* createdAt
* username
* email
* status

alanlarında düşün.

---

# 10. CREDIT SYSTEM

Kredi sistemi ayrı domain olarak tasarlanmalıdır.

Örnek:

```text
CreditWallet
CreditTransaction
CreditPackage
CreditPurchase
```

Kullanıcının kredi bakiyesi yalnızca doğrudan değiştirilmemeli.

Her kredi hareketi transaction olarak kaydedilmeli.

Örnek:

```text
Event oluştur
      ↓
CreditTransaction
      ↓
Wallet balance
```

Finansal/kredi işlemlerinde transaction ve concurrency güvenliği sağla.

---

# 11. MESAJLAŞMA

REST + WebSocket birlikte kullanılacak.

REST:

```text
GET conversations
GET messages
POST message
```

WebSocket:

```text
message:new
message:read
message:typing
user:online
user:offline
```

Socket.IO kullanılacak.

Redis gerektiğinde Socket.IO adapter ve cache için kullanılabilecek şekilde tasarla.

---

# 12. MEDIA SYSTEM

Görselleri ve videoları backend server filesystem'ında kalıcı olarak tutma.

Upload sistemi:

```text
Client
 ↓
Backend
 ↓
Presigned Upload URL
 ↓
Cloudflare R2
 ↓
CDN
 ↓
Client
```

Dosya türü ve boyutlarını validate et.

Güvenli upload sistemi oluştur.

---

# 13. AUTHENTICATION

Authentication sistemi production-ready olmalı.

Desteklenecek yapı:

```text
Register
Login
Logout
Refresh Token
Email/Phone Verification
Password Hashing
Forgot Password
Reset Password
Session Management
```

JWT + Refresh Token yaklaşımı kullanılabilir.

Şifreleri güvenli şekilde hashle.

JWT secret ve diğer kritik bilgiler `.env` üzerinden alınmalı.

Secrets kesinlikle Git'e gönderilmemeli.

---

# 14. SECURITY

Production sistem olarak düşün.

Aşağıdakileri uygula:

* Helmet
* CORS
* Rate limiting
* DTO validation
* Input sanitization
* Authentication guards
* Authorization guards
* RBAC
* SQL injection protection
* XSS protection
* CSRF değerlendirmesi
* File upload validation
* API throttling
* Secure headers
* Environment secrets

---

# 15. ROLE SYSTEM

RBAC sistemi oluştur.

Roller:

```text
USER
MODERATOR
ADMIN
SUPER_ADMIN
```

İleride yeni roller eklenebilecek şekilde tasarla.

---

# 16. ADMIN PANEL

Ayrı Next.js uygulaması:

```text
apps/admin/
```

Modüller:

```text
Dashboard
Users
Events
Reports
Moderation
Payments
Credits
Subscriptions
Categories
Notifications
Content
Settings
Audit Logs
```

Admin paneli normal kullanıcı uygulamasından bağımsız tasarlanmalı.

---

# 17. DESIGN SYSTEM

`Loopin.zip` içindeki mevcut tasarım ana referans olacak.

Mevcut:

* renkler
* typography
* spacing
* radius
* shadows
* card tasarımları
* navigation
* modal yapıları
* animasyonlar
* dark theme

analiz edilmeli.

Daha sonra bunlar merkezi design system'e taşınmalı.

Örneğin:

```text
packages/ui/
```

içinde tekrar kullanılabilir componentler oluştur.

---

# 18. MEVCUT ZIP'İN DÖNÜŞTÜRÜLMESİ

ÖNEMLİ:

Mevcut ZIP'teki HTML dosyalarını sadece `.tsx` olarak yeniden adlandırma.

Mevcut:

```text
HTML
CSS
JavaScript
```

yapısını analiz et ve yeniden tasarla.

Örneğin mevcut Event Card:

```text
EventCard
├── EventHeader
├── EventMedia
├── EventActions
├── EventParticipants
└── EventComments
```

şeklinde componentlere ayrılmalı.

Mevcut inline:

```text
onclick=""
```

kullanımlarını kaldır.

DOM manipulation:

```text
document.getElementById()
innerHTML
querySelector()
```

gibi yaklaşımları React component/state sistemiyle değiştir.

---

# 19. MOCK DATA

İlk geliştirme aşamasında mevcut ZIP'teki mock data kullanılabilir.

Ancak mock data:

```text
services
components
database
```

ile karıştırılmamalı.

Örneğin:

```text
mock/
├── users.ts
├── events.ts
├── reels.ts
└── messages.ts
```

ayrı tutulabilir.

Daha sonra API ile değiştirilebilir.

---

# 20. API CONTRACT

Frontend ve backend birbirine sıkı şekilde bağımlı olmamalı.

API response modellerini TypeScript type'larıyla tanımla.

Örneğin:

```text
packages/types/
```

kullan.

İleride OpenAPI/Swagger üretilebilecek şekilde API tasarla.

---

# 21. PERFORMANCE

Production performansı öncelikli düşün.

Uygula:

* Server Components
* Dynamic imports
* Lazy loading
* Image optimization
* Pagination
* Cursor pagination gereken yerlerde kullan
* Infinite scrolling
* API caching
* Redis caching
* Database indexes
* Debounce search
* Virtualized lists gerektiğinde
* Skeleton loading

Özellikle:

```text
Home Feed
Reels
Messages
Notifications
```

performans açısından optimize edilmeli.

---

# 22. RESPONSIVE

Loopin mobile-first olacak.

Öncelik:

```text
Mobile
 ↓
Tablet
 ↓
Desktop
```

Mevcut ZIP'teki mobil tasarım mümkün olduğunca korunmalı.

Desktop'ta ise aynı sistem genişletilmeli.

---

# 23. PWA

Web uygulaması PWA olarak hazırlanmalı.

Gerektiğinde:

```text
Next.js
+
PWA
+
Capacitor
```

ile native wrapper'a dönüştürülebilecek şekilde mimari kur.

---

# 24. DEPLOYMENT

Production hedef:

```text
loopin.codapi.site
```

Cloudflare:

```text
Internet
 ↓
Cloudflare
 ↓
Nginx
 ↓
Docker
```

Nginx routing:

```text
/
    ↓
Loopin Web

/api
    ↓
Loopin API

/socket.io
    ↓
Loopin WebSocket
```

Docker container'ları:

```text
loopin-web
loopin-admin
loopin-api
loopin-postgres
loopin-redis
```

şeklinde ayrılabilir.

Development ve production environment'larını birbirinden ayır.

---

# 25. ENVIRONMENT

Örnek:

```text
DATABASE_URL=
REDIS_URL=

JWT_SECRET=
JWT_REFRESH_SECRET=

NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=

R2_ENDPOINT=
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_BUCKET=

SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
```

Gerçek secret değerleri source code'a yazma.

---

# 26. DEVELOPMENT STRATEGY

Bütün sistemi tek seferde yazma.

Şu sırayı takip et:

## Phase 1

```text
Project setup
Design system
Authentication
User
Profile
```

## Phase 2

```text
Events
Event detail
Event creation
Event applications
Credits
```

## Phase 3

```text
Feed
Reels
Likes
Comments
Follow
Friendship
```

## Phase 4

```text
Messaging
WebSocket
Notifications
```

## Phase 5

```text
Ratings
Reports
Block
Moderation
QR Check-in
```

## Phase 6

```text
Payments
Subscriptions
Credit packages
```

## Phase 7

```text
Search
Recommendations
AI features
```

---

# 27. GELİŞTİRME KURALI

Her özellik geliştirilirken:

```text
Requirement
 ↓
Database
 ↓
Backend API
 ↓
Frontend service
 ↓
React feature
 ↓
UI component
 ↓
Test
```

sırası takip edilebilir.

Kod tekrarını azalt.

SOLID prensiplerine uygun yaz.

DRY uygula.

YAGNI uygula.

Ancak gereksiz enterprise complexity oluşturma.

---

# 28. TEST

En azından kritik domain'lerde test altyapısı oluştur:

```text
Unit Tests
Integration Tests
API Tests
E2E Tests
```

Özellikle:

```text
Authentication
Events
Applications
Credits
Payments
Messages
Authorization
```

test edilmelidir.

---

# 29. DOKÜMANTASYON

Şu dosyaları oluştur:

```text
docs/
├── ARCHITECTURE.md
├── DATABASE.md
├── API.md
├── AUTH.md
├── DEPLOYMENT.md
├── DESIGN_SYSTEM.md
├── SECURITY.md
└── DEVELOPMENT.md
```

---

# 30. ÇALIŞMA KURALI

İlk olarak `Loopin.zip` dosyasını tamamen analiz et.

Analiz sonucunda:

1. Mevcut ekranları çıkar.
2. Mevcut özellikleri çıkar.
3. Kullanıcı akışlarını çıkar.
4. Mevcut veri yapılarını çıkar.
5. Mevcut UI componentlerini çıkar.
6. Mevcut JavaScript business logic'i çıkar.
7. Eksik veya problemli noktaları belirle.
8. Yeni architecture ile mapping oluştur.

Ardından yeni proje mimarisini oluştur.

**Kodlamaya hemen rastgele başlama.**

Önce architecture ve migration planını oluştur.

Ancak plan onaylandıktan sonra implementation'a geç.

---

# 31. EN ÖNEMLİ KURAL

`Loopin.zip`:

**referans sistemdir.**

Yeni Loopin V2:

**production sistemidir.**

Dolayısıyla amaç:

```text
Mevcut tasarımı kaybetme
+
Mevcut kullanıcı deneyimini koru
+
Kod mimarisini tamamen profesyonelleştir
+
Gerçek database kullan
+
Gerçek API kullan
+
Gerçek authentication kullan
+
Production deployment'a hazırla
```

olmalıdır.

Mevcut ZIP'teki görsel tasarımın gereksiz yere değiştirilmesini istemiyorum.

**Önce mevcut tasarımı mümkün olduğunca birebir koru, sonra mimariyi modernize et.**

---

# 32. BAŞLANGIÇ GÖREVİ

İlk görev olarak yalnızca aşağıdakileri yap:

### Aşama 1

`Loopin.zip` dosyasını analiz et.

### Aşama 2

Mevcut sistemi raporla:

```text
Screens
Components
Features
User Flows
Data Models
Existing APIs
Mock Data
Problems
Technical Debt
```

### Aşama 3

Mevcut yapı ile Loopin V2 arasındaki migration mapping'i çıkar.

### Aşama 4

Önerilen yeni repository tree'yi oluştur.

### Aşama 5

Architecture kararlarını `docs/ARCHITECTURE.md` dosyasına yaz.

### Aşama 6

Bunları tamamlamadan büyük miktarda production kodu yazmaya başlama.

---

## SON HEDEF

Loopin V2:

```text
https://loopin.codapi.site
```

adresinde çalışacak.

Sistem:

```text
Modern
Scalable
Secure
Mobile-first
Production-ready
Maintainable
Modular
```

olmalıdır.

Ve en önemlisi:

**Kullanıcı mevcut Loopin tasarımını gördüğünde “bu başka bir uygulama olmuş” dememeli.**

UI/UX mevcut `Loopin.zip` ile aynı ürünün profesyonel V2'si hissini vermeli.
