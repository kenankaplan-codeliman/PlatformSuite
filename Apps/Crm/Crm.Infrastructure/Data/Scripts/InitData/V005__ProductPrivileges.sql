-- =============================================
-- CRM InitData / V005 — Product privileges seed
-- Seeds: Product privileges + bindings to Administrators (All) and Standard Users (User).
-- Ayrı script: DbUp zaten uygulanmış V001'i tekrar çalıştırmaz; mevcut DB'ler de
-- Product privilege'larını bu script ile alır. Tüm insert'ler idempotent'tir.
-- =============================================

-- ---------------------------------------------
-- Product privileges
-- ---------------------------------------------
INSERT INTO auth_privilege (id, privilege_code, privilege_name, description, is_active, created_by, created_at)
SELECT gen_random_uuid(), codes.code, codes.code, '', true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('Product.Read'), ('Product.Create'), ('Product.Update'), ('Product.Delete'), ('Product.State')
) AS codes(code)
WHERE NOT EXISTS (
    SELECT 1 FROM auth_privilege p WHERE p.privilege_code = codes.code
);

-- ---------------------------------------------
-- Role-Privilege bindings — Administrators (All)
-- ---------------------------------------------
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), r.id, codes.code, 'All', true
FROM auth_role r
CROSS JOIN (VALUES
    ('Product.Read'), ('Product.Create'), ('Product.Update'), ('Product.Delete'), ('Product.State')
) AS codes(code)
WHERE r.role_name = 'Administrators'
  AND NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = r.id AND rp.privilege_code = codes.code
  );

-- ---------------------------------------------
-- Role-Privilege bindings — Standard Users (User-scope)
-- ---------------------------------------------
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), r.id, codes.code, 'User', true
FROM auth_role r
CROSS JOIN (VALUES
    ('Product.Read'), ('Product.Create'), ('Product.Update'), ('Product.Delete'), ('Product.State')
) AS codes(code)
WHERE r.role_name = 'Standard Users'
  AND NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = r.id AND rp.privilege_code = codes.code
  );
