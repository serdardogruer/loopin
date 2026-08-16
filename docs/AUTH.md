# ♾️ Loopin V2 — Kimlik Doğrulama ve Yetkilendirme (AUTH.md)

---

## 1. Kimlik Doğrulama Mimarisi

Loopin V2'de **JWT (JSON Web Token) + Refresh Token** çift katmanlı oturum mekanizması kullanılmaktadır.

### 1.1 Token Yaşam Döngüsü
- **Access Token**:
  - Süre: **15 dakika**
  - İçerik: `sub` (User ID), `email`, `role`
  - Kullanım: Tüm yetkilendirilmiş API isteklerinin `Authorization: Bearer <token>` başlığında gönderilir.
- **Refresh Token**:
  - Süre: **30 gün**
  - Saklama: Redis üzerinde oturum hash'i ile eşleştirilir.
  - Amaç: Access token süresi dolduğunda kesintisiz yeni token temini.

### 1.2 Şifreleme ve Güvenlik
- Kullanıcı parolaları veritabanında asla düz metin saklanmaz.
- `bcrypt` (10 rounds) veya `argon2id` algoritması kullanılır.

---

## 2. Rol Tabanlı Erişim Kontrolü (RBAC)

Platformdaki yetki hiyerarşisi:

```
SUPER_ADMIN  >  ADMIN  >  MODERATOR  >  USER
```

- **USER**: Etkinlik oluşturma, katılma, reel paylaşma, mesajlaşma.
- **MODERATOR**: Kullanıcı ve etkinlik raporlarını inceleme, içerik gizleme.
- **ADMIN**: Kullanıcı askıya alma (ban), etkinlik iptal etme, finansal metrikleri görüntüleme.
- **SUPER_ADMIN**: Tüm sistem yapılandırması, rol atamaları, veritabanı denetim günlükleri (Audit Logs).
