-- =============================================
-- account — CodePro uzantı kolonları
-- TPH inheritance: Supplier alt sınıfı (account_type='Vendor') bu kolonları
-- doldurur; diğer Account türleri NULL bırakır. Domain tarafı Supplier entity'si
-- üzerinden erişir; Platform Account bu kolonları görmez.
-- Aynı script ayrıca raw SQL INSERT'lerin çalışması için account_* tablolarına
-- created_at default değeri ekler (EF tarafı SaveChanges ile zaten yazıyor).
-- =============================================

-- Supplier-specific columns
ALTER TABLE account ADD COLUMN IF NOT EXISTS supplier_type      VARCHAR(20);
ALTER TABLE account ADD COLUMN IF NOT EXISTS supplier_status    VARCHAR(20);
ALTER TABLE account ADD COLUMN IF NOT EXISTS company_type       VARCHAR(20);
ALTER TABLE account ADD COLUMN IF NOT EXISTS company_legal_type VARCHAR(50);
ALTER TABLE account ADD COLUMN IF NOT EXISTS tax_office         VARCHAR(150);
ALTER TABLE account ADD COLUMN IF NOT EXISTS vkn                VARCHAR(20);
ALTER TABLE account ADD COLUMN IF NOT EXISTS mersis_no          VARCHAR(20);

-- created_at defaults (raw SQL seed convenience; EF tarafı her zaman set eder)
ALTER TABLE account         ALTER COLUMN created_at SET DEFAULT current_timestamp;
ALTER TABLE account_email   ALTER COLUMN created_at SET DEFAULT current_timestamp;
ALTER TABLE account_phone   ALTER COLUMN created_at SET DEFAULT current_timestamp;
ALTER TABLE account_address ALTER COLUMN created_at SET DEFAULT current_timestamp;
ALTER TABLE account_contact ALTER COLUMN created_at SET DEFAULT current_timestamp;
