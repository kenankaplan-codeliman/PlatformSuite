-- =============================================
-- CRM SampleData / V005 — Product
-- Örnek ürün kayıtları (donanım, yazılım, hizmet, abonelik, diğer kategoriler).
-- Owner / organization referansları Platform SampleData/InitData'dan gelir.
-- Category + UnitOfMeasure + UnitPriceCurrency GeneralParameter code'larıyla
-- InitData V004__ProductParameters.sql ile uyumlu.
-- =============================================

-- Fixed UUIDs
-- PRODUCT_1 = 55555555-0000-0000-0000-000000000001  (Sunucu Donanımı - Adet)
-- PRODUCT_2 = 55555555-0000-0000-0000-000000000002  (ERP Modül Lisans - Adet)
-- PRODUCT_3 = 55555555-0000-0000-0000-000000000003  (Danışmanlık - Saat)
-- PRODUCT_4 = 55555555-0000-0000-0000-000000000004  (SaaS Abonelik - Ay)
-- PRODUCT_5 = 55555555-0000-0000-0000-000000000005  (Bulut Göç Hizmeti - Gün)
-- PRODUCT_6 = 55555555-0000-0000-0000-000000000006  (Eğitim Paketi - Adet)
-- PRODUCT_7 = 55555555-0000-0000-0000-000000000007  (Destek Saati - Saat)
-- PRODUCT_8 = 55555555-0000-0000-0000-000000000008  (Filo Takip Lisansı - Yıl)

INSERT INTO product (id, name, product_code, category, unit_price, unit_price_currency, unit_of_measure, description, owner_id, organization_id, is_active, created_by, created_at)
SELECT t.id::uuid, t.name, t.product_code, t.category,
       t.unit_price::numeric, t.unit_price_currency, t.unit_of_measure,
       NULLIF(t.description, ''),
       t.owner_id::uuid, t.org_id::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('55555555-0000-0000-0000-000000000001', 'Sunucu — Dell PowerEdge R750',           'PRD-HW-001', 'Hardware',     '180000.00', 'TRY', 'Piece', 'Üretim sınıfı rack-mount sunucu (2U)', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('55555555-0000-0000-0000-000000000002', 'ERP Finans Modülü Lisansı',              'PRD-SW-001', 'Software',     '45000.00',  'USD', 'Piece', 'Kullanıcı başı yıllık lisans',         '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('55555555-0000-0000-0000-000000000003', 'Implementasyon Danışmanlığı',            'PRD-SV-001', 'Service',      '1500.00',   'USD', 'Hour',  'Senior consultant — saatlik',          '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('55555555-0000-0000-0000-000000000004', 'CRM SaaS Abonelik — Standard',           'PRD-SS-001', 'Subscription', '950.00',    'EUR', 'Month', 'Aylık kullanıcı başı abonelik',        '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('55555555-0000-0000-0000-000000000005', 'Bulut Göç Hizmeti',                      'PRD-SV-002', 'Service',      '12000.00',  'USD', 'Day',   'On-prem → cloud taşıma; günlük',       '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('55555555-0000-0000-0000-000000000006', 'Kullanıcı Eğitim Paketi',                'PRD-SV-003', 'Service',      '15000.00',  'TRY', 'Piece', '5 günlük sınıf içi eğitim',           '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000202'),
    ('55555555-0000-0000-0000-000000000007', 'Premium Destek Paketi',                  'PRD-SS-002', 'Subscription','2500.00',   'USD', 'Month', 'Aylık 8x5 telefon + e-posta destek',   '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('55555555-0000-0000-0000-000000000008', 'Filo Takip — Yıllık Lisans',             'PRD-SW-002', 'Software',     '85000.00',  'EUR', 'Year',  'Araç başı yıllık lisans',              '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000202')
) AS t(id, name, product_code, category, unit_price, unit_price_currency, unit_of_measure, description, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM product p WHERE p.id = t.id::uuid);
