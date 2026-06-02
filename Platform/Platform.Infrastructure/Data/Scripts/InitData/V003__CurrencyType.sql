-- =============================================
-- Platform InitData / V003 — CurrencyType general parameters
-- Pairs with Schema/V004__GeneralParameter.sql.
--
-- Para birimi (CurrencyType) cross-cutting bir referans veri olduğundan
-- Platform InitData'sında seed edilir; tüm app'ler (CRM, CodePro, ...) ortak
-- kullanır. CurrencyField bu kök koddan ('CurrencyType') beslenir.
--
-- Kök satır: code='CurrencyType', parent_code=NULL.
-- Değer satırları: code=ISO 4217 kodu (TRY, USD, ...), parent_code='CurrencyType'.
--
-- label = ISO kodu (CurrencyField dropdown'da yalnız kod görünsün diye); kök hariç
-- label == code. İlerde isim gerekirse description kolonu kullanılabilir.
--
-- All inserts are idempotent via WHERE NOT EXISTS.
-- =============================================

INSERT INTO general_parameter (id, code, parent_code, lang, label, order_index, is_active, created_by, created_at)
SELECT gen_random_uuid(), v.code, v.parent_code, 'tr', v.label, v.order_index, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    -- Kök
    ('CurrencyType', NULL,           'Para Birimi', 0),
    -- Popüler para birimleri (ISO 4217) — label yalnız kod
    ('TRY',          'CurrencyType', 'TRY',         1),
    ('USD',          'CurrencyType', 'USD',         2),
    ('EUR',          'CurrencyType', 'EUR',         3),
    ('GBP',          'CurrencyType', 'GBP',         4),
    ('CHF',          'CurrencyType', 'CHF',         5),
    ('JPY',          'CurrencyType', 'JPY',         6),
    ('CNY',          'CurrencyType', 'CNY',         7),
    ('RUB',          'CurrencyType', 'RUB',         8),
    ('SAR',          'CurrencyType', 'SAR',         9),
    ('AED',          'CurrencyType', 'AED',        10),
    ('CAD',          'CurrencyType', 'CAD',        11),
    ('AUD',          'CurrencyType', 'AUD',        12)
) AS v(code, parent_code, label, order_index)
WHERE NOT EXISTS (
    SELECT 1 FROM general_parameter g
    WHERE g.code = v.code
      AND g.parent_code IS NOT DISTINCT FROM v.parent_code
      AND g.lang = 'tr'
);
