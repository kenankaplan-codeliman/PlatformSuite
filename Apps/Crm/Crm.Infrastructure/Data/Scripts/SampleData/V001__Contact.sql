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
-- email (parent_entity_type='Contact')
-- ---------------------------------------------
INSERT INTO email_address (id, parent_entity_type, parent_entity_id, email, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), 'Contact', t.contact_id::uuid, t.email, t.type, t.is_primary,
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
    SELECT 1 FROM email_address ce
    WHERE ce.parent_entity_type = 'Contact' AND ce.parent_entity_id = t.contact_id::uuid AND ce.email = t.email
);

-- ---------------------------------------------
-- phone (parent_entity_type='Contact')
-- ---------------------------------------------
INSERT INTO phone (id, parent_entity_type, parent_entity_id, phone_number, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), 'Contact', t.contact_id::uuid, t.phone, t.type, t.is_primary,
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
    SELECT 1 FROM phone cp
    WHERE cp.parent_entity_type = 'Contact' AND cp.parent_entity_id = t.contact_id::uuid AND cp.phone_number = t.phone
);

-- ---------------------------------------------
-- address (parent_entity_type='Contact')
-- ---------------------------------------------
-- Parametrik il/ilçe kodlarıyla (country_code='TR'); code seçili olduğu için name'ler de dolu (snapshot).
INSERT INTO address (id, parent_entity_type, parent_entity_id, address_line1, country_code, country_name, city_code, city_name, district_code, district_name, postal_code, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), 'Contact', t.contact_id::uuid, t.line1, 'TR', 'Türkiye', t.city_code, t.city_name, t.district_code, t.district_name, t.zip, t.type, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('22222222-0000-0000-0000-000000000001', 'Maslak Mah. Büyükdere Cd. No:255',  '34', 'İstanbul', '34-sariyer',  'Sarıyer',  '34485', 'Office', true),
    ('22222222-0000-0000-0000-000000000002', 'Levent Mah. Esentepe Cd. No:17',    '34', 'İstanbul', '34-besiktas', 'Beşiktaş', '34330', 'Office', true),
    ('22222222-0000-0000-0000-000000000003', 'Kozyatağı Mah. Bayar Cd. No:48',    '34', 'İstanbul', '34-kadikoy',  'Kadıköy',  '34736', 'Office', true),
    ('22222222-0000-0000-0000-000000000004', 'Çankaya Mah. Atatürk Bulvarı No:9', '06', 'Ankara',   '06-cankaya',  'Çankaya',  '06680', 'Office', true),
    ('22222222-0000-0000-0000-000000000005', 'Alsancak Mah. Kıbrıs Şehitleri Cd. No:75', '35', 'İzmir', '35-konak', 'Konak',    '35220', 'Office', true)
) AS t(contact_id, line1, city_code, city_name, district_code, district_name, zip, type, is_primary)
WHERE NOT EXISTS (
    SELECT 1 FROM address ca
    WHERE ca.parent_entity_type = 'Contact' AND ca.parent_entity_id = t.contact_id::uuid AND ca.address_line1 = t.line1
);
