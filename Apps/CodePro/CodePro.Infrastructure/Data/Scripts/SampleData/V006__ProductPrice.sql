-- =============================================
-- CodePro SampleData / V006 — ProductPrice
-- Ürün için tedarikçi + price_list bazlı fiyat kayıtları.
-- Unique index: (product_id, supplier_id, valid_from, valid_until, minimum_quantity, COALESCE(price_list_id, sentinel))
-- =============================================

-- Fixed UUIDs
-- PP_1..PP_6 = 57777777-0000-0000-0000-000000000001..006

INSERT INTO product_price (id, product_id, supplier_id, price_list_id,
                           minimum_quantity, valid_from, valid_until,
                           unit_price, currency,
                           is_active, created_by, created_at)
SELECT t.id::uuid, t.product_id::uuid, t.supplier_id::uuid, t.price_list_id::uuid,
       t.min_qty::numeric,
       (current_timestamp - interval '30 days'), (current_timestamp + interval '335 days'),
       t.unit_price::numeric, t.currency,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('57777777-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000001', '51111111-0000-0000-0000-000000000001', '56666666-0000-0000-0000-000000000001', '1',  '28500.0000', 'TRY'),  -- Laptop  bilgetek
    ('57777777-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000002', '51111111-0000-0000-0000-000000000001', '56666666-0000-0000-0000-000000000001', '1',  '12500.0000', 'TRY'),  -- Monitor bilgetek
    ('57777777-0000-0000-0000-000000000003', '55555555-0000-0000-0000-000000000003', '51111111-0000-0000-0000-000000000001', '56666666-0000-0000-0000-000000000001', '1',  '185000.0000','TRY'),  -- Server  bilgetek
    ('57777777-0000-0000-0000-000000000004', '55555555-0000-0000-0000-000000000004', '51111111-0000-0000-0000-000000000002', '56666666-0000-0000-0000-000000000002', '5',  '4800.0000',  'TRY'),  -- Desk    anadolu (min 5)
    ('57777777-0000-0000-0000-000000000005', '55555555-0000-0000-0000-000000000005', '51111111-0000-0000-0000-000000000002', '56666666-0000-0000-0000-000000000002', '5',  '6500.0000',  'TRY'),  -- Chair   anadolu (min 5)
    ('57777777-0000-0000-0000-000000000006', '55555555-0000-0000-0000-000000000006', '51111111-0000-0000-0000-000000000001', '56666666-0000-0000-0000-000000000001', '1',  '850.0000',   'USD')   -- License bilgetek USD
) AS t(id, product_id, supplier_id, price_list_id, min_qty, unit_price, currency)
WHERE NOT EXISTS (SELECT 1 FROM product_price pp WHERE pp.id = t.id::uuid);
