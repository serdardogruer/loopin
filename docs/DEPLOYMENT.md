# ♾️ Loopin V2 — Deployment & Dağıtım Rehberi (DEPLOYMENT.md)

**Production Host:** `https://loopin.codapi.site`  
**Altyapı:** Ubuntu Linux VPS / Cloud Server + Docker + Nginx + Cloudflare

---

## 1. Hızlı Kurulum Adımları (Production Server)

```bash
# 1. Depoyu klonlayın
git clone <repo-url> /opt/loopin
cd /opt/loopin

# 2. Ortam değişkenlerini oluşturun
cp .env.example .env
nano .env # Secret anahtarları ve veritabanı şifresini güncelleyin

# 3. Docker Compose ile tüm servisleri ayağa kaldırın
docker compose build --no-cache
docker compose up -d

# 4. Veritabanı tablolarını senkronize edin ve seed verilerini çalıştırın
docker compose exec loopin-api pnpm --filter @loopin/backend prisma db push
```

---

## 2. Cloudflare DNS & SSL Ayarları
- `loopin.codapi.site` ➡️ Sunucu IP adresi (A Record, Proxied / Orange Cloud)
- SSL/TLS Modu: **Full (Strict)**
- WebSockets: **Enabled**
- HTTP/2 & HTTP/3: **Enabled**
