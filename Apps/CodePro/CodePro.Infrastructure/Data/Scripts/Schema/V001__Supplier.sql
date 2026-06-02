-- =============================================
-- supplier — CodePro tedarikçi tablosu (kendi başına entity, Account TPH değil)
-- =============================================

CREATE TABLE supplier (
    id                       UUID PRIMARY KEY,
    is_active                BOOLEAN NOT NULL DEFAULT TRUE,

    name                     VARCHAR(200) NOT NULL,
    industry                 VARCHAR(120),
    website                  VARCHAR(255),
    description              TEXT,
    annual_revenue           NUMERIC(18,2),
    number_of_employees      INTEGER,

    supplier_type            VARCHAR(20),
    supplier_status          VARCHAR(20) DEFAULT 'Pending',
    company_type             VARCHAR(20),
    company_legal_type       VARCHAR(50),
    tax_office               VARCHAR(150),
    vkn                      VARCHAR(20),
    mersis_no                VARCHAR(20),

    contact_person_name      VARCHAR(150),
    contact_person_email     VARCHAR(255),
    contact_person_phone     VARCHAR(50),

    address_line             VARCHAR(500),
    city                     VARCHAR(120),
    country                  VARCHAR(120),
    postal_code              VARCHAR(20),

    owner_id                 UUID NOT NULL,
    organization_id          UUID NOT NULL,

    created_by               UUID NOT NULL,
    created_at               TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_by               UUID,
    updated_at               TIMESTAMP,

    is_deleted               BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by               UUID,
    deleted_at               TIMESTAMP
);

CREATE INDEX idx_supplier_owner ON supplier(owner_id);
CREATE INDEX idx_supplier_organization ON supplier(organization_id);
CREATE INDEX idx_supplier_status ON supplier(supplier_status);

-- supplier_product_category junction is defined in 01-ProductCategory.sql
-- (depends on product_category which is created there).
