-- =============================================
-- CodePro SampleData / V011 — Questionnaire (+ questions + options)
-- 2 anket: Offer için (Tedarikçi değerlendirme) + Contract için (Hukuki kontrol listesi).
-- =============================================

-- Fixed UUIDs
-- Q_SUPPLIER = 64444444-0000-0000-0000-000000000001  (related_module=Offer)
-- Q_LEGAL    = 64444444-0000-0000-0000-000000000002  (related_module=Contract)

INSERT INTO questionnaire (id, name, related_module, status, owner_id, organization_id,
                           is_active, created_by, created_at)
SELECT t.id::uuid, t.name, t.module, t.status,
       t.owner_id::uuid, t.org_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('64444444-0000-0000-0000-000000000001', 'Tedarikçi Değerlendirme Anketi', 'Offer',    'Active', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('64444444-0000-0000-0000-000000000002', 'Sözleşme Hukuki Kontrol Listesi', 'Contract', 'Active', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200')
) AS t(id, name, module, status, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM questionnaire q WHERE q.id = t.id::uuid);

-- ---------------------------------------------
-- questionnaire_question
-- ---------------------------------------------
INSERT INTO questionnaire_question (id, questionnaire_id, question_text, question_type, is_required, order_index)
SELECT t.id::uuid, t.questionnaire_id::uuid, t.text, t.qtype, t.required, t.order_idx::int
FROM (VALUES
    -- Q_SUPPLIER
    ('64445555-0000-0000-0000-000000000001', '64444444-0000-0000-0000-000000000001', 'Tedarikçi ISO 9001 sahibi mi?',            'YesNo',         true,  '1'),
    ('64445555-0000-0000-0000-000000000002', '64444444-0000-0000-0000-000000000001', 'Yıllık ciro (TL)',                          'Number',        true,  '2'),
    ('64445555-0000-0000-0000-000000000003', '64444444-0000-0000-0000-000000000001', 'Tercih edilen ödeme vadesi',                'MultipleChoice', true,  '3'),
    ('64445555-0000-0000-0000-000000000004', '64444444-0000-0000-0000-000000000001', 'Referans bilgileri',                        'LongText',      false, '4'),
    -- Q_LEGAL
    ('64445555-0000-0000-0000-000000000005', '64444444-0000-0000-0000-000000000002', 'Karşı taraf KVKK aydınlatma metni onaylı mı?','YesNo',       true,  '1'),
    ('64445555-0000-0000-0000-000000000006', '64444444-0000-0000-0000-000000000002', 'Sözleşme süresi (ay)',                     'Number',        true,  '2'),
    ('64445555-0000-0000-0000-000000000007', '64444444-0000-0000-0000-000000000002', 'Hukuki açıklamalar',                       'LongText',      false, '3')
) AS t(id, questionnaire_id, text, qtype, required, order_idx)
WHERE NOT EXISTS (SELECT 1 FROM questionnaire_question qq WHERE qq.id = t.id::uuid);

-- ---------------------------------------------
-- questionnaire_question_option (MultipleChoice için)
-- ---------------------------------------------
INSERT INTO questionnaire_question_option (id, questionnaire_question_id, option_text, order_index)
SELECT t.id::uuid, t.question_id::uuid, t.text, t.order_idx::int
FROM (VALUES
    ('64446666-0000-0000-0000-000000000001', '64445555-0000-0000-0000-000000000003', 'Peşin',     '1'),
    ('64446666-0000-0000-0000-000000000002', '64445555-0000-0000-0000-000000000003', '30 gün',    '2'),
    ('64446666-0000-0000-0000-000000000003', '64445555-0000-0000-0000-000000000003', '60 gün',    '3'),
    ('64446666-0000-0000-0000-000000000004', '64445555-0000-0000-0000-000000000003', '90+ gün',   '4')
) AS t(id, question_id, text, order_idx)
WHERE NOT EXISTS (SELECT 1 FROM questionnaire_question_option qqo WHERE qqo.id = t.id::uuid);
