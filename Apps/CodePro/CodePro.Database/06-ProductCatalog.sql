-- =============================================
-- product_catalog — Ürün Katalogları
-- =============================================

CREATE TABLE IF NOT EXISTS product_catalog (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),

    code                    VARCHAR(25)     NOT NULL,
    name                    VARCHAR(100)    NOT NULL,
    description             TEXT,

    valid_from              DATE            NOT NULL,
    valid_until             DATE            NOT NULL,

    price_code              VARCHAR(50),

    -- IBaseEntity
    is_active               BOOLEAN         NOT NULL DEFAULT TRUE,

    -- IAuditableEntity
    created_by              UUID            NOT NULL,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by              UUID,
    updated_at              TIMESTAMPTZ,

    -- ISoftDeleteEntity
    is_deleted              BOOLEAN         NOT NULL DEFAULT FALSE,
    deleted_by              UUID,
    deleted_at              TIMESTAMPTZ,

    CONSTRAINT chk_product_catalog_valid_until_after_from CHECK (valid_until >= valid_from)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_product_catalog_code
    ON product_catalog(code) WHERE is_deleted = FALSE;

-- =============================================
-- product_catalog_product — Katalog–Ürün N:M
-- =============================================

CREATE TABLE IF NOT EXISTS product_catalog_product (
    product_catalog_id      UUID NOT NULL REFERENCES product_catalog(id) ON DELETE CASCADE,
    product_id              UUID NOT NULL REFERENCES product(id),
    PRIMARY KEY (product_catalog_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_product_catalog_product_product_id
    ON product_catalog_product(product_id);

-- =============================================
-- product_catalog_organization — Katalog–Organizasyon N:M
-- =============================================

CREATE TABLE IF NOT EXISTS product_catalog_organization (
    product_catalog_id      UUID NOT NULL REFERENCES product_catalog(id) ON DELETE CASCADE,
    app_organization_id     UUID NOT NULL REFERENCES app_organization(id),
    PRIMARY KEY (product_catalog_id, app_organization_id)
);

CREATE INDEX IF NOT EXISTS idx_product_catalog_organization_org_id
    ON product_catalog_organization(app_organization_id);
