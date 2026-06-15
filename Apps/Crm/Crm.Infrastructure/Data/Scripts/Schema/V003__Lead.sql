CREATE TABLE lead (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    subject varchar(250) NOT NULL,

    -- Kişi bilgisi (Convert sırasında Contact'a taşınır)
    first_name varchar(100),
    last_name varchar(100),
    title varchar(150),
    department varchar(200),

    -- Firma bilgisi (Convert sırasında Account'a taşınır)
    company varchar(250),
    industry varchar(150),
    website varchar(250),

    -- İletişim (email/telefon/adres) polimorfik Communications modelinde tutulur
    -- (email_address/phone/address, parent_entity_type = 'Lead') — düz alan yok.

    source varchar(50) NOT NULL,
    status varchar(50) NOT NULL DEFAULT 'New',
    -- Sınıflandırma: GeneralParameter code (LeadRating → Hot/Warm/Cold)
    rating varchar(50),

    score integer,
    estimated_value numeric(18,2),
    estimated_value_currency varchar(10),
    description text,

    converted_account_id uuid NULL,
    converted_contact_id uuid NULL,
    converted_at timestamp NULL,

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

    CONSTRAINT fk_lead_converted_account
        FOREIGN KEY (converted_account_id)
        REFERENCES account(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_lead_converted_contact
        FOREIGN KEY (converted_contact_id)
        REFERENCES contact(id)
        ON DELETE SET NULL
);

CREATE INDEX ix_lead_status ON lead(status) WHERE is_deleted = false;
CREATE INDEX ix_lead_owner ON lead(owner_id) WHERE is_deleted = false;
CREATE INDEX ix_lead_organization ON lead(organization_id) WHERE is_deleted = false;
