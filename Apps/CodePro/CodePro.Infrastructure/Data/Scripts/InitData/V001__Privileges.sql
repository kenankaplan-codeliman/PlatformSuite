-- =============================================
-- CodePro InitData / V001 — CodePro privileges seed
-- Seeds: CodePro aggregate privileges (Supplier, PurchaseOrder, Budget, etc.)
--        + bindings to existing Administrators (All) and Standard Users (User) roles
--        created by Platform's InitData/V001__Identity.sql.
--
-- Execution order is guaranteed by ScriptOrderComparer:
--   Platform.Schema → Platform.InitData → CodePro.Schema → CodePro.InitData → *.SampleData
-- so both the auth_* tables AND the Administrators/Standard Users rows exist by this point.
--
-- Roles are looked up by name; only the audit `created_by` references the admin user UUID.
-- =============================================

-- ---------------------------------------------
-- CodePro privileges (17 aggregates)
-- ---------------------------------------------
INSERT INTO auth_privilege (id, privilege_code, privilege_name, description, is_active, created_by, created_at)
SELECT gen_random_uuid(), codes.code, codes.code, '', true,
       '00000000-0000-0000-0000-000000000020'::uuid, current_timestamp
FROM (VALUES
    -- Supplier (6)
    ('Supplier.Read'), ('Supplier.Create'), ('Supplier.Update'), ('Supplier.Delete'),
    ('Supplier.Assign'), ('Supplier.State'),
    -- PurchaseRequest (6)
    ('PurchaseRequest.Read'), ('PurchaseRequest.Create'), ('PurchaseRequest.Update'),
    ('PurchaseRequest.Delete'), ('PurchaseRequest.Assign'), ('PurchaseRequest.State'),
    -- PurchaseOrder (6)
    ('PurchaseOrder.Read'), ('PurchaseOrder.Create'), ('PurchaseOrder.Update'),
    ('PurchaseOrder.Delete'), ('PurchaseOrder.Assign'), ('PurchaseOrder.State'),
    -- PurchaseBasket (4)
    ('PurchaseBasket.Read'), ('PurchaseBasket.Create'), ('PurchaseBasket.Update'),
    ('PurchaseBasket.Delete'),
    -- Product (5)
    ('Product.Read'), ('Product.Create'), ('Product.Update'), ('Product.Delete'),
    ('Product.State'),
    -- ProductCategory (4)
    ('ProductCategory.Read'), ('ProductCategory.Create'), ('ProductCategory.Update'),
    ('ProductCategory.Delete'),
    -- ProductCatalog (4)
    ('ProductCatalog.Read'), ('ProductCatalog.Create'), ('ProductCatalog.Update'),
    ('ProductCatalog.Delete'),
    -- Brand (4)
    ('Brand.Read'), ('Brand.Create'), ('Brand.Update'), ('Brand.Delete'),
    -- Manufacturer (4)
    ('Manufacturer.Read'), ('Manufacturer.Create'), ('Manufacturer.Update'), ('Manufacturer.Delete'),
    -- PriceList (5)
    ('PriceList.Read'), ('PriceList.Create'), ('PriceList.Update'), ('PriceList.Delete'),
    ('PriceList.State'),
    -- ProductPrice (4)
    ('ProductPrice.Read'), ('ProductPrice.Create'), ('ProductPrice.Update'), ('ProductPrice.Delete'),
    -- EDocument (5)
    ('EDocument.Read'), ('EDocument.Create'), ('EDocument.Update'), ('EDocument.Delete'),
    ('EDocument.State'),
    -- Questionnaire (5)
    ('Questionnaire.Read'), ('Questionnaire.Create'), ('Questionnaire.Update'),
    ('Questionnaire.Delete'), ('Questionnaire.State'),
    -- Contract (6)
    ('Contract.Read'), ('Contract.Create'), ('Contract.Update'), ('Contract.Delete'),
    ('Contract.Approve'), ('Contract.State'),
    -- Offer (6)
    ('Offer.Read'), ('Offer.Create'), ('Offer.Update'), ('Offer.Delete'),
    ('Offer.Approve'), ('Offer.State'),
    -- Budget (7)
    ('Budget.Read'), ('Budget.Create'), ('Budget.Update'), ('Budget.Delete'),
    ('Budget.State'), ('Budget.Increase'), ('Budget.Reserve'),
    -- BudgetCategory (4)
    ('BudgetCategory.Read'), ('BudgetCategory.Create'), ('BudgetCategory.Update'),
    ('BudgetCategory.Delete')
) AS codes(code)
WHERE NOT EXISTS (
    SELECT 1 FROM auth_privilege p WHERE p.privilege_code = codes.code
);

-- ---------------------------------------------
-- Role-Privilege bindings — Administrators (All) for every CodePro privilege
-- ---------------------------------------------
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), r.id, p.privilege_code, 'All', true
FROM auth_role r
CROSS JOIN auth_privilege p
WHERE r.role_name = 'Administrators'
  AND p.privilege_code LIKE ANY (ARRAY[
      'Supplier.%', 'PurchaseRequest.%', 'PurchaseOrder.%', 'PurchaseBasket.%',
      'Product.%', 'ProductCategory.%', 'ProductCatalog.%',
      'Brand.%', 'Manufacturer.%',
      'PriceList.%', 'ProductPrice.%',
      'EDocument.%', 'Questionnaire.%',
      'Contract.%', 'Offer.%', 'Budget.%', 'BudgetCategory.%'
  ])
  AND NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = r.id AND rp.privilege_code = p.privilege_code
  );

-- ---------------------------------------------
-- Role-Privilege bindings — Standard Users (User-scope) for every CodePro privilege
-- ---------------------------------------------
INSERT INTO auth_role_privilege (id, role_id, privilege_code, access_level, is_active)
SELECT gen_random_uuid(), r.id, p.privilege_code, 'User', true
FROM auth_role r
CROSS JOIN auth_privilege p
WHERE r.role_name = 'Standard Users'
  AND p.privilege_code LIKE ANY (ARRAY[
      'Supplier.%', 'PurchaseRequest.%', 'PurchaseOrder.%', 'PurchaseBasket.%',
      'Product.%', 'ProductCategory.%', 'ProductCatalog.%',
      'Brand.%', 'Manufacturer.%',
      'PriceList.%', 'ProductPrice.%',
      'EDocument.%', 'Questionnaire.%',
      'Contract.%', 'Offer.%', 'Budget.%', 'BudgetCategory.%'
  ])
  AND NOT EXISTS (
    SELECT 1 FROM auth_role_privilege rp
    WHERE rp.role_id = r.id AND rp.privilege_code = p.privilege_code
  );
