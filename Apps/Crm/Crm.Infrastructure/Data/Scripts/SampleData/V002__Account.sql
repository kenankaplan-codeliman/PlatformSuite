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
INSERT INTO account (id, account_name, account_type, account_status, industry, annual_revenue, number_of_employees, website, parent_account_id, owner_id, organization_id, is_active, created_by, created_at)
SELECT t.id::uuid, t.name, t.type, t.status, t.industry, t.revenue::numeric, t.employees::int, t.website,
       NULLIF(t.parent_id, '')::uuid,
       t.owner_id::uuid, t.org_id::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('11111111-0000-0000-0000-000000000001', 'KobiLtd Holding A.Ş.',     'Customer', 'Active',   'Holding',   '500000000.00', '850', 'https://kobiltd.com',    '', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('11111111-0000-0000-0000-000000000002', 'KobiLtd Üretim A.Ş.',      'Customer', 'Active',   'Üretim',    '120000000.00', '320', 'https://uretim.kobiltd.com', '11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('11111111-0000-0000-0000-000000000003', 'Tekno Holding A.Ş.',       'Customer', 'Prospect', 'Teknoloji', '250000000.00', '450', 'https://teknoholding.com.tr', '', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('11111111-0000-0000-0000-000000000004', 'Mega Lojistik A.Ş.',       'Partner',  'AtRisk',   'Lojistik',  '85000000.00',  '180', 'https://megalojistik.com.tr', '', '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000202'),
    ('11111111-0000-0000-0000-000000000005', 'MedyaPlus Reklam Ltd.',    'Customer', 'Churned',  'Pazarlama', '12000000.00',  '45',  'https://medyaplus.com',  '', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200')
) AS t(id, name, type, status, industry, revenue, employees, website, parent_id, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM account a WHERE a.id = t.id::uuid);

-- ---------------------------------------------
-- account_email
-- ---------------------------------------------
INSERT INTO account_email (id, account_id, email, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), t.account_id::uuid, t.email, t.type, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('11111111-0000-0000-0000-000000000001', 'info@kobiltd.com',           'Other',   true),
    ('11111111-0000-0000-0000-000000000002', 'satis@uretim.kobiltd.com',   'Work',    true),
    ('11111111-0000-0000-0000-000000000003', 'iletisim@teknoholding.com.tr','Other',  true),
    ('11111111-0000-0000-0000-000000000004', 'destek@megalojistik.com.tr', 'Support', true),
    ('11111111-0000-0000-0000-000000000005', 'merhaba@medyaplus.com',      'Other',   true)
) AS t(account_id, email, type, is_primary)
WHERE NOT EXISTS (SELECT 1 FROM account_email ae WHERE ae.account_id = t.account_id::uuid AND ae.email = t.email);

-- ---------------------------------------------
-- account_phone
-- ---------------------------------------------
INSERT INTO account_phone (id, account_id, phone_number, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), t.account_id::uuid, t.phone, t.type, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('11111111-0000-0000-0000-000000000001', '+90 212 444 1100', 'Work', true),
    ('11111111-0000-0000-0000-000000000002', '+90 262 555 2200', 'Work', true),
    ('11111111-0000-0000-0000-000000000003', '+90 216 555 3300', 'Work', true),
    ('11111111-0000-0000-0000-000000000004', '+90 312 555 4400', 'Work', true),
    ('11111111-0000-0000-0000-000000000005', '+90 232 555 5500', 'Work', true)
) AS t(account_id, phone, type, is_primary)
WHERE NOT EXISTS (SELECT 1 FROM account_phone ap WHERE ap.account_id = t.account_id::uuid AND ap.phone_number = t.phone);

-- ---------------------------------------------
-- account_address
-- ---------------------------------------------
INSERT INTO account_address (id, account_id, address_line1, city, state, postal_code, country, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), t.account_id::uuid, t.line1, t.city, t.state, t.zip, 'Türkiye', t.type, t.is_primary,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('11111111-0000-0000-0000-000000000001', 'Maslak Mah. Büyükdere Cd. No:255 Nurol Plaza',  'İstanbul', 'Sarıyer',   '34485', 'Office', true),
    ('11111111-0000-0000-0000-000000000002', 'Gebze OSB 1. Cad. No:12',                       'Kocaeli',  'Gebze',     '41400', 'Office', true),
    ('11111111-0000-0000-0000-000000000003', 'Kozyatağı Mah. Bayar Cd. No:48 Yapı Kredi Plaza','İstanbul', 'Kadıköy',   '34736', 'Office', true),
    ('11111111-0000-0000-0000-000000000004', 'Çankaya Mah. Atatürk Bulvarı No:9',             'Ankara',   'Çankaya',   '06680', 'Office', true),
    ('11111111-0000-0000-0000-000000000005', 'Alsancak Mah. Kıbrıs Şehitleri Cd. No:75',      'İzmir',    'Konak',     '35220', 'Office', true)
) AS t(account_id, line1, city, state, zip, type, is_primary)
WHERE NOT EXISTS (SELECT 1 FROM account_address aa WHERE aa.account_id = t.account_id::uuid AND aa.address_line1 = t.line1);

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
