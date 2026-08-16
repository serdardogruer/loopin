# ♾️ Loopin - Product Requirements Document (PRD)
### Versiyon: 2.2 | Son Güncelleme: 2026-07-20 | Durum: Canlı Üretim & Tamamlandı (Production Ready)

---

## 1. Proje Genel Bilgileri

### Proje Adı
**Loopin** (Gerçek Zamanlı Etkinlik ve Sosyal Buluşma Platformu)

### Ürün Tanımı ve Felsefesi
Loopin, insanların ortak ilgi alanları, anlık konumları ve gerçek hayat aktiviteleri üzerinden yeni insanlarla tanışmasını sağlayan uçtan uca sosyal etkinlik, eşleştirme ve topluluk platformudur. 

Loopin'in temel mottosu: **"Önce etkinlik, sonra tanışma."**
Sıradan sosyal medya ve romantik eşleşme uygulamalarının aksine Loopin, kullanıcıları ekran karşısında sanal mesajlaşmada tutmak yerine, gerçek hayatta kaliteli zaman geçirebilecekleri güvenli etkinliklerde bir araya getirmeyi hedefler.

---

## 2. Problem Tanımı

Mevcut sosyal ağlar ve tanışma uygulamaları aşağıdaki temel yetersizliklere sahiptir:

1. **Sanal Kaydırma Kısır Döngüsü**: Kullanıcılar profilleri sağa/sola kaydırır ancak bu etkileşimler %90 oranında gerçek hayatta buluşmaya dönüşmez.
2. **Ortak Payda Eksikliği**: Bir amaç veya aktivite olmadan başlatılan sohbetler kısa sürede tıkanır ("Selam, naber?").
3. **Yalnızlık ve Uyum Sağlama Zorluğu**: Yeni bir şehre taşınan, yeni bir hobi edinen veya sosyal çevresini genişletmek isteyen bireyler kendilerine eşlik edecek güvenilir partner bulmakta zorlanır.
4. **Güven ve Şeffaflık Endişesi**: Sahte hesaplar, güncel olmayan fotoğraflar ve belirsiz buluşma planları güvenlik kaygısı yaratır.

### Çözüm Hipotezi:
"Eğer insanlara ne yapmak istediklerini (etkinlik/aktivite) ve nerede yapmak istediklerini belirtme imkanı sunarsak, ortak paydada buluşan kişilerin gerçek hayatta bir araya gelme oranı %300 artar ve sohbet başlatma bariyeri ortadan kalkar."

---

## 3. Navigasyon ve Ekran Mimarisi (4 Ana Sekme & Logo Entegrasyonu)

Platform hem web hem mobil görünümde (Responsive Mobile-First) sadeleştirilmiş **4 Ana Sekme** ve **Tek Tıkla Ana Sayfaya Dönüş** mekanizması ile çalışır:

```
                  ┌──────────────────────────────────────────┐
                  │          LOOPIN BRAND LOGO               │
                  │   (Sol Üst Logo -> Ana Sayfaya Dönüş)    │
                  └────────────────────┬─────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│ 1. ANA SAYFA    │           │ 2. OLUŞTUR      │           │ 3. MESAJLAR     │
│ (Feed & Swiper) │           │ (Etkinlik Kur)  │           │ (Canlı Chat)    │
└─────────────────┘           └─────────────────┘           └─────────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │ 4. PROFİLİM     │
                              │ (Sekmeli Kart)  │
                              └─────────────────┘
```

1. 🌐 **Ana Sayfa (Feed & Harita Radar)**: 
   - **Kaydırma Modu (Swiper)** & **Liste Modu (List)** dinamik görünüm değişimi (`localStorage` kalıcı seçim).
   - 18 Kategori Akordiyonu (Kahve, Konser, Spor, Gezi, Sinema, Teknoloji, Yemek, Gece Hayatı vb.).
   - Gelişmiş Arama & Filtreleme Motoru (`getFilteredEvents`).
2. 🗓️ **Etkinliklerim & Yönetim Hub'ı (My Events)**:
   - Ev Sahipliği Yapılan (Aktif), Katılınan ve Geçmiş Etkinliklerin 3 sekmeli yönetimi.
   - Ev Sahibi kullanıcılar için **[✏️ Etkinliği Düzenle]** ve **[🗑️ İptal Et / Sil]** modalları ve dinamik aksiyonları.
3. ➕ **Oluştur (Create Event)**:
   - 7 Adımlı detaylı etkinlik oluşturma sihirbazı (Görsel, Yüz Yüze/Online, Şehir/İlçe, Mekan, Tarih/Saat, Kontenjan, Yaş, Cinsiyet, Bütçe, Dil, Ulaşım, Çip Etiketler ve Kurallar).
4. 💬 **Mesajlar & Sohbet (Messages)**:
   - Aktif sohbet odaları ve 1-on-1 mesajlaşma listesi.
   - Canlı İnteraktif Sohbet Modalı (`chatModal`): Mesaj baloncukları, anlık zaman damgası ve mesaj gönderme.
5. 👤 **Profilim (Profile)**:
   - 3 Birleşik Alt Sekme: **[📸 Fotoğraflar]**, **[👤 Bilgiler & Yaşam]**, **[🛡️ Güven & İtibar]**.
   - Entegre **Loopin Premium PRO** üyelik bandı ve Güven Skoru / Katılım istatistiklerinden **Etkinliklerim** ekranına hızlı geçiş.
   - Profili Düzenle Modalı (`editProfileModal`) ve Ayarlar Modalı (`settingsModal`).

---

## 4. Kullanıcı Rolleri ve Yetki Matrisi

| Yetki / Özellik | Misafir | Standart Kullanıcı | Premium Üye | Admin / Moderatör |
| :--- | :---: | :---: | :---: | :---: |
| **Etkinlik Keşfi & Harita** | Read-Only | ✅ | ✅ | ✅ |
| **Profil Oluşturma & Galerisi** | ❌ | 6 Fotoğraf Grid | 6 Fotoğraf + Öne Çıkarma | Full Yönetim |
| **Aylık Etkinlik Oluşturma** | ❌ | 3 Etkinlik / Ay | ♾️ Sınırsız | ♾️ Sınırsız |
| **Etkinliğe Başvuru Yapma** | ❌ | ✅ | ✅ (Öncelikli Başvuru) | ✅ |
| **Anlık Sohbet & Mesajlaşma** | ❌ | Başvuru Onaylı | Başvuru Onaylı + Direkt | Sınırsız İnceleme |
| **Gelişmiş Filtreler & Radar** | ❌ | Temel Filtre | Gelişmiş + GPS Yarıçap | ✅ |
| **Profil Rozeti & Mavi Tık** | ❌ | Doğrulanmış | Premium Rozeti + Tık | Admin Rozeti |
| **Yönetim Paneli & Raporlama** | ❌ | ❌ | ❌ | Full Access |

---

## 5. Detaylı Sistem Modülleri

---

### MODÜL 1: Kullanıcı ve Profil Sistemi (Zengin Profil & Sekmeli Görünüm)

#### 1.1 Kayıt & Doğrulama Akışı
* **Kayıt Seçenekleri**: Telefon No (SMS OTP), E-posta + Şifre, Google Sign-In, Apple ID.
* **Doğrulama Katmanları**:
  * **SMS/E-Posta Doğrulama**: Zorunlu ilk adım (Profilde yeşil "Doğrulandı" etiketleri).
  * **Selfie / Canlılık Doğrulaması**: Mavi Tık (Verified Badge) kazanımı.

#### 1.2 Profil Kartı & Sekmeli Yapı
Profil ekranı karmaşıklıktan uzak, 3 ana alt panelde sunulur:
* **Üst Hero Kartı**: Profil fotoğrafı, Mavi Tık, Ad Soyad, Yaş, Kullanıcı adı, Meslek, Şehir ve entegre Premium PRO durumu.
* **İstatistik & Güven Bandı**: Katıldığı (14), Kurduğu (8), Güven Skoru (%98 Top %1) ve Değerlendirme Puanı (4.9 ★).
* **Sekme 1 (📸 Fotoğraflar)**: 6'lı resim galerisi, tıklandığında büyüyen tam ekran Lightbox zoom görünümü.
* **Sekme 2 (👤 Bilgiler & Yaşam)**: Bio (Hakkımda), Kullanıcı Amacı (Sosyal, Flört, Arkadaşlık), İletişim Doğrulama Durumu ve Yaşam Tarzı Rozetleri (Boy, Burç, Sigara, Alkol, Spor, Evcil Hayvan).
* **Sekme 3 (🛡️ Güven & İtibar)**: %100 Zamanında Geldi, %98 Saygılı Davrandı, %95 İletişimi İyiydi vb. detay kırılımları.

---

### MODÜL 2: Etkinlik Oluşturma ve Yönetim Sistemi (7 Adımlı Form)

Kullanıcılar navigasyondaki **"Oluştur"** sekmesi üzerinden 7 kapsamlı aşamada etkinlik oluşturabilir:

1. **Görsel & Temel Bilgiler**: Etkinlik Başlığı, Kapak Fotoğrafı URL'i ve Kategori (18 Farklı Kategori).
2. **Konum & Mekân Türü**: Yüz Yüze / Online Etkinlik seçimi, Şehir/İlçe, Açık Adres veya Mekan Türü (Kafe, Park, Sahil, Restoran, Bar vb.).
3. **Tarih & Saat**: Başlangıç tarihi ve saati.
4. **Katılımcı & Tercihler**: Kontenjan Limiti (Min: 2, Max: 100), Cinsiyet Tercihi (Karma, Kadınlar, Erkekler), En Az/En Çok Yaş Aralığı.
5. **Bütçe & Ücret Yapısı**: Herkes Kendi Öder, Etkinlik Sahibi İkram Eder, Ortak Ödeme (Alman Usulü), Ücretsiz. Etkinlik Dili (Türkçe, İngilizce, Almanca vb.).
6. **Özellikler & Çip Etiketler**: Açık Hava, Kapalı Mekan, Evcil Hayvan Dostu, Toplu Taşıma Yakın, Otopark, Vejetaryen/Vegan, Fotoğraf Çekimi vb.
7. **Detaylı Açıklama & Kurallar**: Serbest metin açıklama ve özel kurallar.

---

### MODÜL 3: Keşif, Harita ve Filtreleme Engine (`getFilteredEvents`)

#### 3.1 Görünüm Modları
1. **Kaydırma Modu (Swiper Feed)**: Kart mimarisinde dokunmatik/sürüklemeli sola (geç) ve sağa (katıl) kaydırma etkileşimi.
2. **Liste Görünümü (List Feed)**: Grid kart yapısında tarih ve mesafeye göre sıralı listeleme.
3. **Görünüm Modu Hafızası**: `setFeedMode(mode)` kullanıcının Swiper/List seçimini `localStorage` üzerinde saklar.

#### 3.2 Merkezi Filtreleme Motoru
`getFilteredEvents()` fonksiyonu tüm filtreleri anlık ve eş zamanlı işler:
* Metin Arama (`searchInput`)
* Kategori Seçimi (18 Kategori)
* Radar / Konum Mesafesi (Sınırsız, 1km - 100km)
* Bütçe & Ücret Türü
* Cinsiyet Tercihi & Dil
* Güven Skoru & Yaş Aralığı
* Sıralama Seçenekleri (En Yakın Tarih, En Yakın Konum, En Popüler, En Güvenilir, En Yeni, Ücretsiz Önce)

---

### MODÜL 4: Katılım Başvuru ve Eşleşme Mantığı

1. **Katılım Talebi**: Kullanıcı bir etkinliğe katılım isteği gönderir.
2. **Organizatör İncelemesi**: Etkinlik sahibi, başvuran kişinin profilini, fotoğraflarını, rozetlerini ve güven skorunu inceler.
3. **Kabul / Red**: Onaylanan katılımcı özel sohbet odasına otomatik dahil edilir.

---

### MODÜL 5: Anlık Sohbet ve Canlı Mesajlaşma (`chatModal`)

* **1-on-1 Özel Sohbet & Etkinlik Odaları**: Mesajlar sekmesinden seçilen kişilerle canlı chat ekranı açılır.
* **Canlı Sohbet Odası Modalı (`chatModal`)**:
  * Kullanıcı başlığı, profil resmi ve online durumu.
  * Gelen/Giden mesaj baloncukları (`incoming`, `outgoing`).
  * Anlık mesaj yazma, `Enter` veya `Gönder` tuşu ile baloncuk ekleme.
  * Otomatik alta kaydırma (`scrollTop = scrollHeight`).

---

### MODÜL 6: Puanlama, İtibar ve Güven Skoru Sistemi

#### 6.1 Davranış Odaklı Etkinlik Sonrası Değerlendirme Sistemi
Etkinlik tamamlandıktan sonra katılımcılar birbirlerini tek bir yıldız puanı yerine davranış odaklı somut seçeneklerle değerlendirir:

* **Olumlu Davranışlar (Pozitif Geri Bildirimler):**
  * ✅ **Zamanında geldi.**
  * ✅ **Saygılı davrandı.**
  * ✅ **İletişimi iyiydi.**
  * ✅ **Etkinliğe katkı sağladı.**
  * ✅ **Tekrar katılmak isterim.**

* **Olumsuz Davranışlar (Negatif Geri Bildirimler):**
  * ❌ **Gelmedi.**
  * ❌ **Son anda iptal etti.**
  * ❌ **Saygısız davrandı.**

---

### MODÜL 7: Dağıtım & Başlatma Komut Dosyası (`start.bat`)

Projeyi tek tıkla canlıya alan gelişmiş Windows Batch Komut Dosyası (`start.bat`):
1. Eski çalışan NestJS veya HTTP Server süreçlerini otomatik sonlandırır.
2. `ipconfig` ile yerel Wi-Fi IPv4 adresini (örn: `192.168.1.5`) tespit eder.
3. **NestJS Backend**: Port `3000` üzerinde başlatılır (`npm run start:dev`).
4. **Web HTTP Server**: Port `8080` üzerinde `0.0.0.0` tüm ağ kartlarına açık olarak başlatılır (`npx http-server web -p 8080 -a 0.0.0.0 --cors -c-1`).
5. **Dinamik API Base URL**: Web istemcisi (`web/app.js`) `window.location.hostname` kullanarak telefon bağlantılarında `http://192.168.1.5:3000/api/v1` adresine otomatik bağlanır.

---

### MODÜL 8: Zengin Etkinlik Detay Sayfası Mimarisi

Loopin uygulamasının en zengin ve etkileşimli sayfası olan **Etkinlik Detay Sayfası**, aşağıdaki bileşen mimarisine sahiptir:

1. **Etkinlik Bilgileri & Başlık Kartı**:
   * **Büyük Kapak Fotoğrafı**: HD kalitede ana görsel ve görsel galerisi geçişi.
   * **Başlık & Kategori**: Etkinlik adı, Ana Kategori (örn: Spor, Kahve, Gezi) ve Alt Kategori (örn: Doğa Yürüyüşü, Filter Coffee, Kamp).
   * **Etiketler (Tags)**: Çip etiketler (`#Trekking`, `#BelgradOrmanı`, `#KahveSeverler`).
   * **Zaman Parametreleri**: Başlangıç tarihi, saati, toplam etkinlik süresi (örn: 3 Saat) ve Anlık Kalan Süre Sayacı ("2 Gün 4 Saat Kaldı").
   * **Kontenjan & Doluluk Oranı**: Toplam kontenjan, mevcut katılan sayısı ve görsel Doluluk Oranı Barı (%80 Dolu - Son 2 Koltuk).
   * **Ücret & Bütçe**: Ücret miktarı (TL) veya yeşil parlak **"Ücretsiz"** etiketi.
   * **Kayıt Zamanı**: Son kayıt tarihi ve saati uyarısı.

2. **Gelişmiş Konum & Mekân Modülü**:
   * **Harita Entegrasyonu**: Google Maps interaktif harita önizlemesi ve GPS koordinatları.
   * **Yol Tarifi & Ulaşım**: Tek tıkla Google Maps / Apple Maps navigasyon açma. Toplu taşıma yakınlık bilgisi (örn: "M2 Metro Durağına 300m") ve Otopark durumu (örn: "Ücretsiz Açık Otopark Mevcut").
   * **Mekân Detayları**: Mekân fotoğrafları galerisi, kullanıcı mekan puanı (4.8 ★) ve mekân açıklaması.

3. **Organizatör İtibar & Profil Kartı**:
   * **Ev Sahibi Kimliği**: Profil fotoğrafı, Ad Soyad, Mavi Doğrulanmış Tık.
   * **İtibar Metrikleri**: Güven Puanı (%98 Güvenilir), Kazanılan Rozetler (Top Ev Sahibi, Süper Organizatör), Düzenlenen Toplam Etkinlik Sayısı, Ortalama Değerlendirme Puanı, Son Giriş Zamanı ("10 dk önce aktifti").
   * **Organizatör Aksiyonları**: `[Profili Gör]`, `[Takip Et]`, `[Arkadaş Ekle]`, `[Mesaj Gönder]`.

4. **Katılımcılar & Sosyal Ağ Modülü**:
   * **Katılanlar & Bekleme Listesi**: Onaylanan katılımcıların avatar listesi ve bekleme listesindekiler.
   * **"Arkadaşların Kimler Gidiyor?"**: Kullanıcının ekli arkadaşlarından bu etkinliğe katılanların öne çıkarılan listesi.
   * **Kullanıcı Kartı Detayı**: Katılımcıların Premium Rozeti ve Güven Puanı gösterimi.

5. **Açıklama, Program & Kurallar Modülü**:
   * **Uzun Açıklama**: Detaylı etkinlik içeriği ve metin anlatımı.
   * **Program (Agenda)**: Saatlik veya aşamalı etkinlik akışı (örn: 10:00 Buluşma, 10:30 Yürüyüş Başlangıcı, 12:30 Mola).
   * **Yanında Getirilecekler**: Katılımcının getirmesi gerekenler listesi (örn: Matara, Yürüyüş Ayakkabısı).
   * **Kurallar & İptal Şartları**: Etkinlik kuralları ve son iptal süresi / şartları.

6. **Zengin Medya Galerisi**:
   * Fotoğraflar, Tanıtım Videoları ve Bu Organizatörün Geçmiş Etkinlik Fotoğrafları.

7. **Etkinlik Altı Alt Aksiyon Barı**:
   * ✅ **Beğen** (Beğeni sayısını artırır)
   * ❤️ **Favorilere Ekle**
   * 💬 **Yorum Yap** (Instagram stili alt sayfaya odaklar)
   * 🔁 **Paylaş** (Instagram, WhatsApp, Telegram, X, Facebook, Bağlantıyı Kopyala, QR Kod)
   * 📤 **Arkadaşını Davet Et**
   * 📅 **Takvime Ekle** (Google, Apple, Outlook)
   * 🔔 **Hatırlatıcı Kur**

---

### MODÜL 9: Instagram Seviyesinde Hiyerarşik Yorum ve Reaksiyon Sistemi

Platformdaki sosyal etkileşimi en üst seviyeye çıkarmak için geliştirilen hiyerarşik yorum sistemi:

1. **Çok Seviyeli Yanıt Ağacı (Nested Tree Replies)**:
   * **Ana Yorum**: Etkinliğe doğrudan yazılan yorum.
   * **Yanıt (1. Seviye)**: Ana yoruma verilen yanıt.
   * **Yanıtın Yanıtı (2. Seviye & Derinlik)**: Yanıta verilen alt yanıtlar (Etiketli kullanıcı adı `@ahmet` gösterimi).
2. **Reaksiyon & Moderasyon**:
   * **Yorum Beğenisi & Emoji**: Yorum bazlı kalp/beğeni ve hızlı emoji reaksiyonları (🔥, ❤️, 👏, 😂).
   * **Yorum Sabitleme (Pin)**: Etkinlik sahibinin önemli duyuru veya yorumları en üste sabitlemesi.
   * **Moderasyon & Şikayet Et**: Uygunsuz yorumları raporlama / engelleme.
3. **Çoklu Paylaşım & Sosyal Entegrasyon**:
   * **Paylaşım Kanalları**: Instagram Stories, WhatsApp, Telegram, X (Twitter), Facebook, Bağlantıyı Kopyala.
   * **Etkinlik QR Kodu**: Etkinlik detayını anında QR kod olarak üretip paylaşma ve taratma.

---

### MODÜL 10: Sosyal Arkadaşlık ve İlişki Sistemi

Kullanıcılar arası kalıcı bağlar kurulmasını sağlayan sosyal arkadaşlık altyapısı:

1. **Kişiler Arası Aksiyonlar**:
   * `[Arkadaş Ekle]`, `[Takip Et]`, `[Mesaj Gönder]`, `[Engelle]`, `[Sessize Al]`, `[Rapor Et]`.
2. **Arkadaşlar İçin Durum & Ortaklık Göstergeleri**:
   * **Çevrimiçi Durumu**: Anlık Online yeşil noktası ve Son Görülme zamanı.
   * **Konum Yakınlığı**: "2 km yakınında".
   * **Ortak İstatistikler**: Ortak ilgi alanları, Ortak katılan etkinlikler ve Birlikte geçmişte katılınen etkinliklerin sayısı.

---

### MODÜL 11: Zengin Profil Sayfası Mimarisi

Profil sayfası kullanıcının sosyal kartviziti ve dijital itibar merkezidir:

* **Güven Puanı & Rozet Vitrini**: %0-100 Güven Skor Kartı ve Kazanılan Başarım Rozetleri.
* **Sosyal Metrikler**: Arkadaş sayısı, Katıldığı etkinlik sayısı, Oluşturduğu etkinlik sayısı.
* **Medya Galerisi**: Yüklenen Fotoğraflar ve Videolar grid görünümü.
* **Sekmeli İçerik**: Favoriler listesi, Yaptığı yorumlar geçmişi, Seçili İlgi Alanları.

---

### MODÜL 12: Akıllı Bildirim ve Takvim Senkronizasyon Sistemi

1. **Kapsamlı Anlık Bildirimler (Push Notifications)**:
   * 📍 **Yakındaki Etkinlik**: Yarıçap içinde yeni etkinlik kurulduğunda.
   * 👥 **Arkadaş Etkinliği**: Bir arkadaşın yeni etkinlik oluşturması veya katılması.
   * ❌ **İptal Bildirimi**: Etkinliğin ev sahibi tarafından iptal edilmesi.
   * 💬 **Yorum & Beğeni**: Yorumuna yanıt geldiğinde veya beğenildiğinde.
   * 🤝 **Arkadaş İsteği & Mesaj**: Yeni arkadaşlık talebi veya 1-on-1 mesaj.
   * ⏰ **Hatırlatıcılar**: "Etkinlik Yarın Saat 14:00'da!" ve "Etkinlik Şimdi Başladı!".
2. **Takvim Senkronizasyonu (Calendar Sync)**:
   * Katılınan veya takvime eklenen etkinlikleri telefonun yerel takvimi, **Google Calendar**, **Apple Calendar** ve **Outlook** ile `.ics` veya API üzerinden otomatik senkronize etme.

---

### MODÜL 13: QR Kod Katılım Doğrulaması & Etkinlik Albümü / Anılar (Memories)

1. **QR Kod ile Giriş & Doğrulama (Check-in Validation)**:
   * Etkinlik mekanında katılımcı telefonundaki QR kodu organizatöre okutur.
   * Sistem katılımı anında doğrular ("Katılım Onaylandı"). Böylece kullanıcının gerçekten gelip gelmediği kesinleşir ve Güven Skoru buna göre hesaplanır.
2. **Etkinlik Albümü & Anılar (Event Album & Memories)**:
   * Etkinlik tamamlandıktan sonra organizatör ve katılımcılar ortak albüme fotoğraf ve video yükleyebilir.
   * Fotoğraflara katılan diğer kullanıcılar etiketlenebilir (Tagging).
   * Oluşan albüm kişisel **"Anılarım (Memories)"** sekmesine eklenir. Bu özellik, aynı toplulukla tekrar etkinliğe katılımı ve platform sadakatini teşvik eder.

---

### MODÜL 14: Favoriler, İzleme Listesi ve AI Etkinlik Öneri Motoru

1. **Favori & Liste Aksiyonları**:
   * **[Kaydet]**, **[Sonra Git]**, **[İzleme Listesi]**, **[Tekrar Katıl]** (Geçmişte çok beğenilen etkinlikleri tekrarlama).
2. **AI Etkinlik Öneri Motoru (Contextual AI Assistant)**:
   * **Hava Durumu Duyarlı Öneriler**: Örn. *"Bugün hava yağmurlu. Sana yakın kapalı mekanlarda 12 sıcak etkinlik buldum!"*
   * **Kişisel Davranış Analizi**: Örn. *"Geçen ay 4 kez kamp etkinliğine katıldın. Bu hafta sonu sana uygun 3 yeni kamp etkinliği var!"*

---

### MODÜL 15: 🎉 Etkinlik Duvarı (Activity Feed)

Uygulamayı sıradan bir etkinlik arama aracından **canlı bir sosyal platforma** dönüştüren dinamik zaman tüneli akışı:

* Ana sayfada sadece etkinlik listesi değil, kullanıcıların ve arkadaşlarının platformdaki anlık etkileşimleri görünür:
  * *"Ayşe, Cumartesi Trekking etkinliğine katıldı."*
  * *"Mehmet yeni bir kahve etkinliği oluşturdu."*
  * *"Ali, Fotoğraf Yürüyüşü etkinliğinden 12 fotoğraf paylaştı."*
  * *"Elif bu etkinliği beğendi."*
  * *"Can, Organizatör Rozeti kazandı."*
* Böylece kullanıcılar etkinlik aramasalar bile günlük olarak akışı takip etmek için uygulamayı ziyaret eder.

---

### MODÜL 16: Otomatik Etkinlik Skoru Motoru (0–100 Event Score)

Her etkinliğin tamamlanmasının ardından arka planda otomatik hesaplanan şeffaf başarı skoru:

* **Katılım Oranı (%30)**: Gerçekleşen QR Check-in / Kontenjan oranı.
* **Zamanında Başlama (%20)**: Etkinlik başlangıç zamanına uyum.
* **Katılımcı Memnuniyeti (%20)**: Etkinlik sonrası verilen ortalama davranış puanları.
* **Yorum Sayısı & Etkileşim (%10)**: Yorum ve canlı sohbet aktivitesi.
* **Fotoğraf Paylaşımı (%10)**: Yüklenen albüm medya sayısı.
* **Tekrar Katılma İsteği (%10)**: Katılımcıların tekrar katılım beyanı.

---

## 6. Teknik Mimarisi ve Teknoloji Yığını

* **Web Front-End**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Custom Design System & Glassmorphism).
* **Mobile App**: Flutter 3.x + Riverpod 2.x (State Management) + Dio Client.
* **Backend API**: NestJS 11 + TypeScript + TypeORM + Swagger OpenAPI.
* **Database**: PostgreSQL 16 + PostGIS (Coğrafi Konum Aramaları).
* **Web Server**: Node.js `http-server` (Cors & Uncached mode).
* **Process Launcher**: `start.bat` (Multi-process CLI Orchestrator).

---

## 7. Başarı Metrikleri (KPI'lar)

1. **Etkinlik Buluşma Oranı (Match-to-Meet Ratio)**: Oluşturulan etkinliklerin %70+'sinin başarıyla gerçekleşmesi.
2. **DAU / MAU Oranı**: Günlük aktif kullanıcının aylık aktif kullanıcıya oranı (%40+ hedef).
3. **Kullanıcı Güven Derecesi**: Ortalama platform güven skorunun 4.5+ seviyesinde tutulması.

---

## SONUÇ

Loopin, ekran kaydırmaya dayalı yüzeysel sosyalleşme kısırdöngüsünü kırarak, **aktivite merkezli gerçek insan ilişkileri** kurmayı hedefleyen, uçtan uca tamamlanmış ve canlıda çalışan modern bir sosyal platformdur.
