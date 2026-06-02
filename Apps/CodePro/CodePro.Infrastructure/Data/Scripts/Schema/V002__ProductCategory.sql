-- =============================================
-- product_category — Ürün Kategorileri
-- =============================================

CREATE TABLE product_category (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name                    VARCHAR(200) NOT NULL,
    title                   VARCHAR(500) NOT NULL,
    code                    VARCHAR(20),
    description             TEXT,

    -- Hiyerarşik kategori (opsiyonel)
    parent_category_id      UUID REFERENCES product_category(id),

    -- IBaseEntity
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,

    -- IAuditableEntity
    created_by              UUID NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by              UUID,
    updated_at              TIMESTAMPTZ,

    -- ISoftDeleteEntity
    is_deleted              BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by              UUID,
    deleted_at              TIMESTAMPTZ
);

-- =============================================
-- supplier_product_category — Supplier ↔ ProductCategory N:N
-- =============================================

CREATE TABLE supplier_product_category (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id             UUID NOT NULL REFERENCES supplier(id) ON DELETE CASCADE,
    product_category_id     UUID NOT NULL REFERENCES product_category(id) ON DELETE CASCADE,
    is_preferred            BOOLEAN NOT NULL DEFAULT FALSE,

    -- IBaseEntity
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,

    -- IAuditableEntity
    created_by              UUID NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by              UUID,
    updated_at              TIMESTAMPTZ,

    -- ISoftDeleteEntity
    is_deleted              BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by              UUID,
    deleted_at              TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_product_category_parent ON product_category(parent_category_id);
CREATE INDEX idx_supplier_product_category_supplier ON supplier_product_category(supplier_id);
CREATE INDEX idx_supplier_product_category_category ON supplier_product_category(product_category_id);
CREATE UNIQUE INDEX uq_supplier_product_category ON supplier_product_category(supplier_id, product_category_id) WHERE is_deleted = FALSE;
