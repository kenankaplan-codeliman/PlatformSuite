-- =============================================
-- CodePro SampleData / V005 — PriceList
-- 3 sample fiyat listesi (tedarikçi bazlı).
-- =============================================

-- Fixed UUIDs
-- PL_BILGETEK_2026  = 56666666-0000-0000-0000-000000000001
-- PL_ANADOLU_2026   = 56666666-0000-0000-0000-000000000002
-- PL_YESIL_2026     = 56666666-0000-0000-0000-000000000003

INSERT INTO price_list (id, code, name, description, supplier_id, is_active, created_by, created_at)
SELECT t.id::uuid, t.code, t.name, t.description, t.supplier_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('56666666-0000-0000-0000-000000000001', 'PL-2026-0001', 'BilgeTek 2026 Kurumsal Fiyat Listesi', 'BT donanım ve yazılım 2026 listesi',     '51111111-0000-0000-0000-000000000001'),
    ('56666666-0000-0000-0000-000000000002', 'PL-2026-0002', 'Anadolu Mobilya 2026 Listesi',         'Ofis mobilyaları 2026 fiyatları',         '51111111-0000-0000-0000-000000000002'),
    ('56666666-0000-0000-0000-000000000003', 'PL-2026-0003', 'Yeşil Enerji 2026 Listesi',            'Güneş paneli + aksesuar 2026 fiyatları',  '51111111-0000-0000-0000-000000000005')
) AS t(id, code, name, description, supplier_id)
WHERE NOT EXISTS (SELECT 1 FROM price_list pl WHERE pl.id = t.id::uuid);
