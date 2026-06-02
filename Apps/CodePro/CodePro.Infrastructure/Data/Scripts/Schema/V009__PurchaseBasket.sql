-- =============================================
-- purchase_basket — Satın Alma Sepetleri
-- Kullanıcıların Purchase Request öncesi ürün biriktirdiği sepet
-- =============================================

CREATE TABLE purchase_basket (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Sepet durumu: Preparing → Converted
    status                  VARCHAR(20) NOT NULL DEFAULT 'Preparing',

    -- Dönüşümden oluşan PR referansı
    purchase_request_id     UUID,

    -- IBaseEntity
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,

    -- IOwnedEntity
    owner_id                UUID NOT NULL,
    organization_id         UUID NOT NULL,

    -- IAuditableEntity
    created_by              UUID NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by              UUID,
    updated_at              TIMESTAMPTZ,

    -- ISoftDeleteEntity
    is_deleted              BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by              UUID,
    deleted_at              TIMESTAMPTZ,

    CONSTRAINT chk_purchase_basket_status
        CHECK (status IN ('Preparing','Converted')),
    CONSTRAINT fk_purchase_basket_purchase_request
        FOREIGN KEY (purchase_request_id) REFERENCES purchase_request(id)
);

-- Kullanıcı başına sadece bir aktif Preparing sepet olabilir
CREATE UNIQUE INDEX uq_purchase_basket_preparing_per_user
    ON purchase_basket(owner_id)
    WHERE status = 'Preparing' AND is_deleted = FALSE;

CREATE INDEX idx_purchase_basket_organization
    ON purchase_basket(organization_id);
CREATE INDEX idx_purchase_basket_owner
    ON purchase_basket(owner_id);
CREATE INDEX idx_purchase_basket_status
    ON purchase_basket(status) WHERE is_deleted = FALSE;

-- =============================================
-- purchase_basket_line — Sepet Satırları
-- =============================================

CREATE TABLE purchase_basket_line (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    purchase_basket_id      UUID NOT NULL REFERENCES purchase_basket(id) ON DELETE CASCADE,
    product_id              UUID NOT NULL REFERENCES product(id),

    -- İstenen adet (>0)
    quantity                INTEGER NOT NULL CHECK (quantity > 0),

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

CREATE INDEX idx_purchase_basket_line_basket
    ON purchase_basket_line(purchase_basket_id);
CREATE INDEX idx_purchase_basket_line_product
    ON purchase_basket_line(product_id);

COMMENT ON TABLE purchase_basket IS 'Kullanıcıya özel satın alma sepeti — Purchase Request öncesi hazırlık aşaması';
COMMENT ON COLUMN purchase_basket.status IS 'Preparing: kullanıcı düzenliyor | Converted: talep oluşturuldu';
COMMENT ON TABLE purchase_basket_line IS 'Sepet satırları — hangi üründen kaç adet';
