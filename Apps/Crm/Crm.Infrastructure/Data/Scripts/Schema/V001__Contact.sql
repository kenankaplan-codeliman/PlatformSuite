CREATE TABLE contact (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name varchar(150) NOT NULL,
    last_name varchar(150) NOT NULL,
    contact_status varchar(50) NOT NULL DEFAULT 'Active',
    title varchar(150),
    department varchar(150),
    birth_date date,
    description text,

    owner_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by uuid NOT NULL,
    created_at timestamp NOT NULL,
    updated_by uuid NULL,
    updated_at timestamp NULL,

    is_deleted boolean NOT NULL DEFAULT false,
    deleted_by uuid NULL,
    deleted_at timestamp NULL
);

-- Email/telefon/adres contact'a özel tabloda değil; polimorfik owner ile
-- V005__Communications.sql'deki email_address/phone/address tablolarında tutulur.



