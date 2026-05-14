-- =============================================
-- Platform InitData / V002 — GeneralParameter privileges
-- Pairs with Schema/V004__GeneralParameter.sql.
--
-- Seeds the GeneralParameter.Read privilege and binds it to the
-- Administrators (All) and Standard Users (User) roles.
--
-- Parametre kayıtlarının kendisi (enum değerleri) ayrı seed scriptleriyle
-- eklenir: Platform enumları bu projenin InitData'sında, app-spesifik
-- enumlar ilgili app'in InitData'sında.
--
-- All inserts are idempotent via WHERE NOT EXISTS.
-- =============================================

-- ---------------------------------------------
-- Privilege
-- ---------------------------------------------
INSERT INTO auth_privilege (id, privilege_code, privilege_name, description, is_active, created_by, created_at)
SELECT gen_random_uuid(), codes.code, codes.code, '', true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('GeneralParameter.Read')
) AS codes(code)
WHERE NOT EXISTS (
    SELECT 1 FROM auth_privilege p WHERE p.privilege_code = codes.code
);

-- ---------------------------------------------
-- Role-Privilege bindings
-- ---------------------------------------------
-- Administrators → All access
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000010'::uuid, 'GeneralParameter.Read', 'All', true
WHERE NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = '00000000-0000-0000-0000-000000000010'::uuid
      AND rp.privilege_code = 'GeneralParameter.Read'
);

-- Standard Users → User-scope access
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000011'::uuid, 'GeneralParameter.Read', 'User', true
WHERE NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = '00000000-0000-0000-0000-000000000011'::uuid
      AND rp.privilege_code = 'GeneralParameter.Read'
);
