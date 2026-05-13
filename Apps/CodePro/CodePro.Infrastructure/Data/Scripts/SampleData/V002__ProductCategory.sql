-- =============================================
-- CodePro SampleData / V002 — ProductCategory (+ supplier_product_category junction)
-- 6 kategori (2 parent + 4 child) + 5 supplier-kategori ilişkisi.
-- =============================================

-- Fixed UUIDs
-- CAT_IT          = 52222222-0000-0000-0000-000000000001  (Bilişim — parent)
-- CAT_IT_HW       = 52222222-0000-0000-0000-000000000002  (Donanım — child of IT)
-- CAT_IT_SW       = 52222222-0000-0000-0000-000000000003  (Yazılım — child of IT)
-- CAT_OFFICE      = 52222222-0000-0000-0000-000000000004  (Ofis Ekipmanları — parent)
-- CAT_OFFICE_FUR  = 52222222-0000-0000-0000-000000000005  (Mobilya — child of Ofis)
-- CAT_LOG         = 52222222-0000-0000-0000-000000000006  (Lojistik Hizmetler)

INSERT INTO product_category (id, name, title, code, description, parent_category_id, is_active, created_by, created_at)
SELECT t.id::uuid, t.name, t.title, t.code, t.description,
       NULLIF(t.parent_id, '')::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('52222222-0000-0000-0000-000000000001', 'Bilişim',           'Bilişim',                    'IT',    'Bilişim ürünleri ve hizmetleri',         ''),
    ('52222222-0000-0000-0000-000000000002', 'Donanım',           'Bilişim > Donanım',          'IT-HW', 'Sunucu, PC, ağ ekipmanı',                '52222222-0000-0000-0000-000000000001'),
    ('52222222-0000-0000-0000-000000000003', 'Yazılım',           'Bilişim > Yazılım',          'IT-SW', 'Lisans, abonelik, geliştirme',           '52222222-0000-0000-0000-000000000001'),
    ('52222222-0000-0000-0000-000000000004', 'Ofis Ekipmanları',  'Ofis Ekipmanları',           'OFS',   'Ofis kullanımına yönelik ürünler',       ''),
    ('52222222-0000-0000-0000-000000000005', 'Mobilya',           'Ofis Ekipmanları > Mobilya', 'OFS-MB','Ofis mobilyaları',                       '52222222-0000-0000-0000-000000000004'),
    ('52222222-0000-0000-0000-000000000006', 'Lojistik Hizmetler','Lojistik Hizmetler',         'LOG',   'Nakliye, depolama, dağıtım',             '')
) AS t(id, name, title, code, description, parent_id)
WHERE NOT EXISTS (SELECT 1 FROM product_category pc WHERE pc.id = t.id::uuid);

-- ---------------------------------------------
-- supplier_product_category junction
--   BilgeTek    → Donanım + Yazılım  (preferred Donanım)
--   Anadolu     → Mobilya             (preferred)
--   Mavi        → Lojistik            (preferred)
--   Çelik       → Donanım             (non-preferred)
--   Yeşil       → Donanım             (preferred)
-- ---------------------------------------------
INSERT INTO supplier_product_category (id, supplier_id, product_category_id, is_preferred,
                                       is_active, created_by, created_at)
SELECT gen_random_uuid(), t.supplier_id::uuid, t.category_id::uuid, t.preferred,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('51111111-0000-0000-0000-000000000001', '52222222-0000-0000-0000-000000000002', true),   -- BilgeTek → Donanım
    ('51111111-0000-0000-0000-000000000001', '52222222-0000-0000-0000-000000000003', false),  -- BilgeTek → Yazılım
    ('51111111-0000-0000-0000-000000000002', '52222222-0000-0000-0000-000000000005', true),   -- Anadolu  → Mobilya
    ('51111111-0000-0000-0000-000000000003', '52222222-0000-0000-0000-000000000006', true),   -- Mavi     → Lojistik
    ('51111111-0000-0000-0000-000000000004', '52222222-0000-0000-0000-000000000002', false),  -- Çelik    → Donanım
    ('51111111-0000-0000-0000-000000000005', '52222222-0000-0000-0000-000000000002', true)    -- Yeşil    → Donanım
) AS t(supplier_id, category_id, preferred)
WHERE NOT EXISTS (
    SELECT 1 FROM supplier_product_category spc
    WHERE spc.supplier_id = t.supplier_id::uuid
      AND spc.product_category_id = t.category_id::uuid
);
