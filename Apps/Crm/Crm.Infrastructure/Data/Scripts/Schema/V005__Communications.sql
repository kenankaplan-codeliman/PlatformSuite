-- =============================================
-- CRM Schema / V005 — Communications (polimorfik owner, junction yok)
-- Email/telefon/adres her sahip entity için ayrı tabloda değil; tür başına tek tabloda
-- (email_address/phone/address) ve sahiplik parent_entity_type + parent_entity_id ile tutulur.
-- =============================================

CREATE TABLE email_address (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_entity_type varchar(100) NOT NULL,
    parent_entity_id   uuid NOT NULL,
    email              varchar(320) NOT NULL,
    type               varchar(50) NOT NULL,
    is_primary         boolean NOT NULL DEFAULT false,
    is_active          boolean NOT NULL DEFAULT true,
    created_by         uuid NOT NULL,
    created_at         timestamp NOT NULL,
    updated_by         uuid NULL,
    updated_at         timestamp NULL,
    is_deleted         boolean NOT NULL DEFAULT false,
    deleted_by         uuid NULL,
    deleted_at         timestamp NULL
);
CREATE INDEX ix_email_address_parent ON email_address(parent_entity_type, parent_entity_id);

CREATE TABLE phone (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_entity_type varchar(100) NOT NULL,
    parent_entity_id   uuid NOT NULL,
    phone_number       varchar(50) NOT NULL,
    type               varchar(50) NOT NULL,
    is_primary         boolean NOT NULL DEFAULT false,
    is_active          boolean NOT NULL DEFAULT true,
    created_by         uuid NOT NULL,
    created_at         timestamp NOT NULL,
    updated_by         uuid NULL,
    updated_at         timestamp NULL,
    is_deleted         boolean NOT NULL DEFAULT false,
    deleted_by         uuid NULL,
    deleted_at         timestamp NULL
);
CREATE INDEX ix_phone_parent ON phone(parent_entity_type, parent_entity_id);

CREATE TABLE address (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_entity_type varchar(100) NOT NULL,
    parent_entity_id   uuid NOT NULL,
    address_line1      varchar(250) NOT NULL,
    address_line2      varchar(250),
    -- GeneralParameter kodları (parent_code zinciri) + denormalize adlar (snapshot)
    country_code       varchar(100),
    country_name       varchar(150),
    city_code          varchar(100),
    city_name          varchar(150),
    district_code      varchar(100),
    district_name      varchar(150),
    state              varchar(150),
    postal_code        varchar(50),
    type               varchar(50) NOT NULL,
    is_primary         boolean NOT NULL DEFAULT false,
    is_active          boolean NOT NULL DEFAULT true,
    created_by         uuid NOT NULL,
    created_at         timestamp NOT NULL,
    updated_by         uuid NULL,
    updated_at         timestamp NULL,
    is_deleted         boolean NOT NULL DEFAULT false,
    deleted_by         uuid NULL,
    deleted_at         timestamp NULL
);
CREATE INDEX ix_address_parent ON address(parent_entity_type, parent_entity_id);
