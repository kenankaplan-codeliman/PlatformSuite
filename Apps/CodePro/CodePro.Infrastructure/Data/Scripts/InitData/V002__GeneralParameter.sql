-- =============================================
-- CodePro InitData / V002 — GeneralParameter seed
--
-- CodePro entity'lerinin GeneralParameter'a taşınan enum alanları:
--   SupplierType / SupplierStatus     → eski CodePro.Domain.Enums.SupplierType / SupplierStatus
--   CompanyType / CompanyLegalType    → eski CodePro.Domain.Enums.CompanyType / CompanyLegalType
--
-- Kök satır:    code = tip adı,    parent_code = NULL
-- Değer satırı: code = enum değeri, parent_code = tip adı
--
-- general_parameter tablosu Platform Schema/V004 ile oluşturulur.
-- Tüm insert'ler WHERE NOT EXISTS ile idempotent'tir.
-- =============================================

INSERT INTO general_parameter (id, code, parent_code, label, order_index, is_active, created_by, created_at)
SELECT gen_random_uuid(), v.code, v.parent_code, v.label, v.order_index, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    -- SupplierType
    ('SupplierType',    NULL,           'Tedarikçi Tipi',    0),
    ('Manufacturer',    'SupplierType', 'Üretici',           1),
    ('Distributor',     'SupplierType', 'Dağıtıcı',          2),
    ('ServiceProvider', 'SupplierType', 'Hizmet Sağlayıcı',  3),
    ('Retailer',        'SupplierType', 'Perakendeci',       4),
    ('Other',           'SupplierType', 'Diğer',             5),
    -- SupplierStatus
    ('SupplierStatus', NULL,             'Tedarikçi Durumu', 0),
    ('Pending',        'SupplierStatus', 'Beklemede',        1),
    ('Active',         'SupplierStatus', 'Aktif',            2),
    ('Passive',        'SupplierStatus', 'Pasif',            3),
    ('Blacklisted',    'SupplierStatus', 'Kara Liste',       4),
    -- CompanyType
    ('CompanyType', NULL,          'Şirket Türü',  0),
    ('Gercek',      'CompanyType', 'Gerçek Kişi',  1),
    ('Tuzel',       'CompanyType', 'Tüzel Kişi',   2),
    -- CompanyLegalType
    ('CompanyLegalType', NULL,               'Şirket Hukuki Türü', 0),
    ('AnonimSirketi',    'CompanyLegalType', 'Anonim Şirketi',     1),
    ('LimitedSirket',    'CompanyLegalType', 'Limited Şirket',     2),
    ('KomanditSirket',   'CompanyLegalType', 'Komandit Şirket',    3),
    ('KolektifSirket',   'CompanyLegalType', 'Kolektif Şirket',    4)
) AS v(code, parent_code, label, order_index)
WHERE NOT EXISTS (
    SELECT 1 FROM general_parameter g
    WHERE g.code = v.code
      AND g.parent_code IS NOT DISTINCT FROM v.parent_code
);
