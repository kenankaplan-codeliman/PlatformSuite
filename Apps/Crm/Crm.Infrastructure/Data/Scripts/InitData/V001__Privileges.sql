-- =============================================
-- CRM InitData / V001 — CRM privileges seed
-- Seeds: CRM aggregate privileges (Account, Contact, Lead, Opportunity)
--        + bindings to existing Administrators (All) and Standard Users (User) roles
--        created by Platform's InitData/V001__Identity.sql.
--
-- Execution order is guaranteed by ScriptOrderComparer:
--   Platform.Schema → Platform.InitData → Crm.Schema → Crm.InitData → *.SampleData
-- so both the auth_* tables AND the Administrators/Standard Users rows exist by this point.
--
-- Roles are looked up by name, not by ID, so this script does not depend on Platform's
-- hardcoded UUIDs (other than the created_by audit field).
-- =============================================

-- ---------------------------------------------
-- CRM privileges
-- ---------------------------------------------
INSERT INTO auth_privilege (id, privilege_code, privilege_name, description, is_active, created_by, created_at)
SELECT gen_random_uuid(), codes.code, codes.code, '', true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    ('Account.Read'), ('Account.Create'), ('Account.Update'), ('Account.Delete'),
    ('Account.Assign'), ('Account.State'),
    ('Contact.Read'), ('Contact.Create'), ('Contact.Update'), ('Contact.Delete'),
    ('Contact.Assign'), ('Contact.State'),
    ('Lead.Read'), ('Lead.Create'), ('Lead.Update'), ('Lead.Delete'),
    ('Lead.Assign'), ('Lead.State'), ('Lead.Convert'),
    ('Opportunity.Read'), ('Opportunity.Create'), ('Opportunity.Update'), ('Opportunity.Delete'),
    ('Opportunity.Assign'), ('Opportunity.State')
) AS codes(code)
WHERE NOT EXISTS (
    SELECT 1 FROM auth_privilege p WHERE p.privilege_code = codes.code
);

-- ---------------------------------------------
-- Role-Privilege bindings — Administrators (All) for every CRM privilege
-- ---------------------------------------------
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), r.id, codes.code, 'All', true
FROM auth_role r
CROSS JOIN (VALUES
    ('Account.Read'), ('Account.Create'), ('Account.Update'), ('Account.Delete'),
    ('Account.Assign'), ('Account.State'),
    ('Contact.Read'), ('Contact.Create'), ('Contact.Update'), ('Contact.Delete'),
    ('Contact.Assign'), ('Contact.State'),
    ('Lead.Read'), ('Lead.Create'), ('Lead.Update'), ('Lead.Delete'),
    ('Lead.Assign'), ('Lead.State'), ('Lead.Convert'),
    ('Opportunity.Read'), ('Opportunity.Create'), ('Opportunity.Update'), ('Opportunity.Delete'),
    ('Opportunity.Assign'), ('Opportunity.State')
) AS codes(code)
WHERE r.role_name = 'Administrators'
  AND NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = r.id AND rp.privilege_code = codes.code
  );

-- ---------------------------------------------
-- Role-Privilege bindings — Standard Users (User-scope) for every CRM privilege
-- ---------------------------------------------
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), r.id, codes.code, 'User', true
FROM auth_role r
CROSS JOIN (VALUES
    ('Account.Read'), ('Account.Create'), ('Account.Update'), ('Account.Delete'),
    ('Account.Assign'), ('Account.State'),
    ('Contact.Read'), ('Contact.Create'), ('Contact.Update'), ('Contact.Delete'),
    ('Contact.Assign'), ('Contact.State'),
    ('Lead.Read'), ('Lead.Create'), ('Lead.Update'), ('Lead.Delete'),
    ('Lead.Assign'), ('Lead.State'), ('Lead.Convert'),
    ('Opportunity.Read'), ('Opportunity.Create'), ('Opportunity.Update'), ('Opportunity.Delete'),
    ('Opportunity.Assign'), ('Opportunity.State')
) AS codes(code)
WHERE r.role_name = 'Standard Users'
  AND NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = r.id AND rp.privilege_code = codes.code
  );
