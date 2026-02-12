CREATE TABLE opportunity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(250) NOT NULL,
    estimated_value numeric(18,2) NOT NULL,
    close_date date,
    stage varchar(50) NOT NULL,
    probability integer NOT NULL,

    account_id uuid NOT NULL,

    owner_id uuid NOT NULL,
    organization_id uuid NOT NULL,

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
        ON DELETE RESTRICT
);

CREATE INDEX ix_opportunities_account ON opportunity(account_id);
