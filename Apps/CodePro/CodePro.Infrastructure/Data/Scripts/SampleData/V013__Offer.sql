-- =============================================
-- CodePro SampleData / V013 — Offer (+ invitees + items + approval steps + form + answers)
-- 3 teklif farklı durumlarda. converted_contract_id NULL bırakılır.
-- =============================================

-- Fixed UUIDs
-- OFFER_1 = 66666666-0000-0000-0000-000000000001  (Sent, Rfq — Donanım)
-- OFFER_2 = 66666666-0000-0000-0000-000000000002  (Draft, Purchase — Lojistik)
-- OFFER_3 = 66666666-0000-0000-0000-000000000003  (Won, Sale — KobiLtd'ye)

INSERT INTO offer (id, offer_number, offer_type, subject, counterparty_name, counterparty_id,
                   responsible_user_id, valid_from, valid_until, currency,
                   discount_percentage, subtotal, vat_total, grand_total, notes, status,
                   owner_id, organization_id,
                   is_active, created_by, created_at)
SELECT t.id::uuid, t.offer_number, t.otype, t.subject, t.cp_name, NULLIF(t.cp_id, '')::uuid,
       t.responsible_user_id::uuid,
       NULLIF(t.valid_from, '')::date, t.valid_until::date, t.currency,
       t.discount::numeric, t.subtotal::numeric, t.vat::numeric, t.grand::numeric, t.notes, t.status,
       t.owner_id::uuid, t.org_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('66666666-0000-0000-0000-000000000001', 'OFR-2026-0001', 'Rfq',      '2026 Q3 sunucu altyapı yenileme RFQ',  'BilgeTek Bilişim Ltd.',     '51111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', '2026-05-01', '2026-06-30', 'TRY', '0',    '555000.00',  '111000.00',  '666000.00',  '3 sunucu için RFQ',                'Sent',  '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('66666666-0000-0000-0000-000000000002', 'OFR-2026-0002', 'Purchase', 'Mavi Lojistik nakliye teklifi',         'Mavi Lojistik San. Tic.',    '51111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000102', '',           '2026-07-15', 'TRY', '5',    '85000.00',   '17000.00',   '96900.00',   'Yıllık nakliye anlaşması',         'Draft', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('66666666-0000-0000-0000-000000000003', 'OFR-2026-0003', 'Sale',     'KobiLtd ERP ekipman teklifi',           'KobiLtd Üretim A.Ş.',       '',                                       '00000000-0000-0000-0000-000000000100', '2026-03-01', '2026-04-30', 'USD', '10',   '120000.00',  '24000.00',   '129600.00',  'Müşteriye satış teklifi',          'Won',   '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200')
) AS t(id, offer_number, otype, subject, cp_name, cp_id, responsible_user_id, valid_from, valid_until, currency, discount, subtotal, vat, grand, notes, status, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM offer o WHERE o.id = t.id::uuid);

-- ---------------------------------------------
-- offer_invitee (RFQ için tedarikçi davetleri)
-- ---------------------------------------------
INSERT INTO offer_invitee (id, offer_id, supplier_id, supplier_name, supplier_email, invited_at, status, quote_amount, quote_currency, quote_notes, quoted_at)
SELECT t.id::uuid, t.offer_id::uuid, NULLIF(t.supplier_id, '')::uuid, t.supplier_name, t.email,
       NULLIF(t.invited_at, '')::timestamptz, t.status,
       NULLIF(t.quote_amount, '')::numeric, NULLIF(t.quote_currency, ''),
       NULLIF(t.quote_notes, ''),
       NULLIF(t.quoted_at, '')::timestamptz
FROM (VALUES
    ('66667777-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', '51111111-0000-0000-0000-000000000001', 'BilgeTek Bilişim Ltd.', 'hakan@bilgetek.com.tr',  '2026-04-15 09:00:00+03', 'Responded', '555000.00', 'TRY', 'Listeyle birebir uyumlu', '2026-04-20 16:00:00+03'),
    ('66667777-0000-0000-0000-000000000002', '66666666-0000-0000-0000-000000000001', '51111111-0000-0000-0000-000000000004', 'Çelik Endüstri A.Ş.',   'ayhan@celikend.com.tr',  '2026-04-15 09:00:00+03', 'Invited', '',          '',    '',                        '')
) AS t(id, offer_id, supplier_id, supplier_name, email, invited_at, status, quote_amount, quote_currency, quote_notes, quoted_at)
WHERE NOT EXISTS (SELECT 1 FROM offer_invitee oi WHERE oi.id = t.id::uuid);

-- ---------------------------------------------
-- offer_item
-- ---------------------------------------------
INSERT INTO offer_item (id, offer_id, order_index, product_id, product_name, quantity, unit, unit_price, vat_rate, line_total, line_vat)
SELECT t.id::uuid, t.offer_id::uuid, t.order_idx::int, NULLIF(t.product_id, '')::uuid, t.product_name,
       t.quantity::numeric, t.unit, t.unit_price::numeric, t.vat_rate,
       t.line_total::numeric, t.line_vat::numeric
FROM (VALUES
    -- Offer 1
    ('66668888-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', '1', '55555555-0000-0000-0000-000000000003', 'Sunucu 1U',      '3',  'Piece', '185000.0000', 'Twenty', '555000.00', '111000.00'),
    -- Offer 2 (free-text — nakliye)
    ('66668888-0000-0000-0000-000000000002', '66666666-0000-0000-0000-000000000002', '1', '',                                       'Yıllık nakliye paketi (10 ton/ay)', '12', 'Month', '7083.3333',  'Twenty', '85000.00',  '17000.00'),
    -- Offer 3
    ('66668888-0000-0000-0000-000000000003', '66666666-0000-0000-0000-000000000003', '1', '55555555-0000-0000-0000-000000000001', 'Dizüstü Bilgisayar 14"', '20', 'Piece', '1000.0000',   'Twenty', '20000.00',  '4000.00'),
    ('66668888-0000-0000-0000-000000000004', '66666666-0000-0000-0000-000000000003', '2', '55555555-0000-0000-0000-000000000002', 'Monitör 27" 4K',         '20', 'Piece', '500.0000',    'Twenty', '10000.00',  '2000.00'),
    ('66668888-0000-0000-0000-000000000005', '66666666-0000-0000-0000-000000000003', '3', '',                                       'Implementation services',           '1',  'Other', '90000.0000',  'Twenty', '90000.00',  '18000.00')
) AS t(id, offer_id, order_idx, product_id, product_name, quantity, unit, unit_price, vat_rate, line_total, line_vat)
WHERE NOT EXISTS (SELECT 1 FROM offer_item oi WHERE oi.id = t.id::uuid);

-- ---------------------------------------------
-- offer_approval_step
-- ---------------------------------------------
INSERT INTO offer_approval_step (id, offer_id, order_index, approver_user_id, role_label, status)
SELECT t.id::uuid, t.offer_id::uuid, t.order_idx::int, t.approver_id::uuid, t.role_label, t.status
FROM (VALUES
    ('66669999-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', '1', '00000000-0000-0000-0000-000000000102', 'Satın Alma Müdürü', 'Approved'),
    ('66669999-0000-0000-0000-000000000002', '66666666-0000-0000-0000-000000000003', '1', '00000000-0000-0000-0000-000000000100', 'Satış Müdürü',      'Approved')
) AS t(id, offer_id, order_idx, approver_id, role_label, status)
WHERE NOT EXISTS (SELECT 1 FROM offer_approval_step oas WHERE oas.id = t.id::uuid);

-- ---------------------------------------------
-- offer_form (Q_SUPPLIER questionnaire'ine bağlanmış — sadece RFQ için)
-- ---------------------------------------------
INSERT INTO offer_form (id, offer_id, questionnaire_id, status, filled_by_user_id, filled_at)
SELECT t.id::uuid, t.offer_id::uuid, t.questionnaire_id::uuid, t.status,
       NULLIF(t.filled_by_id, '')::uuid, NULLIF(t.filled_at, '')::timestamptz
FROM (VALUES
    ('66660000-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', '64444444-0000-0000-0000-000000000001', 'Completed', '00000000-0000-0000-0000-000000000102', '2026-04-21 14:30:00+03')
) AS t(id, offer_id, questionnaire_id, status, filled_by_id, filled_at)
WHERE NOT EXISTS (SELECT 1 FROM offer_form of WHERE of.id = t.id::uuid);

-- ---------------------------------------------
-- offer_form_answer
-- ---------------------------------------------
INSERT INTO offer_form_answer (id, offer_form_id, questionnaire_question_id, answer_text, answer_number, answer_date, answer_bool, answer_options)
SELECT t.id::uuid, t.form_id::uuid, t.question_id::uuid,
       NULLIF(t.answer_text, ''), NULLIF(t.answer_number, '')::numeric, NULLIF(t.answer_date, '')::date,
       NULLIF(t.answer_bool, '')::boolean, NULLIF(t.answer_options, '')
FROM (VALUES
    ('66660001-0000-0000-0000-000000000001', '66660000-0000-0000-0000-000000000001', '64445555-0000-0000-0000-000000000001', '', '',           '', 'true', ''),
    ('66660001-0000-0000-0000-000000000002', '66660000-0000-0000-0000-000000000001', '64445555-0000-0000-0000-000000000002', '', '15000000', '', '',     ''),
    ('66660001-0000-0000-0000-000000000003', '66660000-0000-0000-0000-000000000001', '64445555-0000-0000-0000-000000000003', '', '',           '', '',     '30 gün'),
    ('66660001-0000-0000-0000-000000000004', '66660000-0000-0000-0000-000000000001', '64445555-0000-0000-0000-000000000004', 'KobiLtd Holding, Tekno Holding referansları', '', '', '', '')
) AS t(id, form_id, question_id, answer_text, answer_number, answer_date, answer_bool, answer_options)
WHERE NOT EXISTS (SELECT 1 FROM offer_form_answer ofa WHERE ofa.id = t.id::uuid);
