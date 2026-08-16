# ♾️ Loopin V2 — REST API ve WebSocket Dokümantasyonu (API.md)

**Base URL:** `https://loopin.codapi.site/api/v1`  
**WebSocket URL:** `wss://loopin.codapi.site/socket.io`  
**Swagger UI:** `https://loopin.codapi.site/api/docs`

---

## 1. Authentication Endpoints

| Metot | Endpoint | Auth | Açıklama |
|---|---|---|---|
| `POST` | `/auth/register` | Yok | Yeni kullanıcı kaydı oluşturur, varsayılan 10 kredi tanımlar |
| `POST` | `/auth/login` | Yok | E-posta/kullanıcı adı ve şifre ile giriş yapar, JWT üretir |
| `GET` | `/auth/me` | Bearer | Mevcut oturum açmış kullanıcının profilini döndürür |

---

## 2. Events Endpoints

| Metot | Endpoint | Auth | Açıklama |
|---|---|---|---|
| `GET` | `/events/feed` | Opsiyonel | Ana sayfa dikey akış etkinlik listesini döndürür |
| `GET` | `/events/:id` | Opsiyonel | Etkinlik detayını ve katılımcı listesini getirir |
| `POST` | `/events` | Bearer | Yeni etkinlik oluşturur (**5 Kredi düşer**) |
| `POST` | `/events/:id/like` | Bearer | Etkinliği beğenir / beğeniyi kaldırır |
| `POST` | `/events/:id/join` | Bearer | Etkinliğe katılır veya katılımı iptal eder |
| `POST` | `/events/:id/comments` | Bearer | Etkinliğe yorum ekler |

---

## 3. Reels Endpoints

| Metot | Endpoint | Auth | Açıklama |
|---|---|---|---|
| `GET` | `/reels/feed` | Opsiyonel | Dikey video/fotoğraf akışını döndürür |
| `POST` | `/reels` | Bearer | Yeni reel paylaşımı oluşturur |
| `POST` | `/reels/:id/like` | Bearer | Reel beğenir / beğeniyi geri alır |
| `POST` | `/reels/:id/comments` | Bearer | Reel'e yorum ekler |

---

## 4. Messaging & WebSocket Endpoints

| Metot | Endpoint | Auth | Açıklama |
|---|---|---|---|
| `GET` | `/messages/conversations` | Bearer | Kullanıcının aktif sohbet odalarını listeler |
| `GET` | `/messages/conversations/:id` | Bearer | Belirli odadaki mesaj geçmişini getirir ve okundu işaretler |
| `POST` | `/messages` | Bearer | REST üzerinden yeni mesaj gönderir |

### WebSocket Olayları (Namespace: `/socket.io`)
- **İstemci ➡️ Sunucu**:
  - `message:send` (`{ senderId, recipientId, text, conversationId }`)
  - `typing:start` (`{ senderId, recipientId }`)
  - `typing:stop` (`{ senderId, recipientId }`)
- **Sunucu ➡️ İstemci**:
  - `message:new` (`ChatMessage`)
  - `typing:start`, `typing:stop`
  - `user:online`, `user:offline`

---

## 5. Credits & Economy Endpoints

| Metot | Endpoint | Auth | Açıklama |
|---|---|---|---|
| `GET` | `/credits/wallet` | Bearer | Kullanıcı cüzdan bakiyesini ve işlem geçmişini getirir |
| `GET` | `/credits/packages` | Yok | Satın alınabilir kredi paketlerini listeler |
