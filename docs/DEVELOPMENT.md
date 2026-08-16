# ♾️ Loopin V2 — Yerel Geliştirme Rehberi (DEVELOPMENT.md)

---

## 1. Gereksinimler
- Node.js >= 20.x
- pnpm >= 9.x
- PostgreSQL 16
- Redis 7 (Opsiyonel / Geliştirme ortamında mock destekli)

---

## 2. Projeyi Yerel Ortamda Çalıştırma

```bash
# 1. Bağımlılıkları yükleyin
pnpm install

# 2. Prisma istemcisini oluşturun
pnpm db:generate

# 3. Geliştirme sunucularını başlatın (Turbo ile Next.js Web + Admin + NestJS API)
pnpm dev
```

- **Web Uygulaması**: `http://localhost:3000`
- **Admin Paneli**: `http://localhost:3001`
- **Backend API**: `http://localhost:4000/api/v1`
- **Swagger Docs**: `http://localhost:4000/api/docs`
