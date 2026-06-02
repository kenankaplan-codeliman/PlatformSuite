-- =============================================
-- CRM SampleData / V002 — Account (+ child tables + account_contact junction)
-- Account aggregate includes account_contact junction (per CLAUDE.md).
-- =============================================

-- Fixed UUIDs
-- ACCOUNT_1 = 11111111-0000-0000-0000-000000000001  (KobiLtd — Holding)
-- ACCOUNT_2 = 11111111-0000-0000-0000-000000000002  (KobiLtd — Üretim AŞ — child of #1)
-- ACCOUNT_3 = 11111111-0000-0000-0000-000000000003  (Tekno Holding)
-- ACCOUNT_4 = 11111111-0000-0000-0000-000000000004  (Mega Lojistik)
-- ACCOUNT_5 = 11111111-0000-0000-0000-000000000005  (MedyaPlus Reklam)

-- ---------------------------------------------
-- account (parent first so self-FK doesn't break)
-- ---------------------------------------------
INSERT INTO account (id, account_name, account_type, account_status, industry, annual_revenue, annual_revenue_currency, number_of_employees, website, parent_account_id, owner_id, organization_id, is_active, created_by, created_at)
SELECT t.id::uuid, t.name, t.type, t.status, t.industry, t.revenue::numeric, t.revenue_currency, t.employees::int, t.website,
       NULLIF(t.parent_id, '')::uuid,
       t.owner_id::uuid, t.org_id::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('11111111-0000-0000-0000-000000000001', 'KobiLtd Holding A.Ş.',     'Customer', 'Active',   'Holding',   '500000000.00', 'TRY', '850', 'https://kobiltd.com',    '', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('11111111-0000-0000-0000-000000000002', 'KobiLtd Üretim A.Ş.',      'Customer', 'Active',   'Üretim',    '120000000.00', 'TRY', '320', 'https://uretim.kobiltd.com', '11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('11111111-0000-0000-0000-000000000003', 'Tekno Holding A.Ş.',       'Customer', 'Prospect', 'Teknoloji', '250000000.00', 'USD', '450', 'https://teknoholding.com.tr', '', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('11111111-0000-0000-0000-000000000004', 'Mega Lojistik A.Ş.',       'Partner',  'AtRisk',   'Lojistik',  '85000000.00',  'EUR', '180', 'https://megalojistik.com.tr', '', '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000202'),
    ('11111111-0000-0000-0000-000000000005', 'MedyaPlus Reklam Ltd.',    'Customer', 'Churned',  'Pazarlama', '12000000.00',  'TRY', '45',  'https://medyaplus.com',  '', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200')
) AS t(id, name, type, status, industry, revenue, revenue_currency, employees, website, parent_id, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM account a WHERE a.id = t.id::uuid);

-- ---------------------------------------------
-- email (parent_entity_type='Account')
-- ---------------------------------------------
INSERT INTO email_address (id, parent_entity_type, parent_entity_id, email, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), 'Account', t.account_id::uuid, t.email, t.type, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('11111111-0000-0000-0000-000000000001', 'info@kobiltd.com',           'Other',   true),
    ('11111111-0000-0000-0000-000000000002', 'satis@uretim.kobiltd.com',   'Work',    true),
    ('11111111-0000-0000-0000-000000000003', 'iletisim@teknoholding.com.tr','Other',  true),
    ('11111111-0000-0000-0000-000000000004', 'destek@megalojistik.com.tr', 'Support', true),
    ('11111111-0000-0000-0000-000000000005', 'merhaba@medyaplus.com',      'Other',   true)
) AS t(account_id, email, type, is_primary)
WHERE NOT EXISTS (SELECT 1 FROM email_address ce WHERE ce.parent_entity_type = 'Account' AND ce.parent_entity_id = t.account_id::uuid AND ce.email = t.email);

-- ---------------------------------------------
-- phone (parent_entity_type='Account')
-- ---------------------------------------------
INSERT INTO phone (id, parent_entity_type, parent_entity_id, phone_number, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), 'Account', t.account_id::uuid, t.phone, t.type, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('11111111-0000-0000-0000-000000000001', '+90 212 444 1100', 'Work', true),
    ('11111111-0000-0000-0000-000000000002', '+90 262 555 2200', 'Work', true),
    ('11111111-0000-0000-0000-000000000003', '+90 216 555 3300', 'Work', true),
    ('11111111-0000-0000-0000-000000000004', '+90 312 555 4400', 'Work', true),
    ('11111111-0000-0000-0000-000000000005', '+90 232 555 5500', 'Work', true)
) AS t(account_id, phone, type, is_primary)
WHERE NOT EXISTS (SELECT 1 FROM phone cp WHERE cp.parent_entity_type = 'Account' AND cp.parent_entity_id = t.account_id::uuid AND cp.phone_number = t.phone);

-- ---------------------------------------------
-- address (parent_entity_type='Account')
-- ---------------------------------------------
-- Parametrik il/ilçe kodlarıyla (country_code='TR'); code seçili olduğu için name'ler de dolu (snapshot).
INSERT INTO address (id, parent_entity_type, parent_entity_id, address_line1, country_code, country_name, city_code, city_name, district_code, district_name, postal_code, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), 'Account', t.account_id::uuid, t.line1, 'TR', 'Türkiye', t.city_code, t.city_name, t.district_code, t.district_name, t.zip, t.type, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('11111111-0000-0000-0000-000000000001', 'Maslak Mah. Büyükdere Cd. No:255 Nurol Plaza',  '34', 'İstanbul', '34-sariyer', 'Sarıyer', '34485', 'Office', true),
    ('11111111-0000-0000-0000-000000000002', 'Gebze OSB 1. Cad. No:12',                       '41', 'Kocaeli',  '41-gebze',   'Gebze',   '41400', 'Office', true),
    ('11111111-0000-0000-0000-000000000003', 'Kozyatağı Mah. Bayar Cd. No:48 Yapı Kredi Plaza','34', 'İstanbul', '34-kadikoy', 'Kadıköy', '34736', 'Office', true),
    ('11111111-0000-0000-0000-000000000004', 'Çankaya Mah. Atatürk Bulvarı No:9',             '06', 'Ankara',   '06-cankaya', 'Çankaya', '06680', 'Office', true),
    ('11111111-0000-0000-0000-000000000005', 'Alsancak Mah. Kıbrıs Şehitleri Cd. No:75',      '35', 'İzmir',    '35-konak',   'Konak',   '35220', 'Office', true)
) AS t(account_id, line1, city_code, city_name, district_code, district_name, zip, type, is_primary)
WHERE NOT EXISTS (SELECT 1 FROM address ca WHERE ca.parent_entity_type = 'Account' AND ca.parent_entity_id = t.account_id::uuid AND ca.address_line1 = t.line1);

-- ---------------------------------------------
-- account_contact (junction — Account aggregate'in parçası)
-- ---------------------------------------------
INSERT INTO account_contact (id, account_id, contact_id, role, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), t.account_id::uuid, t.contact_id::uuid, t.role, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'CEO',                true),  -- KobiLtd Holding ← Selin
    ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'Satın Alma Müdürü',  true),  -- KobiLtd Üretim ← Burak
    ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', 'IT Direktörü',       true),  -- Tekno Holding ← Cem
    ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000004', 'Operasyon Lideri',   true),  -- Mega Lojistik ← Deniz
    ('11111111-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000005', 'Pazarlama Uzmanı',   true)   -- MedyaPlus ← Gül
) AS t(account_id, contact_id, role, is_primary)
WHERE NOT EXISTS (
    SELECT 1 FROM account_contact ac
    WHERE ac.account_id = t.account_id::uuid AND ac.contact_id = t.contact_id::uuid
);
