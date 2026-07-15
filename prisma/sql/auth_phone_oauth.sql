-- Auth: telefon unique, SiteSetting, varsayılan giriş ayarları
-- PostgreSQL — mevcut Prisma şeması üzerine uygulanır

BEGIN;

-- 1) SiteSetting tablosu
CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "key"       TEXT NOT NULL,
    "value"     TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- 2) User.phone unique (önce çakışan numaraları temizleyin)
-- Aynı telefona sahip birden fazla kayıt varsa migration başarısız olur.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'User_phone_key'
    ) THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_phone_key" UNIQUE ("phone");
    END IF;
END $$;

-- 3) Varsayılan auth ayarları (SMS kapalı, OAuth açık)
INSERT INTO "SiteSetting" ("key", "value", "updatedAt")
VALUES
    ('auth.smsVerificationEnabled', 'false', CURRENT_TIMESTAMP),
    ('auth.googleAuthEnabled',      'true',  CURRENT_TIMESTAMP),
    ('auth.facebookAuthEnabled',    'true',  CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO UPDATE
SET "value" = EXCLUDED."value",
    "updatedAt" = CURRENT_TIMESTAMP;

-- 4) Admin telefonu (1337 kodu ile giriş)
UPDATE "User"
SET
    "phone"  = '05001234567',
    "role"   = 'ADMIN',
    "status" = 'ACTIVE'
WHERE LOWER("email") = 'admin@example.com';

COMMIT;
