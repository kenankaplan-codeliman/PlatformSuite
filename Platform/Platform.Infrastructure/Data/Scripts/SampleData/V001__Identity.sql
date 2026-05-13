-- =============================================
-- Platform SampleData / V001 — Identity domain
-- Pairs with Schema/V001__Identity.sql + InitData/V001__Identity.sql.
--
-- Production hariç ortamlarda yüklenir. Migrator IHostEnvironment.IsProduction()
-- ise SampleData/ klasörünü filter dışında tutar.
--
-- Seeds:
--   - 3 sample organizations (child of MAIN default org via parent_organization_id)
--   - 5 sample users distributed across sample orgs
--   - User-role assignments (mix of Administrators ve Standard Users)
--
-- All passwords hash'lenir runtime'da via $DefaultPasswordHash$ (paraola "123").
-- All inserts idempotent (WHERE NOT EXISTS by ID).
-- =============================================

-- Fixed UUIDs for sample identity entities
-- ORG_SALES          = 00000000-0000-0000-0000-000000000200
-- ORG_PURCHASING     = 00000000-0000-0000-0000-000000000201
-- ORG_OPERATIONS     = 00000000-0000-0000-0000-000000000202
-- USER_SALES_MGR     = 00000000-0000-0000-0000-000000000100  (Ayşe Yılmaz)
-- USER_SALES_REP     = 00000000-0000-0000-0000-000000000101  (Mehmet Demir)
-- USER_BUYER_MGR     = 00000000-0000-0000-0000-000000000102  (Zeynep Kara)
-- USER_BUYER         = 00000000-0000-0000-0000-000000000103  (Ali Şahin)
-- USER_OPS_LEAD      = 00000000-0000-0000-0000-000000000104  (Elif Aydın)

-- ---------------------------------------------
-- Sample organizations (child of MAIN)
-- ---------------------------------------------
-- Title formatı: "{parentTitle} \ {childName}" — UpdateAppOrganizationHandler ile birebir uyumlu
-- (bkz. UpdateAppOrganizationHandler.ComputeHierarchicalTitleAsync). Root org'un (MAIN) title'ı
-- kendi OrganizationName'idir. Lookup popup'larında ve search ekranlarında bu title gösterilir.

INSERT INTO auth_organization (id, organization_code, organization_name, title, description, type, parent_organization_id, is_default, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000200'::uuid, 'SALES', 'Satış Departmanı',
       'Default Organization \ Satış Departmanı',
       'Müşteri ilişkileri ve satış süreçleri', 'DEPARTMENT',
       '00000000-0000-0000-0000-000000000001'::uuid, false, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_organization WHERE id = '00000000-0000-0000-0000-000000000200'::uuid);

INSERT INTO auth_organization (id, organization_code, organization_name, title, description, type, parent_organization_id, is_default, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000201'::uuid, 'PURCH', 'Satın Alma Departmanı',
       'Default Organization \ Satın Alma Departmanı',
       'Tedarik ve satın alma süreçleri', 'DEPARTMENT',
       '00000000-0000-0000-0000-000000000001'::uuid, false, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_organization WHERE id = '00000000-0000-0000-0000-000000000201'::uuid);

INSERT INTO auth_organization (id, organization_code, organization_name, title, description, type, parent_organization_id, is_default, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000202'::uuid, 'OPS', 'Operasyon Şubesi',
       'Default Organization \ Operasyon Şubesi',
       'Saha operasyonları ve lojistik', 'BRANCH',
       '00000000-0000-0000-0000-000000000001'::uuid, false, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_organization WHERE id = '00000000-0000-0000-0000-000000000202'::uuid);

-- ---------------------------------------------
-- Sample users
-- Hiyerarşi:
--   admin (020)
--     ├── Ayşe (100, Satış Müdürü)         → Mehmet (101, Satış Rep)
--     ├── Zeynep (102, Satın Alma Müdürü)  → Ali (103, Buyer)
--     └── Elif (104, Operasyon Lideri)
-- ---------------------------------------------
INSERT INTO auth_user (id, email, first_name, last_name, phone_number, password_hash, organization_id, manager_id, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000100'::uuid, 'ayse.yilmaz@example.com', 'Ayşe', 'Yılmaz', '+90 532 100 1001',
       '$DefaultPasswordHash$', '00000000-0000-0000-0000-000000000200'::uuid,
       '00000000-0000-0000-0000-000000000020'::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_user WHERE id = '00000000-0000-0000-0000-000000000100'::uuid);

INSERT INTO auth_user (id, email, first_name, last_name, phone_number, password_hash, organization_id, manager_id, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000101'::uuid, 'mehmet.demir@example.com', 'Mehmet', 'Demir', '+90 532 100 1002',
       '$DefaultPasswordHash$', '00000000-0000-0000-0000-000000000200'::uuid,
       '00000000-0000-0000-0000-000000000100'::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_user WHERE id = '00000000-0000-0000-0000-000000000101'::uuid);

INSERT INTO auth_user (id, email, first_name, last_name, phone_number, password_hash, organization_id, manager_id, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000102'::uuid, 'zeynep.kara@example.com', 'Zeynep', 'Kara', '+90 532 100 1003',
       '$DefaultPasswordHash$', '00000000-0000-0000-0000-000000000201'::uuid,
       '00000000-0000-0000-0000-000000000020'::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_user WHERE id = '00000000-0000-0000-0000-000000000102'::uuid);

INSERT INTO auth_user (id, email, first_name, last_name, phone_number, password_hash, organization_id, manager_id, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000103'::uuid, 'ali.sahin@example.com', 'Ali', 'Şahin', '+90 532 100 1004',
       '$DefaultPasswordHash$', '00000000-0000-0000-0000-000000000201'::uuid,
       '00000000-0000-0000-0000-000000000102'::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_user WHERE id = '00000000-0000-0000-0000-000000000103'::uuid);

INSERT INTO auth_user (id, email, first_name, last_name, phone_number, password_hash, organization_id, manager_id, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000104'::uuid, 'elif.aydin@example.com', 'Elif', 'Aydın', '+90 532 100 1005',
       '$DefaultPasswordHash$', '00000000-0000-0000-0000-000000000202'::uuid,
       '00000000-0000-0000-0000-000000000020'::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_user WHERE id = '00000000-0000-0000-0000-000000000104'::uuid);

-- ---------------------------------------------
-- User → Role assignments
--   Sales Manager (Ayşe), Purchasing Manager (Zeynep) → Administrators
--   Sales Rep (Mehmet), Buyer (Ali), Ops Lead (Elif)   → Standard Users
-- ---------------------------------------------
INSERT INTO auth_user_role (id, user_id, role_id, is_active)
SELECT gen_random_uuid(), u.user_id, u.role_id, true
FROM (VALUES
    ('00000000-0000-0000-0000-000000000100'::uuid, '00000000-0000-0000-0000-000000000010'::uuid), -- Ayşe → Admins
    ('00000000-0000-0000-0000-000000000101'::uuid, '00000000-0000-0000-0000-000000000011'::uuid), -- Mehmet → Standard
    ('00000000-0000-0000-0000-000000000102'::uuid, '00000000-0000-0000-0000-000000000010'::uuid), -- Zeynep → Admins
    ('00000000-0000-0000-0000-000000000103'::uuid, '00000000-0000-0000-0000-000000000011'::uuid), -- Ali → Standard
    ('00000000-0000-0000-0000-000000000104'::uuid, '00000000-0000-0000-0000-000000000011'::uuid)  -- Elif → Standard
) AS u(user_id, role_id)
WHERE NOT EXISTS (
    SELECT 1 FROM auth_user_role aur
    WHERE aur.user_id = u.user_id AND aur.role_id = u.role_id
);
