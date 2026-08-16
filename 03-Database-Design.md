
# 03-Database-Design.md
database_design = """# Loopin
## Database Design Document
### Version 1.0

---

# 1. Genel Bakış

Bu doküman Loopin platformunun PostgreSQL veritabanı şemasını, tablo yapılarını, ilişkilerini ve indeks stratejisini tanımlar.

---

# 2. Entity Relationship Diagram (ERD)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │    profiles     │       │  user_interests │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ user_id (PK,FK) │       │ id (PK)         │
│ phone           │       │ full_name       │       │ user_id (FK)    │
│ email           │       │ birth_date      │       │ interest_id (FK)│
│ password_hash   │       │ city            │       └─────────────────┘
│ role            │       │ district        │              ▲
│ is_verified     │       │ bio             │              │
│ is_premium      │       │ avatar_url      │       ┌─────────────────┐
│ status          │       │ goal            │       │    interests    │
│ created_at      │       │ occupation      │       ├─────────────────┤
│ updated_at      │       │ education       │       │ id (PK)         │
└─────────────────┘       │ created_at      │       │ name            │
         │                │ updated_at      │       │ category        │
         │                └─────────────────┘       └─────────────────┘
         │
         │                ┌─────────────────┐       ┌─────────────────┐
         │                │  verifications  │       │  blocked_users  │
         │                ├─────────────────┤       ├─────────────────┤
         └───────────────►│ user_id (FK)    │       │ id (PK)         │
                          │ type            │       │ blocker_id (FK) │
                          │ status          │       │ blocked_id (FK) │
                          │ verified_at     │       │ reason          │
                          └─────────────────┘       │ created_at      │
                                                    └─────────────────┘
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     events      │       │  event_images   │       │ event_applications│
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ event_id (FK)   │       │ id (PK)         │
│ creator_id (FK) │       │ image_url       │       │ event_id (FK)   │
│ title           │       │ order           │       │ applicant_id(FK) │
│ description     │       │ created_at      │       │ status          │
│ category_id(FK)│       └─────────────────┘       │ message         │
│ date            │                                 │ created_at      │
│ time            │       ┌─────────────────┐       │ updated_at      │
│ location        │       │ event_categories│       └─────────────────┘
│ latitude        │       ├─────────────────┤              │
│ longitude       │       │ id (PK)         │◄─────────────┘
│ max_participants│       │ name            │
│ min_age         │       │ icon            │
│ max_age         │       │ color           │
│ gender_pref     │       └─────────────────┘
│ goal            │
│ payment_type    │       ┌─────────────────┐       ┌─────────────────┐
│ status          │       │    messages     │       │  conversations  │
│ created_at      │       ├─────────────────┤       ├─────────────────┤
│ updated_at      │       │ id (PK)         │       │ id (PK)         │
└─────────────────┘       │ conversation_id(FK)◄────│ event_id (FK)   │
         │                │ sender_id (FK)  │       │ participant1(FK)│
         │                │ content         │       │ participant2(FK)│
         │                │ is_read         │       │ last_message_at │
         │                │ created_at      │       │ created_at      │
         │                └─────────────────┘       └─────────────────┘
         │
         │                ┌─────────────────┐       ┌─────────────────┐
         │                │  notifications  │       │    ratings      │
         │                ├─────────────────┤       ├─────────────────┤
         └───────────────►│ user_id (FK)    │       │ id (PK)         │
                          │ type            │       │ event_id (FK)   │
                          │ title           │       │ rater_id (FK)   │
                          │ body            │       │ rated_id (FK)   │
                          │ data            │       │ respect_score   │
                          │ is_read         │       │ punctuality_score│
                          │ created_at      │       │ communication_score│
                          └─────────────────┘       │ overall_score   │
                                                  │ comment         │
┌─────────────────┐       ┌─────────────────┐       │ created_at      │
│  subscriptions  │       │  payment_logs   │       └─────────────────┘
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ user_id (FK)    │
│ plan_type       │       │ subscription_id │
│ status          │       │ amount          │
│ started_at      │       │ currency        │
│ expires_at      │       │ status          │
│ auto_renew      │       │ provider        │
│ created_at      │       │ created_at      │
└─────────────────┘       └─────────────────┘
```

---

# 3. Tablo Detayları

## 3.1 users

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Benzersiz kullanıcı ID |
| phone | VARCHAR(20) | UNIQUE, NOT NULL | Telefon numarası |
| email | VARCHAR(255) | UNIQUE, NULLABLE | E-posta adresi |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hash |
| role | VARCHAR(20) | DEFAULT 'user', CHECK IN ('user','premium','admin','superadmin') | Kullanıcı rolü |
| is_verified | BOOLEAN | DEFAULT FALSE | Telefon doğrulama durumu |
| is_premium | BOOLEAN | DEFAULT FALSE | Premium üyelik durumu |
| status | VARCHAR(20) | DEFAULT 'active', CHECK IN ('active','suspended','deleted') | Hesap durumu |
| last_login_at | TIMESTAMP | NULLABLE | Son giriş zamanı |
| created_at | TIMESTAMP | DEFAULT NOW() | Kayıt zamanı |
| updated_at | TIMESTAMP | DEFAULT NOW() | Güncelleme zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

---

## 3.2 profiles

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| user_id | UUID | PRIMARY KEY, FOREIGN KEY → users.id ON DELETE CASCADE | Kullanıcı ID |
| full_name | VARCHAR(100) | NOT NULL | Tam ad |
| birth_date | DATE | NULLABLE | Doğum tarihi |
| city | VARCHAR(100) | NOT NULL | Şehir |
| district | VARCHAR(100) | NULLABLE | İlçe |
| bio | TEXT | NULLABLE | Hakkında yazısı |
| avatar_url | VARCHAR(500) | NULLABLE | Profil fotoğrafı URL |
| photos | TEXT[] | NULLABLE | 6'lı Tinder stil fotoğraf galerisi |
| height | INT | NULLABLE | Boy (cm) |
| goal | VARCHAR(50) | NULLABLE, CHECK IN ('friendship','social','meet','travel','business','dating') | Amaç |
| occupation | VARCHAR(100) | NULLABLE | Meslek |
| education | VARCHAR(100) | NULLABLE | Eğitim |
| gender | VARCHAR(20) | NULLABLE, CHECK IN ('male','female','other','prefer_not_say') | Cinsiyet |
| gender_preference | VARCHAR(50) | NULLABLE | Tercih edilen cinsiyet |
| sexual_orientation | VARCHAR(50) | NULLABLE | Cinsel yönelim |
| zodiac | VARCHAR(30) | NULLABLE | Burç |
| smoking | VARCHAR(30) | NULLABLE | Sigara kullanımı |
| drinking | VARCHAR(30) | NULLABLE | Alkol kullanımı |
| workout | VARCHAR(30) | NULLABLE | Spor / Egzersiz sıklığı |
| pets | VARCHAR(30) | NULLABLE | Evcil hayvan durumu |
| languages | TEXT[] | NULLABLE | Konuştuğu diller |
| is_profile_public | BOOLEAN | DEFAULT TRUE | Profil gizlilik görünürlüğü |
| allow_search_indexing | BOOLEAN | DEFAULT FALSE | Arama motoru indeksleme izni |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |
| updated_at | TIMESTAMP | DEFAULT NOW() | Güncelleme zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_goal ON profiles(goal);
CREATE INDEX idx_profiles_gender ON profiles(gender);
```

---

## 3.3 interests (Master Data)

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | SERIAL | PRIMARY KEY | Benzersiz ID |
| name | VARCHAR(50) | NOT NULL, UNIQUE | İlgi alanı adı |
| category | VARCHAR(50) | NOT NULL | Kategori |
| icon | VARCHAR(50) | NULLABLE | İkon adı |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**Seed Data:**
```sql
INSERT INTO interests (name, category) VALUES
('Yemek', 'social'), ('Kahve', 'social'), ('Gezi', 'travel'),
('Spor', 'active'), ('Konser', 'entertainment'), ('Sinema', 'entertainment'),
('Seyahat', 'travel'), ('Gece Hayatı', 'social'), ('İş Toplantısı', 'business'),
('Eğitim', 'learning'), ('Kitap', 'hobby'), ('Müzik', 'hobby'),
('Fotoğrafçılık', 'hobby'), ('Doğa Yürüyüşü', 'active'), ('Yoga', 'active'),
('Oyun', 'entertainment'), ('Teknoloji', 'learning'), ('Sanat', 'hobby');
```

---

## 3.4 user_interests

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | SERIAL | PRIMARY KEY | Benzersiz ID |
| user_id | UUID | NOT NULL, FOREIGN KEY → users.id ON DELETE CASCADE | Kullanıcı ID |
| interest_id | INTEGER | NOT NULL, FOREIGN KEY → interests.id ON DELETE CASCADE | İlgi alanı ID |

**İndeksler:**
```sql
CREATE UNIQUE INDEX idx_user_interests_unique ON user_interests(user_id, interest_id);
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_interest_id ON user_interests(interest_id);
```

---

## 3.5 verifications

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | SERIAL | PRIMARY KEY | Benzersiz ID |
| user_id | UUID | NOT NULL, FOREIGN KEY → users.id ON DELETE CASCADE | Kullanıcı ID |
| type | VARCHAR(20) | NOT NULL, CHECK IN ('phone','email','photo','identity') | Doğrulama tipi |
| status | VARCHAR(20) | DEFAULT 'pending', CHECK IN ('pending','approved','rejected') | Durum |
| document_url | VARCHAR(500) | NULLABLE | Belge URL (fotoğraf/identity için) |
| verified_at | TIMESTAMP | NULLABLE | Doğrulama zamanı |
| verified_by | UUID | NULLABLE, FOREIGN KEY → users.id | Doğrulayan admin |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_verifications_user_id ON verifications(user_id);
CREATE INDEX idx_verifications_type ON verifications(type);
CREATE INDEX idx_verifications_status ON verifications(status);
```

---

## 3.6 blocked_users

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | SERIAL | PRIMARY KEY | Benzersiz ID |
| blocker_id | UUID | NOT NULL, FOREIGN KEY → users.id ON DELETE CASCADE | Engelleyen |
| blocked_id | UUID | NOT NULL, FOREIGN KEY → users.id ON DELETE CASCADE | Engellenen |
| reason | TEXT | NULLABLE | Engel nedeni |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE UNIQUE INDEX idx_blocked_users_unique ON blocked_users(blocker_id, blocked_id);
CREATE INDEX idx_blocked_users_blocker ON blocked_users(blocker_id);
CREATE INDEX idx_blocked_users_blocked ON blocked_users(blocked_id);
```

---

## 3.7 event_categories (Master Data)

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | SERIAL | PRIMARY KEY | Benzersiz ID |
| name | VARCHAR(50) | NOT NULL, UNIQUE | Kategori adı |
| icon | VARCHAR(50) | NULLABLE | İkon adı |
| color | VARCHAR(7) | NULLABLE | Hex renk kodu |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**Seed Data:**
```sql
INSERT INTO event_categories (name, icon, color) VALUES
('Yemek', 'restaurant', '#FF6B6B'),
('Kahve', 'coffee', '#8B4513'),
('Gezi', 'hiking', '#4ECDC4'),
('Spor', 'sports', '#45B7D1'),
('Konser', 'music', '#9B59B6'),
('Sinema', 'movie', '#E74C3C'),
('Seyahat', 'flight', '#3498DB'),
('Gece Hayatı', 'nightlife', '#2C3E50'),
('İş Toplantısı', 'business', '#27AE60'),
('Eğitim', 'school', '#F39C12'),
('Diğer', 'more', '#95A5A6');
```

---

## 3.8 events

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Benzersiz ID |
| creator_id | UUID | NOT NULL, FOREIGN KEY → users.id | Etkinlik sahibi |
| title | VARCHAR(200) | NOT NULL | Etkinlik başlığı |
| description | TEXT | NOT NULL | Açıklama |
| category_id | INTEGER | NOT NULL, FOREIGN KEY → event_categories.id | Kategori |
| date | DATE | NOT NULL | Etkinlik tarihi |
| time | TIME | NOT NULL | Etkinlik saati |
| location | VARCHAR(300) | NOT NULL | Konum metni |
| latitude | DECIMAL(10,8) | NULLABLE | Enlem |
| longitude | DECIMAL(11,8) | NULLABLE | Boylam |
| max_participants | INTEGER | DEFAULT 10, CHECK > 0 | Maksimum katılımcı |
| min_age | INTEGER | NULLABLE, CHECK >= 18 | Minimum yaş |
| max_age | INTEGER | NULLABLE | Maksimum yaş |
| gender_preference | VARCHAR(20) | DEFAULT 'any', CHECK IN ('any','male','female') | Cinsiyet tercihi |
| goal | VARCHAR(50) | NULLABLE, CHECK IN ('friendship','social','meet','travel','business','dating') | Beklenti |
| payment_type | VARCHAR(20) | DEFAULT 'split', CHECK IN ('split','host_pays','shared','free') | Ödeme tipi |
| status | VARCHAR(20) | DEFAULT 'active', CHECK IN ('active','cancelled','completed','full') | Durum |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |
| updated_at | TIMESTAMP | DEFAULT NOW() | Güncelleme zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_events_creator_id ON events(creator_id);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_location ON events USING GIST (point(longitude, latitude));
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_date_status ON events(date, status);
```

---

## 3.9 event_images

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | SERIAL | PRIMARY KEY | Benzersiz ID |
| event_id | UUID | NOT NULL, FOREIGN KEY → events.id ON DELETE CASCADE | Etkinlik ID |
| image_url | VARCHAR(500) | NOT NULL | Görsel URL |
| order | INTEGER | DEFAULT 0 | Sıralama |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_event_images_event_id ON event_images(event_id);
```

---

## 3.10 event_applications

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Benzersiz ID |
| event_id | UUID | NOT NULL, FOREIGN KEY → events.id ON DELETE CASCADE | Etkinlik ID |
| applicant_id | UUID | NOT NULL, FOREIGN KEY → users.id ON DELETE CASCADE | Başvuran ID |
| status | VARCHAR(20) | DEFAULT 'pending', CHECK IN ('pending','approved','rejected','cancelled') | Durum |
| message | TEXT | NULLABLE | Başvuru mesajı |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |
| updated_at | TIMESTAMP | DEFAULT NOW() | Güncelleme zamanı |

**İndeksler:**
```sql
CREATE UNIQUE INDEX idx_applications_unique ON event_applications(event_id, applicant_id) WHERE status != 'cancelled';
CREATE INDEX idx_applications_event_id ON event_applications(event_id);
CREATE INDEX idx_applications_applicant_id ON event_applications(applicant_id);
CREATE INDEX idx_applications_status ON event_applications(status);
```

---

## 3.11 support_tickets

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Bilet ID |
| user_id | UUID | NULLABLE, FOREIGN KEY → users.id ON DELETE SET NULL | Talep oluşturan kullanıcı |
| topic | VARCHAR(100) | NOT NULL | Destek konusu |
| email | VARCHAR(255) | NOT NULL | İletişim e-posta adresi |
| message | TEXT | NOT NULL | Talep açıklaması |
| status | VARCHAR(20) | DEFAULT 'open', CHECK IN ('open','in_progress','resolved','closed') | Bilet durumu |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
```

---

## 3.12 conversations

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Benzersiz ID |
| event_id | UUID | NULLABLE, FOREIGN KEY → events.id ON DELETE SET NULL | İlişkili etkinlik |
| participant1_id | UUID | NOT NULL, FOREIGN KEY → users.id | Katılımcı 1 |
| participant2_id | UUID | NOT NULL, FOREIGN KEY → users.id | Katılımcı 2 |
| last_message_at | TIMESTAMP | NULLABLE | Son mesaj zamanı |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE UNIQUE INDEX idx_conversations_unique ON conversations(LEAST(participant1_id, participant2_id), GREATEST(participant1_id, participant2_id));
CREATE INDEX idx_conversations_p1 ON conversations(participant1_id);
CREATE INDEX idx_conversations_p2 ON conversations(participant2_id);
CREATE INDEX idx_conversations_event ON conversations(event_id);
CREATE INDEX idx_conversations_last_msg ON conversations(last_message_at DESC);
```

---

## 3.12 messages

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Benzersiz ID |
| conversation_id | UUID | NOT NULL, FOREIGN KEY → conversations.id ON DELETE CASCADE | Konuşma ID |
| sender_id | UUID | NOT NULL, FOREIGN KEY → users.id | Gönderen ID |
| content | TEXT | NOT NULL | Mesaj içeriği |
| is_read | BOOLEAN | DEFAULT FALSE | Okundu durumu |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(conversation_id, is_read) WHERE is_read = FALSE;
```

---

## 3.13 notifications

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Benzersiz ID |
| user_id | UUID | NOT NULL, FOREIGN KEY → users.id ON DELETE CASCADE | Alıcı ID |
| type | VARCHAR(50) | NOT NULL | Bildirim tipi |
| title | VARCHAR(200) | NOT NULL | Başlık |
| body | TEXT | NOT NULL | İçerik |
| data | JSONB | NULLABLE | Ek veri |
| is_read | BOOLEAN | DEFAULT FALSE | Okundu durumu |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

## 3.14 ratings

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Benzersiz ID |
| event_id | UUID | NOT NULL, FOREIGN KEY → events.id ON DELETE CASCADE | Etkinlik ID |
| rater_id | UUID | NOT NULL, FOREIGN KEY → users.id | Değerlendiren |
| rated_id | UUID | NOT NULL, FOREIGN KEY → users.id | Değerlendirilen |
| respect_score | INTEGER | NOT NULL, CHECK BETWEEN 1 AND 5 | Saygı puanı |
| punctuality_score | INTEGER | NOT NULL, CHECK BETWEEN 1 AND 5 | Dakiklik puanı |
| communication_score | INTEGER | NOT NULL, CHECK BETWEEN 1 AND 5 | İletişim puanı |
| overall_score | INTEGER | NULLABLE, CHECK BETWEEN 1 AND 5 | Genel puan |
| positive_behavior_tags | TEXT[] | NULLABLE, DEFAULT '{}' | Olumlu davranış etiketleri (Örn: 'Zamanında geldi', 'Saygılıydı') |
| negative_behavior_tags | TEXT[] | NULLABLE, DEFAULT '{}' | Olumsuz davranış etiketleri (Örn: 'Gelmedi', 'Son anda iptal etti') |
| comment | TEXT | NULLABLE | Ek açıklama / not |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE UNIQUE INDEX idx_ratings_unique ON ratings(event_id, rater_id, rated_id);
CREATE INDEX idx_ratings_rated_id ON ratings(rated_id);
CREATE INDEX idx_ratings_event_id ON ratings(event_id);
```

---

## 3.15 subscriptions

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Benzersiz ID |
| user_id | UUID | NOT NULL, FOREIGN KEY → users.id ON DELETE CASCADE | Kullanıcı ID |
| plan_type | VARCHAR(20) | NOT NULL, CHECK IN ('monthly','yearly') | Plan tipi |
| status | VARCHAR(20) | DEFAULT 'active', CHECK IN ('active','cancelled','expired') | Durum |
| started_at | TIMESTAMP | NOT NULL | Başlangıç |
| expires_at | TIMESTAMP | NOT NULL | Bitiş |
| auto_renew | BOOLEAN | DEFAULT TRUE | Otomatik yenileme |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires ON subscriptions(expires_at);
```

---

## 3.16 payment_logs

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Benzersiz ID |
| user_id | UUID | NOT NULL, FOREIGN KEY → users.id ON DELETE CASCADE | Kullanıcı ID |
| subscription_id | UUID | NULLABLE, FOREIGN KEY → subscriptions.id | Abonelik ID |
| amount | DECIMAL(10,2) | NOT NULL | Tutar |
| currency | VARCHAR(3) | DEFAULT 'TRY' | Para birimi |
| status | VARCHAR(20) | NOT NULL, CHECK IN ('pending','success','failed','refunded') | Durum |
| provider | VARCHAR(50) | NOT NULL | Ödeme sağlayıcı |
| provider_transaction_id | VARCHAR(255) | NULLABLE | Sağlayıcı işlem ID |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_payment_logs_user_id ON payment_logs(user_id);
CREATE INDEX idx_payment_logs_status ON payment_logs(status);
CREATE INDEX idx_payment_logs_provider_tx ON payment_logs(provider_transaction_id);
```

---

## 3.17 reports

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Benzersiz ID |
| reporter_id | UUID | NOT NULL, FOREIGN KEY → users.id | Şikayetçi |
| reported_id | UUID | NOT NULL, FOREIGN KEY → users.id | Şikayet edilen |
| event_id | UUID | NULLABLE, FOREIGN KEY → events.id | İlişkili etkinlik |
| type | VARCHAR(50) | NOT NULL | Şikayet tipi |
| reason | TEXT | NOT NULL | Şikayet nedeni |
| status | VARCHAR(20) | DEFAULT 'pending', CHECK IN ('pending','reviewed','resolved','dismissed') | Durum |
| reviewed_by | UUID | NULLABLE, FOREIGN KEY → users.id | İnceleyen admin |
| reviewed_at | TIMESTAMP | NULLABLE | İnceleme zamanı |
| created_at | TIMESTAMP | DEFAULT NOW() | Oluşturma zamanı |

**İndeksler:**
```sql
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_reported ON reports(reported_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
```

---

# 4. View'lar (Görünümler)

## 4.1 user_stats
```sql
CREATE VIEW user_stats AS
SELECT 
    u.id as user_id,
    u.full_name,
    COUNT(DISTINCT e.id) as events_created,
    COUNT(DISTINCT ea.event_id) as events_joined,
    COALESCE(AVG(r.overall_score), 0) as average_rating,
    COUNT(DISTINCT r.id) as total_ratings,
    u.is_verified,
    u.is_premium
FROM users u
LEFT JOIN events e ON e.creator_id = u.id AND e.status = 'completed'
LEFT JOIN event_applications ea ON ea.applicant_id = u.id AND ea.status = 'approved'
LEFT JOIN ratings r ON r.rated_id = u.id
GROUP BY u.id, u.full_name, u.is_verified, u.is_premium;
```

## 4.2 event_summary
```sql
CREATE VIEW event_summary AS
SELECT 
    e.*,
    p.full_name as creator_name,
    p.avatar_url as creator_avatar,
    ec.name as category_name,
    ec.icon as category_icon,
    ec.color as category_color,
    COUNT(DISTINCT ea.applicant_id) as approved_count,
    e.max_participants - COUNT(DISTINCT ea.applicant_id) as spots_left
FROM events e
JOIN profiles p ON p.user_id = e.creator_id
JOIN event_categories ec ON ec.id = e.category_id
LEFT JOIN event_applications ea ON ea.event_id = e.id AND ea.status = 'approved'
WHERE e.status = 'active'
GROUP BY e.id, p.full_name, p.avatar_url, ec.name, ec.icon, ec.color;
```

---

# 5. Fonksiyonlar

## 5.1 calculate_user_rating
```sql
CREATE OR REPLACE FUNCTION calculate_user_rating(user_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(AVG(overall_score)::DECIMAL(3,2), 0)
        FROM ratings
        WHERE rated_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql;
```

## 5.2 check_event_full
```sql
CREATE OR REPLACE FUNCTION check_event_full()
RETURNS TRIGGER AS $$
BEGIN
    IF (
        SELECT COUNT(*) 
        FROM event_applications 
        WHERE event_id = NEW.event_id AND status = 'approved'
    ) >= (
        SELECT max_participants 
        FROM events 
        WHERE id = NEW.event_id
    ) THEN
        UPDATE events SET status = 'full' WHERE id = NEW.event_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_event_full
AFTER INSERT OR UPDATE ON event_applications
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION check_event_full();
```

---

# 6. Partitioning Stratejisi

## 6.1 messages (Tarih bazlı)
```sql
-- Aylık partition
CREATE TABLE messages_2024_01 PARTITION OF messages
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## 6.2 notifications (Tarih bazlı)
```sql
-- Aylık partition
CREATE TABLE notifications_2024_01 PARTITION OF notifications
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## 6.3 events (Tarih bazlı)
```sql
-- Yıllık partition
CREATE TABLE events_2024 PARTITION OF events
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

# 7. Redis Key Pattern'leri

| Key Pattern | Tip | TTL | Açıklama |
|-------------|-----|-----|----------|
| `session:{token}` | String | 7 gün | JWT refresh token |
| `user:{id}:profile` | Hash | 1 saat | Kullanıcı profili cache |
| `events:city:{city}` | Sorted Set | 15 dk | Şehir bazlı etkinlikler |
| `events:popular` | Sorted Set | 10 dk | Popüler etkinlikler |
| `chat:{conversation_id}:unread:{user_id}` | String | - | Okunmamış mesaj sayısı |
| `rate_limit:{ip}` | String | 1 dk | Rate limiting |
| `otp:{phone}` | String | 5 dk | SMS OTP kodu |

---

# 8. Migration Stratejisi

## 8.1 TypeORM Migration Yapısı
```
backend/src/migrations/
├── 001-CreateUsersTable.ts
├── 002-CreateProfilesTable.ts
├── 003-CreateInterestsTable.ts
├── 004-CreateEventsTable.ts
├── 005-CreateApplicationsTable.ts
├── 006-CreateMessagesTable.ts
├── 007-CreateNotificationsTable.ts
├── 008-CreateRatingsTable.ts
├── 009-CreateSubscriptionsTable.ts
└── 010-CreateIndexesAndViews.ts
```

## 8.2 Migration Komutları
```bash
# Migration oluştur
npm run migration:generate -- -n CreateUsersTable

# Migration çalıştır
npm run migration:run

# Geri al
npm run migration:revert
```

---

# 9. Backup ve Recovery

## 9.1 Günlük Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U loopin loopin_prod > /backups/loopin_${DATE}.sql
gzip /backups/loopin_${DATE}.sql
# 7 günden eski backupları sil
find /backups -name "loopin_*.sql.gz" -mtime +7 -delete
```

## 9.2 Point-in-Time Recovery
```bash
# WAL archiving aktif
# postgresql.conf:
archive_mode = on
archive_command = 'cp %p /archive/%f'
wal_level = replica
```

---

# 10. Sosyal & Zengin Etkinlik Veritabanı Genişletmeleri

## 10.1 `event_details_extended` Tablosu
```sql
CREATE TABLE event_details_extended (
    event_id UUID PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
    program_agenda JSONB DEFAULT '[]', -- [{"time": "10:00", "title": "Buluşma"}]
    items_to_bring TEXT[] DEFAULT '{}', -- ['Matara', 'Yürüyüş Ayakkabısı']
    rules_list TEXT[] DEFAULT '{}',
    cancellation_policy TEXT,
    venue_rating NUMERIC(3,2) DEFAULT 5.00,
    transit_info TEXT,
    parking_info TEXT,
    sub_category_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 10.2 `event_comments` Tablosu (Instagram Stili Ağaç Yapısı)
```sql
CREATE TABLE event_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES event_comments(id) ON DELETE CASCADE, -- NULL = Ana yorum, UUID = Yanıt
    comment_text TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    likes_count INT DEFAULT 0,
    reactions JSONB DEFAULT '{}', -- {"🔥": 4, "❤️": 12}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_event_parent ON event_comments(event_id, parent_id);
```

## 10.3 `friendships` ve `user_relations` Tablosu
```sql
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'BLOCKED', 'MUTED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_friendships_user_status ON friendships(user_id, status);
```

## 10.4 `event_checkins_qr` Tablosu
```sql
CREATE TABLE event_checkins_qr (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    qr_code_hash VARCHAR(255) NOT NULL UNIQUE,
    scanned_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'ISSUED', -- 'ISSUED', 'VERIFIED', 'EXPIRED'
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 10.5 `event_albums` ve `event_media_tags` Tablosu
```sql
CREATE TABLE event_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(10) DEFAULT 'IMAGE', -- 'IMAGE', 'VIDEO'
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tagged_users JSONB DEFAULT '[]', -- ["user_uuid_1", "user_uuid_2"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 10.6 `activity_feed` Tablosu (Etkinlik Duvarı)
```sql
CREATE TABLE activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'JOINED_EVENT', 'CREATED_EVENT', 'UPLOADED_PHOTOS', 'LIKED_EVENT', 'EARNED_BADGE'
    target_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    caption TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);
```

## 10.7 `event_scores` Tablosu (Otomatik 0-100 Skoru)
```sql
CREATE TABLE event_scores (
    event_id UUID PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
    total_score NUMERIC(5,2) DEFAULT 100.00,
    attendance_rate NUMERIC(5,2) DEFAULT 0.00,
    punctuality_score NUMERIC(5,2) DEFAULT 0.00,
    satisfaction_score NUMERIC(5,2) DEFAULT 0.00,
    comment_density INT DEFAULT 0,
    photo_sharing_count INT DEFAULT 0,
    rejoin_intent_rate NUMERIC(5,2) DEFAULT 0.00,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 10.8 `user_calendar_syncs` ve `user_watchlists` Tablosu
```sql
CREATE TABLE user_calendar_syncs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL, -- 'GOOGLE', 'APPLE', 'OUTLOOK'
    external_calendar_id TEXT,
    auto_sync BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    list_type VARCHAR(20) DEFAULT 'FAVORITE', -- 'FAVORITE', 'GO_LATER', 'WATCHLIST', 'REJOIN'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id, list_type)
);
```

---

# SONUÇ

Bu veritabanı tasarımı, Loopin platformunun hem temel hem de gelişmiş sosyal medya / etkinlik duvarı ihtiyaçlarını karşılayacak şekilde tasarlanmıştır.
"""

