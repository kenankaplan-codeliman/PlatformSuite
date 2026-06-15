CREATE TABLE opportunity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    name varchar(250) NOT NULL,
    description text,

    account_id uuid NOT NULL,
    primary_contact_id uuid NULL,

    stage varchar(50) NOT NULL DEFAULT 'Prospecting',
    estimated_amount numeric(18,2),
    -- Deal-level para birimi (GeneralParameter CurrencyType code).
    -- estimated_amount + actual_amount + tüm opportunity_product satırları bu currency'de.
    -- Multi-currency line item desteği yok (FX dönüşümü kapsam dışı).
    currency varchar(10),
    -- Gerçekleşen tutar: Products satır toplamlarının (brüt) toplamı (server hesaplar).
    -- Tüm satırlar tek currency'de olduğu için toplam matematiksel olarak anlamlı.
    actual_amount numeric(18,2),
    -- Gerçekleşen NET tutar: satırların NetAmount toplamı (oran+tutar indirim uygulanmış).
    actual_net_amount numeric(18,2),
    -- Tüm satırların indirim tutarlarının (oran cinsinden + tutar cinsinden) currency toplamı.
    total_discount_amount numeric(18,2),
    -- Fırsat seviyesindeki efektif indirim oranı (0-100) = total_discount_amount / actual_amount * 100.
    -- actual_amount NULL/0 ise NULL.
    total_discount_rate numeric(5,2),
    probability integer NOT NULL DEFAULT 0,
    close_date timestamp NULL,
    loss_reason varchar(500),

    owner_id uuid NOT NULL,
    organization_id uuid NOT NULL,

    is_active boolean NOT NULL DEFAULT true,

    created_by uuid NOT NULL,
    created_at timestamp NOT NULL,
    updated_by uuid NULL,
    updated_at timestamp NULL,

    is_deleted boolean NOT NULL DEFAULT false,
    deleted_by uuid NULL,
    deleted_at timestamp NULL,

    CONSTRAINT fk_opportunity_account
        FOREIGN KEY (account_id)
        REFERENCES account(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_opportunity_primary_contact
        FOREIGN KEY (primary_contact_id)
        REFERENCES contact(id)
        ON DELETE SET NULL
);

CREATE INDEX ix_opportunity_stage ON opportunity(stage) WHERE is_deleted = false;
CREATE INDEX ix_opportunity_account ON opportunity(account_id) WHERE is_deleted = false;
CREATE INDEX ix_opportunity_owner ON opportunity(owner_id) WHERE is_deleted = false;
CREATE INDEX ix_opportunity_organization ON opportunity(organization_id) WHERE is_deleted = false;
