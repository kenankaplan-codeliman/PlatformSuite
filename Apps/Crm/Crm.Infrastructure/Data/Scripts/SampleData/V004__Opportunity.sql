-- =============================================
-- CRM SampleData / V004 — Opportunity
-- account_id REQUIRED — Account SampleData'dan referans veriyor.
-- primary_contact_id optional.
-- =============================================

-- Fixed UUIDs
-- OPP_1 = 44444444-0000-0000-0000-000000000001  (Prospecting)
-- OPP_2 = 44444444-0000-0000-0000-000000000002  (Proposal)
-- OPP_3 = 44444444-0000-0000-0000-000000000003  (Negotiation)
-- OPP_4 = 44444444-0000-0000-0000-000000000004  (ClosedWon)
-- OPP_5 = 44444444-0000-0000-0000-000000000005  (ClosedLost)

-- Not: `currency` deal-level (Schema V008'den itibaren). Hem EstimatedAmount hem
-- ActualAmount hem de tüm OpportunityProduct satırları bu currency'dedir.
INSERT INTO opportunity (id, name, description, account_id, primary_contact_id, stage, estimated_amount, currency, actual_amount, probability, close_date, loss_reason, owner_id, organization_id, is_active, created_by, created_at)
SELECT t.id::uuid, t.name, t.description, t.account_id::uuid,
       NULLIF(t.contact_id, '')::uuid,
       t.stage, t.estimated_amount::numeric, t.currency,
       NULL::numeric,  -- actual_amount: line item'lar henüz yokken NULL; ileride product satırları seed edildikçe doldurulur
       t.probability::int,
       NULLIF(t.close_date, '')::timestamp, NULLIF(t.loss_reason, ''),
       t.owner_id::uuid, t.org_id::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('44444444-0000-0000-0000-000000000001', 'KobiLtd Üretim — Veri Merkezi Yenileme', 'Üretim biriminin sunucu altyapısı yenilenecek', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'Prospecting',  '750000.00',  'TRY', 10, '2026-09-30 00:00:00', '',                                  '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('44444444-0000-0000-0000-000000000002', 'KobiLtd Holding — ERP Modülleri',         'Finans + İK + Satın Alma modülleri',           '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'Proposal',     '1250000.00', 'USD', 50, '2026-08-15 00:00:00', '',                                  '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('44444444-0000-0000-0000-000000000003', 'Tekno Holding — Bulut Göç Hizmeti',       'Lead 33333334''ten geldi',                     '11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', 'Negotiation',  '1100000.00', 'USD', 75, '2026-07-20 00:00:00', '',                                  '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('44444444-0000-0000-0000-000000000004', 'Mega Lojistik — Filo Takip Lisans',       'Lisans yenileme + ek modül',                   '11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000004', 'ClosedWon',    '320000.00',  'EUR', 100, '2026-04-10 00:00:00', '',                                 '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000202'),
    ('44444444-0000-0000-0000-000000000005', 'MedyaPlus — Pazarlama Otomasyonu',        'Müşteri churn olmuştu',                        '11111111-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000005', 'ClosedLost',   '180000.00',  'TRY', 0, '2026-02-28 00:00:00', 'Rakibe yöneldi — fiyat farkı yüksek', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200')
) AS t(id, name, description, account_id, contact_id, stage, estimated_amount, currency, probability, close_date, loss_reason, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM opportunity o WHERE o.id = t.id::uuid);
