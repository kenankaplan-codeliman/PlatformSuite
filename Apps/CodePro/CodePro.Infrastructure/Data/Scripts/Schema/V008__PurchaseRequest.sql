-- =============================================
-- purchase_request — Satın Alma Talepleri
-- =============================================

CREATE TABLE purchase_request (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Talep numarası — kullanıcı elle girer; boş gönderilirse servis PR-YYYY-NNNN formatında üretir
    request_number           VARCHAR(25) NOT NULL,

    title                    VARCHAR(50) NOT NULL,
    description              TEXT,

    status                   VARCHAR(20) NOT NULL DEFAULT 'Setup',
    priority                 VARCHAR(10) NOT NULL DEFAULT 'Medium',

    request_date             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    required_date            TIMESTAMPTZ,

    currency_code            VARCHAR(3),

    -- Kalem toplamı (header currency'e parite uygulanmış) — servis günceller
    total_amount             NUMERIC(18,2) NOT NULL DEFAULT 0,

    -- IBaseEntity
    is_active                BOOLEAN NOT NULL DEFAULT TRUE,

    -- IOwnedEntity
    owner_id                 UUID NOT NULL,
    organization_id          UUID NOT NULL,

    -- IAuditableEntity
    created_by               UUID NOT NULL,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by               UUID,
    updated_at               TIMESTAMPTZ,

    -- ISoftDeleteEntity
    is_deleted               BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by               UUID,
    deleted_at               TIMESTAMPTZ
);

-- =============================================
-- purchase_request_line — Talep Satırları
-- product_id null ise free-text line yani product ile ilişkili olmayan satır.
-- =============================================

CREATE TABLE purchase_request_line (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    purchase_request_id       UUID NOT NULL REFERENCES purchase_request(id) ON DELETE CASCADE,

    -- Serbest ürün (katalog dışı) — true ise product_id null olur, product_name elle girilir
    is_free_product           BOOLEAN NOT NULL DEFAULT FALSE,

    -- Katalog ürünü (is_free_product = false iken dolu)
    product_id                UUID REFERENCES product(id),

    product_name              VARCHAR(100),

    -- Fiyat eşleşmesi sonucu set edilir (product_price'tan); eşleşme yoksa null
    product_price_id          UUID REFERENCES product_price(id),

    -- Tedarikçi: fiyat eşleşirse product_price.supplier_id'den kopyalanır;
    -- eşleşme yoksa veya serbest ürün ise kullanıcı manuel seçer (nullable)
    supplier_id               UUID REFERENCES supplier(id),

    -- Miktar — 3 ondalık hane
    quantity                  NUMERIC(18,3) NOT NULL,

    unit_of_measure           VARCHAR(25),
    unit_price                NUMERIC(18,4),
    currency                  VARCHAR(3),

    -- Stored total (computed değil) — servis hesaplar
    total_amount              NUMERIC(18,2) NOT NULL DEFAULT 0,

    need_by_date              TIMESTAMPTZ,
    buyer_notes               VARCHAR(255),

    status                    VARCHAR(20) NOT NULL DEFAULT 'Setup',

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
    deleted_at                TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_purchase_request_organization ON purchase_request(organization_id);
CREATE INDEX idx_purchase_request_owner ON purchase_request(owner_id);
CREATE INDEX idx_purchase_request_status ON purchase_request(status) WHERE is_deleted = FALSE;
CREATE INDEX idx_purchase_request_line_request ON purchase_request_line(purchase_request_id);
CREATE INDEX idx_purchase_request_line_product ON purchase_request_line(product_id);
CREATE INDEX idx_purchase_request_line_product_price ON purchase_request_line(product_price_id);
CREATE INDEX idx_purchase_request_line_supplier ON purchase_request_line(supplier_id);
CREATE INDEX idx_purchase_request_line_status ON purchase_request_line(status) WHERE is_deleted = FALSE;
CREATE UNIQUE INDEX uq_purchase_request_number ON purchase_request(request_number) WHERE is_deleted = FALSE;

-- Sequence for request number generation
CREATE SEQUENCE purchase_request_seq START 1;

COMMENT ON TABLE purchase_request IS 'Satın alma talepleri';
COMMENT ON TABLE purchase_request_line IS 'Talep satırları — satır bazlı status ve fiyat';
COMMENT ON COLUMN purchase_request.request_number IS 'Kullanıcı elle girer; boş gönderilirse auto-gen PR-YYYY-NNNN';
COMMENT ON COLUMN purchase_request.total_amount IS 'Satırların header currency''e parite uygulanmış toplamı';
COMMENT ON COLUMN purchase_request_line.product_id IS 'Null ise free-text satır (product_name kullanılır)';
COMMENT ON COLUMN purchase_request_line.total_amount IS 'quantity * unit_price (servis hesaplar)';
