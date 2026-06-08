-- =============================================
-- CRM SampleData / V003 — Lead
-- Lead'in converted_account_id / converted_contact_id FK'leri opsiyonel; çoğu örnek için NULL.
-- Bir tanesi Converted statüsünde olup mevcut bir Account/Contact'a bağlanır.
--
-- İletişim (email/telefon) artık düz alanlarda değil; polimorfik Communications
-- modelinde (email_address/phone, parent_entity_type = 'Lead') tutulur — bu script
-- lead satırlarından sonra örnek iletişim kayıtlarını da seed eder.
-- =============================================

-- Fixed UUIDs
-- LEAD_1 = 33333333-0000-0000-0000-000000000001  (New — Website)
-- LEAD_2 = 33333333-0000-0000-0000-000000000002  (Qualified — Referral)
-- LEAD_3 = 33333333-0000-0000-0000-000000000003  (Contacted — Event)
-- LEAD_4 = 33333333-0000-0000-0000-000000000004  (Converted → ACCOUNT_3, CONTACT_3)
-- LEAD_5 = 33333333-0000-0000-0000-000000000005  (Unqualified — SocialMedia)

INSERT INTO lead (id, subject, first_name, last_name, title, department, company, industry, website, source, status, rating, score, estimated_value, estimated_value_currency, description, converted_account_id, converted_contact_id, converted_at, owner_id, organization_id, is_active, created_by, created_at)
SELECT t.id::uuid, t.subject, t.first_name, t.last_name, t.title, t.department, t.company, t.industry, t.website,
       t.source, t.status, t.rating, t.score::int, t.value::numeric, t.value_currency, t.description,
       NULLIF(t.conv_account, '')::uuid, NULLIF(t.conv_contact, '')::uuid,
       CASE WHEN t.status = 'Converted' THEN current_timestamp - interval '7 days' ELSE NULL END,
       t.owner_id::uuid, t.org_id::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('33333333-0000-0000-0000-000000000001', 'Veri merkezi modernizasyonu', 'Sinem', 'Yıldız',  'BT Müdürü',    'Bilgi Teknolojileri', 'DataCom A.Ş.',    'Bilişim',    'https://datacom.com.tr',       'Website',     'New',         'Warm', 60, '450000.00',  'TRY', 'Web formundan gelen sunucu yenileme talebi',                '', '', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('33333333-0000-0000-0000-000000000002', 'ERP geçişi danışmanlığı',     'Tolga', 'Kaya',    'Genel Müdür',  'Yönetim',             'Yıldız Tekstil',  'Tekstil',    'https://yildiztekstil.com.tr', 'Referral',    'Qualified',   'Hot',  85, '850000.00',  'TRY', 'Mevcut müşteri Selin Öztürk önerdi',                       '', '', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('33333333-0000-0000-0000-000000000003', 'CRM lisansı yenileme',        'Esra',  'Korkmaz', 'IT Direktörü', 'Bilgi İşlem',         'Korkmaz Holding', 'Holding',    'https://korkmazholding.com',   'Event',       'Contacted',   'Cold', 45, '120000.00',  'EUR', 'Sektör fuarında stand ziyareti',                            '', '', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('33333333-0000-0000-0000-000000000004', 'Bulut göç projesi',           'Cem',   'Doğan',   'IT Direktörü', 'Bilgi İşlem',         'Tekno Holding',   'Teknoloji',  'https://teknoholding.com.tr',  'Phone',       'Converted',   'Hot',  95, '1250000.00', 'USD', 'Telefonla ön görüşme sonrası Account + Contact''e dönüştü', '11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('33333333-0000-0000-0000-000000000005', 'Reklam kampanya talebi',      'Murat', 'Eren',    'Sahip',        'Yönetim',             'Eren İnşaat',     'İnşaat',     'https://erenins.com.tr',       'SocialMedia', 'Unqualified', 'Cold', 20, '50000.00',   'TRY', 'LinkedIn üzerinden gelen — bütçe yetersiz',                 '', '', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200')
) AS t(id, subject, first_name, last_name, title, department, company, industry, website, source, status, rating, score, value, value_currency, description, conv_account, conv_contact, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM lead l WHERE l.id = t.id::uuid);

-- ---------------------------------------------
-- Lead iletişim kayıtları — polimorfik owner (parent_entity_type = 'Lead')
-- ---------------------------------------------
INSERT INTO email_address (id, parent_entity_type, parent_entity_id, email, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), 'Lead', t.lead_id::uuid, t.email, 'Work', true, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('33333333-0000-0000-0000-000000000001', 'sinem.yildiz@datacom.com.tr'),
    ('33333333-0000-0000-0000-000000000002', 'tolga@yildiztekstil.com.tr'),
    ('33333333-0000-0000-0000-000000000003', 'esra.korkmaz@korkmazholding.com'),
    ('33333333-0000-0000-0000-000000000004', 'cem.dogan@teknoholding.com.tr'),
    ('33333333-0000-0000-0000-000000000005', 'murat.eren@erenins.com.tr')
) AS t(lead_id, email)
WHERE NOT EXISTS (
    SELECT 1 FROM email_address e
    WHERE e.parent_entity_type = 'Lead' AND e.parent_entity_id = t.lead_id::uuid
);

INSERT INTO phone (id, parent_entity_type, parent_entity_id, phone_number, type, is_primary, is_active, created_by, created_at)
SELECT gen_random_uuid(), 'Lead', t.lead_id::uuid, t.phone, 'Work', true, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('33333333-0000-0000-0000-000000000001', '+90 532 200 0001'),
    ('33333333-0000-0000-0000-000000000002', '+90 532 200 0002'),
    ('33333333-0000-0000-0000-000000000003', '+90 532 200 0003'),
    ('33333333-0000-0000-0000-000000000004', '+90 216 555 0103'),
    ('33333333-0000-0000-0000-000000000005', '+90 532 200 0005')
) AS t(lead_id, phone)
WHERE NOT EXISTS (
    SELECT 1 FROM phone p
    WHERE p.parent_entity_type = 'Lead' AND p.parent_entity_id = t.lead_id::uuid
);
