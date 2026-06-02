-- Opportunity satır kalemleri. product (V006) ve opportunity (V004) tablolarından SONRA
-- oluşturulur — FK ordering için.
CREATE TABLE opportunity_product (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    opportunity_id uuid NOT NULL,
    product_id uuid NOT NULL,

    quantity numeric(18,4) NOT NULL,
    -- Birim fiyat snapshot'ı. Para birimi parent opportunity.currency'den gelir —
    -- line-level currency yok (tüm satırlar deal currency'de).
    unit_price numeric(18,2) NOT NULL,
    -- Ölçü birimi snapshot'ı (GeneralParameter code, parentCode: ProductUnitOfMeasure).
    -- Ürün seçilince Product.UnitOfMeasure'dan prefill edilir; satır seviyesinde
    -- override edilebilir.
    unit_code varchar(50) NULL,

    -- İndirim alanları. Uygulama sırası: önce oran, sonra tutar.
    --   line_discount_rate_amount = quantity * unit_price * discount_rate / 100
    --   line_discount_total       = line_discount_rate_amount + discount_amount
    --   net_amount                = max(0, quantity*unit_price - line_discount_total)
    -- net_amount DB'de tutulmaz — DTO/handler tarafından hesaplanır.
    discount_rate numeric(5,2)  NOT NULL DEFAULT 0,
    discount_amount numeric(18,2) NOT NULL DEFAULT 0,

    is_active boolean NOT NULL DEFAULT true,

    created_by uuid NOT NULL,
    created_at timestamp NOT NULL,
    updated_by uuid NULL,
    updated_at timestamp NULL,

    is_deleted boolean NOT NULL DEFAULT false,
    deleted_by uuid NULL,
    deleted_at timestamp NULL,

    CONSTRAINT fk_opportunity_product_opportunity
        FOREIGN KEY (opportunity_id)
        REFERENCES opportunity(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_opportunity_product_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
        ON DELETE RESTRICT
);

CREATE INDEX ix_opportunity_product_opportunity ON opportunity_product(opportunity_id) WHERE is_deleted = false;
CREATE INDEX ix_opportunity_product_product ON opportunity_product(product_id) WHERE is_deleted = false;
