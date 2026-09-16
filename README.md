# skonutal.com

Satılık, kiralık ve yeni projeler için tek Docker container’da çalışan emlak platformu.

## Tek container ile çalıştırma

```bash
docker compose up --build
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)

İlk açılışta container kendi içinde PostgreSQL’i başlatır, şemayı uygular ve demo veriyi yükler.

### Demo hesaplar

| E-posta | Şifre | Rol |
|---------|-------|-----|
| demo@example.com | demo | Kullanıcı |
| admin@example.com | admin | Yönetici |
| corporate@example.com | corporate | Kurumsal |

## Yerel geliştirme

```bash
npm install
npm run dev
```

`DATABASE_URL` yoksa uygulama mock veri ile çalışır. Production Docker imajında veritabanı zorunludur ve container içinde gelir.
