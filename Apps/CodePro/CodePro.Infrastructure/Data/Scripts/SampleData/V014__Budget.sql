-- =============================================
-- CodePro SampleData / V014 — Budget (+ category + transactions + allocations + approval)
-- =============================================

-- Fixed UUIDs
-- BC_OPEX    = 67776666-0000-0000-0000-000000000001  (parent)
-- BC_IT      = 67776666-0000-0000-0000-000000000002  (child of OPEX)
-- BC_OFFICE  = 67776666-0000-0000-0000-000000000003  (child of OPEX)
-- BUDGET_1   = 67777777-0000-0000-0000-000000000001  (IT 2026 — Active)
-- BUDGET_2   = 67777777-0000-0000-0000-000000000002  (Office 2026 — Active)
-- BUDGET_3   = 67777777-0000-0000-0000-000000000003  (2026 Q3 — Draft)

-- ---------------------------------------------
-- budget_category
-- ---------------------------------------------
INSERT INTO budget_category (id, name, code, description, parent_category_id,
                             owner_id, organization_id,
                             is_active, created_by, created_at)
SELECT t.id::uuid, t.name, t.code, t.description, NULLIF(t.parent_id, '')::uuid,
       t.owner_id::uuid, t.org_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('67776666-0000-0000-0000-000000000001', 'OPEX',               'OPEX',   'Operasyonel giderler',  '',                                       '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('67776666-0000-0000-0000-000000000002', 'Bilişim',            'IT',     'BT donanım/yazılım',    '67776666-0000-0000-0000-000000000001',   '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('67776666-0000-0000-0000-000000000003', 'Ofis Ekipmanları',   'OFS',    'Mobilya ve ofis sarf',  '67776666-0000-0000-0000-000000000001',   '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201')
) AS t(id, name, code, description, parent_id, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM budget_category bc WHERE bc.id = t.id::uuid);

-- ---------------------------------------------
-- budget
-- ---------------------------------------------
INSERT INTO budget (id, name, description, scope_organization_id, budget_category_id,
                    period_type, start_date, end_date, total_amount, currency,
                    overflow_behavior, reservation_release_point, alert_threshold_percentage,
                    carry_over_enabled, responsible_user_id, status,
                    owner_id, organization_id,
                    is_active, created_by, created_at)
SELECT t.id::uuid, t.name, t.description, NULLIF(t.scope_org_id, '')::uuid, NULLIF(t.category_id, '')::uuid,
       t.period_type, t.start_date::date, t.end_date::date,
       t.total::numeric, t.currency,
       t.overflow, t.release_point, t.alert_threshold::int,
       t.carry_over::boolean, t.responsible_user_id::uuid, t.status,
       t.owner_id::uuid, t.org_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('67777777-0000-0000-0000-000000000001', 'BT 2026 yıllık bütçesi',         'BT donanım/yazılım/lisans',  '00000000-0000-0000-0000-000000000201', '67776666-0000-0000-0000-000000000002', 'Yearly',    '2026-01-01', '2026-12-31', '5000000.00', 'TRY', 'Block', 'PurchaseOrder',    '80', 'false', '00000000-0000-0000-0000-000000000102', 'Active', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('67777777-0000-0000-0000-000000000002', 'Ofis 2026 yıllık bütçesi',        'Mobilya, sarf, temizlik',    '00000000-0000-0000-0000-000000000201', '67776666-0000-0000-0000-000000000003', 'Yearly',    '2026-01-01', '2026-12-31', '1500000.00', 'TRY', 'Warn',  'PurchaseOrder',    '75', 'true',  '00000000-0000-0000-0000-000000000102', 'Active', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('67777777-0000-0000-0000-000000000003', 'Genel 2026 Q3 bütçesi',           'Q3 dönemi serbest',          '',                                       '67776666-0000-0000-0000-000000000001', 'Quarterly', '2026-07-01', '2026-09-30', '800000.00',  'TRY', 'Free',  'RequestApproval',  '90', 'false', '00000000-0000-0000-0000-000000000020', 'Draft',  '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001')
) AS t(id, name, description, scope_org_id, category_id, period_type, start_date, end_date, total, currency, overflow, release_point, alert_threshold, carry_over, responsible_user_id, status, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM budget b WHERE b.id = t.id::uuid);

-- ---------------------------------------------
-- budget_transaction (Reserve örnekleri PO_1 ve PO_3 için)
-- ---------------------------------------------
INSERT INTO budget_transaction (id, budget_id, transaction_type, amount, source_type, source_id, description, performed_by, performed_at)
SELECT t.id::uuid, t.budget_id::uuid, t.tx_type, t.amount::numeric, t.source_type, t.source_id, t.description,
       t.performed_by::uuid, current_timestamp - (t.days_ago::text || ' days')::interval
FROM (VALUES
    ('67778888-0000-0000-0000-000000000001', '67777777-0000-0000-0000-000000000001', 'Reserve', '142500.00', 'PurchaseOrder', '63333333-0000-0000-0000-000000000001', 'PO-2026-0001 için rezervasyon',  '00000000-0000-0000-0000-000000000102', '2'),
    ('67778888-0000-0000-0000-000000000002', '67777777-0000-0000-0000-000000000002', 'Reserve', '226000.00', 'PurchaseOrder', '63333333-0000-0000-0000-000000000003', 'PO-2026-0003 için rezervasyon',  '00000000-0000-0000-0000-000000000103', '4')
) AS t(id, budget_id, tx_type, amount, source_type, source_id, description, performed_by, days_ago)
WHERE NOT EXISTS (SELECT 1 FROM budget_transaction bt WHERE bt.id = t.id::uuid);

-- ---------------------------------------------
-- budget_allocation
-- ---------------------------------------------
INSERT INTO budget_allocation (id, budget_id, source_type, source_id, allocated_amount, status)
SELECT t.id::uuid, t.budget_id::uuid, t.source_type, t.source_id, t.amount::numeric, t.status
FROM (VALUES
    ('67779999-0000-0000-0000-000000000001', '67777777-0000-0000-0000-000000000001', 'PurchaseOrder', '63333333-0000-0000-0000-000000000001', '142500.00', 'Reserved'),
    ('67779999-0000-0000-0000-000000000002', '67777777-0000-0000-0000-000000000002', 'PurchaseOrder', '63333333-0000-0000-0000-000000000003', '226000.00', 'Reserved')
) AS t(id, budget_id, source_type, source_id, amount, status)
WHERE NOT EXISTS (SELECT 1 FROM budget_allocation ba WHERE ba.id = t.id::uuid);

-- ---------------------------------------------
-- budget_approval_step (BUDGET_3 Draft için)
-- ---------------------------------------------
INSERT INTO budget_approval_step (id, budget_id, order_index, approver_user_id, role_label, status)
SELECT t.id::uuid, t.budget_id::uuid, t.order_idx::int, t.approver_id::uuid, t.role_label, t.status
FROM (VALUES
    ('67770000-0000-0000-0000-000000000001', '67777777-0000-0000-0000-000000000003', '1', '00000000-0000-0000-0000-000000000102', 'Satın Alma Müdürü', 'NotYet'),
    ('67770000-0000-0000-0000-000000000002', '67777777-0000-0000-0000-000000000003', '2', '00000000-0000-0000-0000-000000000020', 'Yönetim',            'NotYet')
) AS t(id, budget_id, order_idx, approver_id, role_label, status)
WHERE NOT EXISTS (SELECT 1 FROM budget_approval_step bas WHERE bas.id = t.id::uuid);
