-- -----------------------------------------------------------------------------
-- TABLE: opportunity
-- -----------------------------------------------------------------------------
drop table opportunity;
CREATE TABLE opportunity (
    id                  UUID            NOT NULL DEFAULT gen_random_uuid(),
    name                VARCHAR(250)    NOT NULL,
    description         TEXT,

    -- Finansal
    estimated_value     NUMERIC(18, 2)  NOT NULL,
    actual_value        NUMERIC(18, 2),
    currency            CHAR(3)         NOT NULL DEFAULT 'TRY',

    -- Aşama & tahmin
    stage               VARCHAR(50)     not null,
    probability         SMALLINT        NOT null CONSTRAINT chk_opportunity_probability CHECK (probability BETWEEN 0 AND 100),
    close_date          DATE,

    -- Kaynak
    source              VARCHAR(50),

    -- İlişkiler
    account_id          UUID            NOT NULL,
    contact_id          UUID,

    -- IBaseEntity
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,

    -- IOwnedEntity
    owner_id            UUID            NOT NULL,
    organization_id     UUID            NOT NULL,

    -- IAuditableEntity
    created_by          UUID            NOT NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_by          UUID,
    updated_at          TIMESTAMPTZ,

    -- ISoftDeleteEntity
    is_deleted          BOOLEAN         NOT NULL DEFAULT FALSE,
    deleted_by          UUID,
    deleted_at          TIMESTAMPTZ,

    CONSTRAINT pk_opportunity              PRIMARY KEY (id),
    CONSTRAINT fk_opportunity_account      FOREIGN KEY (account_id)
        REFERENCES account (id)            ON DELETE RESTRICT,
    CONSTRAINT fk_opportunity_contact      FOREIGN KEY (contact_id)
        REFERENCES contact (id)            ON DELETE SET NULL
);

CREATE INDEX idx_opportunity_account_id      ON opportunity (account_id);
CREATE INDEX idx_opportunity_contact_id      ON opportunity (contact_id);
CREATE INDEX idx_opportunity_organization_id ON opportunity (organization_id);
CREATE INDEX idx_opportunity_stage           ON opportunity (stage);
CREATE INDEX idx_opportunity_is_deleted      ON opportunity (is_deleted);

COMMENT ON TABLE  opportunity                IS 'Satış fırsatları';
COMMENT ON COLUMN opportunity.estimated_value IS 'Tahmini fırsat değeri';
COMMENT ON COLUMN opportunity.actual_value    IS 'Kapanış sonrası gerçekleşen değer (Closed Won)';
COMMENT ON COLUMN opportunity.currency        IS 'ISO 4217 para birimi kodu (ör: TRY, USD, EUR)';
COMMENT ON COLUMN opportunity.probability     IS 'Kazanma olasılığı 0–100 arasında yüzde değeri';
COMMENT ON COLUMN opportunity.stage           IS 'Aşama: Prospecting | Qualification | NeedsAnalysis | ValueProposition | Proposal | Negotiation | ClosedWon | ClosedLost';
COMMENT ON COLUMN opportunity.source          IS 'Kaynak: Web | Referral | ColdCall | EmailCampaign | Event | SocialMedia | Partner | ExistingCustomer | Other';

-- -----------------------------------------------------------------------------
-- TABLE: opportunity_product  (junction / kalem tablosu)
-- -----------------------------------------------------------------------------

CREATE TABLE opportunity_product (
    id                  UUID            NOT NULL DEFAULT gen_random_uuid(),

    -- FK alanlar
    opportunity_id      UUID            NOT NULL,
    product_id          UUID            NOT NULL,

    -- Kalem bilgileri
    quantity            INTEGER         NOT NULL DEFAULT 1
                            CONSTRAINT chk_op_quantity CHECK (quantity > 0),
    unit_price          NUMERIC(18, 2)  NOT NULL,
    discount_percent    NUMERIC(5, 2)   NOT NULL DEFAULT 0
                            CONSTRAINT chk_op_discount_percent CHECK (discount_percent BETWEEN 0 AND 100),
    discount_amount     NUMERIC(18, 2)  NOT NULL DEFAULT 0
                            CONSTRAINT chk_op_discount_amount  CHECK (discount_amount >= 0),
    description         TEXT,

    -- Hesaplanan toplam (opsiyonel — uygulama katmanında da hesaplanabilir)
    -- total_price = MAX(0, quantity * unit_price - discount_amount - quantity * unit_price * discount_percent / 100)
    total_price         NUMERIC(18, 2)  GENERATED ALWAYS AS (
                            GREATEST(
                                0,
                                quantity * unit_price
                                - discount_amount
                                - quantity * unit_price * discount_percent / 100.0
                            )
                        ) STORED,

    -- IBaseEntity
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,

    -- IAuditableEntity
    created_by          UUID            NOT NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_by          UUID,
    updated_at          TIMESTAMPTZ,

    CONSTRAINT pk_opportunity_product           PRIMARY KEY (id),
    CONSTRAINT uq_opportunity_product           UNIQUE (opportunity_id, product_id),
    CONSTRAINT fk_opp_product_opportunity       FOREIGN KEY (opportunity_id)
        REFERENCES opportunity (id)             ON DELETE CASCADE,
    CONSTRAINT fk_opp_product_product           FOREIGN KEY (product_id)
        REFERENCES product (id)                 ON DELETE RESTRICT
);

CREATE INDEX idx_opp_product_opportunity_id ON opportunity_product (opportunity_id);
CREATE INDEX idx_opp_product_product_id     ON opportunity_product (product_id);

COMMENT ON TABLE  opportunity_product                  IS 'Fırsat–Ürün kalem tablosu (many-to-many)';
COMMENT ON COLUMN opportunity_product.unit_price       IS 'Satış anındaki birim fiyat; product.unit_price override edilebilir';
COMMENT ON COLUMN opportunity_product.discount_percent IS 'İndirim yüzdesi (0–100)';
COMMENT ON COLUMN opportunity_product.discount_amount  IS 'Sabit indirim tutarı';
COMMENT ON COLUMN opportunity_product.total_price      IS 'Hesaplanan kalem tutarı (GENERATED ALWAYS STORED)';