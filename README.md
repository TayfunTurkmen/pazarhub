# sendekonutal.com

Satılık, kiralık ve yeni projeler için tek Docker container’da çalışan emlak platformu.

## Tek container ile çalıştırma

```bash
docker compose up --build
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)

İlk açılışta container kendi içinde PostgreSQL’i başlatır, şemayı uygular ve demo veriyi yükler.

### Demo hesaplar

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Bireysel üye | demo@example.com | demo |
| Kurumsal üye | corporate@example.com | corporate |
| Yönetici (Admin) | admin@example.com | admin |

Giriş sayfasında bu hesaplara tıklayarak formu otomatik doldurabilirsiniz.

Coolify ilk kurulumda demo veri için: `SEED_ON_START=1`

## Yerel geliştirme

```bash
npm install
npm run dev
```

`DATABASE_URL` yoksa uygulama mock veri ile çalışır. Production Docker imajında veritabanı zorunludur ve container içinde gelir.
