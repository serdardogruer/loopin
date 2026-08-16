# ♾️ Loopin V2 — Güvenlik Standartları ve Politikası (SECURITY.md)

---

## 1. Uygulanan Güvenlik Katmanları

1. **Helmet HTTP Güvenlik Başlıkları**: XSS, clickjacking ve MIME-sniffing saldırılarını engeller.
2. **CORS İzinleri**: Yalnızca `https://loopin.codapi.site` ve yetkilendirilmiş API istemcileri kabul edilir.
3. **Throttling / Rate Limiting**: Brute-force saldırılarını önlemek için dakika başına 100 istek sınırı konulmuştur.
4. **Zod & DTO Validasyonu**: Gelen tüm HTTP istek gövdeleri tiplendirilir ve sterilize edilir.
5. **ACID Kredi Concurrency Koruması**: Kredi harcama işlemlerinde veritabanı transaction kilidi (`FOR UPDATE`) kullanılır, negatif bakiye veya çifte harcama imkansız kılınır.
6. **Secrets İzolasyonu**: Hiçbir API anahtarı, JWT secret veya veritabanı şifresi kaynak koduna gömülmez; `.env` üzerinden yüklenir.
