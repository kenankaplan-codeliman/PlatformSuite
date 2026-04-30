-- =============================================
-- SampleData.sql — Demo için örnek veri
-- Yalnızca ilk kurulumda çalışır (docker-entrypoint-initdb.d)
-- Kullanıcı şifresi: demo123 (BCrypt / workFactor=11)
-- =============================================

BEGIN;

-- ---------------------------------------------
-- 1. Organizasyonlar (Genel Müdürlük hiyerarşisi)
-- ---------------------------------------------
INSERT INTO app_organization (id, organization_code, organization_name, title, type, parent_organization_id, cost_center, reports_to, is_active, created_by) VALUES
-- Kök: Genel Müdürlük
('11111111-0000-0000-0000-000000000001', 'GM',          'Genel Müdürlük',                                        'Genel Müdürlük',                                                                                            'EXECUTIVE',       NULL,                                   'CC-1100', NULL,                                   true, '22222222-0000-0000-0000-000000000001'),

-- GM altı iç sistem & danışma birimleri
('11111111-0000-0000-0000-000000000002', 'GM-TFT',      'Teftiş Kurulu Başkanlığı',                              'Genel Müdürlük \ Teftiş Kurulu Başkanlığı',                                                                 'INTERNAL_SYSTEM', '11111111-0000-0000-0000-000000000001', 'CC-1110', '11111111-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000003', 'GM-ICK',      'İç Kontrol Müdürlüğü',                                  'Genel Müdürlük \ İç Kontrol Müdürlüğü',                                                                     'INTERNAL_SYSTEM', '11111111-0000-0000-0000-000000000001', 'CC-1120', '11111111-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000004', 'GM-RSK',      'Risk Yönetimi Müdürlüğü',                               'Genel Müdürlük \ Risk Yönetimi Müdürlüğü',                                                                  'INTERNAL_SYSTEM', '11111111-0000-0000-0000-000000000001', 'CC-1130', '11111111-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000005', 'GM-AKT',      'Aktüerya Müdürlüğü',                                    'Genel Müdürlük \ Aktüerya Müdürlüğü',                                                                       'INTERNAL_SYSTEM', '11111111-0000-0000-0000-000000000001', 'CC-1140', '11111111-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),

-- Finans GMY
('11111111-0000-0000-0000-000000000006', 'GMY-FIN',     'Finans ve Muhasebe Genel Müdür Yardımcılığı',            'Genel Müdürlük \ Finans ve Muhasebe Genel Müdür Yardımcılığı',                                              'EXECUTIVE',       '11111111-0000-0000-0000-000000000001', 'CC-2100', '11111111-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000007', 'GMY-FIN-MUH', 'Muhasebe Müdürlüğü',                                    'Genel Müdürlük \ Finans ve Muhasebe Genel Müdür Yardımcılığı \ Muhasebe Müdürlüğü',                          'DEPARTMENT',      '11111111-0000-0000-0000-000000000006', 'CC-2110', '11111111-0000-0000-0000-000000000006', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000008', 'GMY-FIN-FON', 'Fon Yönetimi Müdürlüğü',                                 'Genel Müdürlük \ Finans ve Muhasebe Genel Müdür Yardımcılığı \ Fon Yönetimi Müdürlüğü',                      'DEPARTMENT',      '11111111-0000-0000-0000-000000000006', 'CC-2120', '11111111-0000-0000-0000-000000000006', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000009', 'GMY-FIN-REA', 'Modelleme ve Reasürans Müdürlüğü',                       'Genel Müdürlük \ Finans ve Muhasebe Genel Müdür Yardımcılığı \ Modelleme ve Reasürans Müdürlüğü',            'DEPARTMENT',      '11111111-0000-0000-0000-000000000006', 'CC-2130', '11111111-0000-0000-0000-000000000006', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000000a', 'GMY-FIN-YAT', 'Yatırımcı İlişkileri Birimi',                            'Genel Müdürlük \ Finans ve Muhasebe Genel Müdür Yardımcılığı \ Yatırımcı İlişkileri Birimi',                 'DEPARTMENT',      '11111111-0000-0000-0000-000000000006', 'CC-2140', '11111111-0000-0000-0000-000000000006', true, '22222222-0000-0000-0000-000000000001'),

-- BT GMY
('11111111-0000-0000-0000-00000000000b', 'GMY-BT',      'Bilgi Teknolojileri Genel Müdür Yardımcılığı',           'Genel Müdürlük \ Bilgi Teknolojileri Genel Müdür Yardımcılığı',                                              'EXECUTIVE',       '11111111-0000-0000-0000-000000000001', 'CC-3100', '11111111-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000000c', 'GMY-BT-YAZ',  'Yazılım Geliştirme Müdürlüğü',                           'Genel Müdürlük \ Bilgi Teknolojileri Genel Müdür Yardımcılığı \ Yazılım Geliştirme Müdürlüğü',               'DEPARTMENT',      '11111111-0000-0000-0000-00000000000b', 'CC-3110', '11111111-0000-0000-0000-00000000000b', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000000d', 'GMY-BT-BIL',  'Bilgi İşlem Müdürlüğü',                                  'Genel Müdürlük \ Bilgi Teknolojileri Genel Müdür Yardımcılığı \ Bilgi İşlem Müdürlüğü',                       'DEPARTMENT',      '11111111-0000-0000-0000-00000000000b', 'CC-3120', '11111111-0000-0000-0000-00000000000b', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000000e', 'GMY-BT-PRO',  'İş Geliştirme ve Proje Yönetimi Müdürlüğü',              'Genel Müdürlük \ Bilgi Teknolojileri Genel Müdür Yardımcılığı \ İş Geliştirme ve Proje Yönetimi Müdürlüğü',  'DEPARTMENT',      '11111111-0000-0000-0000-00000000000b', 'CC-3130', '11111111-0000-0000-0000-00000000000b', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000000f', 'GMY-BT-VER',  'Veri Yönetimi Müdürlüğü',                                'Genel Müdürlük \ Bilgi Teknolojileri Genel Müdür Yardımcılığı \ Veri Yönetimi Müdürlüğü',                    'DEPARTMENT',      '11111111-0000-0000-0000-00000000000b', 'CC-3140', '11111111-0000-0000-0000-00000000000b', true, '22222222-0000-0000-0000-000000000001'),

-- Pazarlama GMY
('11111111-0000-0000-0000-000000000010', 'GMY-PAZ',     'Pazarlama ve Müşteri Yönetimi Genel Müdür Yardımcılığı', 'Genel Müdürlük \ Pazarlama ve Müşteri Yönetimi Genel Müdür Yardımcılığı',                                    'EXECUTIVE',       '11111111-0000-0000-0000-000000000001', 'CC-4100', '11111111-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000011', 'GMY-PAZ-PAZ', 'Pazarlama Müdürlüğü',                                    'Genel Müdürlük \ Pazarlama ve Müşteri Yönetimi Genel Müdür Yardımcılığı \ Pazarlama Müdürlüğü',              'DEPARTMENT',      '11111111-0000-0000-0000-000000000010', 'CC-4110', '11111111-0000-0000-0000-000000000010', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000012', 'GMY-PAZ-URN', 'Ürün Yönetimi Müdürlüğü',                                'Genel Müdürlük \ Pazarlama ve Müşteri Yönetimi Genel Müdür Yardımcılığı \ Ürün Yönetimi Müdürlüğü',          'DEPARTMENT',      '11111111-0000-0000-0000-000000000010', 'CC-4120', '11111111-0000-0000-0000-000000000010', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000013', 'GMY-PAZ-MSD', 'Müşteri İlişkileri ve Dijital Kanal Yönetimi Müdürlüğü', 'Genel Müdürlük \ Pazarlama ve Müşteri Yönetimi Genel Müdür Yardımcılığı \ Müşteri İlişkileri ve Dijital Kanal Yönetimi Müdürlüğü', 'DEPARTMENT', '11111111-0000-0000-0000-000000000010', 'CC-4130', '11111111-0000-0000-0000-000000000010', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000014', 'GMY-PAZ-MSO', 'Müşteri Operasyonları Müdürlüğü',                        'Genel Müdürlük \ Pazarlama ve Müşteri Yönetimi Genel Müdür Yardımcılığı \ Müşteri Operasyonları Müdürlüğü',  'DEPARTMENT',      '11111111-0000-0000-0000-000000000010', 'CC-4140', '11111111-0000-0000-0000-000000000010', true, '22222222-0000-0000-0000-000000000001'),

-- Strateji & İK GMY
('11111111-0000-0000-0000-000000000015', 'GMY-STR',     'Strateji ve İnsan Kaynakları Genel Müdür Yardımcılığı',  'Genel Müdürlük \ Strateji ve İnsan Kaynakları Genel Müdür Yardımcılığı',                                     'EXECUTIVE',       '11111111-0000-0000-0000-000000000001', 'CC-5100', '11111111-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000016', 'GMY-STR-STP', 'Strateji ve Kurumsal Performans Yönetimi Müdürlüğü',     'Genel Müdürlük \ Strateji ve İnsan Kaynakları Genel Müdür Yardımcılığı \ Strateji ve Kurumsal Performans Yönetimi Müdürlüğü', 'DEPARTMENT', '11111111-0000-0000-0000-000000000015', 'CC-5110', '11111111-0000-0000-0000-000000000015', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000017', 'GMY-STR-IKE', 'İnsan Kaynakları ve Eğitim Müdürlüğü',                   'Genel Müdürlük \ Strateji ve İnsan Kaynakları Genel Müdür Yardımcılığı \ İnsan Kaynakları ve Eğitim Müdürlüğü', 'DEPARTMENT', '11111111-0000-0000-0000-000000000015', 'CC-5120', '11111111-0000-0000-0000-000000000015', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000018', 'GMY-STR-KMM', 'Kurumsal Mimari Müdürlüğü',                              'Genel Müdürlük \ Strateji ve İnsan Kaynakları Genel Müdür Yardımcılığı \ Kurumsal Mimari Müdürlüğü',         'DEPARTMENT',      '11111111-0000-0000-0000-000000000015', 'CC-5130', '11111111-0000-0000-0000-000000000015', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000019', 'GMY-STR-HUK', 'Hukuk Müşavirliği',                                      'Genel Müdürlük \ Strateji ve İnsan Kaynakları Genel Müdür Yardımcılığı \ Hukuk Müşavirliği',                  'ADVISORY',        '11111111-0000-0000-0000-000000000015', 'CC-5140', '11111111-0000-0000-0000-000000000015', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000001a', 'GMY-STR-DHS', 'Destek Hizmetleri ve Satın Alma Müdürlüğü',              'Genel Müdürlük \ Strateji ve İnsan Kaynakları Genel Müdür Yardımcılığı \ Destek Hizmetleri ve Satın Alma Müdürlüğü', 'DEPARTMENT', '11111111-0000-0000-0000-000000000015', 'CC-5150', '11111111-0000-0000-0000-000000000015', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000001b', 'GMY-STR-ILM', 'İletişim Müşavirliği',                                   'Genel Müdürlük \ Strateji ve İnsan Kaynakları Genel Müdür Yardımcılığı \ İletişim Müşavirliği',               'ADVISORY',        '11111111-0000-0000-0000-000000000015', 'CC-5160', '11111111-0000-0000-0000-000000000015', true, '22222222-0000-0000-0000-000000000001'),

-- Satış GMY
('11111111-0000-0000-0000-00000000001c', 'GMY-SAT',     'Satış Kanalları Genel Müdür Yardımcılığı',               'Genel Müdürlük \ Satış Kanalları Genel Müdür Yardımcılığı',                                                  'EXECUTIVE',       '11111111-0000-0000-0000-000000000001', 'CC-6100', '11111111-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000001d', 'GMY-SAT-ACE', 'Acenteler Müdürlüğü',                                    'Genel Müdürlük \ Satış Kanalları Genel Müdür Yardımcılığı \ Acenteler Müdürlüğü',                            'DEPARTMENT',      '11111111-0000-0000-0000-00000000001c', 'CC-6110', '11111111-0000-0000-0000-00000000001c', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000001e', 'GMY-SAT-BIR', 'Bireysel Satış Müdürlüğü',                               'Genel Müdürlük \ Satış Kanalları Genel Müdür Yardımcılığı \ Bireysel Satış Müdürlüğü',                       'DEPARTMENT',      '11111111-0000-0000-0000-00000000001c', 'CC-6120', '11111111-0000-0000-0000-00000000001c', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000001f', 'GMY-SAT-KUR', 'Kurumsal Satış Müdürlüğü',                               'Genel Müdürlük \ Satış Kanalları Genel Müdür Yardımcılığı \ Kurumsal Satış Müdürlüğü',                       'DEPARTMENT',      '11111111-0000-0000-0000-00000000001c', 'CC-6130', '11111111-0000-0000-0000-00000000001c', true, '22222222-0000-0000-0000-000000000001'),

-- Bölge & Şube GMY
('11111111-0000-0000-0000-000000000020', 'GMY-BOL',     'Bölge Satış ve Şube Genel Müdür Yardımcılığı',           'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı',                                              'EXECUTIVE',       '11111111-0000-0000-0000-000000000001', 'CC-7100', '11111111-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000021', 'BOL-AKD',     'Akdeniz Bölge Satış Müdürlüğü',                          'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ Akdeniz Bölge Satış Müdürlüğü',              'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7110', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000022', 'BOL-BKA',     'Batı Karadeniz Bölge Satış Müdürlüğü',                   'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ Batı Karadeniz Bölge Satış Müdürlüğü',       'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7115', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000023', 'BOL-CUK',     'Çukurova Bölge Satış Müdürlüğü',                         'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ Çukurova Bölge Satış Müdürlüğü',             'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7120', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000024', 'BOL-EGE',     'Ege Bölge Satış Müdürlüğü',                              'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ Ege Bölge Satış Müdürlüğü',                  'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7125', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000025', 'BOL-GDA',     'Güneydoğu Anadolu Bölge Satış Müdürlüğü',                'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ Güneydoğu Anadolu Bölge Satış Müdürlüğü',    'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7130', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000026', 'BOL-ICA1',    'İç Anadolu I. Bölge Satış Müdürlüğü',                    'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ İç Anadolu I. Bölge Satış Müdürlüğü',        'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7135', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000027', 'BOL-ICA2',    'İç Anadolu II. Bölge Satış Müdürlüğü',                   'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ İç Anadolu II. Bölge Satış Müdürlüğü',       'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7140', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000028', 'BOL-IAN',     'İstanbul Anadolu Bölge Satış Müdürlüğü',                 'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ İstanbul Anadolu Bölge Satış Müdürlüğü',     'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7145', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-000000000029', 'BOL-IAV',     'İstanbul Avrupa Bölge Satış Müdürlüğü',                  'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ İstanbul Avrupa Bölge Satış Müdürlüğü',      'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7150', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000002a', 'BOL-KDA',     'Kuzeydoğu Anadolu Bölge Satış Müdürlüğü',                'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ Kuzeydoğu Anadolu Bölge Satış Müdürlüğü',    'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7155', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000002b', 'BOL-MAR',     'Marmara Bölge Satış Müdürlüğü',                          'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ Marmara Bölge Satış Müdürlüğü',              'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7160', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000002c', 'BOL-TRK',     'Trakya Bölge Satış Müdürlüğü',                           'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ Trakya Bölge Satış Müdürlüğü',               'REGION',          '11111111-0000-0000-0000-000000000020', 'CC-7165', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001'),
('11111111-0000-0000-0000-00000000002d', 'SUB-KKTC',    'KKTC Şube Müdürlüğü',                                    'Genel Müdürlük \ Bölge Satış ve Şube Genel Müdür Yardımcılığı \ KKTC Şube Müdürlüğü',                        'BRANCH',          '11111111-0000-0000-0000-000000000020', 'CC-7170', '11111111-0000-0000-0000-000000000020', true, '22222222-0000-0000-0000-000000000001');

-- ---------------------------------------------
-- 2. Kullanıcılar
--    Şifre: demo123  (BCrypt $2a$11$...)
-- ---------------------------------------------
INSERT INTO app_user (id, email, first_name, last_name, phone_number, password_hash, organization_id, manager_id, is_active, created_by) VALUES
('22222222-0000-0000-0000-000000000001', 'admin@codeliman.com',    'CodeLiman',  'Yönetici',   '+90 555 111 1111', '$2a$11$W8ss.v0.R7kSsE6c0sfwFOXIHKuIQnjvdL/cyXeSMZZmrQmj4QD7i', '11111111-0000-0000-0000-000000000001', NULL, true, '22222222-0000-0000-0000-000000000001'),
('22222222-0000-0000-0000-000000000002', 'ayse.yilmaz@codeliman.com',   'Ayşe',   'Yılmaz',   '+90 555 222 2222', '$2a$11$W8ss.v0.R7kSsE6c0sfwFOXIHKuIQnjvdL/cyXeSMZZmrQmj4QD7i', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('22222222-0000-0000-0000-000000000003', 'mehmet.demir@codeliman.com',  'Mehmet', 'Demir',    '+90 555 333 3333', '$2a$11$W8ss.v0.R7kSsE6c0sfwFOXIHKuIQnjvdL/cyXeSMZZmrQmj4QD7i', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000002', true, '22222222-0000-0000-0000-000000000001'),
('22222222-0000-0000-0000-000000000004', 'zeynep.kaya@codeliman.com',   'Zeynep', 'Kaya',     '+90 555 444 4444', '$2a$11$W8ss.v0.R7kSsE6c0sfwFOXIHKuIQnjvdL/cyXeSMZZmrQmj4QD7i', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000002', true, '22222222-0000-0000-0000-000000000001'),
('22222222-0000-0000-0000-000000000005', 'ali.celik@codeliman.com',     'Ali',    'Çelik',    '+90 555 555 5555', '$2a$11$W8ss.v0.R7kSsE6c0sfwFOXIHKuIQnjvdL/cyXeSMZZmrQmj4QD7i', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000002', true, '22222222-0000-0000-0000-000000000001'),
('22222222-0000-0000-0000-000000000006', 'fatma.sahin@tedarikci.com',   'Fatma',  'Şahin',    '+90 555 666 6666', '$2a$11$W8ss.v0.R7kSsE6c0sfwFOXIHKuIQnjvdL/cyXeSMZZmrQmj4QD7i', '11111111-0000-0000-0000-00000000001a', NULL, true, '22222222-0000-0000-0000-000000000001');

-- ---------------------------------------------
-- 3. Roller
-- ---------------------------------------------
INSERT INTO app_role (id, role_name, description, is_default, is_active, created_by) VALUES
('33333333-0000-0000-0000-000000000001', 'Admin',            'Tam yetkili sistem yöneticisi',       true,  true, '22222222-0000-0000-0000-000000000001'),
('33333333-0000-0000-0000-000000000002', 'PurchaseManager',  'Satın alma yöneticisi',               false, true, '22222222-0000-0000-0000-000000000001'),
('33333333-0000-0000-0000-000000000003', 'Buyer',            'Satın alma sorumlusu / alıcı',        false, true, '22222222-0000-0000-0000-000000000001'),
('33333333-0000-0000-0000-000000000004', 'SupplierUser',     'Tedarikçi tarafı platform kullanıcısı', false, true, '22222222-0000-0000-0000-000000000001');

-- ---------------------------------------------
-- 4. Privilege Kayıtları (temel set)
-- ---------------------------------------------
INSERT INTO app_privilege (privilege_code, privilege_name, description, created_by) VALUES
('User.Read',              'Kullanıcı Görüntüleme',        'Kullanıcıları listele',         '22222222-0000-0000-0000-000000000001'),
('User.Create',            'Kullanıcı Oluşturma',           'Yeni kullanıcı ekle',           '22222222-0000-0000-0000-000000000001'),
('User.Update',            'Kullanıcı Güncelleme',          'Kullanıcı bilgisi güncelle',    '22222222-0000-0000-0000-000000000001'),
('User.Delete',            'Kullanıcı Silme',               'Kullanıcı sil',                 '22222222-0000-0000-0000-000000000001'),
('User.State',             'Kullanıcı Durum Değişikliği',   'Kullanıcı aktif/pasif',         '22222222-0000-0000-0000-000000000001'),
('Activity.Read',          'Aktivite Görüntüleme',          '',                              '22222222-0000-0000-0000-000000000001'),
('Activity.Create',        'Aktivite Oluşturma',            '',                              '22222222-0000-0000-0000-000000000001'),
('Activity.Update',        'Aktivite Güncelleme',           '',                              '22222222-0000-0000-0000-000000000001'),
('Activity.Delete',        'Aktivite Silme',                '',                              '22222222-0000-0000-0000-000000000001'),
('Activity.UpdateStatus',  'Aktivite Durumu Değiştir',      '',                              '22222222-0000-0000-0000-000000000001'),
-- Tedarikçi (Supplier) artık Platform Account TPH alt sınıfı (AccountType=Vendor) —
-- AccountPrivilegeCodes kullanılır; Supplier.* privilege'ları kaldırıldı.
('Account.Read',           'Firma Görüntüleme',             '',                              '22222222-0000-0000-0000-000000000001'),
('Account.Create',         'Firma Oluşturma',               '',                              '22222222-0000-0000-0000-000000000001'),
('Account.Update',         'Firma Güncelleme',              '',                              '22222222-0000-0000-0000-000000000001'),
('Account.Delete',         'Firma Silme',                   '',                              '22222222-0000-0000-0000-000000000001'),
('Account.Assign',         'Firma Atama',                   '',                              '22222222-0000-0000-0000-000000000001'),
('Account.State',          'Firma Durum Değiştir',          '',                              '22222222-0000-0000-0000-000000000001'),
('Contact.Read',           'Kişi Görüntüleme',              '',                              '22222222-0000-0000-0000-000000000001'),
('Contact.Create',         'Kişi Oluşturma',                '',                              '22222222-0000-0000-0000-000000000001'),
('Contact.Update',         'Kişi Güncelleme',               '',                              '22222222-0000-0000-0000-000000000001'),
('Contact.Delete',         'Kişi Silme',                    '',                              '22222222-0000-0000-0000-000000000001'),
('Contact.Assign',         'Kişi Atama',                    '',                              '22222222-0000-0000-0000-000000000001'),
('Contact.State',          'Kişi Durum Değiştir',           '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseRequest.Read',   'Talep Görüntüleme',             '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseRequest.Create', 'Talep Oluşturma',               '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseRequest.Update', 'Talep Güncelleme',              '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseRequest.Delete', 'Talep Silme',                   '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseRequest.Assign', 'Talep Atama',                   '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseRequest.State',  'Talep Durum Değişikliği',       '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseOrder.Read',     'Sipariş Görüntüleme',           '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseOrder.Create',   'Sipariş Oluşturma',             '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseOrder.Update',   'Sipariş Güncelleme',            '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseOrder.Delete',   'Sipariş Silme',                 '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseOrder.Assign',   'Sipariş Atama',                 '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseOrder.State',    'Sipariş Durum Değişikliği',     '',                              '22222222-0000-0000-0000-000000000001'),
('ProductCategory.Read',   'Kategori Görüntüleme',          '',                              '22222222-0000-0000-0000-000000000001'),
('ProductCategory.Create', 'Kategori Oluşturma',            '',                              '22222222-0000-0000-0000-000000000001'),
('ProductCategory.Update', 'Kategori Güncelleme',           '',                              '22222222-0000-0000-0000-000000000001'),
('ProductCategory.Delete', 'Kategori Silme',                '',                              '22222222-0000-0000-0000-000000000001'),
('Product.Read',           'Ürün Görüntüleme',              '',                              '22222222-0000-0000-0000-000000000001'),
('Product.Create',         'Ürün Oluşturma',                '',                              '22222222-0000-0000-0000-000000000001'),
('Product.Update',         'Ürün Güncelleme',               '',                              '22222222-0000-0000-0000-000000000001'),
('Product.Delete',         'Ürün Silme',                    '',                              '22222222-0000-0000-0000-000000000001'),
('Product.State',          'Ürün Durum Değiştir',           '',                              '22222222-0000-0000-0000-000000000001'),
('Brand.Read',             'Marka Görüntüleme',             '',                              '22222222-0000-0000-0000-000000000001'),
('Brand.Create',           'Marka Oluşturma',               '',                              '22222222-0000-0000-0000-000000000001'),
('Brand.Update',           'Marka Güncelleme',              '',                              '22222222-0000-0000-0000-000000000001'),
('Brand.Delete',           'Marka Silme',                   '',                              '22222222-0000-0000-0000-000000000001'),
('Manufacturer.Read',      'Üretici Görüntüleme',           '',                              '22222222-0000-0000-0000-000000000001'),
('Manufacturer.Create',    'Üretici Oluşturma',             '',                              '22222222-0000-0000-0000-000000000001'),
('Manufacturer.Update',    'Üretici Güncelleme',            '',                              '22222222-0000-0000-0000-000000000001'),
('Manufacturer.Delete',    'Üretici Silme',                 '',                              '22222222-0000-0000-0000-000000000001'),
('Attachment.Read',        'Ek Görüntüleme',                '',                              '22222222-0000-0000-0000-000000000001'),
('Attachment.Create',      'Ek Yükleme',                    '',                              '22222222-0000-0000-0000-000000000001'),
('Attachment.Delete',      'Ek Silme',                      '',                              '22222222-0000-0000-0000-000000000001'),
('ProductCatalog.Read',    'Katalog Görüntüleme',           '',                              '22222222-0000-0000-0000-000000000001'),
('ProductCatalog.Create',  'Katalog Oluşturma',             '',                              '22222222-0000-0000-0000-000000000001'),
('ProductCatalog.Update',  'Katalog Güncelleme',            '',                              '22222222-0000-0000-0000-000000000001'),
('ProductCatalog.Delete',  'Katalog Silme',                 '',                              '22222222-0000-0000-0000-000000000001'),
('AppOrganization.Read',   'Organizasyon Görüntüleme',      '',                              '22222222-0000-0000-0000-000000000001'),
('AppOrganization.Create', 'Organizasyon Oluşturma',        '',                              '22222222-0000-0000-0000-000000000001'),
('AppOrganization.Update', 'Organizasyon Güncelleme',       '',                              '22222222-0000-0000-0000-000000000001'),
('AppOrganization.Delete', 'Organizasyon Silme',            '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseBasket.Read',    'Sepet Görüntüleme',             '',                              '22222222-0000-0000-0000-000000000001'),
('PurchaseBasket.Update',  'Sepet Güncelleme',              '',                              '22222222-0000-0000-0000-000000000001'),
('PriceList.Read',         'Fiyat Listesi Görüntüleme',     '',                              '22222222-0000-0000-0000-000000000001'),
('PriceList.Create',       'Fiyat Listesi Oluşturma',       '',                              '22222222-0000-0000-0000-000000000001'),
('PriceList.Update',       'Fiyat Listesi Güncelleme',      '',                              '22222222-0000-0000-0000-000000000001'),
('PriceList.Delete',       'Fiyat Listesi Silme',           '',                              '22222222-0000-0000-0000-000000000001'),
('PriceList.State',        'Fiyat Listesi Durum Değişikliği','',                             '22222222-0000-0000-0000-000000000001'),
-- Sözleşme
('Contract.Read',          'Sözleşme Görüntüleme',          '',                              '22222222-0000-0000-0000-000000000001'),
('Contract.Create',        'Sözleşme Oluşturma',            '',                              '22222222-0000-0000-0000-000000000001'),
('Contract.Update',        'Sözleşme Güncelleme',           '',                              '22222222-0000-0000-0000-000000000001'),
('Contract.Delete',        'Sözleşme Silme',                '',                              '22222222-0000-0000-0000-000000000001'),
('Contract.Approve',       'Sözleşme Onaylama',             '',                              '22222222-0000-0000-0000-000000000001'),
('Contract.State',         'Sözleşme Durum Değişikliği',    '',                              '22222222-0000-0000-0000-000000000001'),
-- Teklif
('Offer.Read',             'Teklif Görüntüleme',            '',                              '22222222-0000-0000-0000-000000000001'),
('Offer.Create',           'Teklif Oluşturma',              '',                              '22222222-0000-0000-0000-000000000001'),
('Offer.Update',           'Teklif Güncelleme',             '',                              '22222222-0000-0000-0000-000000000001'),
('Offer.Delete',           'Teklif Silme',                  '',                              '22222222-0000-0000-0000-000000000001'),
('Offer.Approve',          'Teklif Onaylama',               '',                              '22222222-0000-0000-0000-000000000001'),
('Offer.State',            'Teklif Durum Değişikliği',      '',                              '22222222-0000-0000-0000-000000000001'),
-- Form / EDocument
('EDocument.Read',         'Form Görüntüleme',              '',                              '22222222-0000-0000-0000-000000000001'),
('EDocument.Create',       'Form Oluşturma',                '',                              '22222222-0000-0000-0000-000000000001'),
('EDocument.Update',       'Form Güncelleme',               '',                              '22222222-0000-0000-0000-000000000001'),
('EDocument.Delete',       'Form Silme',                    '',                              '22222222-0000-0000-0000-000000000001'),
('EDocument.State',        'Form Durum Değişikliği',        '',                              '22222222-0000-0000-0000-000000000001'),
-- Anket / Questionnaire
('Questionnaire.Read',     'Anket Görüntüleme',             '',                              '22222222-0000-0000-0000-000000000001'),
('Questionnaire.Create',   'Anket Oluşturma',               '',                              '22222222-0000-0000-0000-000000000001'),
('Questionnaire.Update',   'Anket Güncelleme',              '',                              '22222222-0000-0000-0000-000000000001'),
('Questionnaire.Delete',   'Anket Silme',                   '',                              '22222222-0000-0000-0000-000000000001'),
('Questionnaire.State',    'Anket Durum Değişikliği',       '',                              '22222222-0000-0000-0000-000000000001'),
-- Bütçe / Budget
('Budget.Read',            'Bütçe Görüntüleme',             '',                              '22222222-0000-0000-0000-000000000001'),
('Budget.Create',          'Bütçe Oluşturma',               '',                              '22222222-0000-0000-0000-000000000001'),
('Budget.Update',          'Bütçe Güncelleme',              '',                              '22222222-0000-0000-0000-000000000001'),
('Budget.Delete',          'Bütçe Silme',                   '',                              '22222222-0000-0000-0000-000000000001'),
('Budget.Approve',         'Bütçe Onaylama',                '',                              '22222222-0000-0000-0000-000000000001'),
('Budget.State',           'Bütçe Durum Değişikliği',       '',                              '22222222-0000-0000-0000-000000000001'),
-- Bütçe Kategorisi / BudgetCategory
('BudgetCategory.Read',    'Bütçe Kategorisi Görüntüleme',  '',                              '22222222-0000-0000-0000-000000000001'),
('BudgetCategory.Create',  'Bütçe Kategorisi Oluşturma',    '',                              '22222222-0000-0000-0000-000000000001'),
('BudgetCategory.Update',  'Bütçe Kategorisi Güncelleme',   '',                              '22222222-0000-0000-0000-000000000001'),
('BudgetCategory.Delete',  'Bütçe Kategorisi Silme',        '',                              '22222222-0000-0000-0000-000000000001');

-- ---------------------------------------------
-- 5. Role-Privilege Eşleşmeleri
--    Admin → All (tümüne tam yetki)
--    PurchaseManager → Organization
--    Buyer → User (kendi kayıtları)
--    SupplierUser → çok kısıtlı
-- ---------------------------------------------
-- Admin: her privilege → All
INSERT INTO app_role_privilege (role_id, privilege_code, access_level)
SELECT '33333333-0000-0000-0000-000000000001', privilege_code, 'All' FROM app_privilege;

-- PurchaseManager: yönetsel erişim
INSERT INTO app_role_privilege (role_id, privilege_code, access_level) VALUES
('33333333-0000-0000-0000-000000000002', 'Account.Read',           'Organization'),
('33333333-0000-0000-0000-000000000002', 'Account.Create',         'Organization'),
('33333333-0000-0000-0000-000000000002', 'Account.Update',         'Organization'),
('33333333-0000-0000-0000-000000000002', 'Account.State',          'Organization'),
('33333333-0000-0000-0000-000000000002', 'Account.Assign',         'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseRequest.Read',   'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseRequest.Update', 'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseRequest.Assign', 'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseRequest.State',  'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseOrder.Read',     'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseOrder.Create',   'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseOrder.Update',   'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseOrder.Assign',   'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseOrder.State',    'Organization'),
('33333333-0000-0000-0000-000000000002', 'Product.Read',           'Organization'),
('33333333-0000-0000-0000-000000000002', 'ProductCategory.Read',   'Organization'),
('33333333-0000-0000-0000-000000000002', 'ProductCatalog.Read',    'Organization'),
('33333333-0000-0000-0000-000000000002', 'PriceList.Read',         'Organization'),
('33333333-0000-0000-0000-000000000002', 'PriceList.Create',       'Organization'),
('33333333-0000-0000-0000-000000000002', 'PriceList.Update',       'Organization'),
('33333333-0000-0000-0000-000000000002', 'PriceList.State',        'Organization'),
('33333333-0000-0000-0000-000000000002', 'Activity.Read',          'Organization'),
('33333333-0000-0000-0000-000000000002', 'Activity.Create',        'Organization'),
('33333333-0000-0000-0000-000000000002', 'Activity.Update',        'Organization'),
('33333333-0000-0000-0000-000000000002', 'Activity.UpdateStatus',  'Organization'),
('33333333-0000-0000-0000-000000000002', 'User.Read',              'Organization'),
('33333333-0000-0000-0000-000000000002', 'Brand.Read',             'Organization'),
('33333333-0000-0000-0000-000000000002', 'Manufacturer.Read',      'Organization'),
('33333333-0000-0000-0000-000000000002', 'Attachment.Read',        'Organization'),
('33333333-0000-0000-0000-000000000002', 'Attachment.Create',      'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseBasket.Read',    'Organization'),
('33333333-0000-0000-0000-000000000002', 'PurchaseBasket.Update',  'User'),
-- Sözleşme / Teklif / Form / Anket
('33333333-0000-0000-0000-000000000002', 'Contract.Read',          'Organization'),
('33333333-0000-0000-0000-000000000002', 'Contract.Create',        'Organization'),
('33333333-0000-0000-0000-000000000002', 'Contract.Update',        'Organization'),
('33333333-0000-0000-0000-000000000002', 'Contract.Approve',       'Organization'),
('33333333-0000-0000-0000-000000000002', 'Contract.State',         'Organization'),
('33333333-0000-0000-0000-000000000002', 'Offer.Read',             'Organization'),
('33333333-0000-0000-0000-000000000002', 'Offer.Create',           'Organization'),
('33333333-0000-0000-0000-000000000002', 'Offer.Update',           'Organization'),
('33333333-0000-0000-0000-000000000002', 'Offer.Approve',          'Organization'),
('33333333-0000-0000-0000-000000000002', 'Offer.State',            'Organization'),
('33333333-0000-0000-0000-000000000002', 'EDocument.Read',         'Organization'),
('33333333-0000-0000-0000-000000000002', 'EDocument.Create',       'Organization'),
('33333333-0000-0000-0000-000000000002', 'EDocument.Update',       'Organization'),
('33333333-0000-0000-0000-000000000002', 'EDocument.State',        'Organization'),
('33333333-0000-0000-0000-000000000002', 'Questionnaire.Read',     'Organization'),
('33333333-0000-0000-0000-000000000002', 'Questionnaire.Create',   'Organization'),
('33333333-0000-0000-0000-000000000002', 'Questionnaire.Update',   'Organization'),
('33333333-0000-0000-0000-000000000002', 'Questionnaire.State',    'Organization'),
-- Bütçe / Bütçe Kategorisi
('33333333-0000-0000-0000-000000000002', 'Budget.Read',            'Organization'),
('33333333-0000-0000-0000-000000000002', 'Budget.Create',          'Organization'),
('33333333-0000-0000-0000-000000000002', 'Budget.Update',          'Organization'),
('33333333-0000-0000-0000-000000000002', 'Budget.Approve',         'Organization'),
('33333333-0000-0000-0000-000000000002', 'Budget.State',           'Organization'),
('33333333-0000-0000-0000-000000000002', 'BudgetCategory.Read',    'Organization'),
('33333333-0000-0000-0000-000000000002', 'BudgetCategory.Create',  'Organization'),
('33333333-0000-0000-0000-000000000002', 'BudgetCategory.Update',  'Organization');

-- Buyer: kendi kayıtları + okuma
INSERT INTO app_role_privilege (role_id, privilege_code, access_level) VALUES
('33333333-0000-0000-0000-000000000003', 'Account.Read',           'Organization'),
('33333333-0000-0000-0000-000000000003', 'Product.Read',           'Organization'),
('33333333-0000-0000-0000-000000000003', 'ProductCategory.Read',   'Organization'),
('33333333-0000-0000-0000-000000000003', 'ProductCatalog.Read',    'Organization'),
('33333333-0000-0000-0000-000000000003', 'PriceList.Read',         'Organization'),
('33333333-0000-0000-0000-000000000003', 'PurchaseRequest.Read',   'User'),
('33333333-0000-0000-0000-000000000003', 'PurchaseRequest.Create', 'User'),
('33333333-0000-0000-0000-000000000003', 'PurchaseRequest.Update', 'User'),
('33333333-0000-0000-0000-000000000003', 'PurchaseRequest.Delete', 'User'),
('33333333-0000-0000-0000-000000000003', 'PurchaseOrder.Read',     'User'),
('33333333-0000-0000-0000-000000000003', 'Activity.Read',          'User'),
('33333333-0000-0000-0000-000000000003', 'Activity.Create',        'User'),
('33333333-0000-0000-0000-000000000003', 'Activity.Update',        'User'),
('33333333-0000-0000-0000-000000000003', 'PurchaseBasket.Read',    'User'),
('33333333-0000-0000-0000-000000000003', 'PurchaseBasket.Update',  'User'),
-- Sözleşme / Teklif / Form / Anket (yalnız okuma)
('33333333-0000-0000-0000-000000000003', 'Contract.Read',          'Organization'),
('33333333-0000-0000-0000-000000000003', 'Offer.Read',             'Organization'),
('33333333-0000-0000-0000-000000000003', 'EDocument.Read',         'Organization'),
('33333333-0000-0000-0000-000000000003', 'Questionnaire.Read',     'Organization'),
-- Bütçe / Bütçe Kategorisi (yalnız okuma)
('33333333-0000-0000-0000-000000000003', 'Budget.Read',            'Organization'),
('33333333-0000-0000-0000-000000000003', 'BudgetCategory.Read',    'Organization');

-- SupplierUser: kendi tedarikçisine ait kayıtlar
INSERT INTO app_role_privilege (role_id, privilege_code, access_level) VALUES
('33333333-0000-0000-0000-000000000004', 'Account.Read',           'User'),
('33333333-0000-0000-0000-000000000004', 'Product.Read',           'User'),
('33333333-0000-0000-0000-000000000004', 'PurchaseOrder.Read',     'User'),
('33333333-0000-0000-0000-000000000004', 'Activity.Read',          'User');

-- ---------------------------------------------
-- 6. User-Role Eşleşmeleri
-- ---------------------------------------------
INSERT INTO app_user_role (user_id, role_id) VALUES
('22222222-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000001'), -- Kenan   → Admin
('22222222-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000002'), -- Ayşe    → PurchaseManager
('22222222-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000003'), -- Mehmet  → Buyer
('22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000003'), -- Zeynep  → Buyer
('22222222-0000-0000-0000-000000000005', '33333333-0000-0000-0000-000000000003'), -- Ali     → Buyer
('22222222-0000-0000-0000-000000000006', '33333333-0000-0000-0000-000000000004'); -- Fatma   → SupplierUser

-- ---------------------------------------------
-- 7. Ürün Kategorileri (2 seviyeli ağaç)
-- ---------------------------------------------
INSERT INTO product_category (id, name, title, code, description, parent_category_id, is_active, created_by) VALUES
('44444444-0000-0000-0000-000000000001', 'Bilgi Teknolojileri', 'Bilgi Teknolojileri',                           'BT',       'Donanım ve teknoloji ürünleri',    NULL, true, '22222222-0000-0000-0000-000000000001'),
('44444444-0000-0000-0000-000000000002', 'Dizüstü Bilgisayar',  'Bilgi Teknolojileri \ Dizüstü Bilgisayar',      'BT-LAP',   'Notebook ve iş bilgisayarları',   '44444444-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('44444444-0000-0000-0000-000000000003', 'Sunucu Ekipmanları',  'Bilgi Teknolojileri \ Sunucu Ekipmanları',      'BT-SRV',   'Sunucu ve veri merkezi donanımı', '44444444-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('44444444-0000-0000-0000-000000000004', 'Ağ Ürünleri',         'Bilgi Teknolojileri \ Ağ Ürünleri',             'BT-NET',   'Switch, router, access point',    '44444444-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('44444444-0000-0000-0000-000000000005', 'Ofis',                'Ofis',                                          'OFC',      'Ofis malzemeleri',                 NULL, true, '22222222-0000-0000-0000-000000000001'),
('44444444-0000-0000-0000-000000000006', 'Mobilya',             'Ofis \ Mobilya',                                'OFC-MOB',  'Koltuk, masa, dolap',             '44444444-0000-0000-0000-000000000005', true, '22222222-0000-0000-0000-000000000001'),
('44444444-0000-0000-0000-000000000007', 'Kırtasiye',           'Ofis \ Kırtasiye',                              'OFC-KRT',  'Kalem, kağıt, klasör',            '44444444-0000-0000-0000-000000000005', true, '22222222-0000-0000-0000-000000000001'),
('44444444-0000-0000-0000-000000000008', 'Endüstriyel',         'Endüstriyel',                                   'IND',      'Endüstriyel malzemeler',           NULL, true, '22222222-0000-0000-0000-000000000001'),
('44444444-0000-0000-0000-000000000009', 'Güvenlik Ekipmanları','Endüstriyel \ Güvenlik Ekipmanları',            'IND-SEC',  'KKD ve iş güvenliği',             '44444444-0000-0000-0000-000000000008', true, '22222222-0000-0000-0000-000000000001');

-- ---------------------------------------------
-- 8. Tedarikçiler
-- ---------------------------------------------
-- TPH: account_type='Vendor' → Supplier alt sınıfı; account_status Platform enum'una map'lenir
-- (Active→Active, Pending→Prospect, Passive/Blacklisted→Inactive); supplier_status orijinal
-- supplier lifecycle değerini taşır.
INSERT INTO account (id, account_name, account_type, account_status, supplier_type, supplier_status, industry, annual_revenue, number_of_employees, website, description, company_type, company_legal_type, tax_office, vkn, owner_id, organization_id, created_by, created_at) VALUES
('55555555-0000-0000-0000-000000000001', 'Koç Bilgi Teknolojileri A.Ş.', 'Vendor', 'Active',   'Distributor',     'Active',      'Bilgi Teknolojileri', 2500000000.00, 450, 'https://www.koc-bt.com.tr',    'BT distribütörü',               'Tuzel', 'AnonimSirketi',  'Zincirlikuyu', '1234567890', '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('55555555-0000-0000-0000-000000000002', 'Turkcell Kurumsal',            'Vendor', 'Active',   'ServiceProvider', 'Active',      'Telekomünikasyon',     12000000000.00,  5000, 'https://www.turkcell.com.tr',  'Kurumsal iletişim hizmetleri',   'Tuzel', 'AnonimSirketi',  'Maltepe',       '9876543210', '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('55555555-0000-0000-0000-000000000003', 'Teknosa Bilişim',              'Vendor', 'Active',   'Retailer',        'Active',      'Bilgi Teknolojileri',  3500000000.00, 2000, 'https://www.teknosa.com',      'Elektronik perakende',          'Tuzel', 'AnonimSirketi',  'Beşiktaş',      '5554443332', '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000001', current_timestamp),
('55555555-0000-0000-0000-000000000004', 'Dell Türkiye',                 'Vendor', 'Active',   'Manufacturer',    'Active',      'Bilgi Teknolojileri',  8000000000.00,  250, 'https://www.dell.com.tr',      'Dell Türkiye resmi satış',      'Tuzel', 'LimitedSirket',  'Sarıyer',       '1112223334', '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('55555555-0000-0000-0000-000000000005', 'HP Türkiye',                   'Vendor', 'Active',   'Manufacturer',    'Active',      'Bilgi Teknolojileri',  7000000000.00,  200, 'https://www.hp.com/tr',        'HP Türkiye resmi satış',        'Tuzel', 'LimitedSirket',  'Şişli',         '2223334445', '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('55555555-0000-0000-0000-000000000006', 'İstikbal Mobilya',             'Vendor', 'Active',   'Manufacturer',    'Active',      'Mobilya',              4500000000.00, 3500, 'https://www.istikbal.com.tr',  'Mobilya üretim ve satış',       'Tuzel', 'AnonimSirketi',  'Kayseri',       '3334445556', '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('55555555-0000-0000-0000-000000000007', 'Bürosit Ofis Mobilyaları',     'Vendor', 'Prospect', 'Manufacturer',    'Pending',     'Mobilya',               450000000.00,  350, 'https://www.burosit.com.tr',   'Ofis mobilyaları üreticisi',    'Tuzel', 'LimitedSirket',  'Kayseri',       '4445556667', '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('55555555-0000-0000-0000-000000000008', 'Kırtasiye Dünyası Ltd.',       'Vendor', 'Active',   'Distributor',     'Active',      'Kırtasiye',              75000000.00,   45, 'https://www.kirtasiyedunyasi.com', 'Toptan kırtasiye satış',    'Tuzel', 'LimitedSirket',  'Kocaeli',       '5556667778', '22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('55555555-0000-0000-0000-000000000009', '3M Türkiye',                   'Vendor', 'Active',   'Manufacturer',    'Active',      'Endüstriyel',          1200000000.00,  180, 'https://www.3m.com.tr',        'İş güvenliği ürünleri',         'Tuzel', 'AnonimSirketi',  'Maslak',        '6667778889', '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000001', current_timestamp),
('55555555-0000-0000-0000-00000000000a', 'Eski Tedarik A.Ş.',            'Vendor', 'Inactive', 'Other',           'Blacklisted', 'Karışık',                10000000.00,   25, NULL,                           'Uyumsuzluk nedeniyle kara listede', 'Tuzel', 'AnonimSirketi', 'Ümraniye',  '7778889990', '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp);

-- account_email (suppliers)
INSERT INTO account_email (account_id, email, type, is_primary, created_by) VALUES
('55555555-0000-0000-0000-000000000001', 'info@koc-bt.com.tr',        'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000002', 'kurumsal@turkcell.com.tr',  'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000003', 'b2b@teknosa.com',           'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000004', 'sales@dell.com.tr',         'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000005', 'sales@hp.com.tr',           'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000006', 'kurumsal@istikbal.com.tr',  'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000007', 'satis@burosit.com.tr',      'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000008', 'satis@kirtasiyedunyasi.com','Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000009', 'info@3m.com.tr',            'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-00000000000a', 'info@eskitedarik.com',      'Work', true, '22222222-0000-0000-0000-000000000001');

-- account_phone (suppliers)
INSERT INTO account_phone (account_id, phone_number, type, is_primary, created_by) VALUES
('55555555-0000-0000-0000-000000000001', '+90 212 555 1001', 'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000002', '+90 212 555 2002', 'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000003', '+90 216 555 3003', 'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000004', '+90 212 555 4004', 'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000005', '+90 212 555 5005', 'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000006', '+90 352 555 6006', 'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000007', '+90 352 555 7007', 'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000008', '+90 262 555 8008', 'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000009', '+90 212 555 9009', 'Work', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-00000000000a', '+90 216 555 0000', 'Work', true, '22222222-0000-0000-0000-000000000001');

-- account_address (suppliers)
INSERT INTO account_address (account_id, address_line1, city, state, postal_code, country, type, is_primary, created_by) VALUES
('55555555-0000-0000-0000-000000000001', 'Büyükdere Cad. No:199',    'İstanbul', 'İstanbul', '34394', 'Türkiye', 'Office', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000002', 'Aydınevler Mah. No:1',     'İstanbul', 'İstanbul', '34854', 'Türkiye', 'Office', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000003', 'Teknosa Plaza Barbaros',    'İstanbul', 'İstanbul', '34349', 'Türkiye', 'Office', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000004', 'İstinye Plaza Kat 12',      'İstanbul', 'İstanbul', '34460', 'Türkiye', 'Office', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000005', 'Trump Towers B Blok',       'İstanbul', 'İstanbul', '34387', 'Türkiye', 'Office', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000006', 'Organize San. Bölgesi',     'Kayseri',  'Kayseri',  '38070', 'Türkiye', 'Office', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000007', 'Mimarsinan OSB',             'Kayseri',  'Kayseri',  '38280', 'Türkiye', 'Office', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000008', 'Gebze Plastikçiler OSB',    'Kocaeli',  'Kocaeli',  '41400', 'Türkiye', 'Office', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000009', 'Nisbetiye Cad. No:5',       'İstanbul', 'İstanbul', '34340', 'Türkiye', 'Office', true, '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-00000000000a', 'Eski Sanayi Bölgesi',       'İstanbul', 'İstanbul', '34760', 'Türkiye', 'Office', true, '22222222-0000-0000-0000-000000000001');

-- supplier_user — Account-User join tablosu CodePro şemasında modellenmemiş.
-- Account ↔ User ilişkisi bir aggregate root değil; gerektiğinde ayrı entity
-- (örn. AccountUserAssignment) olarak eklenir. Bu satır geçici devre dışı.
-- INSERT INTO supplier_user (supplier_account_id, user_id, created_by) VALUES
-- ('55555555-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000001');

-- ---------------------------------------------
-- 9. Supplier ↔ Category Eşleşmeleri
-- ---------------------------------------------
INSERT INTO account_product_category (account_id, product_category_id, is_preferred, created_by) VALUES
-- Koç BT: BT tüm alt kategoriler
('55555555-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000002', true,  '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000003', true,  '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000004', false, '22222222-0000-0000-0000-000000000001'),
-- Turkcell Kurumsal: Ağ
('55555555-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000004', true,  '22222222-0000-0000-0000-000000000001'),
-- Teknosa: Dizüstü
('55555555-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000002', false, '22222222-0000-0000-0000-000000000001'),
-- Dell: Dizüstü, Sunucu
('55555555-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000002', true,  '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000003', true,  '22222222-0000-0000-0000-000000000001'),
-- HP: Dizüstü, Sunucu
('55555555-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000002', true,  '22222222-0000-0000-0000-000000000001'),
('55555555-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000003', false, '22222222-0000-0000-0000-000000000001'),
-- İstikbal: Mobilya
('55555555-0000-0000-0000-000000000006', '44444444-0000-0000-0000-000000000006', true,  '22222222-0000-0000-0000-000000000001'),
-- Bürosit: Mobilya
('55555555-0000-0000-0000-000000000007', '44444444-0000-0000-0000-000000000006', false, '22222222-0000-0000-0000-000000000001'),
-- Kırtasiye Dünyası: Kırtasiye
('55555555-0000-0000-0000-000000000008', '44444444-0000-0000-0000-000000000007', true,  '22222222-0000-0000-0000-000000000001'),
-- 3M: Güvenlik
('55555555-0000-0000-0000-000000000009', '44444444-0000-0000-0000-000000000009', true,  '22222222-0000-0000-0000-000000000001');

-- ---------------------------------------------
-- 10. Markalar & Üreticiler
-- ---------------------------------------------
INSERT INTO brand (id, name, created_by) VALUES
('66666666-0000-0000-0000-000000000001', 'Dell',      '22222222-0000-0000-0000-000000000001'),
('66666666-0000-0000-0000-000000000002', 'HP',        '22222222-0000-0000-0000-000000000001'),
('66666666-0000-0000-0000-000000000003', 'Lenovo',    '22222222-0000-0000-0000-000000000001'),
('66666666-0000-0000-0000-000000000004', 'Apple',     '22222222-0000-0000-0000-000000000001'),
('66666666-0000-0000-0000-000000000005', 'Cisco',     '22222222-0000-0000-0000-000000000001'),
('66666666-0000-0000-0000-000000000006', 'Ubiquiti',  '22222222-0000-0000-0000-000000000001'),
('66666666-0000-0000-0000-000000000007', 'İstikbal',  '22222222-0000-0000-0000-000000000001'),
('66666666-0000-0000-0000-000000000008', 'Bürosit',   '22222222-0000-0000-0000-000000000001'),
('66666666-0000-0000-0000-000000000009', '3M',        '22222222-0000-0000-0000-000000000001');

INSERT INTO manufacturer (id, name, created_by) VALUES
('77777777-0000-0000-0000-000000000001', 'Dell Inc.',        '22222222-0000-0000-0000-000000000001'),
('77777777-0000-0000-0000-000000000002', 'HP Inc.',          '22222222-0000-0000-0000-000000000001'),
('77777777-0000-0000-0000-000000000003', 'Lenovo Ltd.',      '22222222-0000-0000-0000-000000000001'),
('77777777-0000-0000-0000-000000000004', 'Apple Inc.',       '22222222-0000-0000-0000-000000000001'),
('77777777-0000-0000-0000-000000000005', 'Cisco Systems',    '22222222-0000-0000-0000-000000000001'),
('77777777-0000-0000-0000-000000000006', 'Ubiquiti Inc.',    '22222222-0000-0000-0000-000000000001'),
('77777777-0000-0000-0000-000000000007', 'Boydak Mobilya',   '22222222-0000-0000-0000-000000000001'),
('77777777-0000-0000-0000-000000000008', 'Bürosit A.Ş.',     '22222222-0000-0000-0000-000000000001'),
('77777777-0000-0000-0000-000000000009', '3M Company',       '22222222-0000-0000-0000-000000000001');

-- ---------------------------------------------
-- 11. Ürünler
-- ---------------------------------------------
INSERT INTO product (id, code, name, short_description, valid_from, valid_until, unit_of_measure, delivery_days, manufacturer_part_number, model, color, product_category_id, created_by) VALUES
-- Dizüstü
('88888888-0000-0000-0000-000000000001', 'LAT-5540-I7',     'Dell Latitude 5540 i7',          'i7 16GB 512GB SSD iş laptopu',        '2026-01-01', '2027-12-31', 'Adet', 7,  'LAT5540-I7-16-512', '5540',       'Siyah',    '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000002', 'HP-EB-840-G10',   'HP EliteBook 840 G10',           'i7 16GB 1TB SSD iş laptopu',          '2026-01-01', '2027-12-31', 'Adet', 10, 'EB840G10-I7-1TB',   '840 G10',    'Gümüş',    '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000003', 'LNV-X1C-G11',     'Lenovo ThinkPad X1 Carbon G11',  'i7 32GB 1TB premium iş laptopu',      '2026-01-01', '2027-12-31', 'Adet', 14, 'X1C-G11-I7-32-1T',  'X1 Carbon',  'Siyah',    '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000004', 'APL-MBP14-M3',    'Apple MacBook Pro 14 M3',        'M3 16GB 512GB uzay grisi',            '2026-01-01', '2027-12-31', 'Adet', 21, 'MBP14-M3-16-512',   'MBP 14 M3',  'Uzay Grisi','44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000005', 'DELL-XPS-13P',    'Dell XPS 13 Plus',               'i7 16GB 512GB ince tasarım',          '2026-01-01', '2027-12-31', 'Adet', 14, 'XPS13PLUS-I7-16',   'XPS 13 Plus','Platinum', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001'),
-- Sunucu
('88888888-0000-0000-0000-000000000006', 'DELL-PE-R750',    'Dell PowerEdge R750',            '2U rackmount sunucu',                 '2026-01-01', '2027-12-31', 'Adet', 30, 'PE-R750-2U',        'R750',       'Siyah',    '44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000007', 'HPE-DL380-G11',   'HPE ProLiant DL380 Gen11',       '2U kurumsal sunucu',                  '2026-01-01', '2027-12-31', 'Adet', 28, 'DL380G11-2U',       'DL380 G11',  'Siyah',    '44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000008', 'LNV-SR650-V3',    'Lenovo ThinkSystem SR650 V3',    'Yüksek performanslı sunucu',          '2026-01-01', '2027-12-31', 'Adet', 35, 'SR650V3-STD',       'SR650 V3',   'Siyah',    '44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001'),
-- Ağ
('88888888-0000-0000-0000-000000000009', 'CSC-C9300-24',    'Cisco Catalyst 9300 24P',        '24 port L3 kurumsal switch',          '2026-01-01', '2027-12-31', 'Adet', 14, 'C9300-24P',         'C9300',      'Gri',      '44444444-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-00000000000a', 'CSC-MX67',        'Cisco Meraki MX67',              'Cloud yönetimli güvenlik duvarı',     '2026-01-01', '2027-12-31', 'Adet', 7,  'MX67-HW',           'MX67',       'Beyaz',    '44444444-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-00000000000b', 'UBI-US-24-250W',  'Ubiquiti UniFi Switch 24 PoE',   '24 port PoE yönetilebilir switch',    '2026-01-01', '2027-12-31', 'Adet', 10, 'US-24-250W',        'US-24',      'Beyaz',    '44444444-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001'),
-- Mobilya
('88888888-0000-0000-0000-00000000000c', 'IST-ERGO-01',     'İstikbal Ofis Koltuğu Ergo',     'Ergonomik yönetici koltuğu',          '2026-01-01', '2027-12-31', 'Adet', 10, 'ERGO-01',           'Ergo',       'Siyah',    '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-00000000000d', 'BRS-CLM-160',     'Bürosit Çalışma Masası 160cm',   'Melamin kaplamalı çalışma masası',    '2026-01-01', '2027-12-31', 'Adet', 14, 'CLM-160-MLM',       'CLM-160',    'Meşe',     '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-00000000000e', 'BRS-TPL-200',     'Bürosit Toplantı Masası 200cm',  '10 kişilik toplantı masası',          '2026-01-01', '2027-12-31', 'Adet', 21, 'TPL-200-MLM',       'TPL-200',    'Ceviz',    '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-00000000000f', 'IST-BKL-03',      'İstikbal Bekleme Koltuğu 3''lü', 'Resepsiyon bekleme koltuğu',          '2026-01-01', '2027-12-31', 'Adet', 14, 'BKL-03',            'BKL-03',     'Gri',      '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000001'),
-- Kırtasiye
('88888888-0000-0000-0000-000000000010', 'KRT-A4-80GR',     'A4 Fotokopi Kağıdı 80gr',        '500 yaprak beyaz A4 kağıt',           '2026-01-01', '2027-12-31', 'Paket', 3, 'A4-80-500',         'A4-80',      'Beyaz',    '44444444-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000011', 'KRT-KLM-SET',     'Dolma Kalem Seti Premium',       '3''lü premium dolma kalem seti',      '2026-01-01', '2027-12-31', 'Set',   5, 'KLM-PRM-3',         'PRM-3',      'Lacivert', '44444444-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000012', 'KRT-KLS-8CM',     'Klasör Geniş 8cm',               'PVC kaplama geniş klasör',            '2026-01-01', '2027-12-31', 'Adet',  2, 'KLS-GNS-8',         'GNS-8',      'Mavi',     '44444444-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000013', 'KRT-NOT-KGT',     'Yapışkanlı Not Kağıdı 76x76',    '100 yaprak yapışkan not kağıdı',      '2026-01-01', '2027-12-31', 'Paket', 2, 'NOT-76-100',        'NOT-76',     'Sarı',     '44444444-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000001'),
-- Güvenlik
('88888888-0000-0000-0000-000000000014', 'SEC-BRT-SRI',     'Baret Endüstriyel Sarı',         'EN397 sertifikalı iş bareti',         '2026-01-01', '2027-12-31', 'Adet',  5, 'BRT-EN397-SRI',     'EN397',      'Sarı',     '44444444-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000015', 'SEC-ELD-DRB',     'İş Eldiveni Darbeli Koruma',     'Anti-impact koruma eldiveni',         '2026-01-01', '2027-12-31', 'Çift',  5, 'ELD-IMP-L',         'IMP-L',      'Siyah',    '44444444-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000016', 'SEC-AYK-CLK-42',  'İş Ayakkabısı Çelik Burun 42',   'S3 çelik burun iş ayakkabısı',        '2026-01-01', '2027-12-31', 'Çift', 10, 'AYK-S3-42',         'S3-42',      'Siyah',    '44444444-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000001');

-- product ↔ brand
INSERT INTO product_brand (product_id, brand_id) VALUES
('88888888-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000002', '66666666-0000-0000-0000-000000000002'),
('88888888-0000-0000-0000-000000000003', '66666666-0000-0000-0000-000000000003'),
('88888888-0000-0000-0000-000000000004', '66666666-0000-0000-0000-000000000004'),
('88888888-0000-0000-0000-000000000005', '66666666-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000006', '66666666-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000007', '66666666-0000-0000-0000-000000000002'),
('88888888-0000-0000-0000-000000000008', '66666666-0000-0000-0000-000000000003'),
('88888888-0000-0000-0000-000000000009', '66666666-0000-0000-0000-000000000005'),
('88888888-0000-0000-0000-00000000000a', '66666666-0000-0000-0000-000000000005'),
('88888888-0000-0000-0000-00000000000b', '66666666-0000-0000-0000-000000000006'),
('88888888-0000-0000-0000-00000000000c', '66666666-0000-0000-0000-000000000007'),
('88888888-0000-0000-0000-00000000000d', '66666666-0000-0000-0000-000000000008'),
('88888888-0000-0000-0000-00000000000e', '66666666-0000-0000-0000-000000000008'),
('88888888-0000-0000-0000-00000000000f', '66666666-0000-0000-0000-000000000007'),
('88888888-0000-0000-0000-000000000014', '66666666-0000-0000-0000-000000000009'),
('88888888-0000-0000-0000-000000000015', '66666666-0000-0000-0000-000000000009');

-- product ↔ manufacturer
INSERT INTO product_manufacturer (product_id, manufacturer_id) VALUES
('88888888-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000002', '77777777-0000-0000-0000-000000000002'),
('88888888-0000-0000-0000-000000000003', '77777777-0000-0000-0000-000000000003'),
('88888888-0000-0000-0000-000000000004', '77777777-0000-0000-0000-000000000004'),
('88888888-0000-0000-0000-000000000005', '77777777-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000006', '77777777-0000-0000-0000-000000000001'),
('88888888-0000-0000-0000-000000000007', '77777777-0000-0000-0000-000000000002'),
('88888888-0000-0000-0000-000000000008', '77777777-0000-0000-0000-000000000003'),
('88888888-0000-0000-0000-000000000009', '77777777-0000-0000-0000-000000000005'),
('88888888-0000-0000-0000-00000000000a', '77777777-0000-0000-0000-000000000005'),
('88888888-0000-0000-0000-00000000000b', '77777777-0000-0000-0000-000000000006'),
('88888888-0000-0000-0000-00000000000c', '77777777-0000-0000-0000-000000000007'),
('88888888-0000-0000-0000-00000000000d', '77777777-0000-0000-0000-000000000008'),
('88888888-0000-0000-0000-00000000000e', '77777777-0000-0000-0000-000000000008'),
('88888888-0000-0000-0000-00000000000f', '77777777-0000-0000-0000-000000000007'),
('88888888-0000-0000-0000-000000000014', '77777777-0000-0000-0000-000000000009'),
('88888888-0000-0000-0000-000000000015', '77777777-0000-0000-0000-000000000009');

-- product keywords (örnekleme)
INSERT INTO product_keyword (product_id, keyword) VALUES
('88888888-0000-0000-0000-000000000001', 'laptop'),
('88888888-0000-0000-0000-000000000001', 'dell'),
('88888888-0000-0000-0000-000000000001', 'i7'),
('88888888-0000-0000-0000-000000000004', 'macbook'),
('88888888-0000-0000-0000-000000000004', 'apple'),
('88888888-0000-0000-0000-000000000009', 'switch'),
('88888888-0000-0000-0000-000000000009', 'cisco'),
('88888888-0000-0000-0000-00000000000c', 'koltuk'),
('88888888-0000-0000-0000-00000000000c', 'ergonomik'),
('88888888-0000-0000-0000-000000000010', 'kağıt'),
('88888888-0000-0000-0000-000000000010', 'a4'),
('88888888-0000-0000-0000-000000000014', 'baret'),
('88888888-0000-0000-0000-000000000014', 'kkd');

-- product_sku (tedarikçi bazlı)
INSERT INTO product_sku (product_id, supplier_account_id, sku) VALUES
('88888888-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000004', 'DELL-LAT5540-I7'),
('88888888-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000001', 'KOC-DLLAT5540'),
('88888888-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000005', 'HP-EB840G10-I7'),
('88888888-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000001', 'KOC-HPEB840'),
('88888888-0000-0000-0000-000000000003', '55555555-0000-0000-0000-000000000001', 'KOC-LNVX1C11'),
('88888888-0000-0000-0000-000000000004', '55555555-0000-0000-0000-000000000003', 'TKS-MBP14M3'),
('88888888-0000-0000-0000-000000000005', '55555555-0000-0000-0000-000000000004', 'DELL-XPS13PLUS'),
('88888888-0000-0000-0000-000000000006', '55555555-0000-0000-0000-000000000004', 'DELL-PE-R750'),
('88888888-0000-0000-0000-000000000007', '55555555-0000-0000-0000-000000000005', 'HPE-DL380-G11'),
('88888888-0000-0000-0000-000000000008', '55555555-0000-0000-0000-000000000001', 'KOC-LNVSR650'),
('88888888-0000-0000-0000-000000000009', '55555555-0000-0000-0000-000000000002', 'TC-C9300-24P'),
('88888888-0000-0000-0000-00000000000a', '55555555-0000-0000-0000-000000000002', 'TC-MX67'),
('88888888-0000-0000-0000-00000000000b', '55555555-0000-0000-0000-000000000001', 'KOC-UBI-US24'),
('88888888-0000-0000-0000-00000000000c', '55555555-0000-0000-0000-000000000006', 'IST-ERGO-01'),
('88888888-0000-0000-0000-00000000000d', '55555555-0000-0000-0000-000000000007', 'BRS-CLM160'),
('88888888-0000-0000-0000-00000000000e', '55555555-0000-0000-0000-000000000007', 'BRS-TPL200'),
('88888888-0000-0000-0000-00000000000f', '55555555-0000-0000-0000-000000000006', 'IST-BKL03'),
('88888888-0000-0000-0000-000000000010', '55555555-0000-0000-0000-000000000008', 'KRT-A4-80'),
('88888888-0000-0000-0000-000000000011', '55555555-0000-0000-0000-000000000008', 'KRT-KLMPRM'),
('88888888-0000-0000-0000-000000000012', '55555555-0000-0000-0000-000000000008', 'KRT-KLS8'),
('88888888-0000-0000-0000-000000000013', '55555555-0000-0000-0000-000000000008', 'KRT-NOT76'),
('88888888-0000-0000-0000-000000000014', '55555555-0000-0000-0000-000000000009', '3M-BRT-EN397'),
('88888888-0000-0000-0000-000000000015', '55555555-0000-0000-0000-000000000009', '3M-ELD-IMP'),
('88888888-0000-0000-0000-000000000016', '55555555-0000-0000-0000-000000000009', '3M-AYK-S3');

-- ---------------------------------------------
-- 11b. Fiyat Listeleri (tedarikçi başına bir liste)
-- ---------------------------------------------
INSERT INTO price_list (id, code, name, description, supplier_account_id, is_active, created_by) VALUES
('bbbbbbbb-0000-0000-0000-000000000001', 'PL-2026-0001', '2026 Koç BT Fiyat Listesi',        'Koç Bilgi Teknolojileri 2026 standart fiyatları',   '55555555-0000-0000-0000-000000000001', true, '22222222-0000-0000-0000-000000000001'),
('bbbbbbbb-0000-0000-0000-000000000002', 'PL-2026-0002', '2026 Turkcell Ağ Fiyat Listesi',   'Turkcell kurumsal ağ ürünleri 2026 fiyatları',       '55555555-0000-0000-0000-000000000002', true, '22222222-0000-0000-0000-000000000001'),
('bbbbbbbb-0000-0000-0000-000000000003', 'PL-2026-0003', '2026 Teknosa Fiyat Listesi',       'Teknosa perakende BT ürünleri 2026 fiyatları',       '55555555-0000-0000-0000-000000000003', true, '22222222-0000-0000-0000-000000000001'),
('bbbbbbbb-0000-0000-0000-000000000004', 'PL-2026-0004', '2026 Dell Fiyat Listesi',          'Dell Türkiye 2026 dizüstü ve sunucu fiyatları',      '55555555-0000-0000-0000-000000000004', true, '22222222-0000-0000-0000-000000000001'),
('bbbbbbbb-0000-0000-0000-000000000005', 'PL-2026-0005', '2026 HP Fiyat Listesi',            'HP Türkiye 2026 dizüstü ve sunucu fiyatları',        '55555555-0000-0000-0000-000000000005', true, '22222222-0000-0000-0000-000000000001'),
('bbbbbbbb-0000-0000-0000-000000000006', 'PL-2026-0006', '2026 İstikbal Mobilya Fiyat Listesi', 'İstikbal ofis mobilyaları 2026 fiyatları',        '55555555-0000-0000-0000-000000000006', true, '22222222-0000-0000-0000-000000000001'),
('bbbbbbbb-0000-0000-0000-000000000007', 'PL-2026-0007', '2026 Bürosit Ofis Fiyat Listesi',  'Bürosit ofis mobilyaları 2026 fiyatları',            '55555555-0000-0000-0000-000000000007', true, '22222222-0000-0000-0000-000000000001'),
('bbbbbbbb-0000-0000-0000-000000000008', 'PL-2026-0008', '2026 Kırtasiye Dünyası Fiyat Listesi', 'Kırtasiye Dünyası toptan fiyatları 2026',         '55555555-0000-0000-0000-000000000008', true, '22222222-0000-0000-0000-000000000001'),
('bbbbbbbb-0000-0000-0000-000000000009', 'PL-2026-0009', '2026 3M İş Güvenliği Fiyat Listesi', '3M KKD ve iş güvenliği ürünleri 2026 fiyatları',   '55555555-0000-0000-0000-000000000009', true, '22222222-0000-0000-0000-000000000001');

-- Sequence'i elle ilerlet ki auto-gen (PL-YYYY-NNNN) çakışmasın
SELECT setval('price_list_seq', 9, true);

-- ---------------------------------------------
-- 12. Ürün Fiyatları (her satır parent PriceList'e bağlı)
-- ---------------------------------------------
INSERT INTO product_price (id, product_id, supplier_account_id, price_list_id, minimum_quantity, valid_from, valid_until, unit_price, currency, created_by) VALUES
-- Dizüstü
('99999999-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000004', 1,  '2026-01-01', '2027-12-31',  42500.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000002', '88888888-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000004', 10, '2026-01-01', '2027-12-31',  39500.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000003', '88888888-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000005', 1,  '2026-01-01', '2027-12-31',  48900.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000004', '88888888-0000-0000-0000-000000000003', '55555555-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 1,  '2026-01-01', '2027-12-31',  62000.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000005', '88888888-0000-0000-0000-000000000004', '55555555-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000003', 1,  '2026-01-01', '2027-12-31',  78500.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000006', '88888888-0000-0000-0000-000000000005', '55555555-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000004', 1,  '2026-01-01', '2027-12-31',  52500.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
-- Sunucu
('99999999-0000-0000-0000-000000000007', '88888888-0000-0000-0000-000000000006', '55555555-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000004', 1,  '2026-01-01', '2027-12-31', 385000.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000008', '88888888-0000-0000-0000-000000000007', '55555555-0000-0000-0000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000005', 1,  '2026-01-01', '2027-12-31', 410000.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000009', '88888888-0000-0000-0000-000000000008', '55555555-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 1,  '2026-01-01', '2027-12-31', 398000.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
-- Ağ
('99999999-0000-0000-0000-00000000000a', '88888888-0000-0000-0000-000000000009', '55555555-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002', 1,  '2026-01-01', '2027-12-31', 125000.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-00000000000b', '88888888-0000-0000-0000-00000000000a', '55555555-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002', 1,  '2026-01-01', '2027-12-31',  34500.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-00000000000c', '88888888-0000-0000-0000-00000000000b', '55555555-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 1,  '2026-01-01', '2027-12-31',  19500.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
-- Mobilya
('99999999-0000-0000-0000-00000000000d', '88888888-0000-0000-0000-00000000000c', '55555555-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000006', 1,  '2026-01-01', '2027-12-31',   8900.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-00000000000e', '88888888-0000-0000-0000-00000000000d', '55555555-0000-0000-0000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000007', 1,  '2026-01-01', '2027-12-31',   6500.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-00000000000f', '88888888-0000-0000-0000-00000000000e', '55555555-0000-0000-0000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000007', 1,  '2026-01-01', '2027-12-31',  24500.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000010', '88888888-0000-0000-0000-00000000000f', '55555555-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000006', 1,  '2026-01-01', '2027-12-31',  15500.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
-- Kırtasiye
('99999999-0000-0000-0000-000000000011', '88888888-0000-0000-0000-000000000010', '55555555-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000008', 1,  '2026-01-01', '2027-12-31',    185.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000012', '88888888-0000-0000-0000-000000000010', '55555555-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000008', 50, '2026-01-01', '2027-12-31',    160.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000013', '88888888-0000-0000-0000-000000000011', '55555555-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000008', 1,  '2026-01-01', '2027-12-31',    650.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000014', '88888888-0000-0000-0000-000000000012', '55555555-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000008', 1,  '2026-01-01', '2027-12-31',     45.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000015', '88888888-0000-0000-0000-000000000013', '55555555-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000008', 1,  '2026-01-01', '2027-12-31',     35.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
-- Güvenlik
('99999999-0000-0000-0000-000000000016', '88888888-0000-0000-0000-000000000014', '55555555-0000-0000-0000-000000000009', 'bbbbbbbb-0000-0000-0000-000000000009', 1,  '2026-01-01', '2027-12-31',    285.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000017', '88888888-0000-0000-0000-000000000015', '55555555-0000-0000-0000-000000000009', 'bbbbbbbb-0000-0000-0000-000000000009', 1,  '2026-01-01', '2027-12-31',    195.0000, 'TRY', '22222222-0000-0000-0000-000000000001'),
('99999999-0000-0000-0000-000000000018', '88888888-0000-0000-0000-000000000016', '55555555-0000-0000-0000-000000000009', 'bbbbbbbb-0000-0000-0000-000000000009', 1,  '2026-01-01', '2027-12-31',    950.0000, 'TRY', '22222222-0000-0000-0000-000000000001');

-- ---------------------------------------------
-- 13. Ürün Katalogları
-- ---------------------------------------------
INSERT INTO product_catalog (id, code, name, description, valid_from, valid_until, price_code, created_by) VALUES
('aaaaaaaa-0000-0000-0000-000000000001', 'CAT-BT-2026',  '2026 BT Standart Kataloğu',  'BT kategorisi için standart fiyatlı katalog', '2026-01-01', '2026-12-31', 'STD',  '22222222-0000-0000-0000-000000000001'),
('aaaaaaaa-0000-0000-0000-000000000002', 'CAT-OFC-2026', '2026 Ofis Kataloğu',         'Ofis mobilya ve kırtasiye',                    '2026-01-01', '2026-12-31', 'STD',  '22222222-0000-0000-0000-000000000001');

INSERT INTO product_catalog_organization (product_catalog_id, app_organization_id) VALUES
-- BT kataloğu: Genel Müdürlük, BT GMY ve Satın Alma Müdürlüğü erişimine açık
('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001'),
('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000000b'),
('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a'),
-- Ofis kataloğu: Genel Müdürlük, İK ve Satın Alma Müdürlüğü erişimine açık
('aaaaaaaa-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001'),
('aaaaaaaa-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000017'),
('aaaaaaaa-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a');

INSERT INTO product_catalog_product (product_catalog_id, product_id) VALUES
-- BT kataloğu
('aaaaaaaa-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000001'),
('aaaaaaaa-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000002'),
('aaaaaaaa-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000003'),
('aaaaaaaa-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000004'),
('aaaaaaaa-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000005'),
('aaaaaaaa-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000006'),
('aaaaaaaa-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000007'),
('aaaaaaaa-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000009'),
('aaaaaaaa-0000-0000-0000-000000000001', '88888888-0000-0000-0000-00000000000a'),
-- Ofis kataloğu
('aaaaaaaa-0000-0000-0000-000000000002', '88888888-0000-0000-0000-00000000000c'),
('aaaaaaaa-0000-0000-0000-000000000002', '88888888-0000-0000-0000-00000000000d'),
('aaaaaaaa-0000-0000-0000-000000000002', '88888888-0000-0000-0000-00000000000e'),
('aaaaaaaa-0000-0000-0000-000000000002', '88888888-0000-0000-0000-000000000010'),
('aaaaaaaa-0000-0000-0000-000000000002', '88888888-0000-0000-0000-000000000011'),
('aaaaaaaa-0000-0000-0000-000000000002', '88888888-0000-0000-0000-000000000012'),
('aaaaaaaa-0000-0000-0000-000000000002', '88888888-0000-0000-0000-000000000013');

-- ---------------------------------------------
-- 14. Satın Alma Talepleri
-- ---------------------------------------------
INSERT INTO purchase_request (id, request_number, title, description, status, priority, request_date, required_date, currency_code, total_amount, owner_id, organization_id, created_by) VALUES
('bbbbbbbb-0000-0000-0000-000000000001', 'PR-2026-0001', 'Yeni personel laptopları',        'Yeni işe başlayan 5 kişi için dizüstü', 'Setup',           'Medium', '2026-04-05', '2026-05-01', 'TRY',  212500.00, '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
('bbbbbbbb-0000-0000-0000-000000000002', 'PR-2026-0002', 'Sunucu yenileme',                 'Veri merkezi 2 sunucu ihtiyacı',         'PendingApproval', 'High',   '2026-04-02', '2026-05-15', 'TRY',  795000.00, '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004'),
('bbbbbbbb-0000-0000-0000-000000000003', 'PR-2026-0003', 'Ofis mobilya alımı',              '15 kişilik yeni ofis donanımı',          'PendingApproval', 'Medium', '2026-04-08', '2026-06-01', 'TRY',  247500.00, '22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000005'),
('bbbbbbbb-0000-0000-0000-000000000004', 'PR-2026-0004', 'Ağ altyapı güncelleme',           'Merkez ofis switch yenileme',            'InPurchasing',    'High',   '2026-03-20', '2026-04-30', 'TRY',  625000.00, '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
('bbbbbbbb-0000-0000-0000-000000000005', 'PR-2026-0005', 'Q2 Kırtasiye siparişi',           'Çeyreklik kırtasiye ihtiyacı',           'InPurchasing',    'Low',    '2026-04-01', '2026-04-25', 'TRY',    9450.00, '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004'),
('bbbbbbbb-0000-0000-0000-000000000006', 'PR-2026-0006', 'İş güvenliği ekipmanları',         'Üretim sahası KKD yenilemesi',           'Completed',       'Urgent', '2026-02-15', '2026-03-10', 'TRY',   28600.00, '22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000005'),
('bbbbbbbb-0000-0000-0000-000000000007', 'PR-2026-0007', 'Yönetici odası donanımı',         'CEO ofisi için MacBook + koltuk',        'Completed',       'Medium', '2026-02-20', '2026-03-20', 'TRY',   87400.00, '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
('bbbbbbbb-0000-0000-0000-000000000008', 'PR-2026-0008', 'Reddedilen örnek talep',          'Bütçe aşımı nedeniyle reddedildi',       'Rejected',        'Low',    '2026-03-05', '2026-04-01', 'TRY',  385000.00, '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004'),
('bbbbbbbb-0000-0000-0000-000000000009', 'PR-2026-0009', 'İptal edilen toplantı odası',      'Lokasyon değişti, iptal',                 'Cancelled',       'Low',    '2026-03-10', '2026-04-20', 'TRY',   24500.00, '22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000005'),
('bbbbbbbb-0000-0000-0000-00000000000a', 'PR-2026-0010', 'Acil güvenlik duvarı yenileme',    'Güvenlik ihlali sonrası acil ihtiyaç',    'Setup',           'Urgent', '2026-04-15', '2026-04-22', 'TRY',   34500.00, '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003');

-- purchase_request_line
INSERT INTO purchase_request_line (id, purchase_request_id, is_free_product, product_id, product_name, product_price_id, supplier_account_id, quantity, unit_of_measure, unit_price, currency, total_amount, need_by_date, status, created_by) VALUES
-- PR-0001: 5 adet Dell Latitude @ 42500 = 212500
('cccccccc-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', false, '88888888-0000-0000-0000-000000000001', 'Dell Latitude 5540 i7', '99999999-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000004', 5, 'Adet', 42500.0000, 'TRY', 212500.00, '2026-05-01', 'Setup', '22222222-0000-0000-0000-000000000003'),
-- PR-0002: 2 sunucu (Dell PE R750 ve HPE DL380) 385000 + 410000 = 795000
('cccccccc-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002', false, '88888888-0000-0000-0000-000000000006', 'Dell PowerEdge R750',   '99999999-0000-0000-0000-000000000007', '55555555-0000-0000-0000-000000000004', 1, 'Adet', 385000.0000,'TRY', 385000.00, '2026-05-15', 'PendingApproval', '22222222-0000-0000-0000-000000000004'),
('cccccccc-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000002', false, '88888888-0000-0000-0000-000000000007', 'HPE ProLiant DL380 Gen11', '99999999-0000-0000-0000-000000000008', '55555555-0000-0000-0000-000000000005', 1, 'Adet', 410000.0000,'TRY', 410000.00, '2026-05-15', 'PendingApproval', '22222222-0000-0000-0000-000000000004'),
-- PR-0003: 15 koltuk + 15 masa = 15*8900 + 15*6500 = 133500 + 97500 = 231000 + toplantı 16500 = 247500
('cccccccc-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000003', false, '88888888-0000-0000-0000-00000000000c', 'İstikbal Ofis Koltuğu Ergo', '99999999-0000-0000-0000-00000000000d', '55555555-0000-0000-0000-000000000006', 15, 'Adet', 8900.0000, 'TRY', 133500.00, '2026-06-01', 'PendingApproval', '22222222-0000-0000-0000-000000000005'),
('cccccccc-0000-0000-0000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000003', false, '88888888-0000-0000-0000-00000000000d', 'Bürosit Çalışma Masası 160cm', '99999999-0000-0000-0000-00000000000e', '55555555-0000-0000-0000-000000000007', 15, 'Adet', 6500.0000, 'TRY',  97500.00, '2026-06-01', 'PendingApproval', '22222222-0000-0000-0000-000000000005'),
('cccccccc-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000003', true, NULL, 'Hoşgeldin seti (serbest ürün)', NULL, NULL, 15, 'Set', 1100.0000, 'TRY', 16500.00, '2026-06-01', 'PendingApproval', '22222222-0000-0000-0000-000000000005'),
-- PR-0004: 5 adet Cisco Catalyst = 625000
('cccccccc-0000-0000-0000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000004', false, '88888888-0000-0000-0000-000000000009', 'Cisco Catalyst 9300 24P', '99999999-0000-0000-0000-00000000000a', '55555555-0000-0000-0000-000000000002', 5, 'Adet', 125000.0000,'TRY', 625000.00, '2026-04-30', 'InPurchasing', '22222222-0000-0000-0000-000000000003'),
-- PR-0005: Kırtasiye karışık
('cccccccc-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000005', false, '88888888-0000-0000-0000-000000000010', 'A4 Fotokopi Kağıdı 80gr', '99999999-0000-0000-0000-000000000012', '55555555-0000-0000-0000-000000000008', 50, 'Paket', 160.0000, 'TRY',  8000.00, '2026-04-25', 'InPurchasing', '22222222-0000-0000-0000-000000000004'),
('cccccccc-0000-0000-0000-000000000009', 'bbbbbbbb-0000-0000-0000-000000000005', false, '88888888-0000-0000-0000-000000000012', 'Klasör Geniş 8cm',          '99999999-0000-0000-0000-000000000014', '55555555-0000-0000-0000-000000000008', 20, 'Adet',  45.0000, 'TRY',   900.00, '2026-04-25', 'InPurchasing', '22222222-0000-0000-0000-000000000004'),
('cccccccc-0000-0000-0000-00000000000a', 'bbbbbbbb-0000-0000-0000-000000000005', false, '88888888-0000-0000-0000-000000000013', 'Yapışkanlı Not Kağıdı 76x76','99999999-0000-0000-0000-000000000015', '55555555-0000-0000-0000-000000000008', 30, 'Paket',  35.0000, 'TRY',  1050.00, '2026-04-25', 'InPurchasing', '22222222-0000-0000-0000-000000000004'),
('cccccccc-0000-0000-0000-00000000000b', 'bbbbbbbb-0000-0000-0000-000000000005', false, '88888888-0000-0000-0000-000000000011', 'Dolma Kalem Seti Premium',  '99999999-0000-0000-0000-000000000013', '55555555-0000-0000-0000-000000000008',  1, 'Set',   500.0000, 'TRY',   500.00, '2026-04-25', 'InPurchasing', '22222222-0000-0000-0000-000000000004'),
-- PR-0006 tamamlanmış: KKD
('cccccccc-0000-0000-0000-00000000000c', 'bbbbbbbb-0000-0000-0000-000000000006', false, '88888888-0000-0000-0000-000000000014', 'Baret Endüstriyel Sarı',    '99999999-0000-0000-0000-000000000016', '55555555-0000-0000-0000-000000000009', 50, 'Adet', 285.0000, 'TRY', 14250.00, '2026-03-10', 'Completed', '22222222-0000-0000-0000-000000000005'),
('cccccccc-0000-0000-0000-00000000000d', 'bbbbbbbb-0000-0000-0000-000000000006', false, '88888888-0000-0000-0000-000000000015', 'İş Eldiveni Darbeli Koruma','99999999-0000-0000-0000-000000000017', '55555555-0000-0000-0000-000000000009', 50, 'Çift', 195.0000, 'TRY',  9750.00, '2026-03-10', 'Completed', '22222222-0000-0000-0000-000000000005'),
('cccccccc-0000-0000-0000-00000000000e', 'bbbbbbbb-0000-0000-0000-000000000006', false, '88888888-0000-0000-0000-000000000016', 'İş Ayakkabısı Çelik Burun 42','99999999-0000-0000-0000-000000000018','55555555-0000-0000-0000-000000000009',  5, 'Çift', 920.0000, 'TRY',  4600.00, '2026-03-10', 'Completed', '22222222-0000-0000-0000-000000000005'),
-- PR-0007 tamamlanmış: CEO donanım
('cccccccc-0000-0000-0000-00000000000f', 'bbbbbbbb-0000-0000-0000-000000000007', false, '88888888-0000-0000-0000-000000000004', 'Apple MacBook Pro 14 M3',  '99999999-0000-0000-0000-000000000005', '55555555-0000-0000-0000-000000000003', 1, 'Adet', 78500.0000,'TRY', 78500.00, '2026-03-20', 'Completed', '22222222-0000-0000-0000-000000000003'),
('cccccccc-0000-0000-0000-000000000010', 'bbbbbbbb-0000-0000-0000-000000000007', false, '88888888-0000-0000-0000-00000000000c', 'İstikbal Ofis Koltuğu Ergo', '99999999-0000-0000-0000-00000000000d', '55555555-0000-0000-0000-000000000006', 1, 'Adet', 8900.0000, 'TRY',  8900.00, '2026-03-20', 'Completed', '22222222-0000-0000-0000-000000000003'),
-- PR-0008 reddedilmiş
('cccccccc-0000-0000-0000-000000000011', 'bbbbbbbb-0000-0000-0000-000000000008', false, '88888888-0000-0000-0000-000000000006', 'Dell PowerEdge R750', '99999999-0000-0000-0000-000000000007', '55555555-0000-0000-0000-000000000004', 1, 'Adet', 385000.0000,'TRY', 385000.00, '2026-04-01', 'Rejected', '22222222-0000-0000-0000-000000000004'),
-- PR-0009 iptal edilmiş
('cccccccc-0000-0000-0000-000000000012', 'bbbbbbbb-0000-0000-0000-000000000009', false, '88888888-0000-0000-0000-00000000000e', 'Bürosit Toplantı Masası 200cm', '99999999-0000-0000-0000-00000000000f','55555555-0000-0000-0000-000000000007', 1, 'Adet', 24500.0000,'TRY', 24500.00, '2026-04-20', 'Cancelled', '22222222-0000-0000-0000-000000000005'),
-- PR-0010 setup: güvenlik duvarı
('cccccccc-0000-0000-0000-000000000013', 'bbbbbbbb-0000-0000-0000-00000000000a', false, '88888888-0000-0000-0000-00000000000a', 'Cisco Meraki MX67', '99999999-0000-0000-0000-00000000000b', '55555555-0000-0000-0000-000000000002', 1, 'Adet', 34500.0000,'TRY', 34500.00, '2026-04-22', 'Setup', '22222222-0000-0000-0000-000000000003');

-- ---------------------------------------------
-- 15. Satın Alma Siparişleri (PR'lardan türetilmiş)
-- ---------------------------------------------
INSERT INTO purchase_order (id, order_number, title, description, supplier_account_id, purchase_request_id, status, priority, order_date, expected_delivery_date, currency_code, total_amount, owner_id, organization_id, created_by) VALUES
-- PR-0004 (InPurchasing) → Cisco switch siparişi, Submitted
('dddddddd-0000-0000-0000-000000000001', 'PO-2026-0001', 'Cisco Catalyst Switch Siparişi', 'PR-2026-0004 kapsamında',       '55555555-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000004', 'Submitted',  'High',   '2026-03-25', '2026-04-30', 'TRY', 625000.00, '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
-- PR-0005 → Kırtasiye siparişi (tek tedarikçi), Confirmed
('dddddddd-0000-0000-0000-000000000002', 'PO-2026-0002', 'Q2 Kırtasiye Siparişi',          'PR-2026-0005 kapsamında',       '55555555-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000005', 'Confirmed',  'Low',    '2026-04-05', '2026-04-25', 'TRY',  10450.00, '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004'),
-- PR-0006 → KKD siparişi, Received
('dddddddd-0000-0000-0000-000000000003', 'PO-2026-0003', 'KKD Siparişi',                   'PR-2026-0006 kapsamında',       '55555555-0000-0000-0000-000000000009', 'bbbbbbbb-0000-0000-0000-000000000006', 'Received',   'Urgent', '2026-02-18', '2026-03-08', 'TRY',  28600.00, '22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000005'),
-- PR-0007 → CEO MacBook (Teknosa), Received
('dddddddd-0000-0000-0000-000000000004', 'PO-2026-0004', 'CEO MacBook Siparişi',           'PR-2026-0007 kapsamında',       '55555555-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000007', 'Received',   'Medium', '2026-02-25', '2026-03-18', 'TRY',  78500.00, '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
-- PR-0007 → CEO Koltuk (İstikbal), InDelivery
('dddddddd-0000-0000-0000-000000000005', 'PO-2026-0005', 'CEO Ofis Koltuğu',               'PR-2026-0007 koltuk kalemi',    '55555555-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000007', 'InDelivery', 'Medium', '2026-02-25', '2026-03-20', 'TRY',   8900.00, '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
-- Draft PO (henüz talep yok, manuel)
('dddddddd-0000-0000-0000-000000000006', 'PO-2026-0006', 'Taslak: Toplantı odası donanım', 'Manuel olarak hazırlanan taslak','55555555-0000-0000-0000-000000000007', NULL,                                    'Draft',      'Low',    '2026-04-12', '2026-05-20', 'TRY',  24500.00, '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004');

-- purchase_order_line
INSERT INTO purchase_order_line (id, purchase_order_id, purchase_request_line_id, is_free_product, product_id, product_name, product_price_id, quantity, unit_of_measure, unit_price, currency, total_amount, need_by_date, status, created_by) VALUES
-- PO-0001: 5 Cisco switch
('eeeeeeee-0000-0000-0000-000000000001', 'dddddddd-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000007', false, '88888888-0000-0000-0000-000000000009', 'Cisco Catalyst 9300 24P', '99999999-0000-0000-0000-00000000000a', 5, 'Adet', 125000.0000, 'TRY', 625000.00, '2026-04-30', 'Submitted', '22222222-0000-0000-0000-000000000003'),
-- PO-0002: Kırtasiye
('eeeeeeee-0000-0000-0000-000000000002', 'dddddddd-0000-0000-0000-000000000002', 'cccccccc-0000-0000-0000-000000000008', false, '88888888-0000-0000-0000-000000000010', 'A4 Fotokopi Kağıdı 80gr',   '99999999-0000-0000-0000-000000000012', 50, 'Paket', 160.0000, 'TRY',  8000.00, '2026-04-25', 'Confirmed', '22222222-0000-0000-0000-000000000004'),
('eeeeeeee-0000-0000-0000-000000000003', 'dddddddd-0000-0000-0000-000000000002', 'cccccccc-0000-0000-0000-000000000009', false, '88888888-0000-0000-0000-000000000012', 'Klasör Geniş 8cm',          '99999999-0000-0000-0000-000000000014', 20, 'Adet',   45.0000, 'TRY',   900.00, '2026-04-25', 'Confirmed', '22222222-0000-0000-0000-000000000004'),
('eeeeeeee-0000-0000-0000-000000000004', 'dddddddd-0000-0000-0000-000000000002', 'cccccccc-0000-0000-0000-00000000000a', false, '88888888-0000-0000-0000-000000000013', 'Yapışkanlı Not Kağıdı 76x76','99999999-0000-0000-0000-000000000015', 30, 'Paket',  35.0000, 'TRY',  1050.00, '2026-04-25', 'Confirmed', '22222222-0000-0000-0000-000000000004'),
('eeeeeeee-0000-0000-0000-000000000005', 'dddddddd-0000-0000-0000-000000000002', 'cccccccc-0000-0000-0000-00000000000b', false, '88888888-0000-0000-0000-000000000011', 'Dolma Kalem Seti Premium',  '99999999-0000-0000-0000-000000000013',  1, 'Set',   500.0000, 'TRY',   500.00, '2026-04-25', 'Confirmed', '22222222-0000-0000-0000-000000000004'),
-- PO-0003: KKD
('eeeeeeee-0000-0000-0000-000000000006', 'dddddddd-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-00000000000c', false, '88888888-0000-0000-0000-000000000014', 'Baret Endüstriyel Sarı',    '99999999-0000-0000-0000-000000000016', 50, 'Adet',  285.0000, 'TRY', 14250.00, '2026-03-08', 'Received', '22222222-0000-0000-0000-000000000005'),
('eeeeeeee-0000-0000-0000-000000000007', 'dddddddd-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-00000000000d', false, '88888888-0000-0000-0000-000000000015', 'İş Eldiveni Darbeli Koruma','99999999-0000-0000-0000-000000000017', 50, 'Çift',  195.0000, 'TRY',  9750.00, '2026-03-08', 'Received', '22222222-0000-0000-0000-000000000005'),
('eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-00000000000e', false, '88888888-0000-0000-0000-000000000016', 'İş Ayakkabısı Çelik Burun 42','99999999-0000-0000-0000-000000000018', 5, 'Çift',  920.0000, 'TRY',  4600.00, '2026-03-08', 'Received', '22222222-0000-0000-0000-000000000005'),
-- PO-0004: MacBook
('eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000004', 'cccccccc-0000-0000-0000-00000000000f', false, '88888888-0000-0000-0000-000000000004', 'Apple MacBook Pro 14 M3',  '99999999-0000-0000-0000-000000000005', 1, 'Adet', 78500.0000, 'TRY', 78500.00, '2026-03-18', 'Received', '22222222-0000-0000-0000-000000000003'),
-- PO-0005: İstikbal koltuk
('eeeeeeee-0000-0000-0000-00000000000a', 'dddddddd-0000-0000-0000-000000000005', 'cccccccc-0000-0000-0000-000000000010', false, '88888888-0000-0000-0000-00000000000c', 'İstikbal Ofis Koltuğu Ergo', '99999999-0000-0000-0000-00000000000d', 1, 'Adet',  8900.0000, 'TRY',  8900.00, '2026-03-20', 'InDelivery', '22222222-0000-0000-0000-000000000003'),
-- PO-0006: Draft — manual
('eeeeeeee-0000-0000-0000-00000000000b', 'dddddddd-0000-0000-0000-000000000006', NULL, false, '88888888-0000-0000-0000-00000000000e', 'Bürosit Toplantı Masası 200cm', '99999999-0000-0000-0000-00000000000f', 1, 'Adet', 24500.0000, 'TRY', 24500.00, '2026-05-20', 'Draft', '22222222-0000-0000-0000-000000000004');

-- purchase_order_request_line junction
INSERT INTO purchase_order_request_line (purchase_order_line_id, purchase_request_line_id, allocated_quantity) VALUES
('eeeeeeee-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000007', 5),
('eeeeeeee-0000-0000-0000-000000000002', 'cccccccc-0000-0000-0000-000000000008', 50),
('eeeeeeee-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-000000000009', 20),
('eeeeeeee-0000-0000-0000-000000000004', 'cccccccc-0000-0000-0000-00000000000a', 30),
('eeeeeeee-0000-0000-0000-000000000005', 'cccccccc-0000-0000-0000-00000000000b', 1),
('eeeeeeee-0000-0000-0000-000000000006', 'cccccccc-0000-0000-0000-00000000000c', 50),
('eeeeeeee-0000-0000-0000-000000000007', 'cccccccc-0000-0000-0000-00000000000d', 50),
('eeeeeeee-0000-0000-0000-000000000008', 'cccccccc-0000-0000-0000-00000000000e', 5),
('eeeeeeee-0000-0000-0000-000000000009', 'cccccccc-0000-0000-0000-00000000000f', 1),
('eeeeeeee-0000-0000-0000-00000000000a', 'cccccccc-0000-0000-0000-000000000010', 1);

-- Sequence'leri güncel tutmak için ileri sar
SELECT setval('purchase_request_seq', 10);
SELECT setval('purchase_order_seq',   6);

-- ---------------------------------------------
-- 16. Satın Alma Sepetleri (Preparing — aktif sepet)
-- ---------------------------------------------
INSERT INTO purchase_basket (id, status, owner_id, organization_id, created_by) VALUES
('ffffffff-0000-0000-0000-000000000001', 'Preparing', '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
('ffffffff-0000-0000-0000-000000000002', 'Preparing', '22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000005');

INSERT INTO purchase_basket_line (purchase_basket_id, product_id, quantity, created_by) VALUES
-- Mehmet'in sepeti: yeni ekip için hazırlık
('ffffffff-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000002', 3, '22222222-0000-0000-0000-000000000003'),
('ffffffff-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000003', 2, '22222222-0000-0000-0000-000000000003'),
-- Ali'nin sepeti: ofis düzeni
('ffffffff-0000-0000-0000-000000000002', '88888888-0000-0000-0000-00000000000d', 5, '22222222-0000-0000-0000-000000000005'),
('ffffffff-0000-0000-0000-000000000002', '88888888-0000-0000-0000-00000000000c', 5, '22222222-0000-0000-0000-000000000005');

-- ---------------------------------------------
-- 17. Aktiviteler (Task, PhoneCall, Email, Appointment)
-- ---------------------------------------------
INSERT INTO activity (id, subject, activity_type, status, priority, start_date, end_date, due_date, regarding_entity_type, regarding_entity_id, owner_id, organization_id, created_by) VALUES
('12121212-0000-0000-0000-000000000001', 'Dell ile yıllık sözleşme görüşmesi', 'Appointment','NotStarted','High',   '2026-04-25 10:00+03', '2026-04-25 11:00+03', '2026-04-25 10:00+03', 'Supplier',        '55555555-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000002'),
('12121212-0000-0000-0000-000000000002', 'Turkcell switch teklifi takibi',     'PhoneCall',  'Completed', 'Normal', '2026-03-22 14:30+03', '2026-03-22 14:45+03', NULL,                  'PurchaseRequest', 'bbbbbbbb-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
('12121212-0000-0000-0000-000000000003', 'Sunucu teklifi için RFQ gönderildi', 'Email',      'Completed', 'High',   '2026-04-03 09:15+03', '2026-04-03 09:15+03', NULL,                  'PurchaseRequest', 'bbbbbbbb-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004'),
('12121212-0000-0000-0000-000000000004', 'Cisco sipariş teslimat takibi',      'Task',       'InProgress','High',   '2026-04-01 00:00+03', NULL,                  '2026-04-30 17:00+03', 'PurchaseOrder',   'dddddddd-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
('12121212-0000-0000-0000-000000000005', 'İstikbal koltuk teslimatı kontrol',  'Task',       'NotStarted','Normal', '2026-04-18 00:00+03', NULL,                  '2026-03-20 17:00+03', 'PurchaseOrder',   'dddddddd-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
('12121212-0000-0000-0000-000000000006', 'Bürosit tedarikçi değerlendirmesi',  'PhoneCall',  'NotStarted','Normal', '2026-04-20 11:00+03', NULL,                  NULL,                  'Supplier',        '55555555-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000002'),
('12121212-0000-0000-0000-000000000007', 'KKD teslimat onay maili',            'Email',      'Completed', 'Normal', '2026-03-09 10:00+03', '2026-03-09 10:00+03', NULL,                  'PurchaseOrder',   'dddddddd-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000005'),
('12121212-0000-0000-0000-000000000008', 'HP çeyrek dönem iş görüşmesi',       'Appointment','NotStarted','Normal', '2026-05-10 14:00+03', '2026-05-10 15:30+03', '2026-05-10 14:00+03', 'Supplier',        '55555555-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000002');

-- Subtype tabloları
INSERT INTO activity_appointment (id, location, is_online, meeting_url, is_all_day, reminder_minutes_before, meeting_notes) VALUES
('12121212-0000-0000-0000-000000000001', 'Dell İstinye Plaza Ofisi', false, NULL,                              false, 30, 'Yıllık sözleşme yenileme — fiyat indirim görüşmesi'),
('12121212-0000-0000-0000-000000000008', 'Online',                    true,  'https://teams.microsoft.com/xyz', false, 15, 'Çeyrek dönem performans ve yeni model sunumu');

INSERT INTO activity_phone_call (id, call_direction, call_notes) VALUES
('12121212-0000-0000-0000-000000000002', 'Outgoing', 'Teklif tarihi 5 Nisan olarak netleştirildi.'),
('12121212-0000-0000-0000-000000000006', 'Outgoing', 'Pending statüsündeki tedarikçi için onay süreci görüşülecek.');

INSERT INTO activity_email (id, body, is_html, is_sent, is_read, read_date) VALUES
('12121212-0000-0000-0000-000000000003', '<p>Merhaba,<br/>Sunucu ihtiyacımız için tekliflerinizi beklemekteyiz.</p>', true, true, true, '2026-04-03 14:00+03'),
('12121212-0000-0000-0000-000000000007', '<p>KKD siparişi eksiksiz teslim alınmıştır. Teşekkürler.</p>',            true, true, true, '2026-03-09 11:30+03');

INSERT INTO activity_task (id, task_description, reminder_at, percent_complete) VALUES
('12121212-0000-0000-0000-000000000004', 'Cisco siparişinin teslimat durumunu haftalık takip et', '2026-04-22 09:00+03', 40),
('12121212-0000-0000-0000-000000000005', 'Koltuk teslimatını resepsiyon ile koordine et',         '2026-04-19 09:00+03',  0);

-- activity_party — her aktiviteye en az bir taraf
INSERT INTO activity_party (activity_id, party_type, participant_type, participant_id, name, email, sort_order) VALUES
-- 1: Appointment Dell
('12121212-0000-0000-0000-000000000001', 'Organizer','User',     '22222222-0000-0000-0000-000000000002', 'Ayşe Yılmaz',       'ayse.yilmaz@codeliman.com', 0),
('12121212-0000-0000-0000-000000000001', 'Attendee', 'Supplier', '55555555-0000-0000-0000-000000000004', 'Dell Türkiye',      'sales@dell.com.tr',         1),
-- 2: PhoneCall Turkcell
('12121212-0000-0000-0000-000000000002', 'Caller',   'User',     '22222222-0000-0000-0000-000000000003', 'Mehmet Demir',      'mehmet.demir@codeliman.com', 0),
('12121212-0000-0000-0000-000000000002', 'Recipient','Supplier', '55555555-0000-0000-0000-000000000002', 'Turkcell Kurumsal', 'kurumsal@turkcell.com.tr',  1),
-- 3: Email sunucu
('12121212-0000-0000-0000-000000000003', 'From','User',     '22222222-0000-0000-0000-000000000004', 'Zeynep Kaya', 'zeynep.kaya@codeliman.com', 0),
('12121212-0000-0000-0000-000000000003', 'To',  'Supplier', '55555555-0000-0000-0000-000000000004', 'Dell Türkiye','sales@dell.com.tr',         1),
('12121212-0000-0000-0000-000000000003', 'To',  'Supplier', '55555555-0000-0000-0000-000000000005', 'HP Türkiye',  'sales@hp.com.tr',           2),
-- 4: Task Cisco
('12121212-0000-0000-0000-000000000004', 'Owner','User','22222222-0000-0000-0000-000000000003', 'Mehmet Demir','mehmet.demir@codeliman.com', 0),
-- 5: Task İstikbal koltuk
('12121212-0000-0000-0000-000000000005', 'Owner','User','22222222-0000-0000-0000-000000000003', 'Mehmet Demir','mehmet.demir@codeliman.com', 0),
-- 6: PhoneCall Bürosit
('12121212-0000-0000-0000-000000000006', 'Caller',   'User',     '22222222-0000-0000-0000-000000000002', 'Ayşe Yılmaz',    'ayse.yilmaz@codeliman.com', 0),
('12121212-0000-0000-0000-000000000006', 'Recipient','Supplier', '55555555-0000-0000-0000-000000000007', 'Bürosit A.Ş.',   'satis@burosit.com.tr',      1),
-- 7: Email KKD
('12121212-0000-0000-0000-000000000007', 'From','Supplier','55555555-0000-0000-0000-000000000009', '3M Türkiye',  'info@3m.com.tr',            0),
('12121212-0000-0000-0000-000000000007', 'To',  'User',    '22222222-0000-0000-0000-000000000005', 'Ali Çelik',   'ali.celik@codeliman.com',   1),
-- 8: Appointment HP
('12121212-0000-0000-0000-000000000008', 'Organizer','User',     '22222222-0000-0000-0000-000000000002', 'Ayşe Yılmaz',  'ayse.yilmaz@codeliman.com', 0),
('12121212-0000-0000-0000-000000000008', 'Attendee', 'Supplier', '55555555-0000-0000-0000-000000000005', 'HP Türkiye',   'sales@hp.com.tr',           1);

-- ---------------------------------------------
-- 18. Anketler (Questionnaire)
-- ---------------------------------------------
INSERT INTO questionnaire (id, name, related_module, status, owner_id, organization_id, created_by) VALUES
('13131313-0000-0000-0000-000000000001', 'Tedarikçi Ön Değerlendirme Anketi',    'Supplier', 'Active', '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000002'),
('13131313-0000-0000-0000-000000000002', 'Teklif Teknik Uygunluk Formu',         'Offer',    'Active', '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003'),
('13131313-0000-0000-0000-000000000003', 'Sözleşme Risk Değerlendirme Anketi',   'Contract', 'Active', '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004'),
('13131313-0000-0000-0000-000000000004', 'Sipariş Sonrası Memnuniyet Anketi',    'Order',    'Draft',  '22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000005');

INSERT INTO questionnaire_question (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
-- Tedarikçi anketi
('14141414-0000-0000-0000-000000000001', '13131313-0000-0000-0000-000000000001', 'ISO 9001 kalite sertifikanız var mı?',              'YesNo',          true,  0),
('14141414-0000-0000-0000-000000000002', '13131313-0000-0000-0000-000000000001', 'Yıllık ciro aralığınız (TRY)',                       'Number',         true,  1),
('14141414-0000-0000-0000-000000000003', '13131313-0000-0000-0000-000000000001', 'Ödeme vadesi tercihi',                               'MultipleChoice', true,  2),
('14141414-0000-0000-0000-000000000004', '13131313-0000-0000-0000-000000000001', 'Kısa firma tanıtımı',                                'LongText',       false, 3),
-- Teklif teknik form
('14141414-0000-0000-0000-000000000005', '13131313-0000-0000-0000-000000000002', 'Teknik şartnameye uygun mu?',                        'YesNo',          true,  0),
('14141414-0000-0000-0000-000000000006', '13131313-0000-0000-0000-000000000002', 'Önerilen teslim süresi (gün)',                       'Number',         true,  1),
('14141414-0000-0000-0000-000000000007', '13131313-0000-0000-0000-000000000002', 'Garanti kapsamı',                                    'ShortText',      true,  2),
-- Sözleşme risk
('14141414-0000-0000-0000-000000000008', '13131313-0000-0000-0000-000000000003', 'Sözleşme konusu kritik mi?',                         'YesNo',          true,  0),
('14141414-0000-0000-0000-000000000009', '13131313-0000-0000-0000-000000000003', 'Risk kategorisi',                                    'MultipleChoice', true,  1),
('14141414-0000-0000-0000-00000000000a', '13131313-0000-0000-0000-000000000003', 'Sigorta gerekli mi?',                                'YesNo',          false, 2),
-- Memnuniyet
('14141414-0000-0000-0000-00000000000b', '13131313-0000-0000-0000-000000000004', 'Siparişinizi zamanında aldınız mı?',                 'YesNo',          true,  0),
('14141414-0000-0000-0000-00000000000c', '13131313-0000-0000-0000-000000000004', 'Genel memnuniyet puanı (1-10)',                      'Number',         true,  1);

INSERT INTO questionnaire_question_option (id, questionnaire_question_id, option_text, order_index) VALUES
-- Ödeme vadesi seçenekleri
('15151515-0000-0000-0000-000000000001', '14141414-0000-0000-0000-000000000003', 'Peşin',        0),
('15151515-0000-0000-0000-000000000002', '14141414-0000-0000-0000-000000000003', '30 gün',       1),
('15151515-0000-0000-0000-000000000003', '14141414-0000-0000-0000-000000000003', '60 gün',       2),
('15151515-0000-0000-0000-000000000004', '14141414-0000-0000-0000-000000000003', '90 gün',       3),
-- Risk kategorisi
('15151515-0000-0000-0000-000000000005', '14141414-0000-0000-0000-000000000009', 'Düşük',        0),
('15151515-0000-0000-0000-000000000006', '14141414-0000-0000-0000-000000000009', 'Orta',         1),
('15151515-0000-0000-0000-000000000007', '14141414-0000-0000-0000-000000000009', 'Yüksek',       2),
('15151515-0000-0000-0000-000000000008', '14141414-0000-0000-0000-000000000009', 'Kritik',       3);

-- ---------------------------------------------
-- 19. Teklifler (Offer)
-- ---------------------------------------------
INSERT INTO offer (id, offer_number, offer_type, subject, counterparty_name, counterparty_id, responsible_user_id, valid_until, currency, discount_percentage, subtotal, vat_total, grand_total, notes, status, owner_id, organization_id, created_by, sent_to_counterparty_at) VALUES
('16161616-0000-0000-0000-000000000001', 'OFR-2026-0001', 'Purchase', 'Veri Merkezi Sunucu Teklifi',       'Dell Türkiye',          '55555555-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000003', '2026-06-30', 'TRY', 5.00,  770000.00, 154000.00, 924000.00, 'Dell PowerEdge R750 x2 için indirimli teklif',       'Sent',  '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', '2026-04-10 09:00+03'),
('16161616-0000-0000-0000-000000000002', 'OFR-2026-0002', 'Purchase', 'Cisco Ağ Ekipmanı Teklifi',         'Turkcell Kurumsal',      '55555555-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', '2026-05-31', 'TRY', 0.00,  625000.00, 125000.00, 750000.00, 'Cisco Catalyst 9300 x5 switch teklifi',              'Won',   '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', '2026-03-18 11:30+03'),
('16161616-0000-0000-0000-000000000003', 'OFR-2026-0003', 'Purchase', 'Ofis Mobilya Teklifi',              'İstikbal Mobilya',       '55555555-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000002', '2026-06-15', 'TRY', 8.00,  230000.00,  46000.00, 276000.00, '15 kişilik ofis donanımı — ergonomik koltuk + masa', 'InInternalApproval', '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000002', NULL),
('16161616-0000-0000-0000-000000000004', 'OFR-2026-0004', 'Purchase', 'Q2 Kırtasiye Blok Sipariş Teklifi', 'Kırtasiye Dünyası Ltd.', '55555555-0000-0000-0000-000000000008', '22222222-0000-0000-0000-000000000004', '2026-05-15', 'TRY', 2.00,    9800.00,   1960.00,  11760.00, 'Yıllık kırtasiye kontratı için ön teklif',            'Draft', '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004', NULL),
('16161616-0000-0000-0000-000000000005', 'OFR-2026-0005', 'Purchase', 'Reddedilen HP Sunucu Teklifi',      'HP Türkiye',             '55555555-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000003', '2026-04-10', 'TRY', 0.00,  420000.00,  84000.00, 504000.00, 'Fiyat Dell ile kıyaslandığında yüksek bulundu',      'Rejected','22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', '2026-03-22 10:00+03');

INSERT INTO offer_item (id, offer_id, order_index, product_id, product_name, quantity, unit, unit_price, vat_rate, line_total, line_vat) VALUES
-- Dell sunucu teklifi: 2 sunucu
('17171717-0000-0000-0000-000000000001', '16161616-0000-0000-0000-000000000001', 0, '88888888-0000-0000-0000-000000000006', 'Dell PowerEdge R750',         2, 'Piece', 385000.0000, 'Twenty', 770000.00, 154000.00),
-- Cisco switch teklifi: 5 switch
('17171717-0000-0000-0000-000000000002', '16161616-0000-0000-0000-000000000002', 0, '88888888-0000-0000-0000-000000000009', 'Cisco Catalyst 9300 24P',     5, 'Piece', 125000.0000, 'Twenty', 625000.00, 125000.00),
-- İstikbal mobilya: 15 koltuk + 10 masa
('17171717-0000-0000-0000-000000000003', '16161616-0000-0000-0000-000000000003', 0, '88888888-0000-0000-0000-00000000000c', 'İstikbal Ofis Koltuğu Ergo', 15, 'Piece',   8900.0000, 'Twenty', 133500.00,  26700.00),
('17171717-0000-0000-0000-000000000004', '16161616-0000-0000-0000-000000000003', 1, '88888888-0000-0000-0000-00000000000d', 'Bürosit Çalışma Masası 160cm',10, 'Piece',   6500.0000, 'Twenty',  65000.00,  13000.00),
-- Kırtasiye teklifi: karışık
('17171717-0000-0000-0000-000000000005', '16161616-0000-0000-0000-000000000004', 0, '88888888-0000-0000-0000-000000000010', 'A4 Fotokopi Kağıdı 80gr',    50, 'Package',   160.0000, 'Twenty',   8000.00,   1600.00),
('17171717-0000-0000-0000-000000000006', '16161616-0000-0000-0000-000000000004', 1, '88888888-0000-0000-0000-000000000012', 'Klasör Geniş 8cm',           20, 'Piece',      45.0000, 'Twenty',    900.00,    180.00),
('17171717-0000-0000-0000-000000000007', '16161616-0000-0000-0000-000000000004', 2, '88888888-0000-0000-0000-000000000011', 'Dolma Kalem Seti Premium',    1, 'Piece',     900.0000, 'Twenty',    900.00,    180.00),
-- HP sunucu (rejected)
('17171717-0000-0000-0000-000000000008', '16161616-0000-0000-0000-000000000005', 0, '88888888-0000-0000-0000-000000000007', 'HPE ProLiant DL380 Gen11',    1, 'Piece', 420000.0000, 'Twenty', 420000.00,  84000.00);

INSERT INTO offer_approval_step (id, offer_id, order_index, approver_user_id, role_label, status, actioned_at) VALUES
-- Cisco Won için onay zinciri tamamlandı
('18181818-0000-0000-0000-000000000001', '16161616-0000-0000-0000-000000000002', 0, '22222222-0000-0000-0000-000000000002', 'Satınalma Yöneticisi', 'Approved', '2026-03-19 14:00+03'),
('18181818-0000-0000-0000-000000000002', '16161616-0000-0000-0000-000000000002', 1, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',          'Approved', '2026-03-20 09:30+03'),
-- İstikbal mobilya - iç onayda bekliyor
('18181818-0000-0000-0000-000000000003', '16161616-0000-0000-0000-000000000003', 0, '22222222-0000-0000-0000-000000000002', 'Satınalma Yöneticisi', 'Waiting',  NULL),
('18181818-0000-0000-0000-000000000004', '16161616-0000-0000-0000-000000000003', 1, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',          'NotYet',   NULL),
-- HP rejected
('18181818-0000-0000-0000-000000000005', '16161616-0000-0000-0000-000000000005', 0, '22222222-0000-0000-0000-000000000002', 'Satınalma Yöneticisi', 'Rejected', '2026-03-25 11:00+03');

INSERT INTO offer_form (id, offer_id, questionnaire_id, status, filled_by_user_id, filled_at) VALUES
-- Cisco teklif için teknik form doldurulmuş
('19191919-0000-0000-0000-000000000001', '16161616-0000-0000-0000-000000000002', '13131313-0000-0000-0000-000000000002', 'Completed', '22222222-0000-0000-0000-000000000003', '2026-03-18 10:45+03'),
-- Dell sunucu teklifi için form henüz boş
('19191919-0000-0000-0000-000000000002', '16161616-0000-0000-0000-000000000001', '13131313-0000-0000-0000-000000000002', 'Partial',   '22222222-0000-0000-0000-000000000003', '2026-04-11 09:00+03');

INSERT INTO offer_form_answer (id, offer_form_id, questionnaire_question_id, answer_text, answer_number, answer_date, answer_bool, answer_options) VALUES
-- Cisco form cevapları (tamamlanmış)
('1a1a1a1a-0000-0000-0000-000000000001', '19191919-0000-0000-0000-000000000001', '14141414-0000-0000-0000-000000000005', NULL,              NULL,    NULL, true, NULL),
('1a1a1a1a-0000-0000-0000-000000000002', '19191919-0000-0000-0000-000000000001', '14141414-0000-0000-0000-000000000006', NULL,              14,      NULL, NULL, NULL),
('1a1a1a1a-0000-0000-0000-000000000003', '19191919-0000-0000-0000-000000000001', '14141414-0000-0000-0000-000000000007', '3 yıl donanım garantisi + 2 yıl yazılım desteği', NULL, NULL, NULL, NULL),
-- Dell form (kısmi)
('1a1a1a1a-0000-0000-0000-000000000004', '19191919-0000-0000-0000-000000000002', '14141414-0000-0000-0000-000000000005', NULL,              NULL,    NULL, true, NULL);

-- ---------------------------------------------
-- 20. Sözleşmeler (Contract)
-- ---------------------------------------------
INSERT INTO contract (id, contract_number, subject, type, counterparty_name, counterparty_id, related_offer_id, start_date, end_date, renewal_type, amount, currency, payment_type, responsible_user_id, reminder_days_before, notes, status, owner_id, organization_id, created_by, signed_at) VALUES
('1b1b1b1b-0000-0000-0000-000000000001', 'CNT-2026-0001', 'Turkcell Kurumsal Hat Sözleşmesi',   'Supplier', 'Turkcell Kurumsal',      '55555555-0000-0000-0000-000000000002', NULL,                                   '2026-01-01', '2026-12-31', 'Automatic', 480000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000002', 30, '200 kurumsal hat yıllık toplam', 'Active',               '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000002', '2025-12-15 10:00+03'),
('1b1b1b1b-0000-0000-0000-000000000002', 'CNT-2026-0002', 'Cisco Ağ Ekipmanı ve Bakım',          'It',       'Turkcell Kurumsal',      '55555555-0000-0000-0000-000000000002', '16161616-0000-0000-0000-000000000002', '2026-04-01', '2029-03-31', 'None',      750000.00, 'TRY', 'Onetime',   '22222222-0000-0000-0000-000000000003', 60, '3 yıl kapsamlı bakım dahil',     'Active',               '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', '2026-03-28 14:00+03'),
('1b1b1b1b-0000-0000-0000-000000000003', 'CNT-2026-0003', 'Bürosit Ofis Mobilya Kira Sözleşmesi','Rent',     'Bürosit Ofis Mobilyaları','55555555-0000-0000-0000-000000000007', NULL,                                   '2026-05-01', '2027-04-30', 'Manual',    180000.00, 'TRY', 'Quarterly', '22222222-0000-0000-0000-000000000004', 45, 'Toplantı odası donanımı kiralama','WaitingForSignature',  '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004', NULL),
('1b1b1b1b-0000-0000-0000-000000000004', 'CNT-2026-0004', 'Dell Sunucu Bakım Sözleşmesi Taslağı','It',       'Dell Türkiye',           '55555555-0000-0000-0000-000000000004', '16161616-0000-0000-0000-000000000001', '2026-07-01', '2029-06-30', 'None',      924000.00, 'TRY', 'Yearly',    '22222222-0000-0000-0000-000000000003', 60, 'Sunucu alımı sonrası 3 yıl bakım','Draft',                '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', NULL),
('1b1b1b1b-0000-0000-0000-000000000005', 'CNT-2026-0005', '3M Yıllık İSG Malzeme Sözleşmesi',   'Supplier', '3M Türkiye',             '55555555-0000-0000-0000-000000000009', NULL,                                   '2025-04-01', '2026-03-31', 'Manual',    320000.00, 'TRY', 'Quarterly', '22222222-0000-0000-0000-000000000003', 30, 'Geçen yıl — süresi doldu',        'Expired',              '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', '2025-03-20 11:00+03');

-- İlişkili teklifi güncelle: Cisco Won → Contract'a dönüştü
UPDATE offer SET converted_contract_id = '1b1b1b1b-0000-0000-0000-000000000002' WHERE id = '16161616-0000-0000-0000-000000000002';

INSERT INTO contract_approval_step (id, contract_id, order_index, approver_user_id, role_label, status, actioned_at) VALUES
-- Turkcell sözleşmesi onay zinciri
('1c1c1c1c-0000-0000-0000-000000000001', '1b1b1b1b-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000002', 'Satınalma Yöneticisi', 'Approved', '2025-12-10 09:00+03'),
('1c1c1c1c-0000-0000-0000-000000000002', '1b1b1b1b-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',          'Approved', '2025-12-14 15:00+03'),
-- Cisco sözleşmesi
('1c1c1c1c-0000-0000-0000-000000000003', '1b1b1b1b-0000-0000-0000-000000000002', 0, '22222222-0000-0000-0000-000000000002', 'Satınalma Yöneticisi', 'Approved', '2026-03-26 11:00+03'),
('1c1c1c1c-0000-0000-0000-000000000004', '1b1b1b1b-0000-0000-0000-000000000002', 1, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',          'Approved', '2026-03-27 16:00+03'),
-- Bürosit kira — imza bekliyor
('1c1c1c1c-0000-0000-0000-000000000005', '1b1b1b1b-0000-0000-0000-000000000003', 0, '22222222-0000-0000-0000-000000000002', 'Satınalma Yöneticisi', 'Approved', '2026-04-15 10:00+03'),
('1c1c1c1c-0000-0000-0000-000000000006', '1b1b1b1b-0000-0000-0000-000000000003', 1, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',          'Waiting',  NULL);

INSERT INTO contract_form (id, contract_id, questionnaire_id, status, filled_by_user_id, filled_at) VALUES
('1d1d1d1d-0000-0000-0000-000000000001', '1b1b1b1b-0000-0000-0000-000000000002', '13131313-0000-0000-0000-000000000003', 'Completed', '22222222-0000-0000-0000-000000000003', '2026-03-25 10:00+03'),
('1d1d1d1d-0000-0000-0000-000000000002', '1b1b1b1b-0000-0000-0000-000000000003', '13131313-0000-0000-0000-000000000003', 'Partial',   '22222222-0000-0000-0000-000000000004', '2026-04-14 15:00+03');

INSERT INTO contract_form_answer (id, contract_form_id, questionnaire_question_id, answer_text, answer_number, answer_date, answer_bool, answer_options) VALUES
-- Cisco risk formu cevapları
('1e1e1e1e-0000-0000-0000-000000000001', '1d1d1d1d-0000-0000-0000-000000000001', '14141414-0000-0000-0000-000000000008', NULL, NULL, NULL, true,  NULL),
('1e1e1e1e-0000-0000-0000-000000000002', '1d1d1d1d-0000-0000-0000-000000000001', '14141414-0000-0000-0000-000000000009', NULL, NULL, NULL, NULL,  'Orta'),
('1e1e1e1e-0000-0000-0000-000000000003', '1d1d1d1d-0000-0000-0000-000000000001', '14141414-0000-0000-0000-00000000000a', NULL, NULL, NULL, false, NULL),
-- Bürosit risk formu — kısmi
('1e1e1e1e-0000-0000-0000-000000000004', '1d1d1d1d-0000-0000-0000-000000000002', '14141414-0000-0000-0000-000000000008', NULL, NULL, NULL, false, NULL);

-- ---------------------------------------------
-- 21. E-Dokümanlar (EDocument)
-- ---------------------------------------------
INSERT INTO e_document (id, subject, description, document_type, status, entity_type, entity_id, attachment_url, owner_id, organization_id, created_by, routing_type, routing_person_ids, routing_person_names) VALUES
('1f1f1f1f-0000-0000-0000-000000000001', 'Dell Sunucu Teklifi — Teknik Rapor',   'Teklif kapsamındaki teknik detay raporu',            'TeknikDokuman', 'Approved', 'Offer',    '16161616-0000-0000-0000-000000000001', '/attachments/ofr-2026-0001-teknik.pdf',       '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', 'Person',   '22222222-0000-0000-0000-000000000002,22222222-0000-0000-0000-000000000001', 'Ayşe Yılmaz,CodeLiman Yönetici'),
('1f1f1f1f-0000-0000-0000-000000000002', 'Cisco Ağ Sözleşmesi — Onay Dokümanı',  '3 yıllık bakım sözleşmesi için onay dokümanı',       'Sozlesme',      'Approved', 'Contract', '1b1b1b1b-0000-0000-0000-000000000002', '/attachments/cnt-2026-0002-onay.pdf',         '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', 'Person',   '22222222-0000-0000-0000-000000000001', 'CodeLiman Yönetici'),
('1f1f1f1f-0000-0000-0000-000000000003', 'Bürosit Kira Sözleşmesi — Onay Bekliyor','Toplantı odası mobilya kira sözleşmesi',           'Sozlesme',      'Sent',     'Contract', '1b1b1b1b-0000-0000-0000-000000000003', '/attachments/cnt-2026-0003-taslak.pdf',       '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004', 'Person',   '22222222-0000-0000-0000-000000000002,22222222-0000-0000-0000-000000000001', 'Ayşe Yılmaz,CodeLiman Yönetici'),
('1f1f1f1f-0000-0000-0000-000000000004', 'İstikbal Mobilya Teklifi — İnceleme',  'Teklif için satın alma onay süreci başlatıldı',      'Teklif',        'Sent',     'Offer',    '16161616-0000-0000-0000-000000000003', '/attachments/ofr-2026-0003-inceleme.pdf',     '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000002', 'Person',   '22222222-0000-0000-0000-000000000001', 'CodeLiman Yönetici'),
('1f1f1f1f-0000-0000-0000-000000000005', 'HP Teklif Red Dokümanı',               'Teklif değerlendirme ve red gerekçesi',               'Other',         'Rejected', 'Offer',    '16161616-0000-0000-0000-000000000005', '/attachments/ofr-2026-0005-red.pdf',          '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', NULL,       NULL, NULL);

INSERT INTO e_document_approval (id, e_document_id, user_id, user_name, status, comment, action_date, seen_at) VALUES
-- Dell teknik rapor onay akışı
('20202020-0000-0000-0000-000000000001', '1f1f1f1f-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'Ayşe Yılmaz',         'approved', 'Teknik detaylar uygun, onaylıyorum.',    '2026-04-12 10:30+03', '2026-04-12 09:15+03'),
('20202020-0000-0000-0000-000000000002', '1f1f1f1f-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'CodeLiman Yönetici',  'approved', 'Onay verildi.',                          '2026-04-13 11:00+03', '2026-04-13 10:55+03'),
-- Cisco sözleşme onay
('20202020-0000-0000-0000-000000000003', '1f1f1f1f-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'CodeLiman Yönetici',  'approved', 'Bütçeye uygun.',                          '2026-03-27 16:00+03', '2026-03-27 15:45+03'),
-- Bürosit kira onay beklemede
('20202020-0000-0000-0000-000000000004', '1f1f1f1f-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000002', 'Ayşe Yılmaz',         'approved', 'Şartlar makul.',                          '2026-04-15 10:00+03', '2026-04-15 09:30+03'),
('20202020-0000-0000-0000-000000000005', '1f1f1f1f-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001', 'CodeLiman Yönetici',  'pending',  NULL,                                       NULL,                   '2026-04-16 08:00+03'),
-- İstikbal inceleme
('20202020-0000-0000-0000-000000000006', '1f1f1f1f-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001', 'CodeLiman Yönetici',  'pending',  NULL,                                       NULL,                   NULL);

INSERT INTO e_document_comment (id, e_document_id, user_id, user_name, content, created_at) VALUES
('21212121-0000-0000-0000-000000000001', '1f1f1f1f-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003', 'Mehmet Demir', 'Ek dosyadaki kapasite bilgileri Dell resmi kanalından doğrulandı.', '2026-04-11 14:00+03'),
('21212121-0000-0000-0000-000000000002', '1f1f1f1f-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'Ayşe Yılmaz',  'Fiyat pazarlığı +%5 ek indirim aldık, güncel teklif yüklendi.',      '2026-04-12 09:30+03'),
('21212121-0000-0000-0000-000000000003', '1f1f1f1f-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000004', 'Zeynep Kaya',  'Sözleşme metni hukuk onayından geçti, imza için yüklendi.',         '2026-04-14 16:00+03');

-- ---------------------------------------------
-- 22. Bütçe Kategorileri (Budget Category) — 2 seviyeli
-- ---------------------------------------------
INSERT INTO budget_category (id, name, code, description, parent_category_id, is_active, owner_id, organization_id, created_by, created_at) VALUES
('22232323-0000-0000-0000-000000000001', 'IT & Donanım',         'IT',      'Bilgi teknolojileri, yazılım ve donanım giderleri',  NULL,                                     true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '2026-01-05 09:00:00+03'),
('22232323-0000-0000-0000-000000000002', 'Pazarlama',            'MKT',     'Pazarlama ve reklam giderleri',                       NULL,                                     true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '2026-01-05 09:05:00+03'),
('22232323-0000-0000-0000-000000000003', 'Ofis Giderleri',       'OFC',     'Kırtasiye, sarf ve ofis işletme giderleri',           NULL,                                     true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '2026-01-05 09:10:00+03'),
('22232323-0000-0000-0000-000000000004', 'Eğitim & Gelişim',     'EGT',     'Kurumsal eğitim, sertifika ve konferanslar',          NULL,                                     true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '2026-01-05 09:15:00+03'),
('22232323-0000-0000-0000-000000000005', 'Dijital Pazarlama',    'MKT-DIG', 'Online reklam, SEO ve performans pazarlama',          '22232323-0000-0000-0000-000000000002',   true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '2026-01-05 09:20:00+03');

-- ---------------------------------------------
-- 23. Bütçeler (Budget)
--    B01 Active  (2026 IT Yıllık)         — Block, PR allocations
--    B02 Active  (Pazarlama Q2 2026)      — Warn, manual allocations
--    B03 InInternalApproval (2027 IT)     — Block, onay sürecinde
--    B04 Draft   (Eğitim 2027 Taslak)     — Warn, pre-reservation
--    B05 Depleted (Ofis Kırtasiye Q1)     — Block, tükendi
--    B06 Expired (2025 IT Yıllık)         — geçmiş dönem
--    B07 Active  (Dijital Pazarlama USD)  — Free overflow, USD
-- ---------------------------------------------
INSERT INTO budget (id, name, description, scope_organization_id, budget_category_id,
    period_type, start_date, end_date, total_amount, currency,
    overflow_behavior, reservation_release_point, alert_threshold_percentage, carry_over_enabled,
    responsible_user_id, status, is_active, owner_id, organization_id, created_by, created_at) VALUES
-- B01: 2026 IT Yıllık — Active
('23232323-0000-0000-0000-000000000001', '2026 IT Yıllık Bütçesi',           'BT GMY için 2026 yıllık donanım/yazılım bütçesi',
    '11111111-0000-0000-0000-00000000000b', '22232323-0000-0000-0000-000000000001',
    'Yearly',    '2026-01-01', '2026-12-31', 15000000.00, 'TRY',
    'Block', 'PurchaseOrder', 80, false,
    '22222222-0000-0000-0000-000000000003', 'Active',             true,
    '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', '2026-01-10 10:00:00+03'),

-- B02: Pazarlama Q2 2026 — Active
('23232323-0000-0000-0000-000000000002', 'Pazarlama Q2 2026 Bütçesi',        'Q2 dönemi pazarlama ve reklam giderleri',
    '11111111-0000-0000-0000-000000000010', '22232323-0000-0000-0000-000000000002',
    'Quarterly', '2026-04-01', '2026-06-30',  3000000.00, 'TRY',
    'Warn',  'PurchaseOrder', 80, false,
    '22222222-0000-0000-0000-000000000004', 'Active',             true,
    '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000004', '2026-03-15 14:00:00+03'),

-- B03: 2027 IT Yıllık — InInternalApproval
('23232323-0000-0000-0000-000000000003', '2027 IT Yıllık Bütçesi',           '2027 yılı IT altyapı bütçesi — iç onay sürecinde',
    '11111111-0000-0000-0000-00000000000b', '22232323-0000-0000-0000-000000000001',
    'Yearly',    '2027-01-01', '2027-12-31', 18000000.00, 'TRY',
    'Block', 'PurchaseOrder', 80, false,
    '22222222-0000-0000-0000-000000000003', 'InInternalApproval', true,
    '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', '2026-04-05 11:00:00+03'),

-- B04: Eğitim 2027 Taslak — Draft
('23232323-0000-0000-0000-000000000004', 'Eğitim 2027 Taslak Bütçesi',       'İK eğitim faaliyetleri 2027 taslak bütçesi',
    '11111111-0000-0000-0000-000000000015', '22232323-0000-0000-0000-000000000004',
    'Yearly',    '2027-01-01', '2027-12-31',  1500000.00, 'TRY',
    'Warn',  'PurchaseOrder', 75, false,
    '22222222-0000-0000-0000-000000000005', 'Draft',              true,
    '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000005', '2026-04-18 16:00:00+03'),

-- B05: Ofis Kırtasiye Q1 2026 — Depleted
('23232323-0000-0000-0000-000000000005', 'Ofis Kırtasiye Q1 2026',           'Q1 dönemi kırtasiye ve ofis sarf bütçesi — tükendi',
    '11111111-0000-0000-0000-00000000001a', '22232323-0000-0000-0000-000000000003',
    'Quarterly', '2026-01-01', '2026-03-31',    50000.00, 'TRY',
    'Block', 'PurchaseOrder', 90, false,
    '22222222-0000-0000-0000-000000000004', 'Depleted',           true,
    '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000004', '2026-01-05 09:30:00+03'),

-- B06: 2025 IT Yıllık — Expired
('23232323-0000-0000-0000-000000000006', '2025 IT Yıllık Bütçesi',           '2025 yılı IT bütçesi — süresi doldu',
    '11111111-0000-0000-0000-00000000000b', '22232323-0000-0000-0000-000000000001',
    'Yearly',    '2025-01-01', '2025-12-31', 12000000.00, 'TRY',
    'Block', 'PurchaseOrder', 80, true,
    '22222222-0000-0000-0000-000000000003', 'Expired',            true,
    '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000003', '2025-01-10 10:00:00+03'),

-- B07: Dijital Pazarlama Q2 USD — Active
('23232323-0000-0000-0000-000000000007', 'Dijital Pazarlama Q2 2026 (USD)',  'Global kampanyalar için Q2 dolar bazlı bütçe',
    '11111111-0000-0000-0000-000000000010', '22232323-0000-0000-0000-000000000005',
    'Quarterly', '2026-04-01', '2026-06-30',   100000.00, 'USD',
    'Free',  'PurchaseOrder', 85, false,
    '22222222-0000-0000-0000-000000000004', 'Active',             true,
    '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000004', '2026-04-01 09:00:00+03');

-- ---------------------------------------------
-- 24. Bütçe Onay Adımları (BudgetApprovalStep)
-- ---------------------------------------------
INSERT INTO budget_approval_step (id, budget_id, order_index, approver_user_id, role_label, status, actioned_at, rejection_reason) VALUES
-- B01 — tamamen onaylı
('24242424-0000-0000-0000-000000000101', '23232323-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000003', 'Bütçe Sorumlusu',    'Approved', '2026-01-11 10:00:00+03', NULL),
('24242424-0000-0000-0000-000000000102', '23232323-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000002', 'Birim Müdürü',       'Approved', '2026-01-12 14:30:00+03', NULL),
('24242424-0000-0000-0000-000000000103', '23232323-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', '2026-01-14 09:15:00+03', NULL),
-- B02 — onaylı
('24242424-0000-0000-0000-000000000201', '23232323-0000-0000-0000-000000000002', 0, '22222222-0000-0000-0000-000000000004', 'Bütçe Sorumlusu',    'Approved', '2026-03-16 11:00:00+03', NULL),
('24242424-0000-0000-0000-000000000202', '23232323-0000-0000-0000-000000000002', 1, '22222222-0000-0000-0000-000000000002', 'Birim Müdürü',       'Approved', '2026-03-18 15:00:00+03', NULL),
('24242424-0000-0000-0000-000000000203', '23232323-0000-0000-0000-000000000002', 2, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', '2026-03-20 10:00:00+03', NULL),
-- B03 — InInternalApproval: ilk iki adım onaylı, üçüncü bekliyor
('24242424-0000-0000-0000-000000000301', '23232323-0000-0000-0000-000000000003', 0, '22222222-0000-0000-0000-000000000003', 'Bütçe Sorumlusu',    'Approved', '2026-04-06 09:30:00+03', NULL),
('24242424-0000-0000-0000-000000000302', '23232323-0000-0000-0000-000000000003', 1, '22222222-0000-0000-0000-000000000002', 'Birim Müdürü',       'Approved', '2026-04-10 13:45:00+03', NULL),
('24242424-0000-0000-0000-000000000303', '23232323-0000-0000-0000-000000000003', 2, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Waiting',  NULL,                       NULL),
-- B04 — Draft: tüm adımlar NotYet
('24242424-0000-0000-0000-000000000401', '23232323-0000-0000-0000-000000000004', 0, '22222222-0000-0000-0000-000000000005', 'Bütçe Sorumlusu',    'NotYet',   NULL, NULL),
('24242424-0000-0000-0000-000000000402', '23232323-0000-0000-0000-000000000004', 1, '22222222-0000-0000-0000-000000000002', 'Birim Müdürü',       'NotYet',   NULL, NULL),
('24242424-0000-0000-0000-000000000403', '23232323-0000-0000-0000-000000000004', 2, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'NotYet',   NULL, NULL),
-- B05 — onaylı (dönem içinde kullanıldı)
('24242424-0000-0000-0000-000000000501', '23232323-0000-0000-0000-000000000005', 0, '22222222-0000-0000-0000-000000000004', 'Bütçe Sorumlusu',    'Approved', '2026-01-06 10:00:00+03', NULL),
('24242424-0000-0000-0000-000000000502', '23232323-0000-0000-0000-000000000005', 1, '22222222-0000-0000-0000-000000000002', 'Birim Müdürü',       'Approved', '2026-01-07 11:00:00+03', NULL),
-- B06 — onaylı (geçmiş yıl)
('24242424-0000-0000-0000-000000000601', '23232323-0000-0000-0000-000000000006', 0, '22222222-0000-0000-0000-000000000003', 'Bütçe Sorumlusu',    'Approved', '2025-01-11 09:30:00+03', NULL),
('24242424-0000-0000-0000-000000000602', '23232323-0000-0000-0000-000000000006', 1, '22222222-0000-0000-0000-000000000002', 'Birim Müdürü',       'Approved', '2025-01-13 14:00:00+03', NULL),
('24242424-0000-0000-0000-000000000603', '23232323-0000-0000-0000-000000000006', 2, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', '2025-01-15 10:30:00+03', NULL),
-- B07 — onaylı
('24242424-0000-0000-0000-000000000701', '23232323-0000-0000-0000-000000000007', 0, '22222222-0000-0000-0000-000000000004', 'Bütçe Sorumlusu',    'Approved', '2026-04-02 10:00:00+03', NULL),
('24242424-0000-0000-0000-000000000702', '23232323-0000-0000-0000-000000000007', 1, '22222222-0000-0000-0000-000000000002', 'Birim Müdürü',       'Approved', '2026-04-03 11:30:00+03', NULL);

-- ---------------------------------------------
-- 25. Bütçe Tahsisleri (BudgetAllocation)
--     Mevcut PR/PO'lara referans verir
-- ---------------------------------------------
INSERT INTO budget_allocation (id, budget_id, source_type, source_id, allocated_amount, status, created_at, updated_at) VALUES
-- B01 (2026 IT Yıllık) allocations
('25252525-0000-0000-0000-000000000101', '23232323-0000-0000-0000-000000000001', 'PurchaseRequest', 'PR-2026-0001',  212500.00, 'Used',     '2026-04-05 10:00:00+03', '2026-04-20 09:00:00+03'),
('25252525-0000-0000-0000-000000000102', '23232323-0000-0000-0000-000000000001', 'PurchaseRequest', 'PR-2026-0004',  625000.00, 'Used',     '2026-03-20 11:00:00+03', '2026-03-25 16:00:00+03'),
('25252525-0000-0000-0000-000000000103', '23232323-0000-0000-0000-000000000001', 'PurchaseRequest', 'PR-2026-0002',  795000.00, 'Reserved', '2026-04-02 14:00:00+03', NULL),
('25252525-0000-0000-0000-000000000104', '23232323-0000-0000-0000-000000000001', 'PurchaseRequest', 'PR-2026-0008',  385000.00, 'Cancelled','2026-03-05 09:00:00+03', '2026-03-10 10:00:00+03'),
-- B02 (Pazarlama Q2) allocations — manuel
('25252525-0000-0000-0000-000000000201', '23232323-0000-0000-0000-000000000002', 'Manual',          'MAN-MKT-001',   450000.00, 'Used',     '2026-04-05 09:00:00+03', '2026-04-15 17:00:00+03'),
('25252525-0000-0000-0000-000000000202', '23232323-0000-0000-0000-000000000002', 'Manual',          'MAN-MKT-002',   320000.00, 'Reserved', '2026-04-12 10:00:00+03', NULL),
-- B05 (Ofis Kırtasiye Q1) — tükenmiş senaryo
('25252525-0000-0000-0000-000000000501', '23232323-0000-0000-0000-000000000005', 'PurchaseRequest', 'PR-2026-0005',    9450.00, 'Used',     '2026-04-01 10:00:00+03', '2026-04-10 09:00:00+03'),
('25252525-0000-0000-0000-000000000502', '23232323-0000-0000-0000-000000000005', 'Manual',          'MAN-OFC-001',    28600.00, 'Used',     '2026-02-10 11:00:00+03', '2026-02-28 15:00:00+03'),
('25252525-0000-0000-0000-000000000503', '23232323-0000-0000-0000-000000000005', 'Manual',          'MAN-OFC-002',    11950.00, 'Used',     '2026-03-05 09:00:00+03', '2026-03-25 12:00:00+03'),
-- B06 (2025 IT Expired) — dönem sonu tamamlanmış
('25252525-0000-0000-0000-000000000601', '23232323-0000-0000-0000-000000000006', 'Manual',          'MAN-IT-2025-01', 4500000.00, 'Used',    '2025-03-10 09:00:00+03', '2025-06-30 18:00:00+03'),
('25252525-0000-0000-0000-000000000602', '23232323-0000-0000-0000-000000000006', 'Manual',          'MAN-IT-2025-02', 3800000.00, 'Used',    '2025-07-01 09:00:00+03', '2025-09-30 18:00:00+03'),
('25252525-0000-0000-0000-000000000603', '23232323-0000-0000-0000-000000000006', 'Manual',          'MAN-IT-2025-03', 3450000.00, 'Used',    '2025-10-01 09:00:00+03', '2025-12-30 18:00:00+03'),
-- B07 (Dijital USD) allocations
('25252525-0000-0000-0000-000000000701', '23232323-0000-0000-0000-000000000007', 'Manual',          'MAN-DIG-001',    25000.00,  'Used',    '2026-04-05 10:00:00+03', '2026-04-18 14:00:00+03'),
('25252525-0000-0000-0000-000000000702', '23232323-0000-0000-0000-000000000007', 'Manual',          'MAN-DIG-002',    15000.00,  'Reserved','2026-04-15 11:00:00+03', NULL);

-- ---------------------------------------------
-- 26. Bütçe Hareketleri (BudgetTransaction)
--     Her allocation için ilgili ledger kaydı
-- ---------------------------------------------
INSERT INTO budget_transaction (id, budget_id, transaction_type, amount, source_type, source_id, description, performed_by, performed_at, related_transaction_id) VALUES
-- B01 işlemleri
('26262626-0000-0000-0000-000000000101', '23232323-0000-0000-0000-000000000001', 'Reserve',       212500.00, 'PurchaseRequest', 'PR-2026-0001', 'Yeni personel laptop talebi rezervasyonu',       '22222222-0000-0000-0000-000000000003', '2026-04-05 10:00:00+03', NULL),
('26262626-0000-0000-0000-000000000102', '23232323-0000-0000-0000-000000000001', 'Usage',         212500.00, 'PurchaseRequest', 'PR-2026-0001', 'Laptop talebi kullanıma dönüştü',                '22222222-0000-0000-0000-000000000003', '2026-04-20 09:00:00+03', '26262626-0000-0000-0000-000000000101'),
('26262626-0000-0000-0000-000000000103', '23232323-0000-0000-0000-000000000001', 'Reserve',       625000.00, 'PurchaseRequest', 'PR-2026-0004', 'Ağ altyapı güncelleme rezervasyonu',             '22222222-0000-0000-0000-000000000003', '2026-03-20 11:00:00+03', NULL),
('26262626-0000-0000-0000-000000000104', '23232323-0000-0000-0000-000000000001', 'Usage',         625000.00, 'PurchaseOrder',   'PO-2026-0001', 'Cisco switch PO onayı ile kullanım',             '22222222-0000-0000-0000-000000000003', '2026-03-25 16:00:00+03', '26262626-0000-0000-0000-000000000103'),
('26262626-0000-0000-0000-000000000105', '23232323-0000-0000-0000-000000000001', 'Reserve',       795000.00, 'PurchaseRequest', 'PR-2026-0002', 'Sunucu yenileme rezervasyonu',                   '22222222-0000-0000-0000-000000000004', '2026-04-02 14:00:00+03', NULL),
('26262626-0000-0000-0000-000000000106', '23232323-0000-0000-0000-000000000001', 'Reserve',       385000.00, 'PurchaseRequest', 'PR-2026-0008', 'PR-2026-0008 bütçe aşımı rezervasyonu',          '22222222-0000-0000-0000-000000000004', '2026-03-05 09:00:00+03', NULL),
('26262626-0000-0000-0000-000000000107', '23232323-0000-0000-0000-000000000001', 'ReserveCancel', 385000.00, 'PurchaseRequest', 'PR-2026-0008', 'PR reddedildi, rezervasyon iptal edildi',        '22222222-0000-0000-0000-000000000002', '2026-03-10 10:00:00+03', '26262626-0000-0000-0000-000000000106'),
-- B02 işlemleri
('26262626-0000-0000-0000-000000000201', '23232323-0000-0000-0000-000000000002', 'Reserve',       450000.00, 'Manual',          'MAN-MKT-001',  'Fuar katılım — stand ve organizasyon ön kayıt',  '22222222-0000-0000-0000-000000000004', '2026-04-05 09:00:00+03', NULL),
('26262626-0000-0000-0000-000000000202', '23232323-0000-0000-0000-000000000002', 'Usage',         450000.00, 'Manual',          'MAN-MKT-001',  'Fuar katılımı gerçekleşti',                      '22222222-0000-0000-0000-000000000004', '2026-04-15 17:00:00+03', '26262626-0000-0000-0000-000000000201'),
('26262626-0000-0000-0000-000000000203', '23232323-0000-0000-0000-000000000002', 'Reserve',       320000.00, 'Manual',          'MAN-MKT-002',  'TV reklam kampanyası rezervasyonu',              '22222222-0000-0000-0000-000000000004', '2026-04-12 10:00:00+03', NULL),
-- B05 işlemleri (Depleted)
('26262626-0000-0000-0000-000000000501', '23232323-0000-0000-0000-000000000005', 'Reserve',         9450.00, 'PurchaseRequest', 'PR-2026-0005', 'Q2 kırtasiye talebi rezervasyonu',               '22222222-0000-0000-0000-000000000004', '2026-04-01 10:00:00+03', NULL),
('26262626-0000-0000-0000-000000000502', '23232323-0000-0000-0000-000000000005', 'Usage',           9450.00, 'PurchaseOrder',   'PO-2026-0002', 'Kırtasiye siparişi kullanıma geçti',             '22222222-0000-0000-0000-000000000004', '2026-04-10 09:00:00+03', '26262626-0000-0000-0000-000000000501'),
('26262626-0000-0000-0000-000000000503', '23232323-0000-0000-0000-000000000005', 'Usage',          28600.00, 'Manual',          'MAN-OFC-001',  'Şubat ayı genel ofis sarf kullanımı',            '22222222-0000-0000-0000-000000000004', '2026-02-28 15:00:00+03', NULL),
('26262626-0000-0000-0000-000000000504', '23232323-0000-0000-0000-000000000005', 'Usage',          11950.00, 'Manual',          'MAN-OFC-002',  'Mart ayı ofis sarf kullanımı',                   '22222222-0000-0000-0000-000000000004', '2026-03-25 12:00:00+03', NULL),
-- B06 işlemleri (Expired — geçmiş yıl özetleri)
('26262626-0000-0000-0000-000000000601', '23232323-0000-0000-0000-000000000006', 'Usage',        4500000.00, 'Manual',          'MAN-IT-2025-01','2025 H1 IT donanım kullanımı',                  '22222222-0000-0000-0000-000000000003', '2025-06-30 18:00:00+03', NULL),
('26262626-0000-0000-0000-000000000602', '23232323-0000-0000-0000-000000000006', 'Usage',        3800000.00, 'Manual',          'MAN-IT-2025-02','2025 Q3 IT yazılım lisans kullanımı',           '22222222-0000-0000-0000-000000000003', '2025-09-30 18:00:00+03', NULL),
('26262626-0000-0000-0000-000000000603', '23232323-0000-0000-0000-000000000006', 'Usage',        3450000.00, 'Manual',          'MAN-IT-2025-03','2025 Q4 IT altyapı kullanımı',                  '22222222-0000-0000-0000-000000000003', '2025-12-30 18:00:00+03', NULL),
-- B07 işlemleri (Dijital USD)
('26262626-0000-0000-0000-000000000701', '23232323-0000-0000-0000-000000000007', 'Reserve',        25000.00, 'Manual',          'MAN-DIG-001',  'Google Ads kampanya rezervasyonu',               '22222222-0000-0000-0000-000000000004', '2026-04-05 10:00:00+03', NULL),
('26262626-0000-0000-0000-000000000702', '23232323-0000-0000-0000-000000000007', 'Usage',          25000.00, 'Manual',          'MAN-DIG-001',  'Google Ads kampanyası tamamlandı',               '22222222-0000-0000-0000-000000000004', '2026-04-18 14:00:00+03', '26262626-0000-0000-0000-000000000701'),
('26262626-0000-0000-0000-000000000703', '23232323-0000-0000-0000-000000000007', 'Reserve',        15000.00, 'Manual',          'MAN-DIG-002',  'Meta kampanya rezervasyonu',                     '22222222-0000-0000-0000-000000000004', '2026-04-15 11:00:00+03', NULL);

-- ---------------------------------------------
-- 27. Ek Tedarikçi Havuzu (SupplierSeed)
-- ---------------------------------------------
-- TPH: account_type='Vendor' → Supplier alt sınıfı (status mapping aynı kuralda)
INSERT INTO account (
    id, account_name, account_type, account_status,
    supplier_type, supplier_status,
    industry, annual_revenue, number_of_employees, website, description,
    company_type, company_legal_type, tax_office, vkn, mersis_no,
    is_active, owner_id, organization_id, created_by, created_at
) VALUES
('cccccccc-0000-0000-0000-000000000011', 'Alfa Bilişim A.Ş.',          'Vendor', 'Active',   'Distributor',    'Active',      'Bilişim / Donanım',        85000000, 120, 'https://alfabilisim.com.tr',  'Kurumsal bilişim donanımı distribütörü',         'Tuzel',  'AnonimSirketi', 'Kozyatağı V.D.', '1234567890', '0123456789012345', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000012', 'Beta Yazılım Ltd. Şti.',     'Vendor', 'Active',   'ServiceProvider','Active',      'Yazılım / SaaS',           22000000,  45, 'https://betayazilim.com',     'Kurumsal yazılım ve SaaS çözümleri',             'Tuzel',  'LimitedSirket', 'Maslak V.D.',    '2345678901', '0234567890123456', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000013', 'Gamma Ofis Çözümleri',       'Vendor', 'Active',   'Retailer',       'Active',      'Ofis Malzemeleri',          7500000,  28, 'https://gammaofis.com.tr',    'Kırtasiye, sarf, ofis mobilyası',                'Tuzel',  'LimitedSirket', 'Başakşehir V.D.','3456789012', '0345678901234567', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000014', 'Delta Lojistik ve Kargo',    'Vendor', 'Active',   'ServiceProvider','Active',      'Lojistik',                 45000000, 180, 'https://deltalojistik.com',   'Yurt içi ve yurt dışı kargo',                    'Tuzel',  'AnonimSirketi', 'Ataşehir V.D.',  '4567890123', '0456789012345678', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000015', 'Epsilon Reklam Ajansı',      'Vendor', 'Active',   'ServiceProvider','Active',      'Pazarlama / Reklam',       12000000,  35, 'https://epsilonreklam.com',   'Dijital ve geleneksel reklam ajansı',            'Tuzel',  'LimitedSirket', 'Şişli V.D.',     '5678901234', '0567890123456789', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000016', 'Zeta Endüstri Makina',       'Vendor', 'Active',   'Manufacturer',   'Active',      'Endüstri / İmalat',       160000000, 250, 'https://zetamakina.com.tr',   'Endüstriyel makine üreticisi',                   'Tuzel',  'AnonimSirketi', 'İkitelli V.D.',  '6789012345', '0678901234567890', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000017', 'Eta Temizlik Hizmetleri',    'Vendor', 'Active',   'ServiceProvider','Active',      'Temizlik / Hizmet',         5500000,  90, 'https://etatemizlik.com',     'Kurumsal temizlik ve hijyen',                    'Tuzel',  'LimitedSirket', 'Kadıköy V.D.',   '7890123456', '0789012345678901', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000018', 'Theta Mühendislik A.Ş.',     'Vendor', 'Prospect', 'ServiceProvider','Pending',     'Danışmanlık / Mühendislik',18000000,  60, 'https://thetamuh.com.tr',     'Yapı ve altyapı danışmanlık',                    'Tuzel',  'AnonimSirketi', 'Çankaya V.D.',   '8901234567', '0890123456789012', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000019', 'Iota Seyahat Acentesi',      'Vendor', 'Active',   'ServiceProvider','Active',      'Seyahat / Turizm',          8200000,  22, 'https://iotaseyahat.com',     'Kurumsal seyahat organizasyonu',                 'Tuzel',  'LimitedSirket', 'Beyoğlu V.D.',   '9012345678', '0901234567890123', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000020', 'Kappa Matbaa ve Yayıncılık', 'Vendor', 'Inactive', 'Manufacturer',   'Passive',     'Matbaa / Yayın',            6800000,  40, 'https://kappamatbaa.com.tr',  'Katalog, broşür, etiket baskı',                  'Tuzel',  'LimitedSirket', 'Bakırköy V.D.',  '1123456789', '1123456789012345', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000021', 'Murat Tekin (Freelance)',    'Vendor', 'Active',   'ServiceProvider','Active',      'Grafik Tasarım',                NULL,   1, 'https://murattekin.design',   'Freelance grafik ve UI tasarım',                 'Gercek', NULL,            'Kartal V.D.',     NULL,         NULL,              true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000022', 'Lambda Güvenlik Sistemleri', 'Vendor', 'Active',   'Distributor',    'Active',      'Güvenlik / Teknoloji',     29000000,  75, 'https://lambdaguvenlik.com',  'CCTV, alarm, erişim kontrol',                    'Tuzel',  'AnonimSirketi', 'Levent V.D.',    '1234567801', '1234567801234567', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000023', 'Mu Tıbbi Cihazlar',          'Vendor', 'Prospect', 'Distributor',    'Pending',     'Sağlık / Medikal',         14500000,  38, 'https://mutibbi.com.tr',      'Kurumsal tıbbi cihaz dağıtımı',                  'Tuzel',  'LimitedSirket', 'Üsküdar V.D.',   '2234567801', '2234567801234567', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000024', 'Nu Mühendislik Hızlı Çözüm', 'Vendor', 'Inactive', 'ServiceProvider','Blacklisted', 'Danışmanlık',               3200000,  10, NULL,                          'Önceki projelerde ifa sorunları nedeniyle kara listede', 'Tuzel', 'LimitedSirket', 'Pendik V.D.',    '3234567801', '3234567801234567', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp),
('cccccccc-0000-0000-0000-000000000025', 'Xi Enerji ve Elektrik',      'Vendor', 'Active',   'Manufacturer',   'Active',      'Enerji / Elektrik',       220000000, 310, 'https://xienerji.com.tr',     'Kurumsal enerji çözümleri, UPS, trafo',          'Tuzel',  'AnonimSirketi', 'Tuzla V.D.',     '4234567801', '4234567801234567', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000001a', '22222222-0000-0000-0000-000000000001', current_timestamp)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------
-- 28. Ek Form / Anket Havuzu (FormsSeed — 12 form, 43 soru, 21 seçenek)
-- ---------------------------------------------
INSERT INTO questionnaire (id, name, related_module, status, is_active, owner_id, organization_id, created_by) VALUES
-- Offer formları
('f0000001-0000-0000-0000-000000000001', 'Teklif Ön Değerlendirme',        'Offer',    'Active',  true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
('f0000002-0000-0000-0000-000000000001', 'Teknik Şartname Kontrolü',       'Offer',    'Active',  true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
('f0000003-0000-0000-0000-000000000001', 'Teklif Sonuç Değerlendirme',     'Offer',    'Draft',   true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
-- Contract formları
('f0000004-0000-0000-0000-000000000001', 'Sözleşme Ön Kontrol',            'Contract', 'Active',  true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
('f0000005-0000-0000-0000-000000000001', 'KVKK Uyum Kontrolü',             'Contract', 'Active',  true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
('f0000006-0000-0000-0000-000000000001', 'Sözleşme Fesih Değerlendirme',   'Contract', 'Passive', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
-- Supplier formları
('f0000007-0000-0000-0000-000000000001', 'Tedarikçi Başvuru Formu',        'Supplier', 'Active',  true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
('f0000008-0000-0000-0000-000000000001', 'Tedarikçi Kalite Değerlendirme', 'Supplier', 'Active',  true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
('f0000009-0000-0000-0000-000000000001', 'Tedarikçi KVKK Bilgilendirme',   'Supplier', 'Draft',   true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
-- Order formları
('f000000a-0000-0000-0000-000000000001', 'Sipariş Teslim Alma',            'Order',    'Active',  true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
('f000000b-0000-0000-0000-000000000001', 'Sipariş Memnuniyet',             'Order',    'Active',  true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
('f000000c-0000-0000-0000-000000000001', 'Sipariş İade Formu',             'Order',    'Passive', true, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001');

INSERT INTO questionnaire_question (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('a0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 'Bu talep için bütçe onayı alındı mı?',    'YesNo',          true,  0),
('a0000001-0000-0000-0000-000000000002', 'f0000001-0000-0000-0000-000000000001', 'İhtiyacı kısaca açıklayınız',             'LongText',       true,  1),
('a0000001-0000-0000-0000-000000000003', 'f0000001-0000-0000-0000-000000000001', 'Talep önceliği nedir?',                   'MultipleChoice', true,  2),
('a0000001-0000-0000-0000-000000000004', 'f0000001-0000-0000-0000-000000000001', 'Tahmini tutar (TRY)',                     'Number',         false, 3),
('a0000002-0000-0000-0000-000000000001', 'f0000002-0000-0000-0000-000000000001', 'Ürün kodu / stok kodu',                   'ShortText',      true,  0),
('a0000002-0000-0000-0000-000000000002', 'f0000002-0000-0000-0000-000000000001', 'Teslimat süresi (gün)',                   'Number',         true,  1),
('a0000002-0000-0000-0000-000000000003', 'f0000002-0000-0000-0000-000000000001', 'Beklenen garanti süresi',                 'MultipleChoice', true,  2),
('a0000003-0000-0000-0000-000000000001', 'f0000003-0000-0000-0000-000000000001', 'Kazanan tedarikçi',                       'ShortText',      true,  0),
('a0000003-0000-0000-0000-000000000002', 'f0000003-0000-0000-0000-000000000001', 'Seçim gerekçesi',                         'LongText',       true,  1),
('a0000003-0000-0000-0000-000000000003', 'f0000003-0000-0000-0000-000000000001', 'Karar tarihi',                            'Date',           true,  2),
('a0000004-0000-0000-0000-000000000001', 'f0000004-0000-0000-0000-000000000001', 'Hukuk biriminin onayı alındı mı?',        'YesNo',          true,  0),
('a0000004-0000-0000-0000-000000000002', 'f0000004-0000-0000-0000-000000000001', 'Temel şart ve hükümlerin özeti',          'LongText',       true,  1),
('a0000004-0000-0000-0000-000000000003', 'f0000004-0000-0000-0000-000000000001', 'Sözleşme başlangıç tarihi',               'Date',           true,  2),
('a0000004-0000-0000-0000-000000000004', 'f0000004-0000-0000-0000-000000000001', 'Sözleşme tutarı (TRY)',                   'Number',         false, 3),
('a0000005-0000-0000-0000-000000000001', 'f0000005-0000-0000-0000-000000000001', 'Kişisel veri işleniyor mu?',              'YesNo',          true,  0),
('a0000005-0000-0000-0000-000000000002', 'f0000005-0000-0000-0000-000000000001', 'Veri işleme süresi (ay)',                 'Number',         false, 1),
('a0000005-0000-0000-0000-000000000003', 'f0000005-0000-0000-0000-000000000001', 'İşlenen veri türü',                       'MultipleChoice', true,  2),
('a0000006-0000-0000-0000-000000000001', 'f0000006-0000-0000-0000-000000000001', 'Fesih sebebi',                            'LongText',       true,  0),
('a0000006-0000-0000-0000-000000000002', 'f0000006-0000-0000-0000-000000000001', 'Fesih tarihi',                            'Date',           true,  1),
('a0000006-0000-0000-0000-000000000003', 'f0000006-0000-0000-0000-000000000001', 'Cezai şart tutarı (TRY)',                 'Number',         false, 2),
('a0000007-0000-0000-0000-000000000001', 'f0000007-0000-0000-0000-000000000001', 'Firma ticari unvanı',                     'ShortText',      true,  0),
('a0000007-0000-0000-0000-000000000002', 'f0000007-0000-0000-0000-000000000001', 'Vergi numarası',                          'ShortText',      true,  1),
('a0000007-0000-0000-0000-000000000003', 'f0000007-0000-0000-0000-000000000001', 'Kuruluş yılı',                            'Number',         true,  2),
('a0000007-0000-0000-0000-000000000004', 'f0000007-0000-0000-0000-000000000001', 'Açık adres',                              'LongText',       true,  3),
('a0000007-0000-0000-0000-000000000005', 'f0000007-0000-0000-0000-000000000001', 'Faaliyet alanı',                          'MultipleChoice', true,  4),
('a0000008-0000-0000-0000-000000000001', 'f0000008-0000-0000-0000-000000000001', 'ISO 9001 sertifikası var mı?',            'YesNo',          true,  0),
('a0000008-0000-0000-0000-000000000002', 'f0000008-0000-0000-0000-000000000001', 'Teslimat zamanlılığı puanı (1-10)',       'Number',         true,  1),
('a0000008-0000-0000-0000-000000000003', 'f0000008-0000-0000-0000-000000000001', 'Ürün kalitesi puanı (1-10)',              'Number',         true,  2),
('a0000008-0000-0000-0000-000000000004', 'f0000008-0000-0000-0000-000000000001', 'Genel değerlendirme notları',             'LongText',       false, 3),
('a0000009-0000-0000-0000-000000000001', 'f0000009-0000-0000-0000-000000000001', 'Tedarikçi açık rıza verdi mi?',           'YesNo',          true,  0),
('a0000009-0000-0000-0000-000000000002', 'f0000009-0000-0000-0000-000000000001', 'Bildirim tarihi',                         'Date',           true,  1),
('a0000009-0000-0000-0000-000000000003', 'f0000009-0000-0000-0000-000000000001', 'Ek notlar',                               'LongText',       false, 2),
('a000000a-0000-0000-0000-000000000001', 'f000000a-0000-0000-0000-000000000001', 'Ürünler eksiksiz teslim alındı mı?',      'YesNo',          true,  0),
('a000000a-0000-0000-0000-000000000002', 'f000000a-0000-0000-0000-000000000001', 'Teslim tarihi',                           'Date',           true,  1),
('a000000a-0000-0000-0000-000000000003', 'f000000a-0000-0000-0000-000000000001', 'Teslim alınan miktar',                    'Number',         true,  2),
('a000000a-0000-0000-0000-000000000004', 'f000000a-0000-0000-0000-000000000001', 'Hasar / eksik notu',                      'LongText',       false, 3),
('a000000b-0000-0000-0000-000000000001', 'f000000b-0000-0000-0000-000000000001', 'Siparişten genel olarak memnun musunuz?', 'YesNo',          true,  0),
('a000000b-0000-0000-0000-000000000002', 'f000000b-0000-0000-0000-000000000001', 'Memnuniyet puanı (1-5)',                  'Number',         true,  1),
('a000000b-0000-0000-0000-000000000003', 'f000000b-0000-0000-0000-000000000001', 'Varsa yorum / öneri',                     'LongText',       false, 2),
('a000000c-0000-0000-0000-000000000001', 'f000000c-0000-0000-0000-000000000001', 'İade sebebi',                             'MultipleChoice', true,  0),
('a000000c-0000-0000-0000-000000000002', 'f000000c-0000-0000-0000-000000000001', 'İade edilen miktar',                      'Number',         true,  1),
('a000000c-0000-0000-0000-000000000003', 'f000000c-0000-0000-0000-000000000001', 'İade tarihi',                             'Date',           true,  2),
('a000000c-0000-0000-0000-000000000004', 'f000000c-0000-0000-0000-000000000001', 'Ek açıklama',                             'LongText',       false, 3);

INSERT INTO questionnaire_question_option (questionnaire_question_id, option_text, order_index) VALUES
('a0000001-0000-0000-0000-000000000003', 'Düşük',  0),
('a0000001-0000-0000-0000-000000000003', 'Orta',   1),
('a0000001-0000-0000-0000-000000000003', 'Yüksek', 2),
('a0000001-0000-0000-0000-000000000003', 'Kritik', 3),
('a0000002-0000-0000-0000-000000000003', '1 Yıl', 0),
('a0000002-0000-0000-0000-000000000003', '2 Yıl', 1),
('a0000002-0000-0000-0000-000000000003', '3 Yıl', 2),
('a0000002-0000-0000-0000-000000000003', '5 Yıl', 3),
('a0000005-0000-0000-0000-000000000003', 'Kimlik',   0),
('a0000005-0000-0000-0000-000000000003', 'İletişim', 1),
('a0000005-0000-0000-0000-000000000003', 'Finansal', 2),
('a0000005-0000-0000-0000-000000000003', 'Sağlık',   3),
('a0000005-0000-0000-0000-000000000003', 'Diğer',    4),
('a0000007-0000-0000-0000-000000000005', 'Üretim',   0),
('a0000007-0000-0000-0000-000000000005', 'Hizmet',   1),
('a0000007-0000-0000-0000-000000000005', 'Ticaret',  2),
('a0000007-0000-0000-0000-000000000005', 'Lojistik', 3),
('a000000c-0000-0000-0000-000000000001', 'Hasarlı Ürün',    0),
('a000000c-0000-0000-0000-000000000001', 'Yanlış Ürün',     1),
('a000000c-0000-0000-0000-000000000001', 'Geç Teslimat',    2),
('a000000c-0000-0000-0000-000000000001', 'Kalite Yetersiz', 3),
('a000000c-0000-0000-0000-000000000001', 'Diğer',           4);

-- ---------------------------------------------
-- 29. Ek Sözleşme Havuzu (ContractsSeed — 20 sözleşme, 80 onay adımı)
-- ---------------------------------------------
INSERT INTO contract (id, contract_number, subject, type, counterparty_name,
    start_date, end_date, renewal_type, amount, currency, payment_type,
    responsible_user_id, reminder_days_before, notes, status,
    sent_to_counterparty_at, signed_at,
    owner_id, organization_id, created_by, created_at) VALUES
('c0000001-0000-0000-0000-000000000001', 'SZL-2026-001', 'Microsoft 365 E3 Kurumsal Lisans',           'It',       'Microsoft Türkiye',          '2026-05-15', '2027-05-14', 'Automatic', 180000.00, 'USD', 'Yearly',    '22222222-0000-0000-0000-000000000005', 30, '250 kullanıcı, yıllık yenilemeli',         'Draft',              NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '1 day'),
('c0000002-0000-0000-0000-000000000001', 'SZL-2026-002', 'Oracle Veritabanı Yıllık Destek Anlaşması',  'It',       'Oracle Türkiye',             '2026-06-01', '2027-05-31', 'Manual',    420000.00, 'USD', 'Yearly',    '22222222-0000-0000-0000-000000000005', 45, 'Premium Support, 7/24 SLA',                'InInternalApproval', NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '5 days'),
('c0000003-0000-0000-0000-000000000001', 'SZL-2026-003', 'SAP ERP Bakım ve Destek Sözleşmesi',         'It',       'SAP Türkiye',                '2026-01-01', '2026-12-31', 'Automatic', 650000.00, 'EUR', 'Yearly',    '22222222-0000-0000-0000-000000000003', 60, 'Enterprise Support paketi',                'Active',             now() - INTERVAL '40 days', now() - INTERVAL '35 days', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '60 days'),
('c0000004-0000-0000-0000-000000000001', 'SZL-2026-004', 'Cisco Ağ Cihazları Bakım Sözleşmesi',        'It',       'Cisco Systems',              '2023-06-01', '2025-05-31', 'None',       95000.00, 'USD', 'Yearly',    '22222222-0000-0000-0000-000000000005', 30, 'Süresi biten eski anlaşma',                'Expired',            '2023-05-15 10:00:00+03', '2023-05-20 14:00:00+03', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '2023-04-10 09:00:00+03'),
('c0000005-0000-0000-0000-000000000001', 'SZL-2026-005', 'Kurumsal İngilizce Eğitim Danışmanlığı',    'Personnel','LinguaPro Eğitim Danışmanlık','2026-06-01', '2027-05-31', 'Manual',    280000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000004', 30, 'Aylık 40 saat kurumsal İngilizce',         'Draft',              NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '2 days'),
('c0000006-0000-0000-0000-000000000001', 'SZL-2026-006', 'İş Sağlığı ve Güvenliği Hizmet Anlaşması',  'Personnel','GüvenliSağlık OSGB A.Ş.',    '2026-05-01', '2027-04-30', 'Automatic', 145000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000002', 30, 'İSG uzmanı + işyeri hekimi',               'InInternalApproval', NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '8 days'),
('c0000007-0000-0000-0000-000000000001', 'SZL-2026-007', 'Personel Servisi Ulaşım Hizmeti',            'Personnel','MetroBüs Turizm Ltd.',       '2026-02-01', '2027-01-31', 'Manual',    850000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000002', 30, '3 güzergah × 2 sefer/gün',                 'Active',             now() - INTERVAL '70 days', now() - INTERVAL '65 days', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '90 days'),
('c0000008-0000-0000-0000-000000000001', 'SZL-2026-008', 'Yemek Kartı ve Catering Hizmet Anlaşması',  'Personnel','SofraPlus Catering',         '2026-05-01', '2027-04-30', 'None',     1200000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000004', 30, 'Yüksek fiyat farkı sebebiyle reddedildi',  'Rejected',           NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '12 days'),
('c0000009-0000-0000-0000-000000000001', 'SZL-2026-009', 'Hammadde Alım Çerçeve Sözleşmesi',           'Supplier', 'Demirtaş Metal Sanayi A.Ş.', '2026-06-01', '2027-05-31', 'Manual',   3200000.00, 'TRY', 'Quarterly', '22222222-0000-0000-0000-000000000005', 45, 'Çelik sac çerçeve anlaşması',              'Draft',              NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '3 days'),
('c000000a-0000-0000-0000-000000000001', 'SZL-2026-010', 'Ofis Sarf Malzemeleri Tedarik Anlaşması',   'Supplier', 'OfisDünyası Ltd.',           '2026-05-01', '2027-04-30', 'Automatic',  95000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000003', 30, 'Aylık talep üzerine teslimat',             'InInternalApproval', NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '6 days'),
('c000000b-0000-0000-0000-000000000001', 'SZL-2026-011', 'Temizlik Malzemeleri Yıllık Anlaşma',        'Supplier', 'CleanMax Kimya',             '2026-01-15', '2027-01-14', 'Manual',    180000.00, 'TRY', 'Quarterly', '22222222-0000-0000-0000-000000000005', 30, 'Aktif çerçeve anlaşma',                    'Active',             now() - INTERVAL '90 days', now() - INTERVAL '85 days', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '100 days'),
('c000000c-0000-0000-0000-000000000001', 'SZL-2026-012', 'Kırtasiye ve Baskı Malzemeleri Anlaşması',  'Supplier', 'PrintOfis Baskı A.Ş.',       '2026-05-15', '2027-05-14', 'None',       75000.00, 'TRY', 'Quarterly', '22222222-0000-0000-0000-000000000003', 30, 'Fiyat rekabeti uygun görülmedi',           'Rejected',           NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '10 days'),
('c000000d-0000-0000-0000-000000000001', 'SZL-2026-013', 'Yıllık Bayilik Satış Anlaşması',             'Sales',    'MegaMarket Zincir Mağazaları','2026-06-01', '2027-05-31', 'Automatic',4500000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000002', 45, 'Yıllık hedef bazlı anlaşma',               'Draft',              NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '1 day'),
('c000000e-0000-0000-0000-000000000001', 'SZL-2026-014', 'Toptan Ürün Satış Protokolü',                'Sales',    'Anadolu Dağıtım A.Ş.',       '2026-05-20', '2027-05-19', 'Manual',   2100000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000002', 30, 'Toptan ürün dağıtım kanalı',               'InInternalApproval', NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '9 days'),
('c000000f-0000-0000-0000-000000000001', 'SZL-2026-015', 'Kurumsal Müşteri Satış Sözleşmesi',          'Sales',    'Turkcell İletişim Hiz. A.Ş.','2026-03-01', '2027-02-28', 'Automatic',1850000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000002', 30, 'Kurumsal müşteri kanalı',                  'Active',             now() - INTERVAL '55 days', now() - INTERVAL '50 days', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '70 days'),
('c0000010-0000-0000-0000-000000000001', 'SZL-2026-016', 'Genel Müdürlük Bina Kira Sözleşmesi',        'Rent',     'Levent Gayrimenkul Yatırım', '2026-07-01', '2031-06-30', 'Manual',    450000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000004', 60, '5 yıl, Levent Plaza 12. kat',              'Draft',              NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '4 days'),
('c0000011-0000-0000-0000-000000000001', 'SZL-2026-017', 'Depo ve Lojistik Alanı Kira Anlaşması',      'Rent',     'Tuzla Lojistik Merkezi',     '2026-02-01', '2028-01-31', 'Automatic', 275000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000005', 30, '2000 m² soğuk hava depo',                  'Active',             now() - INTERVAL '80 days', now() - INTERVAL '75 days', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '95 days'),
('c0000012-0000-0000-0000-000000000001', 'SZL-2026-018', 'Kurumsal Araç Kiralama Sözleşmesi',          'Rent',     'AutoRent Filo Kiralama',     '2026-06-01', '2029-05-31', 'Manual',   3800000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000003', 30, '15 araç, 3 yıllık operasyonel kira',       'WaitingForSignature',now() - INTERVAL '7 days', NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '25 days'),
('c0000013-0000-0000-0000-000000000001', 'SZL-2026-019', 'Yönetim Danışmanlığı Hizmet Sözleşmesi',     'Other',    'Stratejik Danışmanlık Ltd.', '2026-06-15', '2026-12-15', 'None',      320000.00, 'TRY', 'Onetime',   '22222222-0000-0000-0000-000000000002', 15, '6 ay organizasyonel gelişim',              'InInternalApproval', NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '11 days'),
('c0000014-0000-0000-0000-000000000001', 'SZL-2026-020', 'Hukuk Müşavirliği Yıllık Anlaşması',         'Other',    'Yıldız Hukuk Bürosu',        '2026-01-01', '2026-12-31', 'Automatic', 240000.00, 'TRY', 'Monthly',   '22222222-0000-0000-0000-000000000001', 30, 'Kurumsal hukuk danışmanlığı',              'Active',             now() - INTERVAL '105 days', now() - INTERVAL '100 days', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '120 days');

INSERT INTO contract_approval_step (id, contract_id, order_index, approver_user_id, role_label, status, actioned_at, rejection_reason) VALUES
('a1000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',      'NotYet', NULL, NULL),
('a1000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'IT Müdürü',    'NotYet', NULL, NULL),
('a1000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'NotYet', NULL, NULL),
('a1000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'NotYet', NULL, NULL),
('a1000002-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',      'Waiting', NULL, NULL),
('a1000002-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'IT Müdürü',    'NotYet',  NULL, NULL),
('a1000002-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'NotYet',  NULL, NULL),
('a1000002-0000-0000-0000-000000000004', 'c0000002-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'NotYet',  NULL, NULL),
('a1000003-0000-0000-0000-000000000001', 'c0000003-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',      'Approved', now() - INTERVAL '55 days', NULL),
('a1000003-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'IT Müdürü',    'Approved', now() - INTERVAL '50 days', NULL),
('a1000003-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'Approved', now() - INTERVAL '45 days', NULL),
('a1000003-0000-0000-0000-000000000004', 'c0000003-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'Approved', now() - INTERVAL '42 days', NULL),
('a1000004-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',      'Approved', '2023-04-15 10:00:00+03', NULL),
('a1000004-0000-0000-0000-000000000002', 'c0000004-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'IT Müdürü',    'Approved', '2023-04-20 11:00:00+03', NULL),
('a1000004-0000-0000-0000-000000000003', 'c0000004-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'Approved', '2023-05-05 14:00:00+03', NULL),
('a1000004-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'Approved', '2023-05-10 16:00:00+03', NULL),
('a1000005-0000-0000-0000-000000000001', 'c0000005-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000004', 'Sorumlu',      'NotYet', NULL, NULL),
('a1000005-0000-0000-0000-000000000002', 'c0000005-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'İK Müdürü',    'NotYet', NULL, NULL),
('a1000005-0000-0000-0000-000000000003', 'c0000005-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000002', 'Mali İşler',   'NotYet', NULL, NULL),
('a1000005-0000-0000-0000-000000000004', 'c0000005-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'NotYet', NULL, NULL),
('a1000006-0000-0000-0000-000000000001', 'c0000006-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000002', 'Sorumlu',      'Approved', now() - INTERVAL '5 days', NULL),
('a1000006-0000-0000-0000-000000000002', 'c0000006-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'İK Müdürü',    'Waiting',  NULL, NULL),
('a1000006-0000-0000-0000-000000000003', 'c0000006-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'NotYet',   NULL, NULL),
('a1000006-0000-0000-0000-000000000004', 'c0000006-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'NotYet',   NULL, NULL),
('a1000007-0000-0000-0000-000000000001', 'c0000007-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000002', 'Sorumlu',      'Approved', now() - INTERVAL '85 days', NULL),
('a1000007-0000-0000-0000-000000000002', 'c0000007-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'İK Müdürü',    'Approved', now() - INTERVAL '80 days', NULL),
('a1000007-0000-0000-0000-000000000003', 'c0000007-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'Approved', now() - INTERVAL '75 days', NULL),
('a1000007-0000-0000-0000-000000000004', 'c0000007-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'Approved', now() - INTERVAL '70 days', NULL),
('a1000008-0000-0000-0000-000000000001', 'c0000008-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000004', 'Sorumlu',      'Approved', now() - INTERVAL '9 days', NULL),
('a1000008-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'İK Müdürü',    'Approved', now() - INTERVAL '7 days', NULL),
('a1000008-0000-0000-0000-000000000003', 'c0000008-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000002', 'Mali İşler',   'Rejected', now() - INTERVAL '4 days', 'Bütçe üzerinde, pazarlık önerisi iletildi'),
('a1000008-0000-0000-0000-000000000004', 'c0000008-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'NotYet',   NULL, NULL),
('a1000009-0000-0000-0000-000000000001', 'c0000009-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',           'NotYet', NULL, NULL),
('a1000009-0000-0000-0000-000000000002', 'c0000009-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü', 'NotYet', NULL, NULL),
('a1000009-0000-0000-0000-000000000003', 'c0000009-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',        'NotYet', NULL, NULL),
('a1000009-0000-0000-0000-000000000004', 'c0000009-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',       'NotYet', NULL, NULL),
('a100000a-0000-0000-0000-000000000001', 'c000000a-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000003', 'Sorumlu',           'Waiting', NULL, NULL),
('a100000a-0000-0000-0000-000000000002', 'c000000a-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000005', 'Satın Alma Müdürü', 'NotYet',  NULL, NULL),
('a100000a-0000-0000-0000-000000000003', 'c000000a-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',        'NotYet',  NULL, NULL),
('a100000a-0000-0000-0000-000000000004', 'c000000a-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',       'NotYet',  NULL, NULL),
('a100000b-0000-0000-0000-000000000001', 'c000000b-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',           'Approved', now() - INTERVAL '98 days', NULL),
('a100000b-0000-0000-0000-000000000002', 'c000000b-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü', 'Approved', now() - INTERVAL '95 days', NULL),
('a100000b-0000-0000-0000-000000000003', 'c000000b-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',        'Approved', now() - INTERVAL '92 days', NULL),
('a100000b-0000-0000-0000-000000000004', 'c000000b-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',       'Approved', now() - INTERVAL '88 days', NULL),
('a100000c-0000-0000-0000-000000000001', 'c000000c-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000003', 'Sorumlu',           'Rejected', now() - INTERVAL '7 days', 'Fiyat teklifi pazar ortalamasının üzerinde'),
('a100000c-0000-0000-0000-000000000002', 'c000000c-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000005', 'Satın Alma Müdürü', 'NotYet',   NULL, NULL),
('a100000c-0000-0000-0000-000000000003', 'c000000c-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',        'NotYet',   NULL, NULL),
('a100000c-0000-0000-0000-000000000004', 'c000000c-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',       'NotYet',   NULL, NULL),
('a100000d-0000-0000-0000-000000000001', 'c000000d-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000002', 'Sorumlu',      'NotYet', NULL, NULL),
('a100000d-0000-0000-0000-000000000002', 'c000000d-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satış Müdürü', 'NotYet', NULL, NULL),
('a100000d-0000-0000-0000-000000000003', 'c000000d-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'NotYet', NULL, NULL),
('a100000d-0000-0000-0000-000000000004', 'c000000d-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'NotYet', NULL, NULL),
('a100000e-0000-0000-0000-000000000001', 'c000000e-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000002', 'Sorumlu',      'Approved', now() - INTERVAL '8 days', NULL),
('a100000e-0000-0000-0000-000000000002', 'c000000e-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satış Müdürü', 'Approved', now() - INTERVAL '5 days', NULL),
('a100000e-0000-0000-0000-000000000003', 'c000000e-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'Waiting',  NULL, NULL),
('a100000e-0000-0000-0000-000000000004', 'c000000e-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'NotYet',   NULL, NULL),
('a100000f-0000-0000-0000-000000000001', 'c000000f-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000002', 'Sorumlu',      'Approved', now() - INTERVAL '67 days', NULL),
('a100000f-0000-0000-0000-000000000002', 'c000000f-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satış Müdürü', 'Approved', now() - INTERVAL '63 days', NULL),
('a100000f-0000-0000-0000-000000000003', 'c000000f-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'Approved', now() - INTERVAL '60 days', NULL),
('a100000f-0000-0000-0000-000000000004', 'c000000f-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'Approved', now() - INTERVAL '56 days', NULL),
('a1000010-0000-0000-0000-000000000001', 'c0000010-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000004', 'Sorumlu',      'NotYet', NULL, NULL),
('a1000010-0000-0000-0000-000000000002', 'c0000010-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'İdari İşler',  'NotYet', NULL, NULL),
('a1000010-0000-0000-0000-000000000003', 'c0000010-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000002', 'Mali İşler',   'NotYet', NULL, NULL),
('a1000010-0000-0000-0000-000000000004', 'c0000010-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'NotYet', NULL, NULL),
('a1000011-0000-0000-0000-000000000001', 'c0000011-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',      'Approved', now() - INTERVAL '92 days', NULL),
('a1000011-0000-0000-0000-000000000002', 'c0000011-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'İdari İşler',  'Approved', now() - INTERVAL '88 days', NULL),
('a1000011-0000-0000-0000-000000000003', 'c0000011-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'Approved', now() - INTERVAL '83 days', NULL),
('a1000011-0000-0000-0000-000000000004', 'c0000011-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'Approved', now() - INTERVAL '78 days', NULL),
('a1000012-0000-0000-0000-000000000001', 'c0000012-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000003', 'Sorumlu',      'Approved', now() - INTERVAL '22 days', NULL),
('a1000012-0000-0000-0000-000000000002', 'c0000012-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000005', 'İdari İşler',  'Approved', now() - INTERVAL '18 days', NULL),
('a1000012-0000-0000-0000-000000000003', 'c0000012-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'Approved', now() - INTERVAL '13 days', NULL),
('a1000012-0000-0000-0000-000000000004', 'c0000012-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'Approved', now() - INTERVAL '9 days',  NULL),
('a1000013-0000-0000-0000-000000000001', 'c0000013-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000002', 'Sorumlu',      'Approved', now() - INTERVAL '9 days', NULL),
('a1000013-0000-0000-0000-000000000002', 'c0000013-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Birim Müdürü', 'Waiting',  NULL, NULL),
('a1000013-0000-0000-0000-000000000003', 'c0000013-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'NotYet',   NULL, NULL),
('a1000013-0000-0000-0000-000000000004', 'c0000013-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',  'NotYet',   NULL, NULL),
('a1000014-0000-0000-0000-000000000001', 'c0000014-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000001', 'Sorumlu',      'Approved', now() - INTERVAL '115 days', NULL),
('a1000014-0000-0000-0000-000000000002', 'c0000014-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Birim Müdürü', 'Approved', now() - INTERVAL '110 days', NULL),
('a1000014-0000-0000-0000-000000000003', 'c0000014-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',   'Approved', now() - INTERVAL '106 days', NULL),
('a1000014-0000-0000-0000-000000000004', 'c0000014-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000005', 'Genel Müdür',  'Approved', now() - INTERVAL '101 days', NULL);

-- ---------------------------------------------
-- 30. Ek Teklif Havuzu (OffersSeed — 20 teklif, 28 kalem, 80 onay adımı, 57 davetli)
-- ---------------------------------------------
INSERT INTO offer (id, offer_number, offer_type, subject, counterparty_name,
    responsible_user_id, valid_from, valid_until, currency,
    discount_percentage, subtotal, vat_total, grand_total,
    notes, status, result_reason, result_reason_category,
    sent_to_counterparty_at, result_marked_at,
    owner_id, organization_id, created_by, created_at) VALUES
('b0000001-0000-0000-0000-000000000001', 'RFQ-2026-001', 'Rfq', '2026 Ofis Sarf Malzemeleri Teklif Talebi', 'Satın Alma Departmanı', '22222222-0000-0000-0000-000000000005', '2026-04-20', '2026-05-20', 'TRY', 0, 0, 0, 0, 'Yıllık ofis sarf ihtiyacı',              'Draft',              NULL, NULL, NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '1 day'),
('b0000002-0000-0000-0000-000000000001', 'RFP-2026-002', 'Rfp', 'Yeni Sunucu Altyapısı Projesi',            'Bilgi İşlem Departmanı','22222222-0000-0000-0000-000000000005', '2026-05-01', '2026-05-31', 'USD', 0, 0, 0, 0, 'Veri merkezi modernizasyonu',            'Draft',              NULL, NULL, NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '2 days'),
('b0000003-0000-0000-0000-000000000001', 'RFI-2026-003', 'Rfi', 'AR-GE Yazılım Lisansları Bilgi Talebi',    'AR-GE Merkezi',         '22222222-0000-0000-0000-000000000005', '2026-04-25', '2026-05-25', 'USD', 0, 0, 0, 0, 'Geliştirme araçları için tedarikçi araştırması', 'InInternalApproval', NULL, NULL, NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '4 days'),
('b0000004-0000-0000-0000-000000000001', 'RFQ-2026-004', 'Rfq', 'Temizlik Malzemeleri Yıllık Alımı',         'İdari İşler',           '22222222-0000-0000-0000-000000000005', '2026-05-01', '2026-05-30', 'TRY', 0, 0, 0, 0, '12 aylık temizlik sarf',                 'InInternalApproval', NULL, NULL, NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '7 days'),
('b0000005-0000-0000-0000-000000000001', 'RFP-2026-005', 'Rfp', 'Kurumsal Eğitim Programı',                  'İnsan Kaynakları',      '22222222-0000-0000-0000-000000000004', '2026-05-15', '2026-06-15', 'TRY', 0, 0, 0, 0, 'Liderlik + yazılım eğitimleri',          'InInternalApproval', NULL, NULL, NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '9 days'),
('b0000006-0000-0000-0000-000000000001', 'RFQ-2026-006', 'Rfq', 'Dizüstü Bilgisayar Alımı (25 adet)',        'Bilgi İşlem Departmanı','22222222-0000-0000-0000-000000000005', '2026-04-10', '2026-05-10', 'USD', 0, 0, 0, 0, 'Mühendislik ekibi için iş istasyonu',    'Sent',               NULL, NULL, now() - INTERVAL '3 days',  NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '15 days'),
('b0000007-0000-0000-0000-000000000001', 'RFQ-2026-007', 'Rfq', 'Ofis Mobilyaları Yenileme',                 'İdari İşler',           '22222222-0000-0000-0000-000000000004', '2026-04-05', '2026-05-05', 'TRY', 0, 0, 0, 0, 'Merkez ofis mobilya yenileme',           'Sent',               NULL, NULL, now() - INTERVAL '8 days',  NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '18 days'),
('b0000008-0000-0000-0000-000000000001', 'RFI-2026-008', 'Rfi', 'Pazar Araştırma Raporu Talebi',             'Pazarlama Müdürlüğü',   '22222222-0000-0000-0000-000000000002', '2026-04-01', '2026-04-30', 'TRY', 0, 0, 0, 0, 'Sektör analizi bilgi talebi',            'Sent',               NULL, NULL, now() - INTERVAL '12 days', NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '20 days'),
('b0000009-0000-0000-0000-000000000001', 'RFP-2026-009', 'Rfp', 'Dijital Dönüşüm Danışmanlığı',              'Genel Müdürlük',        '22222222-0000-0000-0000-000000000001', '2026-03-20', '2026-05-20', 'TRY', 0, 0, 0, 0, '12 aylık dönüşüm programı',              'Sent',               NULL, NULL, now() - INTERVAL '18 days', NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '30 days'),
('b000000a-0000-0000-0000-000000000001', 'RFQ-2026-010', 'Rfq', 'Kargo ve Kurye Hizmet Anlaşması',           'Operasyon',             '22222222-0000-0000-0000-000000000005', '2026-03-25', '2026-04-25', 'TRY', 0, 0, 0, 0, '12 aylık kargo hizmeti',                 'Sent',               NULL, NULL, now() - INTERVAL '22 days', NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '35 days'),
('b000000b-0000-0000-0000-000000000001', 'RFQ-2026-011', 'Rfq', 'VRV Klima Sistemi Alımı',                   'İdari İşler',           '22222222-0000-0000-0000-000000000005', '2026-02-01', '2026-03-01', 'TRY', 0, 0, 0, 0, 'Genel Merkez klima yenileme',            'Won',  'En uygun teklif kabul edildi',     NULL, now() - INTERVAL '70 days', now() - INTERVAL '45 days',  '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '85 days'),
('b000000c-0000-0000-0000-000000000001', 'RFP-2026-012', 'Rfp', 'IoT Üretim Hattı İzleme Projesi',           'Üretim Tesisi',         '22222222-0000-0000-0000-000000000003', '2026-01-15', '2026-02-28', 'EUR', 0, 0, 0, 0, 'Üretim hattı dijitalleşme',              'Won',  'Teknik skor ve fiyat dengesi',     NULL, now() - INTERVAL '90 days', now() - INTERVAL '60 days',  '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '110 days'),
('b000000d-0000-0000-0000-000000000001', 'RFQ-2026-013', 'Rfq', 'Depo Forklift Alımı (3 adet)',              'Lojistik',              '22222222-0000-0000-0000-000000000005', '2026-02-10', '2026-03-10', 'TRY', 0, 0, 0, 0, 'Elektrikli forklift, 2 ton',             'Won',  'Bakım desteği güçlü',              NULL, now() - INTERVAL '55 days', now() - INTERVAL '35 days',  '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '70 days'),
('b000000e-0000-0000-0000-000000000001', 'RFI-2026-014', 'Rfi', 'SDK Entegrasyon Bilgi Talebi',              'Yazılım Geliştirme',    '22222222-0000-0000-0000-000000000005', '2026-02-20', '2026-03-15', 'USD', 0, 0, 0, 0, 'Üçüncü parti SDK seçimi',                'Won',  'En uygun SDK belirlendi',          NULL, now() - INTERVAL '50 days', now() - INTERVAL '28 days',  '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '65 days'),
('b000000f-0000-0000-0000-000000000001', 'RFQ-2026-015', 'Rfq', 'Güvenlik Kamerası Sistemi',                 'İdari İşler',           '22222222-0000-0000-0000-000000000005', '2026-02-25', '2026-03-25', 'TRY', 0, 0, 0, 0, '50 kamera + NVR',                        'Lost', 'Piyasa ortalaması üzerinde fiyat teklifi geldi, bütçe yetersiz', 'price',      now() - INTERVAL '45 days', now() - INTERVAL '20 days', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '60 days'),
('b0000010-0000-0000-0000-000000000001', 'RFP-2026-016', 'Rfp', 'Kurumsal Web Sitesi Yenileme',              'Pazarlama Müdürlüğü',   '22222222-0000-0000-0000-000000000002', '2026-03-01', '2026-04-01', 'TRY', 0, 0, 0, 0, 'Tam responsive + CMS',                   'Lost', 'Teslimat süresi ihtiyacımıza uygun değildi', 'duration',                           now() - INTERVAL '40 days', now() - INTERVAL '18 days', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '55 days'),
('b0000011-0000-0000-0000-000000000001', 'RFQ-2026-017', 'Rfq', 'SAP Entegrasyon Hizmeti',                   'Bilgi İşlem Departmanı','22222222-0000-0000-0000-000000000003', '2026-03-10', '2026-04-10', 'EUR', 0, 0, 0, 0, 'ERP - CRM entegrasyon',                  'Lost', 'Mevcut tedarikçimizden daha iyi teklif geldi, devam kararı', 'competitor',                  now() - INTERVAL '35 days', now() - INTERVAL '15 days', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '50 days'),
('b0000012-0000-0000-0000-000000000001', 'RFQ-2026-018', 'Rfq', 'Karton Kutu Alımı (5000 adet)',              'Lojistik',              '22222222-0000-0000-0000-000000000005', '2026-01-05', '2026-02-05', 'TRY', 0, 0, 0, 0, 'Standart 40x40x40 karton',               'Expired', NULL, NULL, now() - INTERVAL '105 days', NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '115 days'),
('b0000013-0000-0000-0000-000000000001', 'RFP-2026-019', 'Rfp', 'CRM Yazılımı Seçim Projesi',                 'Satış Müdürlüğü',       '22222222-0000-0000-0000-000000000002', '2026-01-15', '2026-03-15', 'USD', 0, 0, 0, 0, 'Bulut tabanlı CRM',                      'Expired', NULL, NULL, now() - INTERVAL '95 days',  NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '105 days'),
('b0000014-0000-0000-0000-000000000001', 'RFI-2026-020', 'Rfi', 'AR-GE İşbirliği Fizibilite Talebi',          'AR-GE Merkezi',         '22222222-0000-0000-0000-000000000005', '2026-04-01', '2026-05-01', 'TRY', 0, 0, 0, 0, 'Üniversite işbirliği araştırması',       'Rejected',NULL, NULL, NULL, NULL, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', now() - INTERVAL '12 days');

INSERT INTO offer_item (id, offer_id, order_index, product_name, quantity, unit, unit_price, vat_rate, line_total, line_vat) VALUES
('e0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 0, 'A4 Fotokopi Kağıdı 80gr',    200,  'Package', 0, 'Twenty', 0, 0),
('e0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 1, 'HP LaserJet Toner Kartuş',    50,  'Piece',   0, 'Twenty', 0, 0),
('e0000002-0000-0000-0000-000000000001', 'b0000002-0000-0000-0000-000000000001', 0, 'Rack Server (2U)',             3,  'Piece',   0, 'Twenty', 0, 0),
('e0000002-0000-0000-0000-000000000002', 'b0000002-0000-0000-0000-000000000001', 1, 'Katman 3 Switch',              5,  'Piece',   0, 'Twenty', 0, 0),
('e0000002-0000-0000-0000-000000000003', 'b0000002-0000-0000-0000-000000000001', 2, 'Güvenlik Duvarı',              2,  'Piece',   0, 'Twenty', 0, 0),
('e0000003-0000-0000-0000-000000000001', 'b0000003-0000-0000-0000-000000000001', 0, 'IDE Lisans (yıllık)',        100,  'Piece',   0, 'Twenty', 0, 0),
('e0000004-0000-0000-0000-000000000001', 'b0000004-0000-0000-0000-000000000001', 0, 'Temizlik Malzeme Paketi',     12,  'Package', 0, 'Twenty', 0, 0),
('e0000005-0000-0000-0000-000000000001', 'b0000005-0000-0000-0000-000000000001', 0, 'Liderlik Eğitimi (saat)',    120,  'Hour',    0, 'Twenty', 0, 0),
('e0000005-0000-0000-0000-000000000002', 'b0000005-0000-0000-0000-000000000001', 1, 'Yazılım Eğitimi (saat)',     160,  'Hour',    0, 'Twenty', 0, 0),
('e0000006-0000-0000-0000-000000000001', 'b0000006-0000-0000-0000-000000000001', 0, 'Laptop i7 16GB 512SSD',       25,  'Piece',   0, 'Twenty', 0, 0),
('e0000007-0000-0000-0000-000000000001', 'b0000007-0000-0000-0000-000000000001', 0, 'Yönetici Çalışma Masası',     40,  'Piece',   0, 'Twenty', 0, 0),
('e0000007-0000-0000-0000-000000000002', 'b0000007-0000-0000-0000-000000000001', 1, 'Ergonomik Ofis Koltuğu',      50,  'Piece',   0, 'Twenty', 0, 0),
('e0000008-0000-0000-0000-000000000001', 'b0000008-0000-0000-0000-000000000001', 0, 'Sektör Analizi Raporu',        1,  'Piece',   0, 'Twenty', 0, 0),
('e0000009-0000-0000-0000-000000000001', 'b0000009-0000-0000-0000-000000000001', 0, 'Proje Danışmanlık (saat)',   300,  'Hour',    0, 'Twenty', 0, 0),
('e000000a-0000-0000-0000-000000000001', 'b000000a-0000-0000-0000-000000000001', 0, 'Aylık Kargo Hizmeti',         12,  'Month',   0, 'Twenty', 0, 0),
('e000000b-0000-0000-0000-000000000001', 'b000000b-0000-0000-0000-000000000001', 0, 'VRV İç Ünite 18000 BTU',      30,  'Piece',   0, 'Twenty', 0, 0),
('e000000b-0000-0000-0000-000000000002', 'b000000b-0000-0000-0000-000000000001', 1, 'VRV Dış Ünite 24HP',           3,  'Piece',   0, 'Twenty', 0, 0),
('e000000c-0000-0000-0000-000000000001', 'b000000c-0000-0000-0000-000000000001', 0, 'IoT Sensör Ünitesi',         100,  'Piece',   0, 'Twenty', 0, 0),
('e000000c-0000-0000-0000-000000000002', 'b000000c-0000-0000-0000-000000000001', 1, 'Merkezi Gateway',              5,  'Piece',   0, 'Twenty', 0, 0),
('e000000d-0000-0000-0000-000000000001', 'b000000d-0000-0000-0000-000000000001', 0, 'Elektrikli Forklift 2 Ton',    3,  'Piece',   0, 'Twenty', 0, 0),
('e000000e-0000-0000-0000-000000000001', 'b000000e-0000-0000-0000-000000000001', 0, 'SDK Lisansı (yıllık)',         1,  'Piece',   0, 'Twenty', 0, 0),
('e000000f-0000-0000-0000-000000000001', 'b000000f-0000-0000-0000-000000000001', 0, 'IP Kamera 4MP',               50,  'Piece',   0, 'Twenty', 0, 0),
('e000000f-0000-0000-0000-000000000002', 'b000000f-0000-0000-0000-000000000001', 1, 'NVR Kayıt Cihazı 64 Kanal',    2,  'Piece',   0, 'Twenty', 0, 0),
('e0000010-0000-0000-0000-000000000001', 'b0000010-0000-0000-0000-000000000001', 0, 'Web Geliştirme Projesi',       1,  'Piece',   0, 'Twenty', 0, 0),
('e0000011-0000-0000-0000-000000000001', 'b0000011-0000-0000-0000-000000000001', 0, 'SAP Entegrasyon (saat)',     200,  'Hour',    0, 'Twenty', 0, 0),
('e0000012-0000-0000-0000-000000000001', 'b0000012-0000-0000-0000-000000000001', 0, 'Karton Kutu 40x40x40',      5000,  'Piece',   0, 'Twenty', 0, 0),
('e0000013-0000-0000-0000-000000000001', 'b0000013-0000-0000-0000-000000000001', 0, 'CRM Lisans + Kurulum',         1,  'Piece',   0, 'Twenty', 0, 0),
('e0000014-0000-0000-0000-000000000001', 'b0000014-0000-0000-0000-000000000001', 0, 'Fizibilite Raporu',            1,  'Piece',   0, 'Twenty', 0, 0);

INSERT INTO offer_approval_step (id, offer_id, order_index, approver_user_id, role_label, status, actioned_at, rejection_reason) VALUES
('b1000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'NotYet', NULL, NULL),
('b1000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'NotYet', NULL, NULL),
('b1000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'NotYet', NULL, NULL),
('b1000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'NotYet', NULL, NULL),
('b1000002-0000-0000-0000-000000000001', 'b0000002-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'NotYet', NULL, NULL),
('b1000002-0000-0000-0000-000000000002', 'b0000002-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'NotYet', NULL, NULL),
('b1000002-0000-0000-0000-000000000003', 'b0000002-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'NotYet', NULL, NULL),
('b1000002-0000-0000-0000-000000000004', 'b0000002-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'NotYet', NULL, NULL),
('b1000003-0000-0000-0000-000000000001', 'b0000003-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'Waiting', NULL, NULL),
('b1000003-0000-0000-0000-000000000002', 'b0000003-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'NotYet',  NULL, NULL),
('b1000003-0000-0000-0000-000000000003', 'b0000003-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'NotYet',  NULL, NULL),
('b1000003-0000-0000-0000-000000000004', 'b0000003-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'NotYet',  NULL, NULL),
('b1000004-0000-0000-0000-000000000001', 'b0000004-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'Approved', now() - INTERVAL '4 days', NULL),
('b1000004-0000-0000-0000-000000000002', 'b0000004-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Waiting',  NULL, NULL),
('b1000004-0000-0000-0000-000000000003', 'b0000004-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'NotYet',   NULL, NULL),
('b1000004-0000-0000-0000-000000000004', 'b0000004-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'NotYet',   NULL, NULL),
('b1000005-0000-0000-0000-000000000001', 'b0000005-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000004', 'Sorumlu',            'Approved', now() - INTERVAL '7 days', NULL),
('b1000005-0000-0000-0000-000000000002', 'b0000005-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '5 days', NULL),
('b1000005-0000-0000-0000-000000000003', 'b0000005-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000002', 'Mali İşler',         'Waiting',  NULL, NULL),
('b1000005-0000-0000-0000-000000000004', 'b0000005-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'NotYet',   NULL, NULL),
('b1000006-0000-0000-0000-000000000001', 'b0000006-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'Approved', now() - INTERVAL '13 days', NULL),
('b1000006-0000-0000-0000-000000000002', 'b0000006-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '10 days', NULL),
('b1000006-0000-0000-0000-000000000003', 'b0000006-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '7 days',  NULL),
('b1000006-0000-0000-0000-000000000004', 'b0000006-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '4 days',  NULL),
('b1000007-0000-0000-0000-000000000001', 'b0000007-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000004', 'Sorumlu',            'Approved', now() - INTERVAL '16 days', NULL),
('b1000007-0000-0000-0000-000000000002', 'b0000007-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '13 days', NULL),
('b1000007-0000-0000-0000-000000000003', 'b0000007-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000002', 'Mali İşler',         'Approved', now() - INTERVAL '11 days', NULL),
('b1000007-0000-0000-0000-000000000004', 'b0000007-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '9 days',  NULL),
('b1000008-0000-0000-0000-000000000001', 'b0000008-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000002', 'Sorumlu',            'Approved', now() - INTERVAL '18 days', NULL),
('b1000008-0000-0000-0000-000000000002', 'b0000008-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '16 days', NULL),
('b1000008-0000-0000-0000-000000000003', 'b0000008-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '14 days', NULL),
('b1000008-0000-0000-0000-000000000004', 'b0000008-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '13 days', NULL),
('b1000009-0000-0000-0000-000000000001', 'b0000009-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000001', 'Sorumlu',            'Approved', now() - INTERVAL '28 days', NULL),
('b1000009-0000-0000-0000-000000000002', 'b0000009-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '25 days', NULL),
('b1000009-0000-0000-0000-000000000003', 'b0000009-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '22 days', NULL),
('b1000009-0000-0000-0000-000000000004', 'b0000009-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000005', 'Genel Müdür',        'Approved', now() - INTERVAL '19 days', NULL),
('b100000a-0000-0000-0000-000000000001', 'b000000a-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'Approved', now() - INTERVAL '33 days', NULL),
('b100000a-0000-0000-0000-000000000002', 'b000000a-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '30 days', NULL),
('b100000a-0000-0000-0000-000000000003', 'b000000a-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '27 days', NULL),
('b100000a-0000-0000-0000-000000000004', 'b000000a-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '23 days', NULL),
('b100000b-0000-0000-0000-000000000001', 'b000000b-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'Approved', now() - INTERVAL '82 days', NULL),
('b100000b-0000-0000-0000-000000000002', 'b000000b-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '78 days', NULL),
('b100000b-0000-0000-0000-000000000003', 'b000000b-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '75 days', NULL),
('b100000b-0000-0000-0000-000000000004', 'b000000b-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '72 days', NULL),
('b100000c-0000-0000-0000-000000000001', 'b000000c-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000003', 'Sorumlu',            'Approved', now() - INTERVAL '107 days', NULL),
('b100000c-0000-0000-0000-000000000002', 'b000000c-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000005', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '103 days', NULL),
('b100000c-0000-0000-0000-000000000003', 'b000000c-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '99 days',  NULL),
('b100000c-0000-0000-0000-000000000004', 'b000000c-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '95 days',  NULL),
('b100000d-0000-0000-0000-000000000001', 'b000000d-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'Approved', now() - INTERVAL '67 days', NULL),
('b100000d-0000-0000-0000-000000000002', 'b000000d-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '63 days', NULL),
('b100000d-0000-0000-0000-000000000003', 'b000000d-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '60 days', NULL),
('b100000d-0000-0000-0000-000000000004', 'b000000d-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '57 days', NULL),
('b100000e-0000-0000-0000-000000000001', 'b000000e-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'Approved', now() - INTERVAL '62 days', NULL),
('b100000e-0000-0000-0000-000000000002', 'b000000e-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '58 days', NULL),
('b100000e-0000-0000-0000-000000000003', 'b000000e-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '55 days', NULL),
('b100000e-0000-0000-0000-000000000004', 'b000000e-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '52 days', NULL),
('b100000f-0000-0000-0000-000000000001', 'b000000f-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'Approved', now() - INTERVAL '57 days', NULL),
('b100000f-0000-0000-0000-000000000002', 'b000000f-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '53 days', NULL),
('b100000f-0000-0000-0000-000000000003', 'b000000f-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '50 days', NULL),
('b100000f-0000-0000-0000-000000000004', 'b000000f-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '47 days', NULL),
('b1000010-0000-0000-0000-000000000001', 'b0000010-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000002', 'Sorumlu',            'Approved', now() - INTERVAL '52 days', NULL),
('b1000010-0000-0000-0000-000000000002', 'b0000010-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '48 days', NULL),
('b1000010-0000-0000-0000-000000000003', 'b0000010-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '45 days', NULL),
('b1000010-0000-0000-0000-000000000004', 'b0000010-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '42 days', NULL),
('b1000011-0000-0000-0000-000000000001', 'b0000011-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000003', 'Sorumlu',            'Approved', now() - INTERVAL '47 days', NULL),
('b1000011-0000-0000-0000-000000000002', 'b0000011-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000005', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '43 days', NULL),
('b1000011-0000-0000-0000-000000000003', 'b0000011-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '40 days', NULL),
('b1000011-0000-0000-0000-000000000004', 'b0000011-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '37 days', NULL),
('b1000012-0000-0000-0000-000000000001', 'b0000012-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'Approved', now() - INTERVAL '112 days', NULL),
('b1000012-0000-0000-0000-000000000002', 'b0000012-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '110 days', NULL),
('b1000012-0000-0000-0000-000000000003', 'b0000012-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '108 days', NULL),
('b1000012-0000-0000-0000-000000000004', 'b0000012-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '106 days', NULL),
('b1000013-0000-0000-0000-000000000001', 'b0000013-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000002', 'Sorumlu',            'Approved', now() - INTERVAL '102 days', NULL),
('b1000013-0000-0000-0000-000000000002', 'b0000013-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '100 days', NULL),
('b1000013-0000-0000-0000-000000000003', 'b0000013-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Approved', now() - INTERVAL '98 days',  NULL),
('b1000013-0000-0000-0000-000000000004', 'b0000013-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'Approved', now() - INTERVAL '96 days',  NULL),
('b1000014-0000-0000-0000-000000000001', 'b0000014-0000-0000-0000-000000000001', 0, '22222222-0000-0000-0000-000000000005', 'Sorumlu',            'Approved', now() - INTERVAL '10 days', NULL),
('b1000014-0000-0000-0000-000000000002', 'b0000014-0000-0000-0000-000000000001', 1, '22222222-0000-0000-0000-000000000003', 'Satın Alma Müdürü',  'Approved', now() - INTERVAL '8 days',  NULL),
('b1000014-0000-0000-0000-000000000003', 'b0000014-0000-0000-0000-000000000001', 2, '22222222-0000-0000-0000-000000000004', 'Mali İşler',         'Rejected', now() - INTERVAL '5 days',  'Fizibilite raporu yetersiz, stratejik öncelik yok'),
('b1000014-0000-0000-0000-000000000004', 'b0000014-0000-0000-0000-000000000001', 3, '22222222-0000-0000-0000-000000000001', 'Genel Müdür',        'NotYet',   NULL, NULL);

-- offer_invitee — davetli tedarikçiler (Draft/InApproval/Rejected → quote NULL)
INSERT INTO offer_invitee (id, offer_id, supplier_name, supplier_email, invited_at, status,
    quote_amount, quote_currency, quote_notes, quoted_at) VALUES
('d0000002-0000-0000-0000-000000000001', 'b0000002-0000-0000-0000-000000000001', 'Dell Technologies Türkiye',  'kurumsal@dell.com.tr',            NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000002-0000-0000-0000-000000000002', 'b0000002-0000-0000-0000-000000000001', 'HP Enterprise Türkiye',      'corp@hpe.com.tr',                 NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000003-0000-0000-0000-000000000001', 'b0000003-0000-0000-0000-000000000001', 'JetBrains',                   'sales@jetbrains.com',            NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000003-0000-0000-0000-000000000002', 'b0000003-0000-0000-0000-000000000001', 'Microsoft Türkiye',           'kurumsal@microsoft.com',         NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000003-0000-0000-0000-000000000003', 'b0000003-0000-0000-0000-000000000001', 'GitHub Enterprise',           'enterprise@github.com',          NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000004-0000-0000-0000-000000000001', 'b0000004-0000-0000-0000-000000000001', 'CleanMax Kimya',              'teklif@cleanmax.com.tr',         NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000004-0000-0000-0000-000000000002', 'b0000004-0000-0000-0000-000000000001', 'TemizHizmet Ltd.',            'info@temizhizmet.com',           NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000005-0000-0000-0000-000000000001', 'b0000005-0000-0000-0000-000000000001', 'LinguaPro Eğitim',            'kurumsal@linguapro.com',         NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000005-0000-0000-0000-000000000002', 'b0000005-0000-0000-0000-000000000001', 'Akademik Danışmanlık',        'info@akademikdanismanlik.com',   NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000005-0000-0000-0000-000000000003', 'b0000005-0000-0000-0000-000000000001', 'Boğaziçi Eğitim Merkezi',     'kurumsal@bogaziciegitim.com',    NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000006-0000-0000-0000-000000000001', 'b0000006-0000-0000-0000-000000000001', 'Lenovo Türkiye',              'kurumsal@lenovo.com.tr',       now() - INTERVAL '3 days',  'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000006-0000-0000-0000-000000000002', 'b0000006-0000-0000-0000-000000000001', 'Dell Technologies Türkiye',   'kurumsal@dell.com.tr',         now() - INTERVAL '3 days',  'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000006-0000-0000-0000-000000000003', 'b0000006-0000-0000-0000-000000000001', 'HP Türkiye',                  'kurumsal@hp.com.tr',           now() - INTERVAL '3 days',  'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000007-0000-0000-0000-000000000001', 'b0000007-0000-0000-0000-000000000001', 'Koleksiyon Ofis Mobilya',     'kurumsal@koleksiyon.com.tr',   now() - INTERVAL '8 days',  'Responded', 385000.00,  'TRY', 'Teklif geçerlilik: 30 gün',                        now() - INTERVAL '3 days'),
('d0000007-0000-0000-0000-000000000002', 'b0000007-0000-0000-0000-000000000001', 'Bürotime',                    'info@burotime.com',            now() - INTERVAL '8 days',  'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000007-0000-0000-0000-000000000003', 'b0000007-0000-0000-0000-000000000001', 'Sidas Ofis Sistemleri',       'info@sidas.com.tr',            now() - INTERVAL '8 days',  'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000008-0000-0000-0000-000000000001', 'b0000008-0000-0000-0000-000000000001', 'Nielsen Türkiye',             'corporate@nielsen.com.tr',     now() - INTERVAL '12 days', 'Responded',  95000.00,  'TRY', 'Rapor 45 iş günü içinde teslim',                   now() - INTERVAL '5 days'),
('d0000008-0000-0000-0000-000000000002', 'b0000008-0000-0000-0000-000000000001', 'Deloitte Türkiye',            'consulting@deloitte.com.tr',   now() - INTERVAL '12 days', 'Responded', 135000.00,  'TRY', 'Premium rapor, 30 gün içinde',                     now() - INTERVAL '4 days'),
('d0000009-0000-0000-0000-000000000001', 'b0000009-0000-0000-0000-000000000001', 'McKinsey & Company',          'proposal@mckinsey.com',        now() - INTERVAL '18 days', 'Responded', 1650000.00, 'TRY', '12 ay danışmanlık',                                now() - INTERVAL '10 days'),
('d0000009-0000-0000-0000-000000000002', 'b0000009-0000-0000-0000-000000000001', 'BCG Türkiye',                 'info@bcg.com.tr',              now() - INTERVAL '18 days', 'Responded', 1480000.00, 'TRY', 'Hibrit model, 10 ay',                              now() - INTERVAL '9 days'),
('d0000009-0000-0000-0000-000000000003', 'b0000009-0000-0000-0000-000000000001', 'PwC Türkiye',                 'proposal@pwc.com.tr',          now() - INTERVAL '18 days', 'Declined',     NULL,       NULL,  'Kapasite yetersizliği nedeniyle katılamıyoruz',    now() - INTERVAL '12 days'),
('d0000009-0000-0000-0000-000000000004', 'b0000009-0000-0000-0000-000000000001', 'Stratejik Danışmanlık Ltd.',  'info@stratejikdanismanlik.com',now() - INTERVAL '18 days', 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d000000a-0000-0000-0000-000000000001', 'b000000a-0000-0000-0000-000000000001', 'Yurtiçi Kargo',               'corporate@yurticikargo.com',   now() - INTERVAL '22 days', 'Responded', 620000.00,  'TRY', 'Günlük 500 gönderi',                               now() - INTERVAL '15 days'),
('d000000a-0000-0000-0000-000000000002', 'b000000a-0000-0000-0000-000000000001', 'MNG Kargo',                   'corporate@mngkargo.com.tr',    now() - INTERVAL '22 days', 'Responded', 590000.00,  'TRY', 'Hızlı teslimat garantili',                         now() - INTERVAL '13 days'),
('d000000a-0000-0000-0000-000000000003', 'b000000a-0000-0000-0000-000000000001', 'Aras Kargo',                  'corp@araskargo.com.tr',        now() - INTERVAL '22 days', 'Responded', 640000.00,  'TRY', 'SLA garantili',                                    now() - INTERVAL '14 days'),
('d000000b-0000-0000-0000-000000000001', 'b000000b-0000-0000-0000-000000000001', 'Daikin Türkiye',              'corporate@daikin.com.tr',      now() - INTERVAL '70 days', 'Won',       560000.00,  'TRY', 'KAZANAN — 2 yıl ücretsiz bakım dahil',             now() - INTERVAL '55 days'),
('d000000b-0000-0000-0000-000000000002', 'b000000b-0000-0000-0000-000000000001', 'Mitsubishi Electric',         'corp@mitsubishi.com.tr',       now() - INTERVAL '70 days', 'Responded', 625000.00,  'TRY', 'Fiyat yüksek kaldı',                               now() - INTERVAL '57 days'),
('d000000b-0000-0000-0000-000000000003', 'b000000b-0000-0000-0000-000000000001', 'LG Türkiye',                  'corp@lg.com.tr',               now() - INTERVAL '70 days', 'Responded', 598000.00,  'TRY', 'Teslim süresi uzun',                               now() - INTERVAL '56 days'),
('d000000c-0000-0000-0000-000000000001', 'b000000c-0000-0000-0000-000000000001', 'Siemens Türkiye',             'corp@siemens.com.tr',          now() - INTERVAL '90 days', 'Won',       285000.00,  'EUR', 'KAZANAN — Teknik puan en yüksek',                  now() - INTERVAL '70 days'),
('d000000c-0000-0000-0000-000000000002', 'b000000c-0000-0000-0000-000000000001', 'Schneider Electric',          'corporate@se.com.tr',          now() - INTERVAL '90 days', 'Responded', 310000.00,  'EUR', 'Fiyat yüksek',                                     now() - INTERVAL '72 days'),
('d000000c-0000-0000-0000-000000000003', 'b000000c-0000-0000-0000-000000000001', 'Rockwell Automation',         'emea@rockwell.com',            now() - INTERVAL '90 days', 'Responded', 340000.00,  'EUR', 'Çok yüksek fiyat',                                 now() - INTERVAL '71 days'),
('d000000c-0000-0000-0000-000000000004', 'b000000c-0000-0000-0000-000000000001', 'Bosch Rexroth',               'corp@boschrexroth.com.tr',     now() - INTERVAL '90 days', 'Declined',     NULL,       NULL,  'Kapasite yetersiz',                                now() - INTERVAL '85 days'),
('d000000d-0000-0000-0000-000000000001', 'b000000d-0000-0000-0000-000000000001', 'Linde Material Handling',     'tr@linde-mh.com',              now() - INTERVAL '55 days', 'Won',       1450000.00, 'TRY', 'KAZANAN — 5 yıl bakım paketi dahil',               now() - INTERVAL '40 days'),
('d000000d-0000-0000-0000-000000000002', 'b000000d-0000-0000-0000-000000000001', 'Toyota Forklift Türkiye',     'corp@toyota-forklift.com.tr',  now() - INTERVAL '55 days', 'Responded', 1530000.00, 'TRY', 'Bakım dahil değil',                                now() - INTERVAL '42 days'),
('d000000d-0000-0000-0000-000000000003', 'b000000d-0000-0000-0000-000000000001', 'Jungheinrich Türkiye',        'info@jungheinrich.com.tr',     now() - INTERVAL '55 days', 'Responded', 1480000.00, 'TRY', 'Yakın teklif ama teslim süresi uzun',              now() - INTERVAL '43 days'),
('d000000e-0000-0000-0000-000000000001', 'b000000e-0000-0000-0000-000000000001', 'Twilio',                      'enterprise@twilio.com',        now() - INTERVAL '50 days', 'Won',        45000.00,  'USD', 'KAZANAN — Dokümanlar ve SLA kabul edildi',         now() - INTERVAL '35 days'),
('d000000e-0000-0000-0000-000000000002', 'b000000e-0000-0000-0000-000000000001', 'Sendbird',                    'enterprise@sendbird.com',      now() - INTERVAL '50 days', 'Responded',  58000.00,  'USD', 'Feature set daha dar',                             now() - INTERVAL '36 days'),
('d000000f-0000-0000-0000-000000000001', 'b000000f-0000-0000-0000-000000000001', 'Hikvision Türkiye',           'corporate@hikvision.com.tr',   now() - INTERVAL '45 days', 'Responded', 540000.00,  'TRY', 'Bütçe üstü',                                       now() - INTERVAL '32 days'),
('d000000f-0000-0000-0000-000000000002', 'b000000f-0000-0000-0000-000000000001', 'Dahua Technology',            'corp@dahuasecurity.com',       now() - INTERVAL '45 days', 'Responded', 495000.00,  'TRY', 'Yine bütçe üstü',                                  now() - INTERVAL '31 days'),
('d000000f-0000-0000-0000-000000000003', 'b000000f-0000-0000-0000-000000000001', 'Axis Communications',         'tr@axis.com',                  now() - INTERVAL '45 days', 'Responded', 610000.00,  'TRY', 'En yüksek fiyat',                                  now() - INTERVAL '30 days'),
('d0000010-0000-0000-0000-000000000001', 'b0000010-0000-0000-0000-000000000001', 'Monitera',                    'info@monitera.com',            now() - INTERVAL '40 days', 'Responded', 380000.00,  'TRY', 'Teslim süresi 6 ay — çok uzun',                    now() - INTERVAL '28 days'),
('d0000010-0000-0000-0000-000000000002', 'b0000010-0000-0000-0000-000000000001', 'Pikselyum Dijital',           'hello@pikselyum.com',          now() - INTERVAL '40 days', 'Responded', 340000.00,  'TRY', '4 ay teslim — yine uygun değil',                   now() - INTERVAL '27 days'),
('d0000010-0000-0000-0000-000000000003', 'b0000010-0000-0000-0000-000000000001', 'Webrazzi Studio',             'studio@webrazzi.com',          now() - INTERVAL '40 days', 'Declined',     NULL,       NULL,  'Kapasite yetersiz',                                now() - INTERVAL '38 days'),
('d0000011-0000-0000-0000-000000000001', 'b0000011-0000-0000-0000-000000000001', 'NTT Data Türkiye',            'corp@nttdata.com.tr',          now() - INTERVAL '35 days', 'Responded', 180000.00,  'EUR', 'Mevcut tedarikçimiz daha iyi teklif sundu',        now() - INTERVAL '24 days'),
('d0000011-0000-0000-0000-000000000002', 'b0000011-0000-0000-0000-000000000001', 'Innova',                      'corporate@innova.com.tr',      now() - INTERVAL '35 days', 'Responded', 165000.00,  'EUR', 'İyi teklif ama anlaşılan mevcut iş ortağı',        now() - INTERVAL '23 days'),
('d0000012-0000-0000-0000-000000000001', 'b0000012-0000-0000-0000-000000000001', 'Karpak Ambalaj',              'satis@karpak.com.tr',          now() - INTERVAL '105 days','Responded', 195000.00,  'TRY', 'Fiyat teklifi geçerliyken karar verilmedi',        now() - INTERVAL '90 days'),
('d0000012-0000-0000-0000-000000000002', 'b0000012-0000-0000-0000-000000000001', 'Ambalaj Sanayii A.Ş.',        'info@ambalajsan.com',          now() - INTERVAL '105 days','NotResponded', NULL,      NULL,  NULL,                                                NULL),
('d0000013-0000-0000-0000-000000000001', 'b0000013-0000-0000-0000-000000000001', 'Salesforce Türkiye',          'enterprise@salesforce.com.tr', now() - INTERVAL '95 days', 'Responded',  85000.00,  'USD', 'Süresi dolduğu için değerlendirilmedi',            now() - INTERVAL '80 days'),
('d0000013-0000-0000-0000-000000000002', 'b0000013-0000-0000-0000-000000000001', 'Microsoft Dynamics',          'dynamics@microsoft.com',       now() - INTERVAL '95 days', 'Responded',  72000.00,  'USD', 'Süresi dolduğu için değerlendirilmedi',            now() - INTERVAL '78 days'),
('d0000013-0000-0000-0000-000000000003', 'b0000013-0000-0000-0000-000000000001', 'HubSpot',                     'enterprise@hubspot.com',       now() - INTERVAL '95 days', 'NotResponded', NULL,      NULL,  NULL,                                                NULL),
('d0000014-0000-0000-0000-000000000001', 'b0000014-0000-0000-0000-000000000001', 'Boğaziçi Üniversitesi AR-GE', 'arge@boun.edu.tr',             NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL),
('d0000014-0000-0000-0000-000000000002', 'b0000014-0000-0000-0000-000000000001', 'İTÜ ARI Teknokent',           'teknokent@itu.edu.tr',         NULL, 'Invited',      NULL,       NULL,  NULL,                                                NULL);

COMMIT;
