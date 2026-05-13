-- =============================================
-- CodePro SampleData / V015 — EDocument (+ approvals + comments)
-- entity_type/entity_id polimorfik (FK constraint yok). Sample veriler
-- mevcut Contract ve PurchaseOrder kayıtlarına işaret eder.
-- =============================================

-- Fixed UUIDs
-- EDOC_1 = 68888888-0000-0000-0000-000000000001  (Contract sözleşme metni)
-- EDOC_2 = 68888888-0000-0000-0000-000000000002  (PurchaseOrder onay belgesi)

INSERT INTO e_document (id, subject, description, document_type, status,
                        entity_type, entity_id, attachment_url,
                        routing_type, routing_groups, routing_person_ids, routing_person_names,
                        owner_id, organization_id,
                        is_active, created_by, created_at)
SELECT t.id::uuid, t.subject, t.description, t.dtype, t.status,
       t.entity_type, t.entity_id::uuid, t.url,
       t.routing_type, t.routing_groups, t.routing_person_ids, t.routing_person_names,
       t.owner_id::uuid, t.org_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('68888888-0000-0000-0000-000000000001', 'CTR-2026-0001 imzalı sözleşme metni',  'BilgeTek ile imzalı yıllık donanım sözleşmesi', 'Sozlesme', 'Approved', 'Contract',      '65555555-0000-0000-0000-000000000001', '/storage/edoc/ctr-2026-0001.pdf', 'Person', '', '00000000-0000-0000-0000-000000000102', 'Zeynep Kara',  '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('68888888-0000-0000-0000-000000000002', 'PO-2026-0003 onay belgesi',            'Anadolu mobilya 20+20 sipariş onayı',           'Siparis',  'Sent',     'PurchaseOrder', '63333333-0000-0000-0000-000000000003', '/storage/edoc/po-2026-0003.pdf', 'Group',  'PurchasingTeam', '', '',           '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000201')
) AS t(id, subject, description, dtype, status, entity_type, entity_id, url, routing_type, routing_groups, routing_person_ids, routing_person_names, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM e_document ed WHERE ed.id = t.id::uuid);

-- ---------------------------------------------
-- e_document_approval
-- ---------------------------------------------
INSERT INTO e_document_approval (id, e_document_id, user_id, user_name, status, comment, action_date, seen_at)
SELECT t.id::uuid, t.edoc_id::uuid, t.user_id::uuid, t.user_name, t.status, t.comment,
       NULLIF(t.action_date, '')::timestamptz, NULLIF(t.seen_at, '')::timestamptz
FROM (VALUES
    ('68889999-0000-0000-0000-000000000001', '68888888-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Zeynep Kara', 'approved', 'Onaylandı', '2026-04-30 11:00:00+03', '2026-04-29 17:00:00+03'),
    ('68889999-0000-0000-0000-000000000002', '68888888-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000020', 'Admin User',  'approved', 'Onaylandı', '2026-05-01 09:00:00+03', '2026-04-30 18:00:00+03'),
    ('68889999-0000-0000-0000-000000000003', '68888888-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102', 'Zeynep Kara', 'pending',  '',          '',                       '2026-05-04 10:00:00+03')
) AS t(id, edoc_id, user_id, user_name, status, comment, action_date, seen_at)
WHERE NOT EXISTS (SELECT 1 FROM e_document_approval eda WHERE eda.id = t.id::uuid);

-- ---------------------------------------------
-- e_document_comment
-- ---------------------------------------------
INSERT INTO e_document_comment (id, e_document_id, user_id, user_name, content)
SELECT t.id::uuid, t.edoc_id::uuid, t.user_id::uuid, t.user_name, t.content
FROM (VALUES
    ('68880000-0000-0000-0000-000000000001', '68888888-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Zeynep Kara', 'Sözleşme metni hukuk birimince onaylandı.'),
    ('68880000-0000-0000-0000-000000000002', '68888888-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000103', 'Ali Şahin',   'Tedarikçi iletişim bilgileri ekte.')
) AS t(id, edoc_id, user_id, user_name, content)
WHERE NOT EXISTS (SELECT 1 FROM e_document_comment edc WHERE edc.id = t.id::uuid);
