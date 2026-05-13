-- =============================================
-- CodePro SampleData / V009 — PurchaseBasket (+ lines)
-- Kullanıcı başına sadece 1 aktif Preparing sepet (unique constraint).
-- 2 sepet: 1 Preparing (Ali Şahin), 1 Converted (Zeynep Kara → PR_1).
-- =============================================

-- Fixed UUIDs
-- BASKET_1 = 62222222-0000-0000-0000-000000000001  (Ali Şahin — Preparing)
-- BASKET_2 = 62222222-0000-0000-0000-000000000002  (Zeynep Kara — Converted → PR_1)

INSERT INTO purchase_basket (id, status, purchase_request_id, owner_id, organization_id,
                             is_active, created_by, created_at)
SELECT t.id::uuid, t.status, NULLIF(t.pr_id, '')::uuid,
       t.owner_id::uuid, t.org_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('62222222-0000-0000-0000-000000000001', 'Preparing', '',                                       '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000201'),
    ('62222222-0000-0000-0000-000000000002', 'Converted', '61111111-0000-0000-0000-000000000001',   '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201')
) AS t(id, status, pr_id, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM purchase_basket pb WHERE pb.id = t.id::uuid);

-- ---------------------------------------------
-- purchase_basket_line
-- ---------------------------------------------
INSERT INTO purchase_basket_line (id, purchase_basket_id, product_id, quantity,
                                  is_active, created_by, created_at)
SELECT t.id::uuid, t.basket_id::uuid, t.product_id::uuid, t.quantity::int,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    -- Basket 1 (Ali — hazırlık)
    ('62223333-0000-0000-0000-000000000001', '62222222-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000006', 25),  -- 25 lisans
    ('62223333-0000-0000-0000-000000000002', '62222222-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000001', 2),   -- 2 laptop
    -- Basket 2 (Zeynep — converted, PR 1)
    ('62223333-0000-0000-0000-000000000003', '62222222-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000001', 3),
    ('62223333-0000-0000-0000-000000000004', '62222222-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000002', 3)
) AS t(id, basket_id, product_id, quantity)
WHERE NOT EXISTS (SELECT 1 FROM purchase_basket_line pbl WHERE pbl.id = t.id::uuid);
