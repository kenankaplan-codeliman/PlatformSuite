CREATE TABLE product (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    name varchar(250) NOT NULL,
    product_code varchar(50) NOT NULL,

    category varchar(50),
    unit_price numeric(18,2),
    unit_price_currency varchar(10),
    unit_of_measure varchar(50),
    description text,

    owner_id uuid NOT NULL,
    organization_id uuid NOT NULL,

    is_active boolean NOT NULL DEFAULT true,

    created_by uuid NOT NULL,
    created_at timestamp NOT NULL,
    updated_by uuid NULL,
    updated_at timestamp NULL,

    is_deleted boolean NOT NULL DEFAULT false,
    deleted_by uuid NULL,
    deleted_at timestamp NULL
);

-- Benzersiz ürün kodu — yalnızca soft-delete edilmemiş satırlar arasında.
CREATE UNIQUE INDEX ix_product_code_unique ON product(product_code) WHERE is_deleted = false;
CREATE INDEX ix_product_owner ON product(owner_id) WHERE is_deleted = false;
CREATE INDEX ix_product_organization ON product(organization_id) WHERE is_deleted = false;
