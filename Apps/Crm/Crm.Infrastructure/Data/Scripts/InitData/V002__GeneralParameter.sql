-- =============================================
-- CRM InitData / V002 — GeneralParameter seed
--
-- CRM entity'lerinin GeneralParameter'a taşınan enum alanları:
--   LeadStatus / LeadSource          → eski Crm.Domain.Enums.LeadStatus / LeadSource
--   AccountStatus / AccountType      → eski Crm.Domain.Enums.AccountStatus / AccountType
--   ContactStatus                    → eski Crm.Domain.Enums.ContactStatus
--   OpportunityStage                 → eski Crm.Domain.Enums.OpportunityStage
--
-- Kök satır: code = tip adı, parent_code = NULL
-- Değer satırı: code = enum değeri, parent_code = tip adı
--
-- general_parameter tablosu Platform Schema/V004 ile oluşturulur.
-- Tüm insert'ler WHERE NOT EXISTS ile idempotent'tir.
-- =============================================

INSERT INTO general_parameter (id, code, parent_code, label, order_index, is_active, created_by, created_at)
SELECT gen_random_uuid(), v.code, v.parent_code, v.label, v.order_index, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    -- LeadStatus
    ('LeadStatus',   NULL,         'Aday Durumu',       0),
    ('New',          'LeadStatus', 'Yeni',              1),
    ('Contacted',    'LeadStatus', 'İletişim Kuruldu',  2),
    ('Qualified',    'LeadStatus', 'Nitelikli',         3),
    ('Unqualified',  'LeadStatus', 'Niteliksiz',        4),
    ('Converted',    'LeadStatus', 'Dönüştürüldü',      5),
    -- LeadSource
    ('LeadSource',     NULL,         'Aday Kaynağı',   0),
    ('Other',          'LeadSource', 'Diğer',          1),
    ('Website',        'LeadSource', 'Web Sitesi',     2),
    ('Email',          'LeadSource', 'E-posta',        3),
    ('Phone',          'LeadSource', 'Telefon',        4),
    ('Referral',       'LeadSource', 'Referans',       5),
    ('Advertisement',  'LeadSource', 'Reklam',         6),
    ('SocialMedia',    'LeadSource', 'Sosyal Medya',   7),
    ('Event',          'LeadSource', 'Etkinlik',       8),
    ('PartnerNetwork', 'LeadSource', 'İş Ortağı Ağı',  9),
    -- AccountStatus
    ('AccountStatus', NULL,            'Firma Durumu',  0),
    ('Prospect',      'AccountStatus', 'Potansiyel',    1),
    ('Active',        'AccountStatus', 'Aktif',         2),
    ('AtRisk',        'AccountStatus', 'Riskli',        3),
    ('Inactive',      'AccountStatus', 'Pasif',         4),
    ('Churned',       'AccountStatus', 'Kaybedilmiş',   5),
    -- AccountType
    ('AccountType', NULL,          'Firma Tipi',  0),
    ('Customer',    'AccountType', 'Müşteri',     1),
    ('Prospect',    'AccountType', 'Potansiyel',  2),
    ('Partner',     'AccountType', 'İş Ortağı',   3),
    ('Vendor',      'AccountType', 'Tedarikçi',   4),
    ('Competitor',  'AccountType', 'Rakip',       5),
    ('Other',       'AccountType', 'Diğer',       6),
    -- ContactStatus
    ('ContactStatus', NULL,            'Kişi Durumu',      0),
    ('Active',        'ContactStatus', 'Aktif',            1),
    ('DoNotContact',  'ContactStatus', 'İletişime Kapalı', 2),
    ('Unsubscribed',  'ContactStatus', 'Abonelik İptal',   3),
    ('Inactive',      'ContactStatus', 'Pasif',            4),
    -- OpportunityStage
    ('OpportunityStage', NULL,               'Fırsat Aşaması',   0),
    ('Prospecting',      'OpportunityStage', 'Keşif',            1),
    ('Qualification',    'OpportunityStage', 'Niteliklendirme',  2),
    ('NeedsAnalysis',    'OpportunityStage', 'İhtiyaç Analizi',  3),
    ('Proposal',         'OpportunityStage', 'Teklif',           4),
    ('Negotiation',      'OpportunityStage', 'Müzakere',         5),
    ('ClosedWon',        'OpportunityStage', 'Kazanıldı',        6),
    ('ClosedLost',       'OpportunityStage', 'Kaybedildi',       7)
) AS v(code, parent_code, label, order_index)
WHERE NOT EXISTS (
    SELECT 1 FROM general_parameter g
    WHERE g.code = v.code
      AND g.parent_code IS NOT DISTINCT FROM v.parent_code
);
