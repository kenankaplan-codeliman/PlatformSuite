-- =============================================
-- purchase_order — Satın Alma Siparişleri
-- =============================================

CREATE TABLE purchase_order (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Otomatik üretilen sipariş numarası (PO-YYYY-NNNN)
    order_number                VARCHAR(25) NOT NULL,

    title                       VARCHAR(50) NOT NULL,
    description                 TEXT,

    supplier_id                 UUID NOT NULL REFERENCES supplier(id),

    -- Kaynak talep (opsiyonel — elle oluşturulan siparişlerde null)
    purchase_request_id         UUID REFERENCES purchase_request(id),

    status                      VARCHAR(20) NOT NULL DEFAULT 'Draft',
    priority                    VARCHAR(10) NOT NULL DEFAULT 'Medium',

    order_date                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date      TIMESTAMPTZ,

    currency_code               VARCHAR(3),

    -- Satırların header currency'e parite uygulanmış toplamı (persist edilir) — servis günceller
    total_amount                NUMERIC(18,2) NOT NULL DEFAULT 0,

    -- IBaseEntity
    is_active                   BOOLEAN NOT NULL DEFAULT TRUE,

    -- IOwnedEntity
    owner_id                    UUID NOT NULL,
    organization_id             UUID NOT NULL,

    -- IAuditableEntity
    created_by                  UUID NOT NULL,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by                  UUID,
    updated_at                  TIMESTAMPTZ,

    -- ISoftDeleteEntity
    is_deleted                  BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by                  UUID,
    deleted_at                  TIMESTAMPTZ,

    CONSTRAINT chk_purchase_order_status
        CHECK (status IN ('Draft','Submitted','Confirmed','InDelivery','Received','Cancelled')),
    CONSTRAINT chk_purchase_order_priority
        CHECK (priority IN ('Low','Medium','High','Urgent'))
);

-- =============================================
-- purchase_order_line — Sipariş Satırları
-- product_id null ise free-text line (product_name kullanılır).
-- =============================================

CREATE TABLE purchase_order_line (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    purchase_order_id         UUID NOT NULL REFERENCES purchase_order(id) ON DELETE CASCADE,

    -- Kaynak talep satırı (opsiyonel — elle oluşturulan satırlarda null)
    purchase_request_line_id  UUID REFERENCES purchase_request_line(id),

    -- Serbest ürün (katalog dışı) — true ise product_id null olur, product_name elle girilir
    is_free_product           BOOLEAN NOT NULL DEFAULT FALSE,

    -- Katalog ürünü (is_free_product = false iken dolu)
    product_id                UUID REFERENCES product(id),

    product_name              VARCHAR(100),

    -- Fiyat eşleşmesi sonucu set edilir (product_price'tan); eşleşme yoksa null
    product_price_id          UUID REFERENCES product_price(id),

    -- Sipariş miktarı — 3 ondalık hane
    quantity                  NUMERIC(18,3) NOT NULL CHECK (quantity > 0),

    unit_of_measure           VARCHAR(25),
    unit_price                NUMERIC(18,4),
    currency                  VARCHAR(3),

    -- Stored total (computed değil) — servis hesaplar
    total_amount              NUMERIC(18,2) NOT NULL DEFAULT 0,

    need_by_date              TIMESTAMPTZ,
    buyer_notes               VARCHAR(255),

    status                    VARCHAR(20) NOT NULL DEFAULT 'Draft',

    -- IBaseEntity
    is_active                 BOOLEAN NOT NULL DEFAULT TRUE,

    -- IAuditableEntity
    created_by                UUID NOT NULL,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by                UUID,
    updated_at                TIMESTAMPTZ,

    -- ISoftDeleteEntity
    is_deleted                BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by                UUID,
    deleted_at                TIMESTAMPTZ,

    CONSTRAINT chk_purchase_order_line_status
        CHECK (status IN ('Draft','Submitted','Confirmed','InDelivery','Received','Cancelled'))
);

-- =============================================
-- purchase_order_request_line
-- 1 OrderLine → N RequestLine (junction)
-- =============================================

CREATE TABLE purchase_order_request_line (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    purchase_order_line_id      UUID NOT NULL REFERENCES purchase_order_line(id) ON DELETE CASCADE,
    purchase_request_line_id    UUID NOT NULL REFERENCES purchase_request_line(id) ON DELETE RESTRICT,

    -- Bu talep satırından bu sipariş satırına aktarılan miktar (3 ondalık)
    allocated_quantity          NUMERIC(18,3) NOT NULL CHECK (allocated_quantity > 0),

    -- IBaseEntity
    is_active                   BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_order_request_line
        UNIQUE (purchase_order_line_id, purchase_request_line_id)
);

-- Indexes
CREATE INDEX idx_purchase_order_supplier ON purchase_order(supplier_id);
CREATE INDEX idx_purchase_order_request ON purchase_order(purchase_request_id);
CREATE INDEX idx_purchase_order_organization ON purchase_order(organization_id);
CREATE INDEX idx_purchase_order_owner ON purchase_order(owner_id);
CREATE INDEX idx_purchase_order_status ON purchase_order(status) WHERE is_deleted = FALSE;
CREATE INDEX idx_purchase_order_line_order ON purchase_order_line(purchase_order_id);
CREATE INDEX idx_purchase_order_line_request_line ON purchase_order_line(purchase_request_line_id);
CREATE INDEX idx_purchase_order_line_product ON purchase_order_line(product_id);
CREATE INDEX idx_purchase_order_line_product_price ON purchase_order_line(product_price_id);
CREATE INDEX idx_purchase_order_line_status ON purchase_order_line(status) WHERE is_deleted = FALSE;
CREATE INDEX idx_po_request_line_order_line ON purchase_order_request_line(purchase_order_line_id);
CREATE INDEX idx_po_request_line_request_line ON purchase_order_request_line(purchase_request_line_id);
CREATE UNIQUE INDEX uq_purchase_order_number ON purchase_order(order_number) WHERE is_deleted = FALSE;

-- Sequence for order number generation
CREATE SEQUENCE purchase_order_seq START 1;

COMMENT ON TABLE purchase_order IS 'Satın alma siparişleri — tedarikçiye gönderilir';
COMMENT ON TABLE purchase_order_line IS 'Sipariş satırları — satır bazlı status ve fiyat; aynı ürün için birden fazla talep satırı gruplanabilir';
COMMENT ON TABLE purchase_order_request_line IS 'OrderLine ↔ RequestLine junction; 1 sipariş satırı N talep satırından oluşabilir';
COMMENT ON COLUMN purchase_order.total_amount IS 'Satırların header currency''e parite uygulanmış toplamı';
COMMENT ON COLUMN purchase_order_line.product_id IS 'Null ise free-text satır (product_name kullanılır)';
COMMENT ON COLUMN purchase_order_line.total_amount IS 'quantity * unit_price (servis hesaplar)';
