-- =============================================
-- CRM SampleData / V001 — Contact (+ email/phone/address children)
-- 5 sample contacts. Owner ve organization referansları Platform SampleData/InitData'dan gelir.
-- =============================================

-- Fixed UUIDs
-- CONTACT_1 = 22222222-0000-0000-0000-000000000001  (Burak Çelik)
-- CONTACT_2 = 22222222-0000-0000-0000-000000000002  (Selin Öztürk)
-- CONTACT_3 = 22222222-0000-0000-0000-000000000003  (Cem Doğan)
-- CONTACT_4 = 22222222-0000-0000-0000-000000000004  (Deniz Arslan)
-- CONTACT_5 = 22222222-0000-0000-0000-000000000005  (Gül Polat)

-- ---------------------------------------------
-- contact
-- ---------------------------------------------
INSERT INTO contact (id, first_name, last_name, contact_status, title, department, owner_id, organization_id, is_active, created_by, created_at)
SELECT t.id::uuid, t.first_name, t.last_name, t.status, t.title, t.dept,
       t.owner_id::uuid, t.org_id::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('22222222-0000-0000-0000-000000000001', 'Burak',  'Çelik',   'Active',        'Satın Alma Müdürü',  'Satın Alma',  '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('22222222-0000-0000-0000-000000000002', 'Selin',  'Öztürk',  'Active',        'CEO',                 'Yönetim',     '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('22222222-0000-0000-0000-000000000003', 'Cem',    'Doğan',   'Active',        'IT Direktörü',        'Bilgi İşlem', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('22222222-0000-0000-0000-000000000004', 'Deniz',  'Arslan',  'DoNotContact',  'Operasyon Lideri',    'Operasyon',   '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000202'),
    ('22222222-0000-0000-0000-000000000005', 'Gül',    'Polat',   'Inactive',      'Pazarlama Uzmanı',    'Pazarlama',   '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200')
) AS t(id, first_name, last_name, status, title, dept, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM contact c WHERE c.id = t.id::uuid);

-- ---------------------------------------------
-- contact_email
-- ---------------------------------------------
INSERT INTO contact_email (id, contact_id, email, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), t.contact_id::uuid, t.email, t.type, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('22222222-0000-0000-0000-000000000001', 'burak.celik@kobiltd.com',   'Work',     true),
    ('22222222-0000-0000-0000-000000000002', 'selin.ozturk@kobiltd.com',  'Work',     true),
    ('22222222-0000-0000-0000-000000000002', 'selin@gmail.com',           'Personal', false),
    ('22222222-0000-0000-0000-000000000003', 'cem.dogan@teknoholding.com.tr', 'Work', true),
    ('22222222-0000-0000-0000-000000000004', 'deniz.arslan@megalojistik.com.tr', 'Work', true),
    ('22222222-0000-0000-0000-000000000005', 'gul.polat@medyaplus.com',   'Work',     true)
) AS t(contact_id, email, type, is_primary)
WHERE NOT EXISTS (
    SELECT 1 FROM contact_email ce
    WHERE ce.contact_id = t.contact_id::uuid AND ce.email = t.email
);

-- ---------------------------------------------
-- contact_phone
-- ---------------------------------------------
INSERT INTO contact_phone (id, contact_id, phone_number, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), t.contact_id::uuid, t.phone, t.type, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('22222222-0000-0000-0000-000000000001', '+90 212 555 0101', 'Work',   true),
    ('22222222-0000-0000-0000-000000000001', '+90 532 100 0101', 'Mobile', false),
    ('22222222-0000-0000-0000-000000000002', '+90 212 555 0102', 'Work',   true),
    ('22222222-0000-0000-0000-000000000003', '+90 216 555 0103', 'Work',   true),
    ('22222222-0000-0000-0000-000000000004', '+90 312 555 0104', 'Work',   true),
    ('22222222-0000-0000-0000-000000000005', '+90 232 555 0105', 'Mobile', true)
) AS t(contact_id, phone, type, is_primary)
WHERE NOT EXISTS (
    SELECT 1 FROM contact_phone cp
    WHERE cp.contact_id = t.contact_id::uuid AND cp.phone_number = t.phone
);

-- ---------------------------------------------
-- contact_address
-- ---------------------------------------------
INSERT INTO contact_address (id, contact_id, address_line1, city, state, postal_code, country, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), t.contact_id::uuid, t.line1, t.city, t.state, t.zip, 'Türkiye', t.type, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('22222222-0000-0000-0000-000000000001', 'Maslak Mah. Büyükdere Cd. No:255',  'İstanbul', 'Sarıyer',   '34485', 'Office', true),
    ('22222222-0000-0000-0000-000000000002', 'Levent Mah. Esentepe Cd. No:17',    'İstanbul', 'Beşiktaş',  '34330', 'Office', true),
    ('22222222-0000-0000-0000-000000000003', 'Kozyatağı Mah. Bayar Cd. No:48',    'İstanbul', 'Kadıköy',   '34736', 'Office', true),
    ('22222222-0000-0000-0000-000000000004', 'Çankaya Mah. Atatürk Bulvarı No:9', 'Ankara',   'Çankaya',   '06680', 'Office', true),
    ('22222222-0000-0000-0000-000000000005', 'Alsancak Mah. Kıbrıs Şehitleri Cd. No:75', 'İzmir', 'Konak', '35220', 'Office', true)
) AS t(contact_id, line1, city, state, zip, type, is_primary)
WHERE NOT EXISTS (
    SELECT 1 FROM contact_address ca
    WHERE ca.contact_id = t.contact_id::uuid AND ca.address_line1 = t.line1
);
