CREATE TABLE product (
    id                  UUID            NOT NULL DEFAULT gen_random_uuid(),
    name                VARCHAR(250)    NOT NULL,
    description         TEXT,
    sku                 VARCHAR(100),
    category            VARCHAR(50)     NOT NULL,
    unit_price          NUMERIC(18, 2)  NOT NULL,
    currency            CHAR(3)         NOT NULL DEFAULT 'TRY',
    unit                VARCHAR(50),

    -- IBaseEntity
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,

    -- IAuditableEntity
    created_by          UUID            NOT NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_by          UUID,
    updated_at          TIMESTAMPTZ,

    -- ISoftDeleteEntity
    is_deleted          BOOLEAN         NOT NULL DEFAULT FALSE,
    deleted_by          UUID,
    deleted_at          TIMESTAMPTZ,

    CONSTRAINT pk_product PRIMARY KEY (id)
);

-- SKU null olmayan satırlarda unique olsun (partial index)
CREATE UNIQUE INDEX uq_product_sku_notnull
    ON product (sku)
    WHERE sku IS NOT NULL;

-- Soft-delete filtresi için index
CREATE INDEX idx_product_is_deleted       ON product (is_deleted);

COMMENT ON TABLE  product                IS 'Ürün ve hizmet kataloğu';
COMMENT ON COLUMN product.sku            IS 'Stock Keeping Unit — benzersiz ürün kodu';
COMMENT ON COLUMN product.currency       IS 'ISO 4217 para birimi kodu (ör: TRY, USD, EUR)';
COMMENT ON COLUMN product.category       IS 'Ürün kategorisi: Software | Hardware | Service | License | Maintenance | Training | Other';
COMMENT ON COLUMN product.unit           IS 'Birim adı (ör: Adet, Saat, Lisans, Ay)';
