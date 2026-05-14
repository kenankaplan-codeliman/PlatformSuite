-- =============================================
-- general_parameter — Dinamik parametre / enum altyapısı
--
-- Logic taşımayan enumların yerini alan, code + parent_code ile
-- hiyerarşik tutulan global sistem referans verisi:
--   - Kök satır:    code = enum tip adı (ör. 'LeadStatus'), parent_code = NULL
--   - Değer satırı: code = enum değeri (ör. 'New'),          parent_code = 'LeadStatus'
--
-- Global sistem verisidir — owner/organization filtresine tabi DEĞİLDİR.
-- Parametre kayıtları (enum değerleri) InitData seed scriptleriyle eklenir;
-- API yalnız okur.
-- =============================================

CREATE TABLE IF NOT EXISTS general_parameter (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),

    code         VARCHAR(100) NOT NULL,
    parent_code  VARCHAR(100),
    label        VARCHAR(250) NOT NULL,
    order_index  INTEGER      NOT NULL DEFAULT 0,
    description  VARCHAR(500),

    -- IBaseEntity
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,

    -- IAuditableEntity
    created_by   UUID         NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by   UUID,
    updated_at   TIMESTAMPTZ
);

-- Değer satırları: (parent_code, code) benzersiz
CREATE UNIQUE INDEX IF NOT EXISTS uq_general_parameter_value_code
    ON general_parameter (parent_code, code)
    WHERE parent_code IS NOT NULL;

-- Kök satırlar: code benzersiz
CREATE UNIQUE INDEX IF NOT EXISTS uq_general_parameter_root_code
    ON general_parameter (code)
    WHERE parent_code IS NULL;

-- parent_code ile gruplu listeleme için
CREATE INDEX IF NOT EXISTS idx_general_parameter_parent_code
    ON general_parameter (parent_code);
