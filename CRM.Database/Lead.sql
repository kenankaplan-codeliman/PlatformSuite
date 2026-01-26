create table if not exists lead (
    -- IBaseEntity
    id                          uuid primary key default gen_random_uuid(),

    -- Domain Properties
    company_name                varchar(200) not null,
    first_name                  varchar(100) not null,
    last_name                   varchar(100) not null,
    job_title                   varchar(100),
    email                       varchar(150),
    phone                       varchar(50),
    mobile_phone                varchar(50),
    website                     varchar(200),

    -- Enums (string)
    lead_source                 varchar(50) not null,
    lead_status                 varchar(50) not null,
    lead_rating                 varchar(50) not null,

    industry                    varchar(150),
    number_of_employees         int,
    annual_revenue              numeric(18,2),
    estimated_value             numeric(18,2),

    description                 varchar(1000),
    address                     varchar(1000),

    converted_date              timestamptz,
    converted_account_id        uuid,
    converted_contact_id        uuid,
    converted_opportunity_id    uuid,

    -- IBaseEntity
    is_active                   boolean not null default true,

    -- IAuditableEntity
    created_by                  uuid not null,
    created_at                  timestamptz not null default current_timestamp,
    updated_by                  uuid,
    updated_at                  timestamptz,

    -- ISoftDeleteEntity
    is_deleted                  boolean not null default false,
    deleted_by                  uuid,
    deleted_at                  timestamptz,

    -- IOwnedEntity
    owner_id                    uuid not null,
    organization_id             uuid not null,

    -- Enum constraints
    constraint chk_lead_source
        check (lead_source in (
            'Web','Phone','Email','Referral','Campaign','Other'
        )),

    constraint chk_lead_status
        check (lead_status in (
            'New','Contacted','Qualified','Converted','Disqualified'
        )),

    constraint chk_lead_rating
        check (lead_rating in (
            'Cold','Warm','Hot'
        ))
);
