
# 09-Admin-Panel.md
admin_panel = """# Loopin
## Admin Panel Specification
### Version 1.0

---

# 1. Genel Bakış

Bu doküman Loopin platformunun admin panelinin ekran spesifikasyonlarını, yetki yapısını ve işlevlerini tanımlar.

**Teknoloji:** Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui

---

# 2. Admin Rolleri ve Yetkileri

| Rol | Yetkiler |
|-----|----------|
| **Super Admin** | Tüm yetkiler, admin oluşturma, sistem ayarları |
| **Admin** | Kullanıcı yönetimi, etkinlik yönetimi, rapor yönetimi |
| **Moderator** | Etkinlik inceleme, rapor inceleme, kullanıcı uyarısı |
| **Support** | Kullanıcı destek talepleri, temel kullanıcı bilgileri görüntüleme |

---

# 3. Giriş ve Authentication

## 3.1 Login Ekranı
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                          [Loopin Logo]                              │
│                                                                     │
│                        Admin Panel                                  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  E-posta                                                    │   │
│  │  admin@loopin.app                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Şifre                                           [👁️]    │   │
│  │  ●●●●●●●●●●                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [☐] Beni hatırla                                                 │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Giriş Yap                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Şifremi unuttum                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Validasyon:**
- Email: Required, valid email format
- Password: Required, min 8 characters
- 2FA: Admin ve Super Admin için zorunlu (TOTP)

---

# 4. Dashboard

## 4.1 Ana Dashboard
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Loopin Admin Panel                              [🔔] [👤]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  GENEL İSTATİSTİKLER                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   15,420    │  │   8,500     │  │    120      │  │   1,500     ││
│  │ Toplam      │  │ Aktif       │  │ Günlük      │  │ Premium     ││
│  │ Kullanıcı   │  │ Kullanıcı   │  │ Etkinlik    │  │ Kullanıcı   ││
│  │ ↑ 12%       │  │ ↑ 8%        │  │ ↑ 5%        │  │ ↑ 15%       ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
│                                                                     │
│  GRAFİKLER                                                          │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────┐│
│  │  Kullanıcı Kayıt Trendi           │  │  Etkinlik Kategorileri ││
│  │                                   │  │                         ││
│  │    📈 Line Chart                  │  │    🥧 Pie Chart        ││
│  │                                   │  │                         ││
│  │  Son 30 gün                       │  │  Bu ay                  ││
│  └─────────────────────────────────────┘  └─────────────────────────┘│
│                                                                     │
│  SON AKTİVİTELER                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Son Kayıtlar                    │  Son Etkinlikler        │   │
│  │  ┌─────────────────────────────┐  │  ┌─────────────────────┐│   │
│  │  │ [Foto] Ahmet Y. - 2 dk önce│  │  │ 🍽️ Yemek @ Kadıköy││   │
│  │  │ [Foto] Zeynep K. - 5 dk önce│  │  │ ☕ Kahve @ Beşiktaş││   │
│  │  │ [Foto] Can D. - 10 dk önce  │  │  │ 🏃 Spor @ Belgrad ││   │
│  │  └─────────────────────────────┘  │  └─────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  BEKLEYEN İŞLEMLER                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🚨 12 Şikayet Beklemede        [İncele →]                │   │
│  │  ⏳ 5 Doğrulama Beklemede       [İncele →]                │   │
│  │  📝 3 Etkinlik Onay Beklemede   [İncele →]                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Dashboard API
```
GET /api/v1/admin/dashboard
Response: {
  "totalUsers": 15420,
  "activeUsers": 8500,
  "dailyEvents": 120,
  "premiumUsers": 1500,
  "newUsersToday": 45,
  "newEventsToday": 30,
  "applicationsToday": 150,
  "reportsPending": 12,
  "verificationsPending": 5,
  "eventsPending": 3,
  "userGrowth": [ /* last 30 days */ ],
  "eventCategories": [ /* distribution */ ],
  "recentUsers": [ /* last 10 */ ],
  "recentEvents": [ /* last 10 */ ]
}
```

---

# 5. Kullanıcı Yönetimi

## 5.1 Kullanıcı Listesi
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Kullanıcılar                                      [+ Yeni]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🔍 Ara...    [Filtrele ▼]    [Dışa Aktar]                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ID │ Ad │ Telefon │ Şehir │ Durum │ Rol │ Doğrulama │ İşlemler │
│  ───┼────┼─────────┼───────┼───────┼─────┼───────────┼──────────│
│  1  │ Ahmet Y. │ +90555...│ İstanbul│ Aktif│ User │ ✓ │ [👁️][✏️][🚫]│
│  2  │ Zeynep K.│ +90555...│ Ankara  │ Aktif│ User │ ✓ │ [👁️][✏️][🚫]│
│  3  │ Can D.   │ +90555...│ İzmir   │ Askı │ User │ ✗ │ [👁️][✏️][✓]│
│  4  │ Mehmet A.│ +90555...│ Bursa   │ Aktif│ Premium│ ✓ │ [👁️][✏️][🚫]│
│  ...│ ...      │ ...      │ ...     │ ...  │ ...  │ ...│ ...      │
│                                                                     │
│  ← 1  2  3  ...  50 →                                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Filtreleme Seçenekleri
- Durum: Aktif, Askıya Alındı, Silindi
- Rol: User, Premium, Admin, Super Admin
- Doğrulama: Doğrulanmış, Doğrulanmamış
- Şehir: Dropdown
- Kayıt Tarihi: Tarih aralığı
- Premium: Evet/Hayır

### API
```
GET /api/v1/admin/users?page=1&limit=50&status=active&role=user&verified=true&city=Istanbul
```

---

## 5.2 Kullanıcı Detay
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Kullanıcı Detayı                              [← Geri]       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │              [Profil Fotoğrafı]                             │   │
│  │                                                             │   │
│  │              Ahmet Yılmaz, 29                               │   │
│  │              ★ 4.8 (32 değerlendirme)                       │   │
│  │              [Doğrulanmış] [Premium]                        │   │
│  │                                                             │   │
│  │  📍 İstanbul  |  💼 Yazılım Mühendisi  |  🎓 Lisans      │   │
│  │                                                             │   │
│  │  🎯 Amaç: Yeni insanlarla tanışma                         │   │
│  │                                                             │   │
│  │  🏷️ İlgi Alanları: Yemek, Seyahat, Fotoğrafçılık, Teknoloji│   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  İSTATİSTİKLER                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │     32      │  │     18      │  │     45      │  │    150      ││
│  │  Katıldığı  │  │  Oluşturduğu│  │  Bağlantı   │  │  Mesaj      ││
│  │  Etkinlik   │  │  Etkinlik   │  │             │  │             ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
│                                                                     │
│  HESAP BİLGİLERİ                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ID: 550e8400-e29b-41d4-a716-446655440000                  │   │
│  │  Telefon: +905551234567                                    │   │
│  │  E-posta: ahmet@example.com                                │   │
│  │  Rol: User                                                 │   │
│  │  Durum: Aktif                                              │   │
│  │  Kayıt Tarihi: 15.01.2026                                  │   │
│  │  Son Giriş: 20.07.2026 14:30                               │   │
│  │  Premium: Evet (Bitiş: 20.08.2026)                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  GÜVENLİK                                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Telefon Doğrulama: ✓ Doğrulandı                           │   │
│  │  E-posta Doğrulama: ✓ Doğrulandı                           │   │
│  │  Fotoğraf Doğrulama: ✓ Doğrulandı                          │   │
│  │  Kimlik Doğrulama: ✗ Beklemede                             │   │
│  │  [Kimlik Belgesini Görüntüle]                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  İŞLEMLER                                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [✏️ Düzenle]  [🚫 Askıya Al]  [🗑️ Sil]  [📧 Mesaj Gönder]│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  SON ETKİNLİKLER                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Etkinlik          │ Tarih      │ Durum    │ İşlem          │   │
│  │  ──────────────────┼────────────┼──────────┼────────────────│   │
│  │  Akşam Yemeği @ K.│ 20.07.2026 │ Aktif    │ [Görüntüle]    │   │
│  │  Kahve & Sohbet   │ 15.07.2026 │ Tamamlandı│ [Görüntüle]    │   │
│  │  Koşu @ Belgrad   │ 10.07.2026 │ Tamamlandı│ [Görüntüle]    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ŞİKAYET GEÇMİŞİ                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Tarih      │ Tip              │ Durum    │ İşlem          │   │
│  │  ───────────┼──────────────────┼──────────┼────────────────│   │
│  │  18.07.2026 │ Uygunsuz davranış│ Çözüldü  │ [Detay]        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5.3 Kullanıcı Düzenle
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Kullanıcı Düzenle                              [← İptal]      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  AD SOYAD                                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Ahmet Yılmaz                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  TELEFON                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ +905551234567                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  E-POSTA                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ahmet@example.com                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ROL                                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ User                              [▼]                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  Seçenekler: User, Premium, Admin, Super Admin                    │
│                                                                     │
│  DURUM                                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Aktif                             [▼]                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  Seçenekler: Aktif, Askıya Alındı, Silindi                        │
│                                                                     │
│  DOĞRULAMA DURUMU                                                   │
│  [☑] Telefon    [☑] E-posta    [☑] Fotoğraf    [☐] Kimlik        │
│                                                                     │
│  NOT (Admin için)                                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Değişiklikleri Kaydet                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 6. Etkinlik Yönetimi

## 6.1 Etkinlik Listesi
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Etkinlikler                                     [+ Yeni]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🔍 Ara...    [Filtrele ▼]    [Dışa Aktar]                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ID │ Başlık │ Kategori │ Tarih │ Şehir │ Katılımcı │ Durum │ İşlem│
│  ───┼────────┼──────────┼───────┼───────┼───────────┼───────┼──────│
│  1  │ Akşam..│ 🍽️ Yemek │20.07  │ İstan.│ 2/4       │ Aktif │ [👁️][✏️][🚫]│
│  2  │ Kahve..│ ☕ Kahve  │21.07  │ İstan.│ 1/3       │ Aktif │ [👁️][✏️][🚫]│
│  3  │ Koşu.. │ 🏃 Spor   │22.07  │ İstan.│ 3/6       │ Tamam.│ [👁️][✏️][🗑️]│
│  4  │ Konser.│ 🎵 Konser │15.07  │ Ankara│ 45/50     │ İptal │ [👁️][✏️][🗑️]│
│  ...│ ...    │ ...      │ ...   │ ...   │ ...       │ ...   │ ...  │
│                                                                     │
│  ← 1  2  3  ...  25 →                                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Filtreleme Seçenekleri
- Durum: Aktif, Tamamlandı, İptal Edildi, Askıya Alındı
- Kategori: Tüm kategoriler
- Şehir: Dropdown
- Tarih: Tarih aralığı
- Oluşturan: Kullanıcı adı/ID
- Katılımcı sayısı: Min/Max

---

## 6.2 Etkinlik Detay
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Etkinlik Detayı                               [← Geri]       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    [Etkinlik Fotoğrafı]                       │   │
│  │                                                             │   │
│  │  🍽️ Yemek                [Doğrulanmış] [Premium]           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Akşam Yemeği @ Kadıköy                                            │
│                                                                     │
│  📅 20 Temmuz 2026, Salı 20:00                                    │
│  📍 Kadıköy, Moda Caddesi No:15, İstanbul                         │
│  [Haritada Gör]                                                    │
│                                                                     │
│  Açıklama                                                          │
│  Kadıköy'de güzel bir akşam yemeği için bir araya geliyoruz.     │
│                                                                     │
│  ─────────────────────────────────────────────────────────────      │
│                                                                     │
│  ETKİNLİK SAHİBİ                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Foto]  Ahmet Yılmaz, 29  ★ 4.8  [Doğrulanmış]          │   │
│  │  📍 İstanbul  |  👤 User                                   │   │
│  │  [Profili Görüntüle →]                                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  KATILIMCILAR (2/4)                                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Foto] Ahmet Y. (Sahip)  │ [Foto] Zeynep K.             │   │
│  │  [Foto] Can D. (Beklemede)│ [➕] Boş                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  BEKLENTİ VE AYARLAR                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Yaş Aralığı: 22-35                                        │   │
│  │  Cinsiyet: Herhangi                                        │   │
│  │  Ödeme: Herkes kendi öder                                  │   │
│  │  Beklenti: Sadece arkadaşlık                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  İŞLEMLER                                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [✏️ Düzenle]  [🚫 İptal Et]  [🗑️ Sil]  [📧 Bildirim]    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  BAŞVURULAR                                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Foto] Zeynep K. - "Katılmak istiyorum" - [✓] [✕]        │   │
│  │  [Foto] Can D.    - "İlginç bir etkinlik" - [✓] [✕]        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 7. Rapor Yönetimi

## 7.1 Rapor Listesi
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Şikayetler                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🔍 Ara...    [Filtrele ▼]                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Beklemede (12)] [İnceleniyor (3)] [Çözüldü (45)] [Reddedildi (8)]│
│                                                                     │
│  ID │ Şikayetçi │ Şikayet Edilen │ Tip │ Tarih │ Durum │ İşlem    │
│  ───┼───────────┼────────────────┼─────┼───────┼───────┼──────────│
│  1  │ Zeynep K. │ Mehmet A.      │ Taciz│18.07  │ Bekle.│ [👁️][✓]│
│  2  │ Can D.    │ Ayşe B.        │ Spam │17.07  │ Bekle.│ [👁️][✓]│
│  3  │ Ahmet Y.  │ Mehmet A.      │ Sahte│16.07  │ İncel.│ [👁️][✓]│
│  ...│ ...       │ ...            │ ...  │ ...   │ ...   │ ...     │
│                                                                     │
│  ← 1  2  3  ...  10 →                                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Filtreleme Seçenekleri
- Durum: Beklemede, İnceleniyor, Çözüldü, Reddedildi
- Tip: Uygunsuz davranış, Spam, Sahte profil, Taciz, Şiddet, Diğer
- Tarih: Tarih aralığı
- Öncelik: Yüksek, Normal, Düşük (otomatik hesaplanır)

---

## 7.2 Rapor Detay ve İnceleme
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Şikayet Detayı                                [← Geri]       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ŞİKAYET BİLGİLERİ                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ID: #1234                                                  │   │
│  │  Tarih: 18.07.2026 14:30                                   │   │
│  │  Durum: Beklemede                                          │   │
│  │  Öncelik: Yüksek                                            │   │
│  │  Tip: Taciz / Uygunsuz davranış                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ŞİKAYETÇİ                                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Foto]  Zeynep Kaya, 26  ★ 4.5                            │   │
│  │  📍 İstanbul  |  👤 User                                   │   │
│  │  [Profili Görüntüle →]                                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ŞİKAYET EDİLEN                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Foto]  Mehmet Aydın, 30  ★ 3.2                           │   │
│  │  📍 Ankara  |  👤 User  |  ⚠️ 3 şikayet                   │   │
│  │  [Profili Görüntüle →]  [Tüm Şikayetleri →]               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  İLİŞKİLİ ETKİNLİK                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🍽️ Akşam Yemeği @ Kadıköy                                 │   │
│  │  📅 15.07.2026  |  [Etkinliği Görüntüle →]                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ŞİKAYET METNİ                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Etkinlik sırasında uygunsuz davranışlarda bulundu ve      │   │
│  │  rahatsız edici mesajlar gönderdi.                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  KANITLAR (Ekran görüntüleri, mesajlar vb.)                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [📷 Ekran Görüntüsü 1]  [📷 Ekran Görüntüsü 2]           │   │
│  │  [💬 Mesaj Geçmişi]                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  İŞLEM GEÇMİŞİ                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  18.07.2026 14:30 - Şikayet oluşturuldu (Zeynep K.)       │   │
│  │  18.07.2026 15:00 - Otomatik atandı (Sistem)               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  KARAR                                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Aksiyon:                                                  │   │
│  │  [○] Kullanıcıyı Uyar                                      │   │
│  │  [○] Kullanıcıyı Askıya Al (Süre: [___] gün)             │   │
│  │  [○] Kullanıcıyı Kalıcı Olarak Engelle                    │   │
│  │  [○] Şikayeti Reddet                                       │   │
│  │                                                            │   │
│  │  Not:                                                      │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │                                                     │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                            │   │
│  │  [☐] Şikayetçiye bildirim gönder                         │   │
│  │  [☐] Şikayet edilene bildirim gönder                      │   │
│  │                                                            │   │
│  │  [Kararı Uygula]                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 8. Doğrulama Yönetimi

## 8.1 Bekleyen Doğrulamalar
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Doğrulamalar                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Telefon (0)] [E-posta (0)] [Fotoğraf (3)] [Kimlik (2)]           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Foto]  Can Demir, 30                                     │   │
│  │  Tip: Fotoğraf Doğrulama                                   │   │
│  │  Tarih: 20.07.2026 10:00                                   │   │
│  │  [👁️ Görüntüle]  [✓ Onayla]  [✕ Reddet]                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Foto]  Ayşe Balcı, 25                                   │   │
│  │  Tip: Kimlik Doğrulama                                     │   │
│  │  Tarih: 19.07.2026 15:30                                   │   │
│  │  [👁️ Görüntüle]  [✓ Onayla]  [✕ Reddet]                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 9. Abonelik ve Ödeme Yönetimi

## 9.1 Abonelik Listesi
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Abonelikler                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  GENEL İSTATİSTİKLER                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   1,500     │  │   ₺148,500  │  │   %12       │  │   45        ││
│  │ Aktif       │  │ Aylık Gelir │  │ Churn Rate  │  │ Yeni Bu Ay  ││
│  │ Abonelik    │  │             │  │             │  │             ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
│                                                                     │
│  ABONELİK LİSTESİ                                                   │
│  ID │ Kullanıcı │ Plan │ Başlangıç │ Bitiş │ Durum │ Ödeme │ İşlem│
│  ───┼───────────┼──────┼───────────┼───────┼───────┼───────┼──────│
│  1  │ Ahmet Y.  │ Aylık│ 20.07.26  │20.08.26│ Aktif │ Başarılı│ [👁️]│
│  2  │ Zeynep K. │ Yıllı│ 15.01.26  │15.01.27│ Aktif │ Başarılı│ [👁️]│
│  3  │ Can D.    │ Aylık│ 01.07.26  │01.08.26│ İptal │ İptal  │ [👁️]│
│  ...│ ...       │ ...  │ ...       │ ...   │ ...   │ ...   │ ...  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 10. İçerik Yönetimi

## 10.1 Etkinlik Kategorileri
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Kategoriler                                         [+ Ekle]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ID │ İsim     │ İkon     │ Renk      │ Etkinlik Sayısı │ İşlem   │
│  ───┼──────────┼──────────┼───────────┼─────────────────┼─────────│
│  1  │ Yemek    │ 🍽️       │ #FF6B6B   │ 450             │ [✏️][🗑️]│
│  2  │ Kahve    │ ☕       │ #8B4513   │ 320             │ [✏️][🗑️]│
│  3  │ Spor     │ 🏃       │ #45B7D1   │ 280             │ [✏️][🗑️]│
│  4  │ Konser   │ 🎵       │ #9B59B6   │ 150             │ [✏️][🗑️]│
│  ...│ ...      │ ...      │ ...       │ ...             │ ...     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 10.2 İlgi Alanları Yönetimi
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  İlgi Alanları                                       [+ Ekle]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ID │ İsim         │ Kategori │ Kullanıcı Sayısı │ İşlem           │
│  ───┼──────────────┼──────────┼─────────────────┼─────────────────│
│  1  │ Yemek        │ Sosyal   │ 5,420           │ [✏️][🗑️]       │
│  2  │ Seyahat      │ Seyahat  │ 3,200           │ [✏️][🗑️]       │
│  3  │ Fotoğrafçılık│ Hobi     │ 2,800           │ [✏️][🗑️]       │
│  ...│ ...          │ ...      │ ...             │ ...             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 11. Sistem Ayarları

## 11.1 Genel Ayarlar
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Sistem Ayarları                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  UYGULAMA AYARLARI                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Uygulama Adı                                               │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ Loopin                                                │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │  Bakım Modu                    [Toggle: Kapalı]          │   │
│  │  Yeni Kayıtlar                 [Toggle: Açık]              │   │
│  │  Yeni Etkinlikler              [Toggle: Açık]              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  KAYIT AYARLARI                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Telefon Doğrulama Zorunlu     [Toggle: Açık]              │   │
│  │  E-posta Doğrulama Zorunlu     [Toggle: Kapalı]            │   │
│  │  Fotoğraf Doğrulama Zorunlu    [Toggle: Kapalı]            │   │
│  │  Minimum Yaş                   [18]                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ETKİNLİK AYARLARI                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Maksimum Etkinlik (Ücretsiz)  [3]                         │   │
│  │  Maksimum Katılımcı            [50]                        │   │
│  │  Etkinlik Onayı Gerekli        [Toggle: Kapalı]           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  BİLDİRİM AYARLARI                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Push Bildirimleri             [Toggle: Açık]              │   │
│  │  E-posta Bildirimleri          [Toggle: Açık]              │   │
│  │  SMS Bildirimleri              [Toggle: Kapalı]            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Değişiklikleri Kaydet                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 12. Log ve Audit

## 12.1 Sistem Logları
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Sistem Logları                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Filtrele ▼]  [Tarih Aralığı]  [Dışa Aktar]              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Zaman            │ Seviye │ Kullanıcı │ Modül    │ Mesaj          │
│  ─────────────────┼────────┼───────────┼──────────┼────────────────│
│  20.07.26 14:30:15│ ERROR  │ system    │ auth     │ Token expired  │
│  20.07.26 14:25:00│ INFO   │ Ahmet Y.  │ events   │ Event created  │
│  20.07.26 14:20:00│ WARN   │ system    │ security │ Rate limit hit │
│  20.07.26 14:15:00│ INFO   │ Zeynep K. │ messages │ Message sent   │
│  ...              │ ...    │ ...       │ ...      │ ...            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 12.2 Admin Audit Log
```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡]  Admin İşlem Geçmişi                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Zaman            │ Admin      │ İşlem           │ Hedef    │ Detay │
│  ─────────────────┼────────────┼─────────────────┼──────────┼───────│
│  20.07.26 14:30  │ SuperAdmin │ Kullanıcı askıya│ Ahmet Y. │ 7 gün │
│  20.07.26 14:25  │ Admin      │ Etkinlik silindi│ #1234    │ -     │
│  20.07.26 14:20  │ Moderator  │ Şikayet çözüldü │ #567     │ Uyarı │
│  20.07.26 14:15  │ Admin      │ Doğrulama onay  │ Can D.   │ Foto  │
│  ...              │ ...        │ ...             │ ...      │ ...   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 13. API Endpoints (Admin)

## 13.1 Dashboard
```
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/stats/users?period=30d
GET    /api/v1/admin/stats/events?period=30d
GET    /api/v1/admin/stats/revenue?period=30d
```

## 13.2 Users
```
GET    /api/v1/admin/users
GET    /api/v1/admin/users/:id
PATCH  /api/v1/admin/users/:id/status
DELETE /api/v1/admin/users/:id
GET    /api/v1/admin/users/:id/events
GET    /api/v1/admin/users/:id/reports
```

## 13.3 Events
```
GET    /api/v1/admin/events
GET    /api/v1/admin/events/:id
PATCH  /api/v1/admin/events/:id/status
DELETE /api/v1/admin/events/:id
```

## 13.4 Reports
```
GET    /api/v1/admin/reports
GET    /api/v1/admin/reports/:id
PATCH  /api/v1/admin/reports/:id
GET    /api/v1/admin/reports/stats
```

## 13.5 Verifications
```
GET    /api/v1/admin/verifications?status=pending&type=photo
POST   /api/v1/admin/verifications/:id/approve
POST   /api/v1/admin/verifications/:id/reject
```

## 13.6 Subscriptions
```
GET    /api/v1/admin/subscriptions
GET    /api/v1/admin/subscriptions/:id
GET    /api/v1/admin/subscriptions/stats
```

## 13.7 Settings
```
GET    /api/v1/admin/settings
PATCH  /api/v1/admin/settings
GET    /api/v1/admin/logs
GET    /api/v1/admin/audit-logs
```

---

# 14. Admin Panel Teknik Detayları

## 14.1 Teknoloji Stack
| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| State | Zustand |
| Data Fetching | TanStack Query (React Query) |
| Charts | Recharts |
| Tables | TanStack Table |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

## 14.2 Route Yapısı
```
/admin
  /login
  /dashboard
  /users
    /[id]
    /[id]/edit
  /events
    /[id]
  /reports
    /[id]
  /verifications
  /subscriptions
  /categories
  /interests
  /settings
  /logs
  /audit-logs
```

## 14.3 Layout Yapısı
```tsx
// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

# SONUÇ

Bu admin panel spesifikasyonu, Loopin platformunun yönetim arayüzünün tüm ekranlarını, API endpoint'lerini ve teknik detaylarını tanımlar. Next.js tabanlı modern bir admin paneli hedeflenmektedir.
"""

with open('/mnt/agents/output/09-Admin-Panel.md', 'w', encoding='utf-8') as f:
    f.write(admin_panel)

print("✅ 09-Admin-Panel.md oluşturuldu")
