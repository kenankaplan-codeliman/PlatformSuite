-- =============================================
-- CodePro SampleData / V012 — Contract (+ approval steps + form + answers)
-- related_offer_id NULL bırakılır (Offer henüz oluşmadı; FK nullable).
-- =============================================

-- Fixed UUIDs
-- CONTRACT_1 = 65555555-0000-0000-0000-000000000001  (Active, Supplier sözleşmesi)
-- CONTRACT_2 = 65555555-0000-0000-0000-000000000002  (Draft, IT sözleşmesi)
-- CONTRACT_3 = 65555555-0000-0000-0000-000000000003  (WaitingForSignature, Rent)

INSERT INTO contract (id, contract_number, subject, type, counterparty_name, counterparty_id,
                      start_date, end_date, renewal_type, amount, currency, payment_type,
                      responsible_user_id, reminder_days_before, notes, status,
                      owner_id, organization_id,
                      is_active, created_by, created_at)
SELECT t.id::uuid, t.contract_number, t.subject, t.ctype, t.cp_name, NULLIF(t.cp_id, '')::uuid,
       t.start_date::date, NULLIF(t.end_date, '')::date, t.renewal,
       t.amount::numeric, t.currency, t.payment,
       t.responsible_user_id::uuid, t.reminder_days::int,
       t.notes, t.status,
       t.owner_id::uuid, t.org_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('65555555-0000-0000-0000-000000000001', 'CTR-2026-0001', 'BilgeTek 2026 yıllık donanım sözleşmesi', 'Supplier',  'BilgeTek Bilişim Ltd.',     '51111111-0000-0000-0000-000000000001', '2026-01-01', '2026-12-31', 'Manual', '1500000.00', 'TRY', 'Quarterly', '00000000-0000-0000-0000-000000000102', '30', '4 dönemli ödeme', 'Active',              '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('65555555-0000-0000-0000-000000000002', 'CTR-2026-0002', 'Office 365 yıllık lisans',                'It',        'BilgeTek Bilişim Ltd.',     '51111111-0000-0000-0000-000000000001', '2026-06-01', '2027-05-31', 'Automatic', '125000.00', 'USD', 'Yearly',   '00000000-0000-0000-0000-000000000102', '60', 'Otomatik yenileme', 'Draft',             '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('65555555-0000-0000-0000-000000000003', 'CTR-2026-0003', 'Ofis kira sözleşmesi — Levent',            'Rent',      'Levent Gayrimenkul A.Ş.',    '',                                       '2026-09-01', '2029-08-31', 'None',    '720000.00', 'TRY', 'Monthly',   '00000000-0000-0000-0000-000000000100', '60', '3 yıl, aylık 20K',  'WaitingForSignature', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200')
) AS t(id, contract_number, subject, ctype, cp_name, cp_id, start_date, end_date, renewal, amount, currency, payment, responsible_user_id, reminder_days, notes, status, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM contract c WHERE c.id = t.id::uuid);

-- ---------------------------------------------
-- contract_approval_step
-- ---------------------------------------------
INSERT INTO contract_approval_step (id, contract_id, order_index, approver_user_id, role_label, status)
SELECT t.id::uuid, t.contract_id::uuid, t.order_idx::int, t.approver_id::uuid, t.role_label, t.status
FROM (VALUES
    -- Contract 1 (Active) — approved chain
    ('65556666-0000-0000-0000-000000000001', '65555555-0000-0000-0000-000000000001', '1', '00000000-0000-0000-0000-000000000102', 'Satın Alma Müdürü', 'Approved'),
    ('65556666-0000-0000-0000-000000000002', '65555555-0000-0000-0000-000000000001', '2', '00000000-0000-0000-0000-000000000020', 'Yönetim',           'Approved'),
    -- Contract 3 (WaitingForSignature) — waiting on management
    ('65556666-0000-0000-0000-000000000003', '65555555-0000-0000-0000-000000000003', '1', '00000000-0000-0000-0000-000000000100', 'Satış Müdürü',      'Approved'),
    ('65556666-0000-0000-0000-000000000004', '65555555-0000-0000-0000-000000000003', '2', '00000000-0000-0000-0000-000000000020', 'Yönetim',           'Waiting')
) AS t(id, contract_id, order_idx, approver_id, role_label, status)
WHERE NOT EXISTS (SELECT 1 FROM contract_approval_step cas WHERE cas.id = t.id::uuid);

-- ---------------------------------------------
-- contract_form (Q_LEGAL questionnaire'ine bağlanmış)
-- ---------------------------------------------
INSERT INTO contract_form (id, contract_id, questionnaire_id, status, filled_by_user_id, filled_at)
SELECT t.id::uuid, t.contract_id::uuid, t.questionnaire_id::uuid, t.status,
       NULLIF(t.filled_by_id, '')::uuid,
       NULLIF(t.filled_at, '')::timestamptz
FROM (VALUES
    ('65557777-0000-0000-0000-000000000001', '65555555-0000-0000-0000-000000000001', '64444444-0000-0000-0000-000000000002', 'Completed', '00000000-0000-0000-0000-000000000102', '2026-04-25 10:00:00+03')
) AS t(id, contract_id, questionnaire_id, status, filled_by_id, filled_at)
WHERE NOT EXISTS (SELECT 1 FROM contract_form cf WHERE cf.id = t.id::uuid);

-- ---------------------------------------------
-- contract_form_answer
-- ---------------------------------------------
INSERT INTO contract_form_answer (id, contract_form_id, questionnaire_question_id, answer_text, answer_number, answer_date, answer_bool, answer_options)
SELECT t.id::uuid, t.form_id::uuid, t.question_id::uuid,
       NULLIF(t.answer_text, ''), NULLIF(t.answer_number, '')::numeric, NULLIF(t.answer_date, '')::date,
       NULLIF(t.answer_bool, '')::boolean, NULLIF(t.answer_options, '')
FROM (VALUES
    ('65558888-0000-0000-0000-000000000001', '65557777-0000-0000-0000-000000000001', '64445555-0000-0000-0000-000000000005', '',                '',       '', 'true',  ''),
    ('65558888-0000-0000-0000-000000000002', '65557777-0000-0000-0000-000000000001', '64445555-0000-0000-0000-000000000006', '',                '12',     '', '',      ''),
    ('65558888-0000-0000-0000-000000000003', '65557777-0000-0000-0000-000000000001', '64445555-0000-0000-0000-000000000007', 'Standart KVKK + gizlilik maddeleri eklenmiştir', '', '', '', '')
) AS t(id, form_id, question_id, answer_text, answer_number, answer_date, answer_bool, answer_options)
WHERE NOT EXISTS (SELECT 1 FROM contract_form_answer cfa WHERE cfa.id = t.id::uuid);
