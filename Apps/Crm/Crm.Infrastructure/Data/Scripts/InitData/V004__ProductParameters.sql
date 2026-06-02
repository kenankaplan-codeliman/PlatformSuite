-- =============================================
-- CRM InitData / V004 — Product GeneralParameter seed
--
-- Product entity'sinin GeneralParameter alanları:
--   ProductCategory      → Product.Category
--   ProductUnitOfMeasure → Product.UnitOfMeasure
--
-- Kök satır: code = tip adı, parent_code = NULL
-- Değer satırı: code = enum değeri, parent_code = tip adı
-- Tüm insert'ler WHERE NOT EXISTS ile idempotent'tir.
-- (UnitPrice para birimi mevcut CurrencyType parametresini kullanır — burada seed edilmez.)
-- =============================================

INSERT INTO general_parameter (id, code, parent_code, lang, label, order_index, is_active, created_by, created_at)
SELECT gen_random_uuid(), v.code, v.parent_code, 'tr', v.label, v.order_index, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    -- ProductCategory
    ('ProductCategory', NULL,              'Ürün Kategorisi', 0),
    ('Hardware',        'ProductCategory', 'Donanım',         1),
    ('Software',        'ProductCategory', 'Yazılım',         2),
    ('Service',         'ProductCategory', 'Hizmet',          3),
    ('Subscription',    'ProductCategory', 'Abonelik',        4),
    ('Other',           'ProductCategory', 'Diğer',           5),
    -- ProductUnitOfMeasure
    ('ProductUnitOfMeasure', NULL,                   'Ölçü Birimi', 0),
    ('Piece',                'ProductUnitOfMeasure', 'Adet',        1),
    ('Hour',                 'ProductUnitOfMeasure', 'Saat',        2),
    ('Day',                  'ProductUnitOfMeasure', 'Gün',         3),
    ('Month',                'ProductUnitOfMeasure', 'Ay',          4),
    ('Year',                 'ProductUnitOfMeasure', 'Yıl',         5),
    ('Kilogram',             'ProductUnitOfMeasure', 'Kilogram',    6),
    ('Liter',                'ProductUnitOfMeasure', 'Litre',       7)
) AS v(code, parent_code, label, order_index)
WHERE NOT EXISTS (
    SELECT 1 FROM general_parameter g
    WHERE g.code = v.code
      AND g.parent_code IS NOT DISTINCT FROM v.parent_code
      AND g.lang = 'tr'
);
