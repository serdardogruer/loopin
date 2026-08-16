# ♾️ Loopin V2 — Modern Sosyal Etkinlik ve Topluluk Platformu

**Production Domain:** [https://loopin.codapi.site](https://loopin.codapi.site)  
**Sürüm:** 2.0.0 (Production-Ready Modular Monolith)

---

## 🚀 Proje Genel Bakış

Loopin, **"Önce etkinlik, sonra tanışma"** mottosuyla çalışan; gerçek zamanlı etkinlik keşfi, TikTok/Instagram tarzı dikey reels akışı, anlık mesajlaşma ve kredi bazlı ekonomiye sahip sosyal buluşma platformudur.

---

## 🛠️ Mimari & Teknoloji Yığını

- **Monorepo**: `pnpm workspace` + `Turborepo`
- **Web**: Next.js 14 (App Router) + React + Tailwind CSS + Zustand + TanStack Query
- **Admin**: Next.js 14 + Moderasyon & Yönetim Paneli
- **Backend API**: NestJS 10 (Modular Monolith) + TypeScript
- **Veritabanı**: PostgreSQL 16 + Prisma ORM
- **Önbellek & Real-time**: Redis 7 + Socket.IO (WebSocket)
- **Depolama**: Cloudflare R2 / S3 Presigned URL Abstraction
- **Konteyner & Proxy**: Docker + Docker Compose + Nginx Reverse Proxy

---

## 📁 Monorepo Klasör Yapısı

```
loopin/
├── apps/
│   ├── web/           # Next.js Mobile-First Web & PWA
│   └── admin/         # Next.js Admin & Moderasyon Paneli
├── backend/           # NestJS Modular Monolith API & WebSocket
├── packages/
│   ├── ui/            # Paylaşımlı UI Tasarım Sistemi & Bileşenler
│   ├── types/         # Paylaşımlı TypeScript Tipleri & Entity Modelleri
│   ├── validation/    # Paylaşımlı Zod Validasyon Şemaları
│   └── utils/         # Tarih, metin ve yardımcı fonksiyonlar
├── infrastructure/
│   ├── docker/        # Dockerfile tanımları
│   └── nginx/         # Nginx Gateway yönlendirmeleri (loopin.codapi.site)
├── docs/              # Mimari, Veritabanı, API, Auth, Güvenlik Dokümanları
└── docker-compose.yml
```

---

## 📚 Dokümantasyon

Tüm mimari detaylar ve kılavuzlar `docs/` klasöründe yer almaktadır:
- [docs/ARCHITECTURE.md](file:///c:/Users/PC/Desktop/Loopin/docs/ARCHITECTURE.md)
- [docs/DATABASE.md](file:///c:/Users/PC/Desktop/Loopin/docs/DATABASE.md)
- [docs/API.md](file:///c:/Users/PC/Desktop/Loopin/docs/API.md)
- [docs/AUTH.md](file:///c:/Users/PC/Desktop/Loopin/docs/AUTH.md)
- [docs/DEPLOYMENT.md](file:///c:/Users/PC/Desktop/Loopin/docs/DEPLOYMENT.md)
- [docs/DESIGN_SYSTEM.md](file:///c:/Users/PC/Desktop/Loopin/docs/DESIGN_SYSTEM.md)
- [docs/SECURITY.md](file:///c:/Users/PC/Desktop/Loopin/docs/SECURITY.md)
- [docs/DEVELOPMENT.md](file:///c:/Users/PC/Desktop/Loopin/docs/DEVELOPMENT.md)
