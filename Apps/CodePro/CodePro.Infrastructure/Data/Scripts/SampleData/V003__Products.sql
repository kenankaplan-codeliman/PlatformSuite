-- =============================================
-- CodePro SampleData / V003 — Brand, Manufacturer, Product (+ junctions, keywords, SKUs)
-- =============================================

-- Fixed UUIDs
-- Brand:        53333333-0000-0000-0000-000000000001..003
-- Manufacturer: 54444444-0000-0000-0000-000000000001..003
-- Product:      55555555-0000-0000-0000-000000000001..006

-- ---------------------------------------------
-- brand
-- ---------------------------------------------
INSERT INTO brand (id, name, is_active, created_by, created_at)
SELECT t.id::uuid, t.name, true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('53333333-0000-0000-0000-000000000001', 'Dell'),
    ('53333333-0000-0000-0000-000000000002', 'HP'),
    ('53333333-0000-0000-0000-000000000003', 'Lenovo')
) AS t(id, name)
WHERE NOT EXISTS (SELECT 1 FROM brand b WHERE b.id = t.id::uuid);

-- ---------------------------------------------
-- manufacturer
-- ---------------------------------------------
INSERT INTO manufacturer (id, name, is_active, created_by, created_at)
SELECT t.id::uuid, t.name, true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('54444444-0000-0000-0000-000000000001', 'Dell Inc.'),
    ('54444444-0000-0000-0000-000000000002', 'HP Inc.'),
    ('54444444-0000-0000-0000-000000000003', 'Lenovo Group Ltd.')
) AS t(id, name)
WHERE NOT EXISTS (SELECT 1 FROM manufacturer m WHERE m.id = t.id::uuid);

-- ---------------------------------------------
-- product
-- ---------------------------------------------
INSERT INTO product (id, code, name, short_description, detailed_description,
                     valid_from, valid_until,
                     unit_of_measure, delivery_days, quantity_per_unit,
                     manufacturer_part_number, model, color,
                     product_category_id,
                     is_active, created_by, created_at)
SELECT t.id::uuid, t.code, t.name, t.short_desc, t.detailed_desc,
       (current_timestamp - interval '180 days'), (current_timestamp + interval '365 days'),
       t.uom, t.delivery_days::int, t.qty_per_unit::int,
       t.mpn, t.model, t.color,
       t.category_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('55555555-0000-0000-0000-000000000001', 'PRD-LAP-001',  'Dizüstü Bilgisayar 14"',  'Iş Laptopu 14"',        'Intel i7, 16GB RAM, 512GB SSD',     'Adet', '7',  '1', 'DLL-LAP-14-I7', 'Latitude 7440',  'Gri',     '52222222-0000-0000-0000-000000000002'),
    ('55555555-0000-0000-0000-000000000002', 'PRD-MON-001',  'Monitör 27" 4K',          'IPS Monitör 27"',        '4K, USB-C dock destekli',           'Adet', '5',  '1', 'HP-MON-27-4K',  'EliteDisplay U27', 'Siyah','52222222-0000-0000-0000-000000000002'),
    ('55555555-0000-0000-0000-000000000003', 'PRD-SRV-001',  'Sunucu 1U',               'Rack Sunucu 1U',         '2x Xeon, 128GB RAM, 4x 2TB SSD',    'Adet', '14', '1', 'DLL-SRV-1U',    'PowerEdge R660', 'Siyah',  '52222222-0000-0000-0000-000000000002'),
    ('55555555-0000-0000-0000-000000000004', 'PRD-DSK-001',  'Çalışma Masası',          'Ofis Masası 160x80',     'L şeklinde, beyaz lake',            'Adet', '10', '1', 'AOM-DSK-160',   'WorkPro 160',    'Beyaz',   '52222222-0000-0000-0000-000000000005'),
    ('55555555-0000-0000-0000-000000000005', 'PRD-CHR-001',  'Ofis Koltuğu',            'Ergonomik Koltuk',       'Bel desteği, ayarlanabilir',        'Adet', '7',  '1', 'AOM-CHR-ERG',   'ErgoPlus',       'Siyah',   '52222222-0000-0000-0000-000000000005'),
    ('55555555-0000-0000-0000-000000000006', 'PRD-LIC-001',  'Office 365 Lisansı',      'Yıllık E3 Lisansı',      'Per-user, yıllık',                  'Adet', '1',  '1', 'MSO-E3-Y',      'M365 E3',        '',        '52222222-0000-0000-0000-000000000003')
) AS t(id, code, name, short_desc, detailed_desc, uom, delivery_days, qty_per_unit, mpn, model, color, category_id)
WHERE NOT EXISTS (SELECT 1 FROM product p WHERE p.id = t.id::uuid);

-- ---------------------------------------------
-- product_brand junction (composite PK)
-- ---------------------------------------------
INSERT INTO product_brand (product_id, brand_id)
SELECT t.product_id::uuid, t.brand_id::uuid
FROM (VALUES
    ('55555555-0000-0000-0000-000000000001', '53333333-0000-0000-0000-000000000001'),  -- Laptop  → Dell
    ('55555555-0000-0000-0000-000000000002', '53333333-0000-0000-0000-000000000002'),  -- Monitor → HP
    ('55555555-0000-0000-0000-000000000003', '53333333-0000-0000-0000-000000000001'),  -- Server  → Dell
    ('55555555-0000-0000-0000-000000000006', '53333333-0000-0000-0000-000000000001')   -- License → Dell (placeholder)
) AS t(product_id, brand_id)
WHERE NOT EXISTS (
    SELECT 1 FROM product_brand pb
    WHERE pb.product_id = t.product_id::uuid AND pb.brand_id = t.brand_id::uuid
);

-- ---------------------------------------------
-- product_manufacturer junction
-- ---------------------------------------------
INSERT INTO product_manufacturer (product_id, manufacturer_id)
SELECT t.product_id::uuid, t.manufacturer_id::uuid
FROM (VALUES
    ('55555555-0000-0000-0000-000000000001', '54444444-0000-0000-0000-000000000001'),
    ('55555555-0000-0000-0000-000000000002', '54444444-0000-0000-0000-000000000002'),
    ('55555555-0000-0000-0000-000000000003', '54444444-0000-0000-0000-000000000001')
) AS t(product_id, manufacturer_id)
WHERE NOT EXISTS (
    SELECT 1 FROM product_manufacturer pm
    WHERE pm.product_id = t.product_id::uuid AND pm.manufacturer_id = t.manufacturer_id::uuid
);

-- ---------------------------------------------
-- product_keyword
-- ---------------------------------------------
INSERT INTO product_keyword (id, product_id, keyword)
SELECT gen_random_uuid(), t.product_id::uuid, t.keyword
FROM (VALUES
    ('55555555-0000-0000-0000-000000000001', 'laptop'),
    ('55555555-0000-0000-0000-000000000001', 'dizüstü'),
    ('55555555-0000-0000-0000-000000000001', 'iş bilgisayarı'),
    ('55555555-0000-0000-0000-000000000002', 'monitör'),
    ('55555555-0000-0000-0000-000000000002', '4K'),
    ('55555555-0000-0000-0000-000000000003', 'sunucu'),
    ('55555555-0000-0000-0000-000000000003', 'rack'),
    ('55555555-0000-0000-0000-000000000004', 'masa'),
    ('55555555-0000-0000-0000-000000000004', 'ofis mobilyası'),
    ('55555555-0000-0000-0000-000000000005', 'koltuk'),
    ('55555555-0000-0000-0000-000000000005', 'ergonomik'),
    ('55555555-0000-0000-0000-000000000006', 'lisans'),
    ('55555555-0000-0000-0000-000000000006', 'office')
) AS t(product_id, keyword)
WHERE NOT EXISTS (
    SELECT 1 FROM product_keyword pk
    WHERE pk.product_id = t.product_id::uuid AND pk.keyword = t.keyword
);

-- ---------------------------------------------
-- product_sku — tedarikçi bazlı SKU
-- ---------------------------------------------
INSERT INTO product_sku (id, product_id, supplier_id, sku)
SELECT gen_random_uuid(), t.product_id::uuid, t.supplier_id::uuid, t.sku
FROM (VALUES
    ('55555555-0000-0000-0000-000000000001', '51111111-0000-0000-0000-000000000001', 'BLG-LAP-7440'),
    ('55555555-0000-0000-0000-000000000002', '51111111-0000-0000-0000-000000000001', 'BLG-MON-U27'),
    ('55555555-0000-0000-0000-000000000003', '51111111-0000-0000-0000-000000000001', 'BLG-SRV-R660'),
    ('55555555-0000-0000-0000-000000000004', '51111111-0000-0000-0000-000000000002', 'ANM-DSK-160'),
    ('55555555-0000-0000-0000-000000000005', '51111111-0000-0000-0000-000000000002', 'ANM-CHR-ERG'),
    ('55555555-0000-0000-0000-000000000006', '51111111-0000-0000-0000-000000000001', 'BLG-LIC-M365E3')
) AS t(product_id, supplier_id, sku)
WHERE NOT EXISTS (
    SELECT 1 FROM product_sku ps
    WHERE ps.product_id = t.product_id::uuid AND ps.supplier_id = t.supplier_id::uuid
);
