-- =============================================
-- Attachment (Ek Dosya) Tabloları
-- =============================================

-- =============================================
-- attachment_file_data — Binary dosya verisi
-- Sadece ID ile ayrı çekilir; liste sorgularına dahil edilmez.
-- =============================================

CREATE TABLE attachment_file_data (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    data_bytes  BYTEA   NOT NULL
);

-- =============================================
-- attachment_file_metadata — Dosya meta verisi
--
-- document_type uygulamaya özgü string olarak saklanır; geçerli değerler
-- her app'in kendi sabit listesinde tutulur (örn. CRM Account doc types).
-- expires_at NOT NULL: draft (henüz hiçbir entity ile ilişkilendirilmemiş)
-- attachment için TTL. AssociateAsync ile NULL yapılır.
-- AttachmentCleanupService (Platform.Api) süresi geçenleri saatte bir siler.
-- =============================================

CREATE TABLE attachment_file_metadata (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    file_data_id    UUID        NOT NULL REFERENCES attachment_file_data(id) ON DELETE CASCADE,

    file_name       VARCHAR(500)    NOT NULL,
    content_type    VARCHAR(200)    NOT NULL,
    file_size       BIGINT          NOT NULL,
    document_type   VARCHAR(100)    NOT NULL DEFAULT 'Other',
    subject         VARCHAR(500),
    description     TEXT,

    expires_at      TIMESTAMPTZ,

    -- IBaseEntity
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,

    -- IOwnedEntity
    owner_id        UUID            NOT NULL,
    organization_id UUID            NOT NULL,

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

-- =============================================
-- attachment_file_relation — Entity ilişkisi
-- Bir dosyanın hangi entity ile ilişkili olduğunu tutar.
-- =============================================

CREATE TABLE attachment_file_relation (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    metadata_id     UUID        NOT NULL REFERENCES attachment_file_metadata(id) ON DELETE CASCADE,
    entity_id       UUID        NOT NULL,
    entity_type     VARCHAR(100) NOT NULL
);

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX idx_attachment_metadata_owner_id         ON attachment_file_metadata(owner_id);
CREATE INDEX idx_attachment_metadata_organization_id  ON attachment_file_metadata(organization_id);
CREATE INDEX idx_attachment_metadata_expires_at       ON attachment_file_metadata(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_attachment_relation_entity           ON attachment_file_relation(entity_id, entity_type);
CREATE INDEX idx_attachment_relation_metadata_id      ON attachment_file_relation(metadata_id);
