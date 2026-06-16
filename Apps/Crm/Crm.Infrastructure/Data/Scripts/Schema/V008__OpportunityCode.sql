-- =============================================
-- CRM Schema / V008 — Opportunity "Fırsat Kodu"
--
-- opportunity tablosuna numarator ile üretilen benzersiz kod kolonu ekler.
-- Kod create sırasında uygulama tarafında üretilir (FRS-{yıl}-{sıra}); kullanıcı
-- müdahalesi yoktur. Sayaç altyapısı Platform number_counter tablosudur (Yearly reset).
--
-- Bu script hem boş (fresh) hem dolu (mevcut) veritabanında çalışır:
--  - Fresh: tablo boş, backfill/sayaç tohumlama no-op; SampleData V004 kodlu satır ekler.
--  - Mevcut: var olan satırlara created_at sırasına göre kod atanır ve number_counter
--    yıl bazında ilerletilir ki sonraki create'ler çakışmasın.
-- =============================================

-- 1) Kolonu önce NULLABLE ekle (mevcut satırları backfill edebilmek için).
ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS opportunity_code varchar(30);

-- 2) Mevcut (kodu olmayan) satırlara FRS-{yıl}-{sıra:4} ata — yıl içinde created_at sırası.
WITH numbered AS (
    SELECT id,
           EXTRACT(YEAR FROM created_at)::int AS yr,
           row_number() OVER (
               PARTITION BY EXTRACT(YEAR FROM created_at)
               ORDER BY created_at, id
           ) AS seq
    FROM opportunity
    WHERE opportunity_code IS NULL
)
UPDATE opportunity o
SET opportunity_code = 'FRS-' || n.yr::text || '-' || lpad(n.seq::text, 4, '0')
FROM numbered n
WHERE o.id = n.id;

-- 3) number_counter'ı yıl bazında ilerlet (document_type UPPER 'OPPORTUNITY', reset_period
--    Yearly=1). Böylece backfill edilmiş satırlardan sonra üretilen ilk numara çakışmaz.
INSERT INTO number_counter (document_type, reset_period, period_key, last_value, created_at, updated_at)
SELECT 'OPPORTUNITY', 1, y.yr::text, y.cnt, now(), now()
FROM (
    SELECT EXTRACT(YEAR FROM created_at)::int AS yr, count(*) AS cnt
    FROM opportunity
    GROUP BY EXTRACT(YEAR FROM created_at)
) y
ON CONFLICT (document_type, period_key)
DO UPDATE SET last_value = GREATEST(number_counter.last_value, EXCLUDED.last_value),
              updated_at = now();

-- 4) NOT NULL + benzersizlik. Unique index lower() ile case-insensitive ve
--    soft-delete edilmiş satırları hariç tutar (handler kontrolüyle uyumlu).
ALTER TABLE opportunity ALTER COLUMN opportunity_code SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_opportunity_code
    ON opportunity (lower(opportunity_code))
    WHERE is_deleted = false;
