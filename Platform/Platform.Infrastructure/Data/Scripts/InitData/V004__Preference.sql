-- =============================================
-- Platform InitData / V004 — Preference privilege seed
-- Seeds: Preference.Manage privilege + bindings to Administrators (All) and Standard Users (User).
-- Kişisel tercih (dashboard layout vb.) get/save için gereken tek privilege.
-- =============================================

INSERT INTO auth_privilege (id, privilege_code, privilege_name, description, is_active, created_by, created_at)
SELECT gen_random_uuid(), codes.code, codes.code, '', true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('Preference.Manage')
) AS codes(code)
WHERE NOT EXISTS (
    SELECT 1 FROM auth_privilege p WHERE p.privilege_code = codes.code
);

-- Administrators (All)
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), r.id, 'Preference.Manage', 'All', true
FROM auth_role r
WHERE r.role_name = 'Administrators'
  AND NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = r.id AND rp.privilege_code = 'Preference.Manage'
  );

-- Standard Users (User-scope — kullanıcı yalnız kendi tercihini yönetir)
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), r.id, 'Preference.Manage', 'User', true
FROM auth_role r
WHERE r.role_name = 'Standard Users'
  AND NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = r.id AND rp.privilege_code = 'Preference.Manage'
  );
