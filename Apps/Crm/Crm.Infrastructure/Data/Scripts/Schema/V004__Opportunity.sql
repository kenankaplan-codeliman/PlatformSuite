CREATE TABLE opportunity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    name varchar(250) NOT NULL,
    description text,

    account_id uuid NOT NULL,
    primary_contact_id uuid NULL,

    stage varchar(50) NOT NULL DEFAULT 'Prospecting' CHECK (stage IN ('Prospecting', 'Qualification', 'NeedsAnalysis', 'Proposal', 'Negotiation', 'ClosedWon', 'ClosedLost')),
    amount numeric(18,2),
    probability integer NOT NULL DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
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
