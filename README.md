# Sahibinden Konut Al Klonu

Bu proje, popüler emlak ve alışveriş platformu benzeri kapsamlı bir ilan listeleme uygulamasıdır. Proje, Next.js (App Router) kullanılarak modern web standartlarına uygun, hızlı ve SEO dostu bir yapıda geliştirilmektedir. Platform, geniş kapsamlı emlak arama, listeleme, filtreleme ve detaylı ilan inceleme seçenekleri sunmayı hedeflemektedir.

## 🚀 Öne Çıkan Özellikler

- **Gelişmiş Arama ve Filtreleme:** Detaylı arama modülleri ile kullanıcıların aradıkları gayrimenkule veya ilana (il, ilçe, mahalle, fiyat, kategori vb.) çok boyutlu olarak filtreleme yaparak hızla ulaşabilmesi.
- **Harita Üzerinden Arama (Map Modu):** Kullanıcıların interaktif harita üzerinde ilanların lokasyonlarını görüntüleyip doğrudan harita üzerinden seçim yapabilme yeteneği.
- **Dinamik Kategori Yönetimi:** Konut, iş yeri, arsa, bina, devre mülk ve turistik tesis gibi zengin alt kırılımlara sahip kategori mimarisi.
- **Lokasyon Verisi Yönetimi:** Türkiye'deki il, ilçe ve mahalle verilerinin detaylı listelendiği ve bu yapı entegrasyonu sayesinde hassas lokasyon araması.
- **Gece / Gündüz Teması (Dark & Light Mode):** Kullanıcı tercihine göre kolayca değiştirilebilen ve tüm platforma uygulanan tam uyumlu renk temaları.
- **Çoklu Dil Desteği (i18n):** `next-intl` entegrasyonu ile uygulamanın farklı diller için özelleştirilebilir yapıda çalışması.
- **Responsive (Duyarlı) ve Modern Tasarım:** Mobil, tablet ve masaüstü cihazlarla tam uyumlu Tailwind CSS v4 tabanlı kullanıcı arayüzü ve modern tipografi (Lucide React ikon desteği ile).
- **SEO Dostu Altyapı:** Next.js Server Components sayesinde arama motoru optimizasyonu (SEO).

## 🛠 Kullanılan Teknolojiler ve Araçlar

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Stil Yönetimi:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Uluslararasılaştırma (i18n):** [next-intl](https://next-intl-docs.vercel.app/)
- **Tema Yönetimi:** [next-themes](https://github.com/pacocoursey/next-themes)
- **İkonlar:** [Lucide React](https://lucide.dev/)
- **Dil:** TypeScript

## 📂 Proje Yapısı

- `src/app/`: Next.js App Router yapısındaki sayfalarımız, lokasyon rotalarımız (`[locale]`) ve yerleşim (layout) dosyaları.
- `src/components/`: Bileşen bazlı geliştirme yaklaşımıyla hazırladığımız tekrar kullanılabilir UI elemanları:
  - `home/`: Anasayfaya özel bölümler ve manşet bileşenleri.
  - `listing/`: İlan listeleme, detaylı görünüm ve filtreleme bileşenleri.
  - `layout/`: Navbar, Footer, Tema Seçici vb. temel yapı taşları.
  - `ui/`: Butonlar, inputlar vb. temel ara yüz malzemeleri.
- `src/i18n/`: Çeviri verileri, yapılandırma ve yönlendirme dosyaları.
- `src/services/` ve `mockData/`: Projeye temel oluşturan sahte (mock) veri servisleri ve veri tabanı simülasyonları.

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz.

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   # veya
   yarn install
   # veya
   pnpm install
   ```

2. Geliştirme (development) sunucusunu başlatın:
   ```bash
   npm run dev
   # veya
   yarn dev
   # veya
   pnpm dev
   ```

3. Uygulamayı inceleyin:
   Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek platformu yerel ağınızda test edebilirsiniz. Uygulamanın Türkçe versiyonu örneğin `/tr` rotası altında çalışacaktır.

## Production Altyapısı

Proje mock veritabanı olmadan da çalışabilir; `DATABASE_URL` tanımlandığında Prisma + PostgreSQL devreye girer.

### Ortam Değişkenleri

```bash
cp .env.example .env
```

| Değişken | Açıklama |
|----------|----------|
| `DATABASE_URL` | PostgreSQL bağlantı dizesi |
| `AUTH_SECRET` | NextAuth JWT imzalama anahtarı |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (opsiyonel) |
| `UPSTASH_REDIS_*` | Rate limiting (opsiyonel) |

### PostgreSQL (Docker)

```bash
npm run db:up          # PostgreSQL başlat
npm run db:push        # Şemayı uygula
npm run db:seed        # Demo verileri yükle
npm run db:setup       # Üç komutu sırayla çalıştırır
```

Varsayılan bağlantı: `postgresql://postgres:postgres@localhost:5432/sahibindenkonutal`

### Demo Hesaplar

| E-posta | Şifre | Rol |
|---------|-------|-----|
| demo@example.com | demo | Kullanıcı |
| admin@example.com | admin | Yönetici |
| corporate@example.com | corporate | Kurumsal |

### E2E Testleri

```bash
npx playwright install chromium
npm run test:e2e
```

### API Özeti

- `POST /api/auth/register` — Kayıt
- `GET/POST /api/listings` — İlan listele / oluştur
- `PATCH /api/listings/[id]` — İlan güncelle (admin: durum onayı)
- `GET /api/admin/stats` — Yönetici istatistikleri
- `GET /api/admin/listings` — Tüm ilanlar (admin)
- `GET/POST /api/favorites` — Favoriler
- `GET/POST /api/conversations` — Mesajlaşma
- `POST /api/upload` — Görsel yükleme

## 🤝 Katkıda Bulunma

Geri bildirimleriniz ve pull request (PR) gönderimleriniz projenin gelişimine katkıda bulunmak için her zaman açıktır.
