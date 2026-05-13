-- =============================================
-- CodePro SampleData / V001 — Supplier
-- 5 sample suppliers. Owner = Zeynep Kara (Purchasing Manager), Org = Purchasing.
-- =============================================

-- Fixed UUIDs
-- SUPPLIER_1 = 51111111-0000-0000-0000-000000000001  (BilgeTek Bilişim)
-- SUPPLIER_2 = 51111111-0000-0000-0000-000000000002  (Anadolu Ofis Mobilya)
-- SUPPLIER_3 = 51111111-0000-0000-0000-000000000003  (Mavi Lojistik)
-- SUPPLIER_4 = 51111111-0000-0000-0000-000000000004  (Çelik Endüstri)
-- SUPPLIER_5 = 51111111-0000-0000-0000-000000000005  (Yeşil Enerji A.Ş.)

INSERT INTO supplier (id, name, industry, website, description, annual_revenue, number_of_employees,
                      supplier_type, supplier_status, company_type, company_legal_type, tax_office, vkn, mersis_no,
                      contact_person_name, contact_person_email, contact_person_phone,
                      address_line, city, country, postal_code,
                      owner_id, organization_id,
                      is_active, created_by, created_at)
SELECT t.id::uuid, t.name, t.industry, t.website, t.description, t.revenue::numeric, t.employees::int,
       t.stype, t.sstatus, t.ctype, t.cltype, t.tax_office, t.vkn, t.mersis,
       t.cp_name, t.cp_email, t.cp_phone,
       t.address, t.city, 'Türkiye', t.postal,
       '00000000-0000-0000-0000-000000000102'::uuid,
       '00000000-0000-0000-0000-000000000201'::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('51111111-0000-0000-0000-000000000001', 'BilgeTek Bilişim Ltd.',     'Bilişim',  'https://bilgetek.com.tr',     'Donanım ve yazılım tedariki',  '15000000.00', '60',  'Distributor',     'Active',  'Tuzel', 'LimitedSirket',  'Maslak VD',         '1234567890', '0123456789012345', 'Hakan Çetin',  'hakan@bilgetek.com.tr',     '+90 212 333 0001', 'Maslak Mah. Eski Büyükdere Cd. No:14', 'İstanbul', '34485'),
    ('51111111-0000-0000-0000-000000000002', 'Anadolu Ofis Mobilya A.Ş.', 'Mobilya',  'https://anadolumobilya.com',  'Ofis ve depolama mobilyaları', '8000000.00',  '35',  'Manufacturer',    'Active',  'Tuzel', 'AnonimSirketi',  'Ankara Çankaya VD', '2345678901', '0234567890123456', 'Yasemin Akın', 'yasemin@anadolumobilya.com','+90 312 333 0002', 'Çankaya OSB 5. Cad. No:8',             'Ankara',   '06800'),
    ('51111111-0000-0000-0000-000000000003', 'Mavi Lojistik San. Tic.',   'Lojistik', 'https://mavilojistik.com.tr', 'Karayolu ve depolama',         '22000000.00', '120', 'ServiceProvider', 'Active',  'Tuzel', 'LimitedSirket',  'Pendik VD',         '3456789012', '0345678901234567', 'Onur Demir',   'onur@mavilojistik.com.tr',  '+90 216 333 0003', 'Pendik OSB 12. Cad. No:5',             'İstanbul', '34906'),
    ('51111111-0000-0000-0000-000000000004', 'Çelik Endüstri A.Ş.',       'Metal',    'https://celikend.com.tr',     'Çelik konstrüksiyon ve sac',   '45000000.00', '210', 'Manufacturer',    'Pending', 'Tuzel', 'AnonimSirketi',  'Kocaeli VD',        '4567890123', '0456789012345678', 'Ayhan Polat',  'ayhan@celikend.com.tr',     '+90 262 333 0004', 'Gebze OSB 1. Cad. No:22',              'Kocaeli',  '41400'),
    ('51111111-0000-0000-0000-000000000005', 'Yeşil Enerji A.Ş.',         'Enerji',   'https://yesilenerji.com.tr',  'Güneş paneli ve aksesuar',     '32000000.00', '95',  'Manufacturer',    'Active',  'Tuzel', 'AnonimSirketi',  'Konak VD',          '5678901234', '0567890123456789', 'Berna Doğan',  'berna@yesilenerji.com.tr',  '+90 232 333 0005', 'Konak Mah. 1456. Sk. No:11',           'İzmir',    '35220')
) AS t(id, name, industry, website, description, revenue, employees,
       stype, sstatus, ctype, cltype, tax_office, vkn, mersis,
       cp_name, cp_email, cp_phone,
       address, city, postal)
WHERE NOT EXISTS (SELECT 1 FROM supplier s WHERE s.id = t.id::uuid);
