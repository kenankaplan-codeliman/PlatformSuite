CREATE TABLE account (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_name varchar(250) NOT NULL,
    account_type varchar(50) NOT NULL,
    account_status varchar(50) NOT NULL DEFAULT 'Prospect' CHECK (account_status IN ('Prospect', 'Active', 'AtRisk', 'Inactive', 'Churned')),
    industry varchar(150),
    annual_revenue numeric(18,2),
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


CREATE TABLE account_email (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid NOT NULL,
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

    CONSTRAINT fk_account_email
        FOREIGN KEY (account_id)
        REFERENCES account(id)
        ON DELETE CASCADE
);

CREATE INDEX ix_account_email_account ON account_email(account_id);


CREATE TABLE account_phone (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid NOT NULL,
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

    CONSTRAINT fk_account_phone
        FOREIGN KEY (account_id)
        REFERENCES account(id)
        ON DELETE CASCADE
);

CREATE INDEX ix_account_phones_account ON account_phone(account_id);

CREATE TABLE account_address (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid NOT NULL,
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

    CONSTRAINT fk_account_address
        FOREIGN KEY (account_id)
        REFERENCES account(id)
        ON DELETE CASCADE
);

CREATE INDEX ix_account_address_account ON account_address(account_id);