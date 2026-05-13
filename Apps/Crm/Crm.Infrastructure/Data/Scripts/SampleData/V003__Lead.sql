-- =============================================
-- CRM SampleData / V003 — Lead
-- Lead'in converted_account_id / converted_contact_id FK'leri opsiyonel; çoğu örnek için NULL.
-- Bir tanesi Converted statüsünde olup mevcut bir Account/Contact'a bağlanır.
-- =============================================

-- Fixed UUIDs
-- LEAD_1 = 33333333-0000-0000-0000-000000000001  (New — Website)
-- LEAD_2 = 33333333-0000-0000-0000-000000000002  (Qualified — Referral)
-- LEAD_3 = 33333333-0000-0000-0000-000000000003  (Contacted — Event)
-- LEAD_4 = 33333333-0000-0000-0000-000000000004  (Converted → ACCOUNT_3, CONTACT_3)
-- LEAD_5 = 33333333-0000-0000-0000-000000000005  (Unqualified — SocialMedia)

INSERT INTO lead (id, subject, first_name, last_name, company, title, email, phone, website, source, status, score, estimated_value, description, converted_account_id, converted_contact_id, converted_at, owner_id, organization_id, is_active, created_by, created_at)
SELECT t.id::uuid, t.subject, t.first_name, t.last_name, t.company, t.title, t.email, t.phone, t.website,
       t.source, t.status, t.score::int, t.value::numeric, t.description,
       NULLIF(t.conv_account, '')::uuid, NULLIF(t.conv_contact, '')::uuid,
       CASE WHEN t.status = 'Converted' THEN current_timestamp - interval '7 days' ELSE NULL END,
       t.owner_id::uuid, t.org_id::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('33333333-0000-0000-0000-000000000001', 'Veri merkezi modernizasyonu', 'Sinem', 'Yıldız',  'DataCom A.Ş.',     'BT Müdürü',    'sinem.yildiz@datacom.com.tr',  '+90 532 200 0001', 'https://datacom.com.tr', 'Website',     'New',         60, '450000.00', 'Web formundan gelen sunucu yenileme talebi',                '', '', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('33333333-0000-0000-0000-000000000002', 'ERP geçişi danışmanlığı',     'Tolga', 'Kaya',    'Yıldız Tekstil',   'Genel Müdür',  'tolga@yildiztekstil.com.tr',   '+90 532 200 0002', 'https://yildiztekstil.com.tr', 'Referral',  'Qualified',   85, '850000.00', 'Mevcut müşteri Selin Öztürk önerdi',                       '', '', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('33333333-0000-0000-0000-000000000003', 'CRM lisansı yenileme',        'Esra',  'Korkmaz', 'Korkmaz Holding',  'IT Direktörü', 'esra.korkmaz@korkmazholding.com','+90 532 200 0003', 'https://korkmazholding.com', 'Event',     'Contacted',   45, '120000.00', 'Sektör fuarında stand ziyareti',                            '', '', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('33333333-0000-0000-0000-000000000004', 'Bulut göç projesi',           'Cem',   'Doğan',   'Tekno Holding',    'IT Direktörü', 'cem.dogan@teknoholding.com.tr','+90 216 555 0103', 'https://teknoholding.com.tr', 'Phone',    'Converted',   95, '1250000.00','Telefonla ön görüşme sonrası Account + Contact''e dönüştü', '11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('33333333-0000-0000-0000-000000000005', 'Reklam kampanya talebi',      'Murat', 'Eren',    'Eren İnşaat',      'Sahip',        'murat.eren@erenins.com.tr',    '+90 532 200 0005', 'https://erenins.com.tr', 'SocialMedia', 'Unqualified', 20, '50000.00',  'LinkedIn üzerinden gelen — bütçe yetersiz',                 '', '', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200')
) AS t(id, subject, first_name, last_name, company, title, email, phone, website, source, status, score, value, description, conv_account, conv_contact, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM lead l WHERE l.id = t.id::uuid);
