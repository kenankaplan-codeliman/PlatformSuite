-- =============================================
-- product_price — Ürün Fiyatları
-- Aynı tarih aralığında aynı tedarikçi için aynı minimum miktarda ve
-- aynı fiyat listesine (veya liste dışı) bağlı sadece bir kayıt olabilir.
-- =============================================

CREATE TABLE product_price (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    product_id      UUID            NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    supplier_id     UUID            NOT NULL REFERENCES supplier(id),
    price_list_id   UUID            REFERENCES price_list(id),

    minimum_quantity NUMERIC(18,4)  NOT NULL,

    -- Fiyat geçerlilik aralığı
    valid_from      TIMESTAMPTZ     NOT NULL,
    valid_until     TIMESTAMPTZ     NOT NULL,

    unit_price      NUMERIC(18,4)   NOT NULL,
    currency        VARCHAR(3)      NOT NULL,

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

CREATE INDEX idx_product_price_product_id
    ON product_price(product_id) WHERE is_deleted = FALSE;

CREATE INDEX idx_product_price_supplier_id
    ON product_price(supplier_id) WHERE is_deleted = FALSE;

CREATE INDEX idx_product_price_price_list_id
    ON product_price(price_list_id) WHERE is_deleted = FALSE;

-- Aynı tarih aralığında aynı tedarikçi + ürün + minimum miktar için
-- aynı fiyat listesi içinde (veya liste dışı NULL grubunda) tek kayıt.
-- PostgreSQL UNIQUE indeksi NULL'ları farklı kabul ettiği için COALESCE
-- ile sabit bir sentinel UUID kullanıyoruz.
CREATE UNIQUE INDEX uq_product_price_rule
    ON product_price (
        product_id,
        supplier_id,
        valid_from,
        valid_until,
        minimum_quantity,
        COALESCE(price_list_id, '00000000-0000-0000-0000-000000000000'::uuid)
    )
    WHERE is_deleted = FALSE;
