
# 02-System-Architecture.md
system_architecture = """
# Loopin
## System Architecture Document
### Version 1.0

---

# 1. Genel Bakış

Bu doküman Loopin platformunun teknik mimarisini, servis yapısını, veri akışlarını ve entegrasyon noktalarını tanımlar.

---

# 2. Teknoloji Stack

| Katman | Teknoloji | Amaç |
|--------|-----------|------|
| **Mobile App** | Flutter 3.x | iOS ve Android uygulaması |
| **Web App** | Next.js 14 | Web arayüzü ve landing page |
| **Backend API** | NestJS 10 | REST API ve WebSocket sunucusu |
| **Database** | PostgreSQL 16 | İlişkisel veri depolama |
| **Cache** | Redis 7 | Oturum, cache ve real-time veri |
| **File Storage** | AWS S3 / MinIO | Profil fotoğrafları ve medya |
| **Push Notifications** | Firebase Cloud Messaging | Mobil push bildirimleri |
| **Real-time Messaging** | Socket.io (WebSocket) | Anlık mesajlaşma |
| **Search** | PostgreSQL Full-Text + PostGIS | Etkinlik arama ve konum bazlı sorgular |
| **Container** | Docker + Docker Compose | Geliştirme ve deployment |
| **Reverse Proxy** | Nginx | Load balancing ve SSL |

---

# 3. Sistem Mimarisi Diyagramı

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   Flutter    │  │   Next.js    │  │  Admin Panel │                  │
│  │   (Mobile)   │  │    (Web)     │  │   (Next.js)  │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
└─────────┼─────────────────┼─────────────────┼──────────────────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │ HTTPS / WSS
┌───────────────────────────▼─────────────────────────────────────────────┐
│                           API GATEWAY                                    │
│                         Nginx Reverse Proxy                              │
│                    (Rate Limiting, SSL, Load Bal)                        │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────────────┐
│                         APPLICATION LAYER                              │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      NestJS API Server                           │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │    │
│  │  │  Auth    │ │ Event    │ │ Message  │ │  User    │          │    │
│  │  │  Module  │ │ Module   │ │ Module   │ │ Module   │          │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │    │
│  │  │  Match   │ │ Notify   │ │  Rating  │ │  Admin   │          │    │
│  │  │  Module  │ │ Module   │ │ Module   │ │ Module   │          │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │    │
│  │  ┌──────────┐ ┌──────────┐                                     │    │
│  │  │ Payment  │ │  Search  │                                     │    │
│  │  │ Module   │ │  Module  │                                     │    │
│  │  └──────────┘ └──────────┘                                     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              Socket.io Server                            │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────────────┐
│                          DATA LAYER                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  PostgreSQL  │  │    Redis     │  │   AWS S3     │  │   FCM        │ │
│  │  (Primary DB)│  │  (Cache/Session)│  │  (File Storage)│  │ (Push Notif) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 4. Servis Modülleri

## 4.1 Auth Service
- **Sorumluluk:** Kimlik doğrulama, yetkilendirme, token yönetimi
- **Endpoint'ler:** `/auth/*`
- **Bağımlılıklar:** PostgreSQL, Redis

## 4.2 User Service
- **Sorumluluk:** Kullanıcı profilleri, ilgi alanları, tercihler
- **Endpoint'ler:** `/users/*`
- **Bağımlılıklar:** PostgreSQL, S3

## 4.3 Event Service
- **Sorumluluk:** Etkinlik CRUD, katılımcı yönetimi, filtreleme
- **Endpoint'ler:** `/events/*`
- **Bağımlılıklar:** PostgreSQL, Redis, PostGIS

## 4.4 Application Service
- **Sorumluluk:** Etkinlik başvuruları, onay/red süreçleri
- **Endpoint'ler:** `/applications/*`
- **Bağımlılıklar:** PostgreSQL, Notification Service

## 4.5 Messaging Service
- **Sorumluluk:** Real-time mesajlaşma, sohbet geçmişi
- **Endpoint'ler:** `/messages/*`, WebSocket events
- **Bağımlılıklar:** PostgreSQL, Redis, Socket.io

## 4.6 Notification Service
- **Sorumluluk:** Push bildirimleri, in-app bildirimler
- **Endpoint'ler:** `/notifications/*`
- **Bağımlılıklar:** PostgreSQL, Redis, FCM

## 4.7 Rating Service
- **Sorumluluk:** Kullanıcı puanlama, güven skoru hesaplama
- **Endpoint'ler:** `/ratings/*`
- **Bağımlılıklar:** PostgreSQL

## 4.8 Search Service
- **Sorumluluk:** Etkinlik arama, filtreleme, öneriler
- **Endpoint'ler:** `/search/*`
- **Bağımlılıklar:** PostgreSQL, Redis

## 4.9 Payment Service
- **Sorumluluk:** Premium abonelik, ödeme işlemleri
- **Endpoint'ler:** `/payments/*`
- **Bağımlılıklar:** PostgreSQL, Payment Gateway (Stripe/iyzico)

## 4.10 Admin Service
- **Sorumluluk:** Admin panel operasyonları, raporlama
- **Endpoint'ler:** `/admin/*`
- **Bağımlılıklar:** PostgreSQL

---

# 5. Veri Akış Diyagramları

## 5.1 Kullanıcı Kayıt Akışı

```
Flutter App → POST /auth/register → Validation → PostgreSQL (User oluştur)
                                    ↓
                              SMS/Email OTP → Kullanıcı doğrulama
                                    ↓
                              JWT Token üretimi → Redis (Session)
                                    ↓
                              Başarılı yanıt → Flutter App
```

## 5.2 Etkinlik Oluşturma Akışı

```
Flutter App → POST /events → Auth Middleware → Validation
                                    ↓
                              PostgreSQL (Event oluştur)
                                    ↓
                              Redis (Event cache invalidate)
                                    ↓
                              Başarılı yanıt → Flutter App
```

## 5.3 Etkinlik Başvuru Akışı

```
Flutter App → POST /applications → Auth Middleware → Validation
                                    ↓
                              PostgreSQL (Application oluştur)
                                    ↓
                              Notification Service → FCM (Event sahibine bildirim)
                                    ↓
                              Redis (Unread count update)
                                    ↓
                              Başarılı yanıt → Flutter App
```

## 5.4 Mesajlaşma Akışı (Real-time)

```
Flutter App → WebSocket Connect → Auth (JWT verify)
                                    ↓
                              Socket.io Room (event_id based)
                                    ↓
                              Mesaj gönderimi
                                    ↓
                              PostgreSQL (Message kaydet)
                                    ↓
                              Redis (Unread count)
                                    ↓
                              FCM (Offline kullanıcılara push)
                                    ↓
                              Socket.io Broadcast (Online kullanıcılara)
```

---

# 6. Veritabanı Bağlantıları

```
NestJS API Server
    ├── PostgreSQL (TypeORM)
    │   ├── Connection Pool: 20
    │   ├── Timeout: 30s
    │   └── SSL: Production'da aktif
    │
    ├── Redis (ioredis)
    │   ├── Connection Pool: 10
    │   ├── Session Store: TTL 7 gün
    │   └── Cache: TTL 1 saat
    │
    ├── AWS S3 (aws-sdk)
    │   ├── Presigned URL: 15 dakika
    │   └── Bucket: loopin-media-{env}
    │
    └── Firebase Admin SDK
        └── FCM Push Notifications
```

---

# 7. Güvenlik Mimarisi

## 7.1 Kimlik Doğrulama
- **JWT Access Token:** 15 dakika geçerlilik
- **JWT Refresh Token:** 7 gün geçerlilik (Redis'te saklanır)
- **Telefon Doğrulama:** Twilio / Firebase Auth
- **Email Doğrulama:** SMTP ile OTP

## 7.2 Yetkilendirme
- **RBAC (Role-Based Access Control):**
  - `user`: Standart kullanıcı
  - `premium`: Premium kullanıcı
  - `admin`: Yönetici
  - `superadmin`: Süper yönetici

## 7.3 Rate Limiting
- **Genel API:** 100 istek / dakika / IP
- **Auth endpoint'leri:** 10 istek / dakika / IP
- **Messaging:** 60 mesaj / dakika / kullanıcı

## 7.4 Veri Güvenliği
- **Şifreleme:** bcrypt (passwords), AES-256 (sensitive data)
- **HTTPS:** Tüm iletişimler TLS 1.3
- **CORS:** Whitelist bazlı
- **Input Validation:** class-validator + sanitization

---

# 8. Ölçeklenebilirlik Stratejisi

## 8.1 Yatay Ölçeklendirme
```
Load Balancer (Nginx)
    ├── API Server Instance 1
    ├── API Server Instance 2
    └── API Server Instance N
```

## 8.2 Veritabanı Ölçeklendirme
- **Read Replicas:** Etkinlik arama ve listeleme için
- **Connection Pooling:** PgBouncer
- **Partitioning:** Etkinlik tabloları tarih bazlı partition

## 8.3 Cache Stratejisi
- **Redis Cluster:** Master-Slave yapılandırma
- **Cache Layers:**
  - L1: In-memory (NestJS cache manager)
  - L2: Redis
  - L3: PostgreSQL

---

# 9. Monitoring ve Logging

## 9.1 Loglama
- **Yapı:** Structured JSON logging
- **Seviyeler:** error, warn, info, debug
- **Kapsam:** Tüm API istekleri, veritabanı sorguları, hatalar

## 9.2 Monitoring
- **Health Checks:** `/health` endpoint
- **Metrics:** Prometheus + Grafana
- **Alerting:** CPU > 80%, Memory > 85%, DB connections > 80%

## 9.3 Error Tracking
- **Sentry:** Production hata takibi
- **Slack Integration:** Kritik hata bildirimleri

---

# 10. Environment Yapılandırması

## 10.1 Geliştirme (Development)
```yaml
# docker-compose.dev.yml
services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://loopin:loopin@postgres:5432/loopin_dev
      - REDIS_URL=redis://redis:6379
  
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

## 10.2 Üretim (Production)
- **Kubernetes / Docker Swarm** deployment
- **Auto-scaling:** CPU bazlı
- **Backup:** PostgreSQL günlük yedekleme
- **CDN:** CloudFront / Cloudflare (medya dosyaları)

---

# 11. API Versiyonlama

```
/api/v1/auth/*
/api/v1/users/*
/api/v1/events/*
/api/v1/applications/*
/api/v1/messages/*
/api/v1/notifications/*
/api/v1/ratings/*
/api/v1/search/*
/api/v1/payments/*
/api/v1/admin/*
```

---

# 12. WebSocket Events

## 12.1 Client → Server
```javascript
// join_room
{ event: 'join_room', data: { roomId: 'event_123' } }

// send_message
{ event: 'send_message', data: { roomId: 'event_123', content: '...' } }

// typing
{ event: 'typing', data: { roomId: 'event_123', isTyping: true } }

// leave_room
{ event: 'leave_room', data: { roomId: 'event_123' } }
```

## 12.2 Server → Client
```javascript
// new_message
{ event: 'new_message', data: { id, senderId, content, timestamp } }

// user_typing
{ event: 'user_typing', data: { userId, isTyping } }

// user_joined
{ event: 'user_joined', data: { userId, roomId } }

// user_left
{ event: 'user_left', data: { userId, roomId } }
```

---

# 13. Dosya Yükleme Akışı

```
Flutter App → POST /upload/presigned-url
                    ↓
              S3 Presigned URL üretimi
                    ↓
              Flutter App → Direct Upload to S3
                    ↓
              S3 → Upload Complete
                    ↓
              Flutter App → PATCH /users/profile (mediaUrl güncelleme)
```

---

# 14. Bildirim Stratejisi

| Senaryo | Kanal | Koşul |
|---------|-------|-------|
| Yeni başvuru | Push + In-app | Event sahibi online değilse push |
| Başvuru kabul | Push + In-app | Her zaman |
| Yeni mesaj | Push + In-app | Kullanıcı sohbette değilse push |
| Etkinlik hatırlatma | Push | Etkinlikten 1 saat önce |
| Puanlama zamanı | Push + In-app | Etkinlik bittikten 1 saat sonra |
| Sistem bildirimi | In-app | Her zaman |

---

# 15. Disaster Recovery

## 15.1 Yedekleme Stratejisi
- **PostgreSQL:** Günlük otomatik yedekleme (AWS RDS / self-managed)
- **Redis:** RDB snapshots her 6 saatte bir
- **S3:** Cross-region replication

## 15.2 Recovery Time Objectives (RTO)
- **API Sunucuları:** < 5 dakika
- **Veritabanı:** < 30 dakika
- **Tam Sistem:** < 1 saat

## 15.3 Recovery Point Objectives (RPO)
- **Veritabanı:** < 1 saat veri kaybı
- **Medya Dosyaları:** < 24 saat

---

# SONUÇ

Bu mimari dokümanı, Loopin platformunun teknik altyapısını tanımlar. MVP aşamasında tek instance çalışacak şekilde tasarlanmış, ancak yatay ölçeklendirmeye uygun bir yapı sunar.
"""

with open('/mnt/agents/output/02-System-Architecture.md', 'w', encoding='utf-8') as f:
    f.write(system_architecture)

print("✅ 02-System-Architecture.md oluşturuldu")
