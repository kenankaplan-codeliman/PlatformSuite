-- =============================================
-- Patch: Supplier.* privilege'larını Account.* + Contact.* ile değiştir
-- Supplier artık Platform Account TPH alt sınıfı (AccountType=Vendor);
-- API tarafı AccountController + AccountPrivilegeCodes kullanıyor, fakat
-- 15-SampleData.sql ilk seed'inde Supplier.* kayıtlıydı. Mevcut DB'yi
-- nuke etmeden senkronize etmek için bu patch'i çalıştır:
--
--   docker exec -i codepro-db psql -U $POSTGRES_USER -d codepro_db \
--     < Apps/CodePro/CodePro.Database/patches/2026-04-30-supplier-to-account-privileges.sql
--
-- Idempotent: tekrar çalıştırılırsa hata vermez.
-- =============================================

BEGIN;

-- 1) app_privilege: Account.* ve Contact.* girişlerini ekle (varsa atla)
INSERT INTO app_privilege (privilege_code, privilege_name, description, created_by)
SELECT v.code, v.name, '', '22222222-0000-0000-0000-000000000001'
FROM (VALUES
    ('Account.Read',   'Firma Görüntüleme'),
    ('Account.Create', 'Firma Oluşturma'),
    ('Account.Update', 'Firma Güncelleme'),
    ('Account.Delete', 'Firma Silme'),
    ('Account.Assign', 'Firma Atama'),
    ('Account.State',  'Firma Durum Değiştir'),
    ('Contact.Read',   'Kişi Görüntüleme'),
    ('Contact.Create', 'Kişi Oluşturma'),
    ('Contact.Update', 'Kişi Güncelleme'),
    ('Contact.Delete', 'Kişi Silme'),
    ('Contact.Assign', 'Kişi Atama'),
    ('Contact.State',  'Kişi Durum Değiştir')
) AS v(code, name)
WHERE NOT EXISTS (
    SELECT 1 FROM app_privilege p WHERE p.privilege_code = v.code
);

-- 2) Supplier.* satır eşleşmelerini Account.* olarak yeniden ata.
--    Aynı (role_id, Account.*) zaten varsa Supplier satırını sil.
WITH mapping AS (
    SELECT 'Supplier.Read'   AS old_code, 'Account.Read'   AS new_code
    UNION ALL SELECT 'Supplier.Create', 'Account.Create'
    UNION ALL SELECT 'Supplier.Update', 'Account.Update'
    UNION ALL SELECT 'Supplier.Delete', 'Account.Delete'
    UNION ALL SELECT 'Supplier.Assign', 'Account.Assign'
    UNION ALL SELECT 'Supplier.State',  'Account.State'
),
to_update AS (
    SELECT rp.id, m.new_code
    FROM app_role_privilege rp
    JOIN mapping m ON rp.privilege_code = m.old_code
    WHERE NOT EXISTS (
        SELECT 1 FROM app_role_privilege rp2
        WHERE rp2.role_id = rp.role_id
          AND rp2.privilege_code = m.new_code
    )
)
UPDATE app_role_privilege
SET privilege_code = to_update.new_code
FROM to_update
WHERE app_role_privilege.id = to_update.id;

DELETE FROM app_role_privilege
WHERE privilege_code LIKE 'Supplier.%';

-- 3) Admin rolü için yeni privilege'ları (Account.*, Contact.* ve henüz
--    atanmamış başka her şey) 'All' seviyesinde ekle.
INSERT INTO app_role_privilege (role_id, privilege_code, access_level)
SELECT '33333333-0000-0000-0000-000000000001', p.privilege_code, 'All'
FROM app_privilege p
WHERE NOT EXISTS (
    SELECT 1 FROM app_role_privilege rp
    WHERE rp.role_id = '33333333-0000-0000-0000-000000000001'
      AND rp.privilege_code = p.privilege_code
);

-- 4) Kullanılmayan Supplier.* privilege tanımlarını da temizle.
DELETE FROM app_privilege
WHERE privilege_code LIKE 'Supplier.%';

COMMIT;
