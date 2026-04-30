-- =============================================
-- product_image — Ürün Resimleri
-- Hem orijinal (image_bytes) hem de yeniden boyutlandırılmış (thumbnail_bytes)
-- saklanır. Gösterimlerde daima thumbnail kullanılır.
-- Her ürünün en fazla bir varsayılan (is_default = TRUE) resmi olabilir.
-- =============================================

CREATE TABLE IF NOT EXISTS product_image (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID            NOT NULL REFERENCES product(id) ON DELETE CASCADE,

    file_name       VARCHAR(500)    NOT NULL,
    content_type    VARCHAR(200)    NOT NULL,
    file_size       BIGINT          NOT NULL,
    image_bytes     BYTEA           NOT NULL,
    thumbnail_bytes BYTEA           NOT NULL,

    sort_order      INTEGER         NOT NULL DEFAULT 0,
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,

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

CREATE INDEX IF NOT EXISTS idx_product_image_product_id ON product_image(product_id) WHERE is_deleted = FALSE;

-- Ürün başına yalnızca bir varsayılan olabilir.
CREATE UNIQUE INDEX IF NOT EXISTS uq_product_image_default
    ON product_image(product_id)
    WHERE is_default = TRUE AND is_deleted = FALSE;
