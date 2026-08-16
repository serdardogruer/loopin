
# 05-Screen-Specification.md - devam ve kalan dosyalar
screen_spec_part2 = """

## 7.5 Rate Screen

**Ekran ID:** `SCR-027`
**Route:** `/profile/rate/:eventId`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  [←] Etkinliği Değerlendir              │
├─────────────────────────────────────────┤
│                                         │
│         ┌─────────┐                    │
│         │  [Foto] │                    │
│         └─────────┘                    │
│              Ahmet                     │
│         Koşu @ Belgrad Ormanı         │
│                                         │
│  ───────────────────────────────────   │
│                                         │
│  Saygı                                │
│  ⭐ ⭐ ⭐ ⭐ ⭐                          │
│                                         │
│  Dakiklik                             │
│  ⭐ ⭐ ⭐ ⭐ ⭐                          │
│                                         │
│  İletişim                             │
│  ⭐ ⭐ ⭐ ⭐ ⭐                          │
│                                         │
│  Genel Deneyim                        │
│  ⭐ ⭐ ⭐ ⭐ ⭐                          │
│                                         │
│  Yorum (İsteğe bağlı)                 │
│  ┌─────────────────────────────────────┐│
│  │ Harika bir etkinlikti...         ││
│  │                                   ││
│  └─────────────────────────────────────┘│
│  0/300                                │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │      Değerlendirmeyi Gönder         ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### Form Model
```dart
class RatingForm {
  int respectScore;      // Required, 1-5
  int punctualityScore;  // Required, 1-5
  int communicationScore;// Required, 1-5
  int overallScore;      // Required, 1-5
  String? comment;       // Optional, max 300
}
```

### API
```
POST /api/v1/ratings
Body: {
  "eventId": "...",
  "ratedId": "...",
  "respectScore": 5,
  "punctualityScore": 5,
  "communicationScore": 4,
  "overallScore": 5,
  "comment": "Harika bir etkinlikti..."
}
```

---

## 7.6 Settings Screen

**Ekran ID:** `SCR-032`
**Route:** `/profile/settings`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  [←]  Ayarlar                           │
├─────────────────────────────────────────┤
│                                         │
│  HESAP                                  │
│  ┌─────────────────────────────────────┐│
│  │  ✏️ Profili Düzenle              ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  📷 Fotoğrafları Yönet           ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  🔒 Şifre Değiştir                 ││
│  └─────────────────────────────────────┘│
│                                         │
│  BİLDİRİMLER                            │
│  ┌─────────────────────────────────────┐│
│  │  🔔 Push Bildirimleri    [Toggle]  ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  📧 E-posta Bildirimleri [Toggle]  ││
│  └─────────────────────────────────────┘│
│                                         │
│  GİZLİLİK                               │
│  ┌─────────────────────────────────────┐│
│  │  👤 Görünürlük Ayarları           ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  🚫 Engellenen Kullanıcılar       ││
│  └─────────────────────────────────────┘│
│                                         │
│  DESTEK                                 │
│  ┌─────────────────────────────────────┐│
│  │  ❓ Yardım Merkezi                  ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  📝 Geri Bildirim Gönder           ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  📋 Kullanım Koşulları             ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  🔒 Gizlilik Politikası            ││
│  └─────────────────────────────────────┘│
│                                         │
│  ───────────────────────────────────   │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🚪 Çıkış Yap                      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🗑️ Hesabı Sil                     ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

---

## 7.7 Security Settings Screen

**Ekran ID:** `SCR-033`
**Route:** `/profile/security`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  [←]  Güvenlik                          │
├─────────────────────────────────────────┤
│                                         │
│  DOĞRULAMA DURUMU                       │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  📱 Telefon          [✓ Doğrulandı]││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  📧 E-posta          [✓ Doğrulandı]││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  📷 Fotoğraf         [⏳ Beklemede] ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  🆔 Kimlik           [✕ Başlat]     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ŞİFRE                                  │
│  ┌─────────────────────────────────────┐│
│  │  🔒 Şifre Değiştir                 ││
│  └─────────────────────────────────────┘│
│                                         │
│  GİRİŞ GÜVENLİĞİ                        │
│  ┌─────────────────────────────────────┐│
│  │  📱 Aktif Cihazlar                 ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

---

## 7.8 Blocked Users Screen

**Ekran ID:** `SCR-034`
**Route:** `/profile/blocked`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  [←]  Engellenen Kullanıcılar           │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [Foto]  Mehmet, 30               ││
│  │          Engellendi: 15.07.2026   ││
│  │          [Engeli Kaldır]           ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [Foto]  Ayşe, 25                 ││
│  │          Engellendi: 10.07.2026   ││
│  │          [Engeli Kaldır]           ││
│  └─────────────────────────────────────┘│
│                                         │
│  Boş State:                             │
│  Henüz engellediğiniz kullanıcı yok.   │
│                                         │
└─────────────────────────────────────────┘
```

### API
```
GET /api/v1/users/blocked
DELETE /api/v1/users/blocked/:id
```

---

## 7.9 Report Screen

**Ekran ID:** `SCR-035`
**Route:** `/report`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  [←]  Şikayet Et                        │
├─────────────────────────────────────────┤
│                                         │
│  Şikayet Edilen: Ahmet                  │
│                                         │
│  Şikayet Tipi *                         │
│  ┌─────────────────────────────────────┐│
│  │ Uygunsuz davranış           [▼]     ││
│  └─────────────────────────────────────┘│
│                                         │
│  Seçenekler:                            │
│  • Uygunsuz davranış                    │
│  • Spam                                 │
│  • Sahte profil                         │
│  • Taciz                                │
│  • Şiddet veya tehdit                   │
│  • Diğer                                │
│                                         │
│  Açıklama *                             │
│  ┌─────────────────────────────────────┐│
│  │ Şikayetinizi detaylı açıklayın... ││
│  │                                   ││
│  └─────────────────────────────────────┘│
│  0/500                                │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │         Şikayeti Gönder             ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### API
```
POST /api/v1/reports
Body: {
  "reportedId": "...",
  "eventId": "...", // optional
  "type": "inappropriate_behavior",
  "reason": "..."
}
```

---

# 8. Monetization Modülü Ekranları

## 8.1 Premium Screen

**Ekran ID:** `SCR-031`
**Route:** `/premium`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  [←]  Loopin Premium                    │
├─────────────────────────────────────────┤
│                                         │
│         ⭐ Loopin Premium               │
│                                         │
│    Premium özelliklerle daha fazla      │
│    etkinlik, daha fazla bağlantı!       │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ✓ Sınırsız etkinlik oluşturma    ││
│  │  ✓ Gelişmiş filtreleme             ││
│  │  ✓ Profil öne çıkarma              ││
│  │  ✓ Öncelikli eşleşme               ││
│  │  ✓ Görüntülenme istatistikleri     ││
│  │  ✓ Reklamsız deneyim               ││
│  │  ✓ Özel rozet                      ││
│  └─────────────────────────────────────┘│
│                                         │
│  PLANLAR                                │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Aylık                              ││
│  │  ₺99/ay                             ││
│  │  [Seç]                              ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Yıllık              EN İYİ DEĞER ││
│  │  ₺799/yıl                           ││
│  │  ₺999 yerine                        ││
│  │  [Seç]                              ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │     Premium'a Yükselt               ││
│  └─────────────────────────────────────┘│
│                                         │
│  Ödeme güvenli ve şifrelidir.          │
│                                         │
└─────────────────────────────────────────┘
```

### API
```
POST /api/v1/payments/subscribe
Body: { "planType": "monthly", "paymentMethod": "credit_card" }
```

---

# 9. Discovery Modülü Ekranları

## 9.1 Map View Screen

**Ekran ID:** `SCR-036`
**Route:** `/discover/map`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  [←]  Harita                            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │         [Harita Görünümü]           ││
│  │                                     ││
│  │    📍        📍                     ││
│  │         📍        📍                ││
│  │              📍                     ││
│  │                                     ││
│  │    [📍 Mevcut Konum]               ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [Foto] 🍽️ Akşam Yemeği @ Kadıköy ││
│  │         📍 2.5 km | 👥 2/4        ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### API
```
GET /api/v1/events/nearby?lat=41.0&lng=29.0&radius=10
Response: {
  "events": [
    {
      "id": "...",
      "title": "...",
      "latitude": 41.0,
      "longitude": 29.0,
      "category": "yemek"
    }
  ]
}
```

---

# 10. Bildirim Ekranı

## 10.1 Notifications Screen

**Ekran ID:** `SCR-025`
**Route:** `/notifications`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  [←]  Bildirimler            [Tümünü Oku]│
├─────────────────────────────────────────┤
│                                         │
│  🔴 YENİ BAŞVURU                        │
│  ┌─────────────────────────────────────┐│
│  │  [Foto] Zeynep etkinliğine        ││
│  │         başvurdu                  ││
│  │         "Merhaba, katılmak        ││
│  │          istiyorum!"              ││
│  │         2 dk önce                 ││
│  └─────────────────────────────────────┘│
│                                         │
│  ✅ BAŞVURU KABUL                       │
│  ┌─────────────────────────────────────┐│
│  │  [Foto] Ahmet başvurunu           ││
│  │         kabul etti                ││
│  │         "Akşam Yemeği @ Kadıköy"  ││
│  │         15 dk önce                ││
│  └─────────────────────────────────────┘│
│                                         │
│  💬 YENİ MESAJ                          │
│  ┌─────────────────────────────────────┐│
│  │  [Foto] Can: "Yarın saat 9'da    ││
│  │         buluşalım mı?"            ││
│  │         1 saat önce               ││
│  └─────────────────────────────────────┘│
│                                         │
│  ⏰ HATIRLATMA                          │
│  ┌─────────────────────────────────────┐│
│  │  "Akşam Yemeği @ Kadıköy"         ││
│  │  2 saat sonra başlıyor!           ││
│  │  Bugün 18:00                      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ⭐ PUANLAMA                            │
│  ┌─────────────────────────────────────┐│
│  │  "Koşu @ Belgrad Ormanı"          ││
│  │  etkinliğini değerlendirmeyi      ││
│  │  unutma!                          ││
│  │  Dün                              ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### API
```
GET /api/v1/notifications?page=1&limit=30
PATCH /api/v1/notifications/:id/read
PATCH /api/v1/notifications/read-all
```

---

# 11. Bottom Navigation

```dart
class BottomNavConfig {
  static const tabs = [
    BottomNavItem(
      icon: Icons.home_outlined,
      activeIcon: Icons.home,
      label: 'Ana Sayfa',
      route: '/home',
    ),
    BottomNavItem(
      icon: Icons.explore_outlined,
      activeIcon: Icons.explore,
      label: 'Keşfet',
      route: '/discover',
    ),
    BottomNavItem(
      icon: Icons.add_circle_outline,
      activeIcon: Icons.add_circle,
      label: 'Oluştur',
      route: '/events/create/step-1',
      isCenter: true,
    ),
    BottomNavItem(
      icon: Icons.chat_bubble_outline,
      activeIcon: Icons.chat_bubble,
      label: 'Mesajlar',
      route: '/messages',
      badge: 'unreadCount',
    ),
    BottomNavItem(
      icon: Icons.person_outline,
      activeIcon: Icons.person,
      label: 'Profil',
      route: '/profile',
    ),
  ];
}
```

---

# 12. Ekran Geçiş Matrisi

| From \\ To | Home | Event Detail | Create Event | Chat | Profile | Filter |
|------------|------|--------------|--------------|------|---------|--------|
| **Home** | - | Push | Push | Push | Push | Modal |
| **Event Detail** | Pop | - | - | Push | Push | - |
| **Create Event** | Pop (cancel) | - | - | - | - | - |
| **Chat** | Pop | - | - | - | Push | - |
| **Profile** | Pop | - | - | - | - | - |
| **Filter** | Dismiss | - | - | - | - | - |

---

# 13. Responsive Davranışlar

## 13.1 Telefon (Portrait)
- Tüm ekranlar tam ekran
- Bottom navigation aktif
- Single column layout

## 13.2 Tablet (Landscape)
- Home Feed: 2 column grid
- Event Detail: Split view (detail + map)
- Chat: Split view (list + chat)

---

# 14. Tema ve Renkler

## 14.1 Dark Theme (Varsayılan)
```dart
class AppTheme {
  static const Color background = Color(0xFF0A0A0A);
  static const Color surface = Color(0xFF1A1A1A);
  static const Color surfaceVariant = Color(0xFF2A2A2A);
  static const Color primary = Color(0xFF6366F1);
  static const Color primaryVariant = Color(0xFF818CF8);
  static const Color secondary = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color onBackground = Color(0xFFFFFFFF);
  static const Color onSurface = Color(0xFFE5E5E5);
  static const Color onSurfaceVariant = Color(0xFFA3A3A3);
}
```

## 14.2 Typography
```dart
class AppTypography {
  static const TextStyle headline1 = TextStyle(fontSize: 28, fontWeight: FontWeight.bold);
  static const TextStyle headline2 = TextStyle(fontSize: 24, fontWeight: FontWeight.bold);
  static const TextStyle headline3 = TextStyle(fontSize: 20, fontWeight: FontWeight.w600);
  static const TextStyle body1 = TextStyle(fontSize: 16, fontWeight: FontWeight.normal);
  static const TextStyle body2 = TextStyle(fontSize: 14, fontWeight: FontWeight.normal);
  static const TextStyle caption = TextStyle(fontSize: 12, fontWeight: FontWeight.normal);
}
```

---

# 15. Animasyon Spesifikasyonları

| Animasyon | Süre | Tip | Açıklama |
|-----------|------|-----|----------|
| Page Transition | 300ms | Cupertino | iOS tarzı slide |
| Bottom Sheet | 250ms | BottomUp | Yumuşak açılış |
| Modal | 200ms | FadeScale | Opacity + scale |
| Loading Skeleton | - | Shimmer | Yükleme simülasyonu |
| Button Press | 100ms | Scale | 0.98 scale |
| Card Tap | 150ms | Scale | 0.97 scale |
| Pull to Refresh | 300ms | Rotation | Döndürme animasyonu |
| Notification Badge | 300ms | Bounce | Zıplama animasyonu |
| Star Rating | 150ms | Scale | Yıldız tıklama |

---

# 16. Erişilebilirlik (Accessibility)

## 16.1 Kontrast Oranları
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

## 16.2 Touch Targets
- Minimum: 48x48 dp
- Spacing: 8 dp minimum

## 16.3 Screen Reader
- Tüm butonlar: `semanticLabel`
- Görseller: `semanticLabel` veya `excludeFromSemantics`
- Form alanları: `hintText` + `helperText`
- Hata mesajları: `errorText`

## 16.4 Dynamic Type
- Text scale factor: 1.0 - 2.0 desteği
- Layout overflow kontrolü

---

# 17. Etkinliklerim & Düzenleme Ekran Spesifikasyonları

## 17.1 My Events Screen (Etkinliklerim / Looplarım)

**Ekran ID:** `SCR-028`  
**Route:** `/my-events`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  Etkinliklerim & Looplarım              │
├─────────────────────────────────────────┤
│ [ 👑 Ev Sahipliğim ] [ 🎟️ Katıldıklarım ] [ 📜 Geçmiş ] │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [Kapak Görseli - 👑 Ev Sahibi]       │ │
│ │ 🚀 Startup & Yazılımcı Kahvesi      │ │
│ │ 📅 25 Ekim, 14:00 • 📍 Levent       │ │
│ │ 👥 4/10 Katılımcı                   │ │
│ │ ─────────────────────────────────── │ │
│ │ [ ✏️ Düzenle ]     [ 🗑️ Sil / İptal ]│ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 17.2 Edit Event Screen (Etkinlik Düzenle)

**Ekran ID:** `SCR-029`  
**Route:** `/events/edit/:id`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  [←] Etkinliği Düzenle                  │
├─────────────────────────────────────────┤
│ Etkinlik Başlığı                        │
│ ┌─────────────────────────────────────┐ │
│ │ Startup & Yazılımcı Kahvesi         │ │
│ └─────────────────────────────────────┘ │
│ Açıklama & Kurallar                     │
│ ┌─────────────────────────────────────┐ │
│ │ Etkinlik detayları ve akışı...      │ │
│ └─────────────────────────────────────┘ │
│ ┌───────────────────┐ ┌───────────────┐ │
│ │ Tarih: 25 Ekim    │ │ Saat: 14:00   │ │
│ └───────────────────┘ └───────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │     Değişiklikleri Kaydet           │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

# 18. Sosyal & Zengin Etkinlik Ekran Spesifikasyonları

## 18.1 Rich Event Detail Screen (Zengin Etkinlik Detay Sayfası)

**Ekran ID:** `SCR-030`  
**Route:** `/events/detail/:id`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│ [←] [❤️] [🔁] [📅] [🔔]                 │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │        [ BÜYÜK KAPAK FOTO ]         │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│ 🏷️ Spor > Doğa Yürüyüşü  | ⏳ 2G 4S Kaldı│
│ 📌 Belgrad Ormanı Trekking ve Kahve    │
│ #Trekking #Doğa #Kahve                 │
│ 📅 28 Temmuz, 10:00 (3 Saat Süre)       │
│ 👥 8/10 Katılımcı (%80 Dolu) [🟢 Ücretsiz]│
│ 🕒 Son Kayıt: 27 Temmuz 23:59           │
├─────────────────────────────────────────┤
│ 📍 KONUM & ULAŞIM                       │
│ [🗺️ Google Maps İnteraktif Harita]       │
│ 🚗 Otopark: Ücretsiz  🚇 Metro: 300m    │
│ 🏢 Mekan: Belgrad Cafe (4.8 ★)          │
│ [ Navigation / Yol Tarifi Al ]          │
├─────────────────────────────────────────┤
│ 👑 ORGANİZATÖR                         │
│ 🖼️ [Foto] Ahmet Y. (Mavi Tık ✅)        │
│ 🛡️ %98 Güven Puanı • 🏆 Top Ev Sahibi   │
│ 📊 14 Etkinlik • 4.9 ★ • Son Görülme: 10d│
│ [Profili Gör] [Takip Et] [Arkadaş Ekle] │
├─────────────────────────────────────────┤
│ 👥 KATILIMCILAR (8)                     │
│ 🖼️🖼️🖼️🖼️🖼️ +3 Bekleme Listesi         │
│ 🌟 Giden Arkadaşlar: Ayşe K., Mehmet T. │
├─────────────────────────────────────────┤
│ 📜 PROGRAM & AKIŞ                      │
│ • 10:00 Buluşma ve Tanışma              │
│ • 10:30 Parkur Yürüyüşü                 │
│ • 12:30 Kahve Molası                    │
├─────────────────────────────────────────┤
│ 🎒 YANINDA GETİRİLECEKLER              │
│ ✓ Spor ayakkabı  ✓ Su matarası         │
├─────────────────────────────────────────┤
│ 💬 YORUMLAR (14) - Instagram Stili      │
│ 👤 Ali: Harika bir rota olacak! (❤️ 4)  │
│   └── 👤 Ahmet: Kesinlikle hazırsın!    │
│ [Tüm Yorumları Gör & Yorum Yap]        │
├─────────────────────────────────────────┤
│ 底部 Aksiyon Bar:                        │
│ [✅ Beğen] [💬 Yorum] [📤 Davet] [Katıl] │
└─────────────────────────────────────────┘
```

### Dart Model Definition
```dart
class RichEventDetailModel {
  final String id;
  final String title;
  final String coverImageUrl;
  final String categoryName;
  final String subCategoryName;
  final List<String> tags;
  final DateTime eventDate;
  final String durationText;
  final int maxCapacity;
  final int currentParticipants;
  final bool isFree;
  final double price;
  final DateTime registrationDeadline;
  final double latitude;
  final double longitude;
  final String transitInfo;
  final String parkingInfo;
  final String venueName;
  final double venueRating;
  final OrganizerInfo organizer;
  final List<ParticipantInfo> participants;
  final List<String> goingFriends;
  final List<ProgramAgendaItem> agenda;
  final List<String> itemsToBring;
  final List<String> rules;
  final String cancellationPolicy;
  final int eventScore;
}
```

---

## 18.2 Instagram Style Comments Sheet (Hiyerarşik Yorum Komponenti)

**Ekran ID:** `SCR-031`  
**Route:** Modal Bottom Sheet / `/events/:id/comments`

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│ 💬 Yorumlar (24)               [📌 Pin] │
├─────────────────────────────────────────┤
│ 📌 [SABİTLENDİ - ORGANİZATÖR]            │
│ 👑 Ahmet Y.: Parkurda matara unutmayın! │
├─────────────────────────────────────────┤
│ 👤 Elif S. (Güven: %99)                 │
│    Harika görünüyor, ben de geliyorum!  │
│    ❤️ 12 Beğeni • 🔥 3 • [Yanıtla]       │
│                                         │
│    └── 👤 Caner K.: Harika, birlikte    │
│        gideriz @Elif S.!                │
│        ❤️ 2 Beğeni • [Yanıtla]          │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ ✍️ Yorum veya yanıt yaz... [😍] [🔥] │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 18.3 Activity Feed Screen (Etkinlik Duvarı)

**Ekran ID:** `SCR-032`  
**Route:** `/feed` / Tab 1 Secondary View

### Görsel Yapı
```
┌─────────────────────────────────────────┐
│  🎉 Etkinlik Duvarı (Activity Feed)     │
├─────────────────────────────────────────┤
│ 👤 Ayşe K. bir etkinliğe katıldı         │
│ 📍 Belgrad Ormanı Trekking               │
│ 🕒 15 dakika önce                       │
│ 💬 2 Yorum • ❤️ 14 Beğeni                │
├─────────────────────────────────────────┤
│ 📸 Ali T. 8 yeni fotoğraf paylaştı      │
│ 🖼️ [Foto 1] [Foto 2] [Foto 3]           │
│ 📍 Kahve Tadımı Etkinliği               │
│ 🕒 1 saat önce                          │
├─────────────────────────────────────────┤
│ 👑 Caner M. "Süper Ev Sahibi" rozeti    │
│    kazandı! 🏆                          │
│ 🕒 3 saat önce                          │
└─────────────────────────────────────────┘
```

---

# SONUÇ

Bu ekran spesifikasyonu, Loopin uygulamasının tüm ekranlarının detaylı tasarım ve davranış kurallarını tanımlar. Flutter geliştirme ekibi için implementasyon rehberi niteliğindedir.
