-- =============================================
-- CodePro SampleData / V010 — PurchaseOrder (+ lines + order-request-line junction)
-- 3 sipariş. PR_3 (OrderCreated) için bir sipariş açılır ve junction kurulur.
-- =============================================

-- Fixed UUIDs
-- PO_1 = 63333333-0000-0000-0000-000000000001  (Draft, PR yok)
-- PO_2 = 63333333-0000-0000-0000-000000000002  (Confirmed, PR yok — elle açılmış)
-- PO_3 = 63333333-0000-0000-0000-000000000003  (Submitted, PR_3'ten)

INSERT INTO purchase_order (id, order_number, title, description, supplier_id, purchase_request_id,
                            status, priority, order_date, expected_delivery_date,
                            currency_code, total_amount,
                            owner_id, organization_id,
                            is_active, created_by, created_at)
SELECT t.id::uuid, t.order_number, t.title, t.description,
       t.supplier_id::uuid, NULLIF(t.pr_id, '')::uuid,
       t.status, t.priority,
       (current_timestamp - (t.days_ago::text || ' days')::interval),
       (current_timestamp + interval '14 days'),
       t.currency, t.total::numeric,
       t.owner_id::uuid, t.org_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('63333333-0000-0000-0000-000000000001', 'PO-2026-0001', 'BilgeTek — 5 laptop',     'Yeni başlayanlar için ek talep',                                      '51111111-0000-0000-0000-000000000001', '',                                       'Draft',     'Medium', '2', 'TRY', '142500.00', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('63333333-0000-0000-0000-000000000002', 'PO-2026-0002', 'Yeşil Enerji — UPS bakım',  'Yıllık bakım anlaşması ön sipariş',                                  '51111111-0000-0000-0000-000000000005', '',                                       'Confirmed', 'Low',    '7', 'TRY', '38000.00',  '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('63333333-0000-0000-0000-000000000003', 'PO-2026-0003', 'Anadolu — Mobilya seti',     'PR-2026-0003''ten oluşturulan sipariş',                              '51111111-0000-0000-0000-000000000002', '61111111-0000-0000-0000-000000000003',   'Submitted', 'Medium', '4', 'TRY', '226000.00', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000201')
) AS t(id, order_number, title, description, supplier_id, pr_id, status, priority, days_ago, currency, total, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM purchase_order po WHERE po.id = t.id::uuid);

-- ---------------------------------------------
-- purchase_order_line
-- ---------------------------------------------
INSERT INTO purchase_order_line (id, purchase_order_id, purchase_request_line_id, is_free_product,
                                 product_id, product_name, product_price_id,
                                 quantity, unit_of_measure, unit_price, currency, total_amount,
                                 status, is_active, created_by, created_at)
SELECT t.id::uuid, t.po_id::uuid, NULLIF(t.prl_id, '')::uuid, t.is_free,
       NULLIF(t.product_id, '')::uuid, NULLIF(t.product_name, ''), NULLIF(t.product_price_id, '')::uuid,
       t.quantity::numeric, t.uom, t.unit_price::numeric, t.currency, t.total::numeric,
       t.line_status, true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    -- PO 1
    ('63334444-0000-0000-0000-000000000001', '63333333-0000-0000-0000-000000000001', '', false, '55555555-0000-0000-0000-000000000001', 'Dizüstü Bilgisayar 14"', '57777777-0000-0000-0000-000000000001', '5',  'Adet', '28500.0000', 'TRY', '142500.00', 'Draft'),
    -- PO 2 — free-text line
    ('63334444-0000-0000-0000-000000000002', '63333333-0000-0000-0000-000000000002', '', true,  '',                                       'UPS Yıllık Bakım Anlaşması',          '', '1',  'Adet', '38000.0000', 'TRY', '38000.00',  'Confirmed'),
    -- PO 3 (PR_3'ten)
    ('63334444-0000-0000-0000-000000000003', '63333333-0000-0000-0000-000000000003', '61112222-0000-0000-0000-000000000004', false, '55555555-0000-0000-0000-000000000004', 'Çalışma Masası',     '57777777-0000-0000-0000-000000000004', '20', 'Adet', '4800.0000',  'TRY', '96000.00',  'Submitted'),
    ('63334444-0000-0000-0000-000000000004', '63333333-0000-0000-0000-000000000003', '61112222-0000-0000-0000-000000000005', false, '55555555-0000-0000-0000-000000000005', 'Ofis Koltuğu',       '57777777-0000-0000-0000-000000000005', '20', 'Adet', '6500.0000',  'TRY', '130000.00', 'Submitted')
) AS t(id, po_id, prl_id, is_free, product_id, product_name, product_price_id, quantity, uom, unit_price, currency, total, line_status)
WHERE NOT EXISTS (SELECT 1 FROM purchase_order_line pol WHERE pol.id = t.id::uuid);

-- ---------------------------------------------
-- purchase_order_request_line junction (sadece PO_3 için PR_3 satırlarına bağlanır)
-- ---------------------------------------------
INSERT INTO purchase_order_request_line (id, purchase_order_line_id, purchase_request_line_id,
                                         allocated_quantity, is_active)
SELECT gen_random_uuid(), t.pol_id::uuid, t.prl_id::uuid, t.allocated_qty::numeric, true
FROM (VALUES
    ('63334444-0000-0000-0000-000000000003', '61112222-0000-0000-0000-000000000004', '20'),  -- 20 masa allocated
    ('63334444-0000-0000-0000-000000000004', '61112222-0000-0000-0000-000000000005', '20')   -- 20 koltuk allocated
) AS t(pol_id, prl_id, allocated_qty)
WHERE NOT EXISTS (
    SELECT 1 FROM purchase_order_request_line porl
    WHERE porl.purchase_order_line_id = t.pol_id::uuid
      AND porl.purchase_request_line_id = t.prl_id::uuid
);
