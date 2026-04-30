CREATE TABLE contact (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name varchar(150) NOT NULL,
    last_name varchar(150) NOT NULL,
    contact_status varchar(50) NOT NULL DEFAULT 'Active' CHECK (contact_status IN ('Active', 'DoNotContact', 'Unsubscribed', 'Inactive')),
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

CREATE TABLE contact_email (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id uuid NOT NULL,
    email varchar(320) NOT NULL,
    type varchar(50) NOT NULL,
    is_primary boolean NOT NULL DEFAULT false,
    
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by uuid NOT NULL,
    created_at timestamp NOT NULL,
    updated_by uuid NULL,
    updated_at timestamp NULL,

    is_deleted boolean NOT NULL DEFAULT false,
    deleted_by uuid NULL,
    deleted_at timestamp NULL,

    CONSTRAINT fk_contact_email
        FOREIGN KEY (contact_id)
        REFERENCES contact(id)
        ON DELETE CASCADE
);

CREATE INDEX ix_contact_email_contact ON contact_email(contact_id);

CREATE TABLE contact_phone (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id uuid NOT NULL,
    phone_number varchar(50) NOT NULL,
    type varchar(50) NOT NULL,
    is_primary boolean NOT NULL DEFAULT false,
    
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by uuid NOT NULL,
    created_at timestamp NOT NULL,
    updated_by uuid NULL,
    updated_at timestamp NULL,

    is_deleted boolean NOT NULL DEFAULT false,
    deleted_by uuid NULL,
    deleted_at timestamp NULL,

    CONSTRAINT fk_contact_phone
        FOREIGN KEY (contact_id)
        REFERENCES contact(id)
        ON DELETE CASCADE
);

create INDEX ix_contact_phone_contact ON contact_phone(contact_id);

CREATE TABLE contact_address (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id uuid NOT NULL,
    address_line1 varchar(250) NOT NULL,
    address_line2 varchar(250),
    city varchar(150),
    state varchar(150),
    postal_code varchar(50),
    country varchar(150),
    type varchar(50) NOT NULL,
    is_primary boolean NOT NULL DEFAULT false,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by uuid NOT NULL,
    created_at timestamp NOT NULL,
    updated_by uuid NULL,
    updated_at timestamp NULL,

    is_deleted boolean NOT NULL DEFAULT false,
    deleted_by uuid NULL,
    deleted_at timestamp NULL,
    
    CONSTRAINT fk_contact_address
        FOREIGN KEY (contact_id)
        REFERENCES contact(id)
        ON DELETE CASCADE
);

CREATE INDEX ix_contact_address_contact ON contact_address(contact_id);



