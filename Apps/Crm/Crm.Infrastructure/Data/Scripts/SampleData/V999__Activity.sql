-- =============================================
-- CRM SampleData / V999 — Activity (regarding CRM entities)
-- Activity entity Platform.Domain'de yaşar; tablolar Platform.Schema/V002__Activity.sql ile kurulur.
-- Bu script Activity'leri CRM entity'lerine (Account, Contact, Lead, Opportunity) bağlar.
--
-- V999 prefix: tüm CRM SampleData scripts (V001..V004) çalıştıktan SONRA koşar,
-- böylece referans verilen Account/Contact/Lead/Opportunity kayıtları mevcuttur.
--
-- TPT strategy: önce base `activity` satırı, sonra alt-tip tablosuna (email/phone_call/task/appointment).
-- activity_party tablosu polimorfik katılımcılar için (User, Account, Contact, ...).
-- =============================================

-- Fixed UUIDs (activity)
-- ACT_1 = 7a000000-0000-0000-0000-000000000001  (Email      → Account KobiLtd Holding)
-- ACT_2 = 7a000000-0000-0000-0000-000000000002  (PhoneCall  → Account Tekno Holding)
-- ACT_3 = 7a000000-0000-0000-0000-000000000003  (Task       → Opportunity KobiLtd ERP Modülleri)
-- ACT_4 = 7a000000-0000-0000-0000-000000000004  (Appointment→ Opportunity KobiLtd Veri Merkezi)
-- ACT_5 = 7a000000-0000-0000-0000-000000000005  (Task       → Lead Yıldız Tekstil ERP)
-- ACT_6 = 7a000000-0000-0000-0000-000000000006  (Email      → Contact Cem Doğan)

-- ---------------------------------------------
-- activity (base — TPT root)
-- ---------------------------------------------
INSERT INTO activity (id, subject, activity_type, status, priority,
                      start_date, end_date, due_date,
                      regarding_entity_type, regarding_entity_id,
                      owner_id, organization_id,
                      is_active, created_by, created_at)
SELECT t.id::uuid, t.subject, t.atype, t.status, t.priority,
       NULLIF(t.start_date, '')::timestamptz, NULLIF(t.end_date, '')::timestamptz, NULLIF(t.due_date, '')::timestamptz,
       t.regarding_type, t.regarding_id::uuid,
       t.owner_id::uuid, t.org_id::uuid,
       true, '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('7a000000-0000-0000-0000-000000000001', 'KobiLtd Holding — ön satış sunumu maili',     'Email',       'Completed',  'Normal', '2026-05-01 10:00:00+03', '2026-05-01 10:15:00+03', '',                       'Account',     '11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('7a000000-0000-0000-0000-000000000002', 'Tekno Holding bulut göç görüşmesi',           'PhoneCall',   'Completed',  'High',   '2026-05-03 14:00:00+03', '2026-05-03 14:35:00+03', '',                       'Account',     '11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('7a000000-0000-0000-0000-000000000003', 'ERP modülleri için teklif hazırla',           'Task',        'InProgress', 'High',   '',                       '',                       '2026-05-20 17:00:00+03', 'Opportunity', '44444444-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('7a000000-0000-0000-0000-000000000004', 'KobiLtd Veri Merkezi keşif toplantısı',       'Appointment', 'NotStarted', 'Normal', '2026-05-15 09:30:00+03', '2026-05-15 11:00:00+03', '',                       'Opportunity', '44444444-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('7a000000-0000-0000-0000-000000000005', 'Yıldız Tekstil — ilk niteleme araması yap',   'Task',        'NotStarted', 'Normal', '',                       '',                       '2026-05-12 17:00:00+03', 'Lead',        '33333333-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200'),
    ('7a000000-0000-0000-0000-000000000006', 'Cem Doğan — bulut göç önerisi gönder',         'Email',       'Completed',  'Normal', '2026-05-05 11:20:00+03', '2026-05-05 11:25:00+03', '',                       'Contact',     '22222222-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200')
) AS t(id, subject, atype, status, priority, start_date, end_date, due_date, regarding_type, regarding_id, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM activity a WHERE a.id = t.id::uuid);

-- ---------------------------------------------
-- activity_email (subtype) — for Email activities
-- ---------------------------------------------
INSERT INTO activity_email (id, body, is_html, is_sent, is_read, read_date)
SELECT t.id::uuid, t.body, t.is_html, t.is_sent, t.is_read, NULLIF(t.read_date, '')::timestamptz
FROM (VALUES
    ('7a000000-0000-0000-0000-000000000001', '<p>Sayın Selin Öztürk,</p><p>Yeni dönem işbirliği için sunum dosyamızı ekte iletiyoruz.</p><p>Saygılarımızla.</p>', true, true, true,  '2026-05-01 14:00:00+03'),
    ('7a000000-0000-0000-0000-000000000006', '<p>Sayın Cem Bey,</p><p>Bulut göç projesi için detaylı teklif ekte. Geri dönüşünüzü bekliyoruz.</p>',                  true, true, false, '')
) AS t(id, body, is_html, is_sent, is_read, read_date)
WHERE NOT EXISTS (SELECT 1 FROM activity_email ae WHERE ae.id = t.id::uuid);

-- ---------------------------------------------
-- activity_phone_call (subtype)
-- ---------------------------------------------
INSERT INTO activity_phone_call (id, call_direction, call_notes)
SELECT t.id::uuid, t.direction, t.notes
FROM (VALUES
    ('7a000000-0000-0000-0000-000000000002', 'Outgoing', 'Cem Bey ile yapılan görüşmede bulut göç projesi için Q3 başlangıcı netleşti. Demo isteği var.')
) AS t(id, direction, notes)
WHERE NOT EXISTS (SELECT 1 FROM activity_phone_call apc WHERE apc.id = t.id::uuid);

-- ---------------------------------------------
-- activity_task (subtype)
-- ---------------------------------------------
INSERT INTO activity_task (id, task_description, reminder_at, percent_complete)
SELECT t.id::uuid, t.description, NULLIF(t.reminder, '')::timestamptz, t.percent::int
FROM (VALUES
    ('7a000000-0000-0000-0000-000000000003', 'Finans/IK/Satın Alma modülleri için detaylı teklif hazırla; ek lisans maliyetlerini dahil et.', '2026-05-18 09:00:00+03', '60'),
    ('7a000000-0000-0000-0000-000000000005', 'Tolga Kaya ile niteleme görüşmesi yap; bütçe ve karar verici netleşsin.',                     '2026-05-10 09:00:00+03', '0')
) AS t(id, description, reminder, percent)
WHERE NOT EXISTS (SELECT 1 FROM activity_task at WHERE at.id = t.id::uuid);

-- ---------------------------------------------
-- activity_appointment (subtype)
-- ---------------------------------------------
INSERT INTO activity_appointment (id, location, is_online, meeting_url, is_all_day, reminder_minutes_before, is_recurring, meeting_notes)
SELECT t.id::uuid, t.location, t.is_online, NULLIF(t.meeting_url, ''), t.all_day, t.reminder::int, t.recurring, t.notes
FROM (VALUES
    ('7a000000-0000-0000-0000-000000000004', 'KobiLtd Holding Ofisi, Maslak / İstanbul', false, '', false, 60, false, 'Veri merkezi modernizasyonu kapsam görüşmesi — IT ekibi ile')
) AS t(id, location, is_online, meeting_url, all_day, reminder, recurring, notes)
WHERE NOT EXISTS (SELECT 1 FROM activity_appointment aa WHERE aa.id = t.id::uuid);

-- ---------------------------------------------
-- activity_party (katılımcılar — polimorfik)
-- Sender/owner: aktiviteyi yürüten user
-- Recipient: contact/lead/account temsilcisi
-- ---------------------------------------------
INSERT INTO activity_party (id, activity_id, party_type, participant_entity_type, participant_entity_id, name, email, phone_number, sort_order, is_active)
SELECT gen_random_uuid(), t.activity_id::uuid, t.party_type,
       NULLIF(t.entity_type, ''), NULLIF(t.entity_id, '')::uuid,
       NULLIF(t.name, ''), NULLIF(t.email, ''), NULLIF(t.phone, ''),
       t.sort_order::int, true
FROM (VALUES
    -- ACT_1 (Email → Account KobiLtd) Sender: Ayşe; Recipient: Contact Selin
    ('7a000000-0000-0000-0000-000000000001', 'From', 'User',    '00000000-0000-0000-0000-000000000100', '', '', '', '0'),
    ('7a000000-0000-0000-0000-000000000001', 'To',   'Contact', '22222222-0000-0000-0000-000000000002', '', '', '', '1'),
    -- ACT_2 (PhoneCall → Account Tekno) Caller: Mehmet; Recipient: Contact Cem
    ('7a000000-0000-0000-0000-000000000002', 'Caller',    'User',    '00000000-0000-0000-0000-000000000101', '', '', '', '0'),
    ('7a000000-0000-0000-0000-000000000002', 'Recipient', 'Contact', '22222222-0000-0000-0000-000000000003', '', '', '', '1'),
    -- ACT_3 (Task → Opp) Owner: Ayşe (sadece atanmış)
    ('7a000000-0000-0000-0000-000000000003', 'Owner', 'User', '00000000-0000-0000-0000-000000000100', '', '', '', '0'),
    -- ACT_4 (Appointment → Opp) Organizer Mehmet, Attendees: Burak (Contact) + harici Müşteri IT Lead
    ('7a000000-0000-0000-0000-000000000004', 'Organizer', 'User',    '00000000-0000-0000-0000-000000000101', '', '', '', '0'),
    ('7a000000-0000-0000-0000-000000000004', 'Required',  'Contact', '22222222-0000-0000-0000-000000000001', '', '', '', '1'),
    ('7a000000-0000-0000-0000-000000000004', 'Optional',  '',        '',                                       'Engin Yıldız (KobiLtd IT)', 'engin.yildiz@kobiltd.com', '+90 532 999 1234', '2'),
    -- ACT_5 (Task → Lead) Owner: Mehmet
    ('7a000000-0000-0000-0000-000000000005', 'Owner', 'User', '00000000-0000-0000-0000-000000000101', '', '', '', '0'),
    -- ACT_6 (Email → Contact Cem) From Mehmet, To Contact Cem (Tekno IT Director)
    ('7a000000-0000-0000-0000-000000000006', 'From', 'User',    '00000000-0000-0000-0000-000000000101', '', '', '', '0'),
    ('7a000000-0000-0000-0000-000000000006', 'To',   'Contact', '22222222-0000-0000-0000-000000000003', '', '', '', '1')
) AS t(activity_id, party_type, entity_type, entity_id, name, email, phone, sort_order)
WHERE NOT EXISTS (
    SELECT 1 FROM activity_party ap
    WHERE ap.activity_id = t.activity_id::uuid
      AND ap.party_type = t.party_type
      AND ap.sort_order = t.sort_order::int
);
