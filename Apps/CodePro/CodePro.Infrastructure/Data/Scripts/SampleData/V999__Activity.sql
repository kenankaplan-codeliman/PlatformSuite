-- =============================================
-- CodePro SampleData / V999 — Activity (regarding CodePro entities)
-- Activity entity Platform.Domain'de yaşar; tablolar Platform.Schema/V002__Activity.sql ile kurulur.
-- Bu script Activity'leri CodePro entity'lerine (Supplier, PurchaseOrder, Contract, Offer, Budget)
-- bağlar.
--
-- V999 prefix: tüm CodePro SampleData scripts (V001..V015) çalıştıktan SONRA koşar,
-- böylece referans verilen Supplier/PO/Contract/Offer/Budget kayıtları mevcuttur.
--
-- TPT strategy: önce base `activity` satırı, sonra alt-tip tablosuna (email/phone_call/task/appointment).
-- activity_party tablosu polimorfik katılımcılar için (User, Supplier, ...).
-- =============================================

-- Fixed UUIDs (activity)
-- ACT_1 = 7c000000-0000-0000-0000-000000000001  (Email      → Supplier BilgeTek — RFQ iletişimi)
-- ACT_2 = 7c000000-0000-0000-0000-000000000002  (PhoneCall  → Supplier Çelik Endüstri — onboarding)
-- ACT_3 = 7c000000-0000-0000-0000-000000000003  (Task       → Offer RFQ-2026-0001 değerlendirme)
-- ACT_4 = 7c000000-0000-0000-0000-000000000004  (Appointment→ Contract Kira sözleşme imza)
-- ACT_5 = 7c000000-0000-0000-0000-000000000005  (Task       → PurchaseOrder Anadolu mobilya takip)
-- ACT_6 = 7c000000-0000-0000-0000-000000000006  (Email      → Budget BT 2026 yıllık — onay yazışması)

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
    ('7c000000-0000-0000-0000-000000000001', 'BilgeTek — RFQ-2026-0001 iletişim',           'Email',       'Completed',  'High',   '2026-05-02 09:00:00+03', '2026-05-02 09:10:00+03', '',                       'Supplier',      '51111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('7c000000-0000-0000-0000-000000000002', 'Çelik Endüstri — onboarding görüşmesi',       'PhoneCall',   'Completed',  'Normal', '2026-05-04 11:00:00+03', '2026-05-04 11:25:00+03', '',                       'Supplier',      '51111111-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('7c000000-0000-0000-0000-000000000003', 'RFQ teklif değerlendirmesini tamamla',         'Task',        'InProgress', 'High',   '',                       '',                       '2026-05-22 17:00:00+03', 'Offer',         '66666666-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201'),
    ('7c000000-0000-0000-0000-000000000004', 'Levent kira sözleşmesi — imza randevusu',     'Appointment', 'NotStarted', 'High',   '2026-05-25 14:00:00+03', '2026-05-25 15:30:00+03', '',                       'Contract',      '65555555-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200'),
    ('7c000000-0000-0000-0000-000000000005', 'Anadolu mobilya teslimat takibi',              'Task',        'NotStarted', 'Normal', '',                       '',                       '2026-05-18 17:00:00+03', 'PurchaseOrder', '63333333-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000201'),
    ('7c000000-0000-0000-0000-000000000006', 'BT 2026 yıllık bütçe — yönetim onay yazısı',  'Email',       'Completed',  'Normal', '2026-04-15 16:00:00+03', '2026-04-15 16:05:00+03', '',                       'Budget',        '67777777-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201')
) AS t(id, subject, atype, status, priority, start_date, end_date, due_date, regarding_type, regarding_id, owner_id, org_id)
WHERE NOT EXISTS (SELECT 1 FROM activity a WHERE a.id = t.id::uuid);

-- ---------------------------------------------
-- activity_email (subtype)
-- ---------------------------------------------
INSERT INTO activity_email (id, body, is_html, is_sent, is_read, read_date)
SELECT t.id::uuid, t.body, t.is_html, t.is_sent, t.is_read, NULLIF(t.read_date, '')::timestamptz
FROM (VALUES
    ('7c000000-0000-0000-0000-000000000001', '<p>Sayın Hakan Bey,</p><p>RFQ-2026-0001 kapsamında 3 adet 1U sunucu için teklifinizi iletmenizi rica ederiz. Detay teknik şartname ekte yer almaktadır.</p>', true, true, true, '2026-05-02 11:00:00+03'),
    ('7c000000-0000-0000-0000-000000000006', '<p>BT 2026 yıllık bütçesi yönetim onayına sunulmuştur. Onay sonrası rezervasyonlar aktif hale getirilecektir.</p>', true, true, true, '2026-04-15 17:30:00+03')
) AS t(id, body, is_html, is_sent, is_read, read_date)
WHERE NOT EXISTS (SELECT 1 FROM activity_email ae WHERE ae.id = t.id::uuid);

-- ---------------------------------------------
-- activity_phone_call (subtype)
-- ---------------------------------------------
INSERT INTO activity_phone_call (id, call_direction, call_notes)
SELECT t.id::uuid, t.direction, t.notes
FROM (VALUES
    ('7c000000-0000-0000-0000-000000000002', 'Outgoing', 'Ayhan Bey ile tedarikçi statüsü onboarding görüşmesi yapıldı. ISO belgesi haftaya iletilecek; vade 30 gün netleşti.')
) AS t(id, direction, notes)
WHERE NOT EXISTS (SELECT 1 FROM activity_phone_call apc WHERE apc.id = t.id::uuid);

-- ---------------------------------------------
-- activity_task (subtype)
-- ---------------------------------------------
INSERT INTO activity_task (id, task_description, reminder_at, percent_complete)
SELECT t.id::uuid, t.description, NULLIF(t.reminder, '')::timestamptz, t.percent::int
FROM (VALUES
    ('7c000000-0000-0000-0000-000000000003', 'BilgeTek ve Çelik Endüstri tekliflerini karşılaştır; toplam maliyet ve teslim süresi açısından analiz hazırla.', '2026-05-20 09:00:00+03', '40'),
    ('7c000000-0000-0000-0000-000000000005', 'Anadolu Mobilya ile teslimat tarihini doğrula; ilgili lojistik koordinasyonu yap.',                              '2026-05-15 09:00:00+03', '0')
) AS t(id, description, reminder, percent)
WHERE NOT EXISTS (SELECT 1 FROM activity_task at WHERE at.id = t.id::uuid);

-- ---------------------------------------------
-- activity_appointment (subtype)
-- ---------------------------------------------
INSERT INTO activity_appointment (id, location, is_online, meeting_url, is_all_day, reminder_minutes_before, is_recurring, meeting_notes)
SELECT t.id::uuid, t.location, t.is_online, NULLIF(t.meeting_url, ''), t.all_day, t.reminder::int, t.recurring, t.notes
FROM (VALUES
    ('7c000000-0000-0000-0000-000000000004', 'Levent Gayrimenkul A.Ş. Ofisi, Levent / İstanbul', false, '', false, 120, false, 'Ofis kira sözleşmesi imza ve anahtar teslim toplantısı')
) AS t(id, location, is_online, meeting_url, all_day, reminder, recurring, notes)
WHERE NOT EXISTS (SELECT 1 FROM activity_appointment aa WHERE aa.id = t.id::uuid);

-- ---------------------------------------------
-- activity_party (polimorfik katılımcılar)
-- ---------------------------------------------
INSERT INTO activity_party (id, activity_id, party_type, participant_entity_type, participant_entity_id, name, email, phone_number, sort_order, is_active)
SELECT gen_random_uuid(), t.activity_id::uuid, t.party_type,
       NULLIF(t.entity_type, ''), NULLIF(t.entity_id, '')::uuid,
       NULLIF(t.name, ''), NULLIF(t.email, ''), NULLIF(t.phone, ''),
       t.sort_order::int, true
FROM (VALUES
    -- ACT_1 (Email → Supplier BilgeTek)
    ('7c000000-0000-0000-0000-000000000001', 'From', 'User',     '00000000-0000-0000-0000-000000000102', '', '', '', '0'),
    ('7c000000-0000-0000-0000-000000000001', 'To',   'Supplier', '51111111-0000-0000-0000-000000000001', 'Hakan Çetin', 'hakan@bilgetek.com.tr', '+90 212 333 0001', '1'),
    -- ACT_2 (PhoneCall → Supplier Çelik)
    ('7c000000-0000-0000-0000-000000000002', 'Caller',    'User',     '00000000-0000-0000-0000-000000000102', '', '', '', '0'),
    ('7c000000-0000-0000-0000-000000000002', 'Recipient', 'Supplier', '51111111-0000-0000-0000-000000000004', 'Ayhan Polat', 'ayhan@celikend.com.tr', '+90 262 333 0004', '1'),
    -- ACT_3 (Task → Offer) Owner Zeynep
    ('7c000000-0000-0000-0000-000000000003', 'Owner', 'User', '00000000-0000-0000-0000-000000000102', '', '', '', '0'),
    -- ACT_4 (Appointment → Contract Kira)
    ('7c000000-0000-0000-0000-000000000004', 'Organizer', 'User', '00000000-0000-0000-0000-000000000100', '', '', '', '0'),
    ('7c000000-0000-0000-0000-000000000004', 'Required',  '',     '',                                       'Levent Gayrimenkul yetkilisi', 'kira@leventgmenkul.com.tr', '+90 212 444 7000', '1'),
    -- ACT_5 (Task → PO Anadolu)
    ('7c000000-0000-0000-0000-000000000005', 'Owner', 'User',     '00000000-0000-0000-0000-000000000103', '', '', '', '0'),
    ('7c000000-0000-0000-0000-000000000005', 'To',    'Supplier', '51111111-0000-0000-0000-000000000002', 'Yasemin Akın', 'yasemin@anadolumobilya.com', '+90 312 333 0002', '1'),
    -- ACT_6 (Email → Budget) From Zeynep, To Admin
    ('7c000000-0000-0000-0000-000000000006', 'From', 'User', '00000000-0000-0000-0000-000000000102', '', '', '', '0'),
    ('7c000000-0000-0000-0000-000000000006', 'To',   'User', '00000000-0000-0000-0000-000000000020', '', '', '', '1')
) AS t(activity_id, party_type, entity_type, entity_id, name, email, phone, sort_order)
WHERE NOT EXISTS (
    SELECT 1 FROM activity_party ap
    WHERE ap.activity_id = t.activity_id::uuid
      AND ap.party_type = t.party_type
      AND ap.sort_order = t.sort_order::int
);
