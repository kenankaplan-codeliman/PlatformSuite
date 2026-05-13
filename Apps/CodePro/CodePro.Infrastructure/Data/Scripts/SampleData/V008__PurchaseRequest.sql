-- =============================================
-- CodePro SampleData / V008 — PurchaseRequest (+ lines)
-- 3 talep, çeşitli durumlarda. Lines product/product_price referansları opsiyonel.
-- =============================================

-- Fixed UUIDs
-- PR_1 = 61111111-0000-0000-0000-000000000001  (Setup)
-- PR_2 = 61111111-0000-0000-0000-000000000002  (PendingApproval)
-- PR_3 = 61111111-0000-0000-0000-000000000003  (OrderCreated)

INSERT INTO purchase_request (id, request_number, title, description, status, priority,
                              request_date, required_date, currency_code, total_amount,
                              owner_id, organization_id,
                              is_active, created_by, created_at)
SELECT t.id::uuid, t.request_number, t.title, t.description, t.status, t.priority,
       (current_timestamp - (t.days_ago::text || ' days')::interval),
       (current_timestamp + interval '30 days'),
       t.currency, t.total_amount::numeric,
       t.owner_id::uuid, t.org_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('61111111-0000-0000-0000-000000000001', 'PR-2026-0001', 'Bilişim donanım talebi Q1',     'Yeni başlayan ekip için laptop+monitor',  'Setup',           'Medium', '5',  'TRY', '155000.00',  '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000201'),
    ('61111111-0000-0000-0000-000000000002', 'PR-2026-0002', 'Sunucu yenileme — production',  'Eski 1U sunucuların değişimi',             'PendingApproval', 'High',   '12', 'TRY', '555000.00',  '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('61111111-0000-0000-0000-000000000003', 'PR-2026-0003', 'Ofis kurulumu — yeni kat',       'Open-office için 20 masa + 20 koltuk',     'OrderCreated',    'Medium', '20', 'TRY', '226000.00',  '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000201')
) AS t(id, request_number, title, description, status, priority, days_ago, currency, total_amount, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM purchase_request pr WHERE pr.id = t.id::uuid);

-- ---------------------------------------------
-- purchase_request_line
-- ---------------------------------------------
INSERT INTO purchase_request_line (id, purchase_request_id, is_free_product, product_id, product_name, product_price_id, supplier_id,
                                   quantity, unit_of_measure, unit_price, currency, total_amount,
                                   need_by_date, status,
                                   is_active, created_by, created_at)
SELECT t.id::uuid, t.pr_id::uuid, t.is_free, NULLIF(t.product_id, '')::uuid, NULLIF(t.product_name, ''),
       NULLIF(t.product_price_id, '')::uuid, NULLIF(t.supplier_id, '')::uuid,
       t.quantity::numeric, t.uom, t.unit_price::numeric, t.currency, t.total::numeric,
       (current_timestamp + interval '21 days'), t.line_status,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    -- PR 1 — Setup
    ('61112222-0000-0000-0000-000000000001', '61111111-0000-0000-0000-000000000001', false, '55555555-0000-0000-0000-000000000001', 'Dizüstü Bilgisayar 14"', '57777777-0000-0000-0000-000000000001', '51111111-0000-0000-0000-000000000001',  '3', 'Adet', '28500.0000', 'TRY', '85500.00',  'Setup'),
    ('61112222-0000-0000-0000-000000000002', '61111111-0000-0000-0000-000000000001', false, '55555555-0000-0000-0000-000000000002', 'Monitör 27" 4K',          '57777777-0000-0000-0000-000000000002', '51111111-0000-0000-0000-000000000001',  '3', 'Adet', '12500.0000', 'TRY', '37500.00',  'Setup'),
    -- PR 2 — PendingApproval (sunucular)
    ('61112222-0000-0000-0000-000000000003', '61111111-0000-0000-0000-000000000002', false, '55555555-0000-0000-0000-000000000003', 'Sunucu 1U',               '57777777-0000-0000-0000-000000000003', '51111111-0000-0000-0000-000000000001',  '3', 'Adet', '185000.0000','TRY', '555000.00', 'PendingApproval'),
    -- PR 3 — OrderCreated (mobilya)
    ('61112222-0000-0000-0000-000000000004', '61111111-0000-0000-0000-000000000003', false, '55555555-0000-0000-0000-000000000004', 'Çalışma Masası',          '57777777-0000-0000-0000-000000000004', '51111111-0000-0000-0000-000000000002', '20', 'Adet', '4800.0000',  'TRY', '96000.00',  'OrderCreated'),
    ('61112222-0000-0000-0000-000000000005', '61111111-0000-0000-0000-000000000003', false, '55555555-0000-0000-0000-000000000005', 'Ofis Koltuğu',            '57777777-0000-0000-0000-000000000005', '51111111-0000-0000-0000-000000000002', '20', 'Adet', '6500.0000',  'TRY', '130000.00', 'OrderCreated')
) AS t(id, pr_id, is_free, product_id, product_name, product_price_id, supplier_id, quantity, uom, unit_price, currency, total, line_status)
WHERE NOT EXISTS (SELECT 1 FROM purchase_request_line prl WHERE prl.id = t.id::uuid);
