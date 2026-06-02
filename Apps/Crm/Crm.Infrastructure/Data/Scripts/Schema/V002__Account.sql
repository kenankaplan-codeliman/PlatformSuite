CREATE TABLE account (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_name varchar(250) NOT NULL,
    account_type varchar(50) NOT NULL,
    account_status varchar(50) NOT NULL DEFAULT 'Prospect' CHECK (account_status IN ('Prospect', 'Active', 'AtRisk', 'Inactive', 'Churned')),
    industry varchar(150),
    annual_revenue numeric(18,2),
    annual_revenue_currency varchar(10),
    number_of_employees integer,
    website varchar(250),
    description text,

    parent_account_id uuid NULL,

    owner_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by uuid NOT NULL,
    created_at timestamp NOT NULL,
    updated_by uuid NULL,
    updated_at timestamp NULL,

    is_deleted boolean NOT NULL DEFAULT false,
    deleted_by uuid NULL,
    deleted_at timestamp NULL,

    CONSTRAINT fk_account_parent 
    	FOREIGN KEY (parent_account_id) 
    	REFERENCES account(id)  
    	ON DELETE RESTRICT
);


CREATE TABLE account_contact (
	
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	
    account_id uuid NOT NULL,
    contact_id uuid NOT NULL,
    role varchar(150),
    is_primary boolean NOT NULL DEFAULT false,
    
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by uuid NOT NULL,
    created_at timestamp NOT NULL,
    updated_by uuid NULL,
    updated_at timestamp NULL,

    is_deleted boolean NOT NULL DEFAULT false,
    deleted_by uuid NULL,
    deleted_at timestamp NULL,

    CONSTRAINT fk_ac_account
        FOREIGN KEY (account_id)
        REFERENCES account(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ac_contact
        FOREIGN KEY (contact_id)
        REFERENCES contact(id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX ix_account_contact_account_contact_unique
ON account_contact(account_id, contact_id)
WHERE is_deleted = false;

-- Email/telefon/adres account'a özel tabloda değil; polimorfik owner ile
-- V005__Communications.sql'deki email_address/phone/address tablolarında tutulur.
