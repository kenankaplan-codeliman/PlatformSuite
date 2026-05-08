-- =============================================
-- price_list — Fiyat Listesi
-- Tedarikçi bazlı fiyat gruplarını başlık olarak tutar. Ürün fiyatları
-- product_price tablosunda price_list_id ile bu başlığa bağlanır.
-- =============================================

CREATE TABLE IF NOT EXISTS price_list (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,

    -- Liste kodu — boş gönderilirse servis PL-YYYY-NNNN formatında üretir
    code            VARCHAR(25)     NOT NULL,
    name            VARCHAR(100)    NOT NULL,
    description     TEXT,

    supplier_id     UUID            NOT NULL REFERENCES supplier(id),

    -- IAuditableEntity
    created_by      UUID            NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by      UUID,
    updated_at      TIMESTAMPTZ,

    -- ISoftDeleteEntity
    is_deleted      BOOLEAN         NOT NULL DEFAULT FALSE,
    deleted_by      UUID,
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_price_list_code
    ON price_list(code) WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_price_list_supplier_id
    ON price_list(supplier_id) WHERE is_deleted = FALSE;

-- Sequence for code generation (PL-YYYY-NNNN)
CREATE SEQUENCE IF NOT EXISTS price_list_seq START 1;

COMMENT ON TABLE price_list IS 'Tedarikçi bazlı fiyat listesi başlığı';
COMMENT ON COLUMN price_list.code IS 'Boş gönderilirse auto-gen PL-YYYY-NNNN';
