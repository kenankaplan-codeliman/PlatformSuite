-- =============================================
-- brand — Markalar
-- =============================================

CREATE TABLE IF NOT EXISTS brand (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name                    VARCHAR(100) NOT NULL,

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

CREATE UNIQUE INDEX IF NOT EXISTS uq_brand_name ON brand(name) WHERE is_deleted = FALSE;

-- =============================================
-- manufacturer — Üreticiler
-- =============================================

CREATE TABLE IF NOT EXISTS manufacturer (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name                    VARCHAR(100) NOT NULL,

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

CREATE UNIQUE INDEX IF NOT EXISTS uq_manufacturer_name ON manufacturer(name) WHERE is_deleted = FALSE;

-- =============================================
-- product — Ürünler
-- =============================================

CREATE TABLE IF NOT EXISTS product (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Temel Bilgiler
    code                    VARCHAR(25) NOT NULL,
    name                    VARCHAR(50) NOT NULL,
    short_description       VARCHAR(50) NOT NULL,
    detailed_description    TEXT,

    -- Geçerlilik Tarihi Aralığı (zorunlu)
    valid_from              TIMESTAMPTZ NOT NULL,
    valid_until             TIMESTAMPTZ NOT NULL,

    -- Ölçüm ve Teslimat
    unit_of_measure         VARCHAR(50),
    delivery_days           INTEGER NOT NULL DEFAULT 0,
    quantity_per_unit       INTEGER,

    -- Üretici / Model / Renk
    manufacturer_part_number VARCHAR(25),
    model                   VARCHAR(25),
    color                   VARCHAR(25),
    product_url             TEXT,

    -- Hesap Kodu (alıcı bazlı)
    account_code_id         UUID,

    -- Kategori FK (zorunlu)
    product_category_id     UUID NOT NULL REFERENCES product_category(id),

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
    deleted_at              TIMESTAMPTZ,

    CONSTRAINT chk_valid_until_after_from CHECK (valid_until >= valid_from)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_product_code ON product(code) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_product_category_id ON product(product_category_id);

-- =============================================
-- product_brand — Ürün–Marka N:M
-- =============================================

CREATE TABLE IF NOT EXISTS product_brand (
    product_id              UUID NOT NULL REFERENCES product(id),
    brand_id                UUID NOT NULL REFERENCES brand(id),
    PRIMARY KEY (product_id, brand_id)
);

-- =============================================
-- product_manufacturer — Ürün–Üretici N:M
-- =============================================

CREATE TABLE IF NOT EXISTS product_manufacturer (
    product_id              UUID NOT NULL REFERENCES product(id),
    manufacturer_id         UUID NOT NULL REFERENCES manufacturer(id),
    PRIMARY KEY (product_id, manufacturer_id)
);

-- =============================================
-- product_keyword — Ürün Anahtar Kelimeleri
-- =============================================

CREATE TABLE IF NOT EXISTS product_keyword (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id              UUID NOT NULL REFERENCES product(id),
    keyword                 VARCHAR(100) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_keyword_product_id ON product_keyword(product_id);

-- =============================================
-- product_sku — Tedarikçi Bazlı SKU
-- =============================================

CREATE TABLE IF NOT EXISTS product_sku (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id              UUID NOT NULL REFERENCES product(id),
    supplier_account_id             UUID NOT NULL REFERENCES account(id),
    sku                     VARCHAR(25) NOT NULL,
    CONSTRAINT uq_product_sku_supplier UNIQUE (product_id, supplier_account_id)
);

CREATE INDEX IF NOT EXISTS idx_product_sku_product_id ON product_sku(product_id);
