-- =============================================
-- Platform InitData / V001 — Identity domain seed
-- Pairs with Schema/V001__Identity.sql (which creates auth_* tables).
--
-- Seeds: default organization, Administrators + Standard Users roles,
--        Platform-level privileges (User, Activity, Organization, AppRole, Attachment),
--        role-privilege bindings, admin@admin and user@user users with hashed passwords.
--
-- Execution order is guaranteed by ScriptOrderComparer:
--   Platform.Schema.* → Platform.InitData.* → App.Schema.* → App.InitData.* → *.SampleData.*
-- so all auth_* tables exist before this script runs.
--
-- Password hash injected by migrator at runtime via DbUp variable:
--   $DefaultPasswordHash$  → IPasswordHasher.Hash(SeedPasswordVariables.DefaultPassword)
-- All seed users (InitData + SampleData) share the same default password.
--
-- All inserts are idempotent via WHERE NOT EXISTS.
--
-- Identity tabloları auth_ prefix ile yaşar — PostgreSQL reserved keyword
-- (user, role) çakışmasını önlemek için.
-- =============================================

-- Fixed UUIDs for predictable seed entities
-- DEFAULT_ORG       = 00000000-0000-0000-0000-000000000001
-- ROLE_ADMINS       = 00000000-0000-0000-0000-000000000010
-- ROLE_STANDARD     = 00000000-0000-0000-0000-000000000011
-- USER_ADMIN        = 00000000-0000-0000-0000-000000000020
-- USER_STANDARD     = 00000000-0000-0000-0000-000000000021

-- ---------------------------------------------
-- Default organization (required by auth_user.organization_id NOT NULL)
-- ---------------------------------------------
INSERT INTO auth_organization (id, organization_code, organization_name, title, description, type, is_default, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000001'::uuid, 'MAIN', 'Default Organization', 'Default Organization', '', 'EXECUTIVE', true, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (
    SELECT 1 FROM auth_organization WHERE id = '00000000-0000-0000-0000-000000000001'::uuid
);

-- ---------------------------------------------
-- Roles: Administrators (all access), Standard Users (default, user-scope)
-- ---------------------------------------------
INSERT INTO auth_role (id, role_name, description, is_default, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000010'::uuid, 'Administrators', 'Full system access', false, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_role WHERE id = '00000000-0000-0000-0000-000000000010'::uuid);

INSERT INTO auth_role (id, role_name, description, is_default, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000011'::uuid, 'Standard Users', 'Default user role with personal-scope access', true, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_role WHERE id = '00000000-0000-0000-0000-000000000011'::uuid);

-- ---------------------------------------------
-- Platform privileges (User, Activity, Organization, AppRole, Attachment)
-- ---------------------------------------------
INSERT INTO auth_privilege (id, privilege_code, privilege_name, description, is_active, created_by, created_at)
SELECT gen_random_uuid(), codes.code, codes.code, '', true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('User.Read'), ('User.Create'), ('User.Update'), ('User.Delete'),
    ('Activity.Read'), ('Activity.Create'), ('Activity.Update'), ('Activity.Delete'),
    ('Activity.UpdateStatus'), ('Activity.Assign'), ('Activity.State'),
    ('Organization.Read'), ('Organization.Create'), ('Organization.Update'), ('Organization.Delete'),
    ('AppRole.Read'), ('AppRole.Create'), ('AppRole.Update'), ('AppRole.Delete'),
    ('Attachment.Read'), ('Attachment.Create'), ('Attachment.Delete')
) AS codes(code)
WHERE NOT EXISTS (
    SELECT 1 FROM auth_privilege p WHERE p.privilege_code = codes.code
);

-- ---------------------------------------------
-- Role-Privilege bindings
-- Administrators → All access for every platform privilege
-- ---------------------------------------------
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000010'::uuid, p.privilege_code, 'All', true
FROM auth_privilege p
WHERE p.privilege_code IN (
    'User.Read', 'User.Create', 'User.Update', 'User.Delete',
    'Activity.Read', 'Activity.Create', 'Activity.Update', 'Activity.Delete',
    'Activity.UpdateStatus', 'Activity.Assign', 'Activity.State',
    'Organization.Read', 'Organization.Create', 'Organization.Update', 'Organization.Delete',
    'AppRole.Read', 'AppRole.Create', 'AppRole.Update', 'AppRole.Delete',
    'Attachment.Read', 'Attachment.Create', 'Attachment.Delete'
)
AND NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = '00000000-0000-0000-0000-000000000010'::uuid
      AND rp.privilege_code = p.privilege_code
);

-- Standard Users → User-scope access for every platform privilege
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000011'::uuid, p.privilege_code, 'User', true
FROM auth_privilege p
WHERE p.privilege_code IN (
    'User.Read', 'User.Create', 'User.Update', 'User.Delete',
    'Activity.Read', 'Activity.Create', 'Activity.Update', 'Activity.Delete',
    'Activity.UpdateStatus', 'Activity.Assign', 'Activity.State',
    'Organization.Read', 'Organization.Create', 'Organization.Update', 'Organization.Delete',
    'AppRole.Read', 'AppRole.Create', 'AppRole.Update', 'AppRole.Delete',
    'Attachment.Read', 'Attachment.Create', 'Attachment.Delete'
)
AND NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = '00000000-0000-0000-0000-000000000011'::uuid
      AND rp.privilege_code = p.privilege_code
);

-- ---------------------------------------------
-- Seed users — password hashes injected by migrator
-- ---------------------------------------------
INSERT INTO auth_user (id, email, first_name, last_name, password_hash, organization_id, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000020'::uuid, 'admin@app.com', 'Admin', 'User',
       '$DefaultPasswordHash$',
       '00000000-0000-0000-0000-000000000001'::uuid, true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_user WHERE id = '00000000-0000-0000-0000-000000000020'::uuid);

INSERT INTO auth_user (id, email, first_name, last_name, password_hash, organization_id, manager_id, is_active, created_by, created_at)
SELECT '00000000-0000-0000-0000-000000000021'::uuid, 'user@app.com', 'Standard', 'User',
       '$DefaultPasswordHash$',
       '00000000-0000-0000-0000-000000000001'::uuid,
       '00000000-0000-0000-0000-000000000020'::uuid,
       true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
WHERE NOT EXISTS (SELECT 1 FROM auth_user WHERE id = '00000000-0000-0000-0000-000000000021'::uuid);

-- ---------------------------------------------
-- User → Role assignments
-- admin@admin → Administrators
-- user@user   → Standard Users
-- ---------------------------------------------
INSERT INTO auth_user_role (id, user_id, role_id, is_active)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000020'::uuid,
       '00000000-0000-0000-0000-000000000010'::uuid, true
WHERE NOT EXISTS (
    SELECT 1 FROM auth_user_role
    WHERE user_id = '00000000-0000-0000-0000-000000000020'::uuid
      AND role_id = '00000000-0000-0000-0000-000000000010'::uuid
);

INSERT INTO auth_user_role (id, user_id, role_id, is_active)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000021'::uuid,
       '00000000-0000-0000-0000-000000000011'::uuid, true
WHERE NOT EXISTS (
    SELECT 1 FROM auth_user_role
    WHERE user_id = '00000000-0000-0000-0000-000000000021'::uuid
      AND role_id = '00000000-0000-0000-0000-000000000011'::uuid
);
