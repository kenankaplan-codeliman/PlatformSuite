-- =============================================
-- CodePro SampleData / V007 — ProductCatalog (+ product / organization junctions)
-- =============================================

-- Fixed UUIDs
-- CAT_IT_2026  = 58888888-0000-0000-0000-000000000001
-- CAT_OFS_2026 = 58888888-0000-0000-0000-000000000002

INSERT INTO product_catalog (id, code, name, description, valid_from, valid_until, price_code,
                             is_active, created_by, created_at)
SELECT t.id::uuid, t.code, t.name, t.description,
       (current_date - interval '15 days')::date, (current_date + interval '350 days')::date,
       t.price_code,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('58888888-0000-0000-0000-000000000001', 'CAT-IT-2026',  'Bilişim Katalogu 2026', 'Kurumsal IT donanım/yazılım', 'PL-2026-IT'),
    ('58888888-0000-0000-0000-000000000002', 'CAT-OFS-2026', 'Ofis Katalogu 2026',    'Ofis mobilyaları',            'PL-2026-OFS')
) AS t(id, code, name, description, price_code)
WHERE NOT EXISTS (SELECT 1 FROM product_catalog pc WHERE pc.id = t.id::uuid);

-- ---------------------------------------------
-- product_catalog_product
-- ---------------------------------------------
INSERT INTO product_catalog_product (product_catalog_id, product_id)
SELECT t.catalog_id::uuid, t.product_id::uuid
FROM (VALUES
    ('58888888-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000001'),  -- IT cat → Laptop
    ('58888888-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000002'),  -- IT cat → Monitor
    ('58888888-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000003'),  -- IT cat → Server
    ('58888888-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000006'),  -- IT cat → License
    ('58888888-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000004'),  -- Ofs cat → Desk
    ('58888888-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000005')   -- Ofs cat → Chair
) AS t(catalog_id, product_id)
WHERE NOT EXISTS (
    SELECT 1 FROM product_catalog_product pcp
    WHERE pcp.product_catalog_id = t.catalog_id::uuid AND pcp.product_id = t.product_id::uuid
);

-- ---------------------------------------------
-- product_catalog_organization (auth_organization FK)
-- ---------------------------------------------
INSERT INTO product_catalog_organization (product_catalog_id, app_organization_id)
SELECT t.catalog_id::uuid, t.org_id::uuid
FROM (VALUES
    ('58888888-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),  -- IT cat → MAIN
    ('58888888-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201'),  -- IT cat → Purchasing
    ('58888888-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000201'),  -- Ofs cat → Purchasing
    ('58888888-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000200')   -- Ofs cat → Sales
) AS t(catalog_id, org_id)
WHERE NOT EXISTS (
    SELECT 1 FROM product_catalog_organization pco
    WHERE pco.product_catalog_id = t.catalog_id::uuid AND pco.app_organization_id = t.org_id::uuid
);
