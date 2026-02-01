-- =============================================
-- app_organization 
-- =============================================

create table if not exists app_organization (
    -- IBaseEntity
    id                      uuid primary key default gen_random_uuid(),

    -- Domain Properties
    organization_code       varchar(50) not null,
    organization_name       varchar(150) not null,
    description             varchar(1000) not null default '',
    parent_organization_id  uuid,

    -- Flags
    is_default              boolean not null default false,
    is_active               boolean not null default true,

    -- IAuditableEntity
    created_by              uuid not null,
    created_at              timestamptz not null default current_timestamp,
    updated_by              uuid,
    updated_at              timestamptz,

    -- ISoftDeleteEntity
    is_deleted              boolean not null default false,
    deleted_by              uuid,
    deleted_at              timestamptz,

    constraint fk_app_organization_parent
        foreign key (parent_organization_id)
        references app_organization (id)
);

-- =============================================
-- app_user  
-- =============================================

create table if not exists app_user (
    -- IBaseEntity
    id                  uuid primary key default gen_random_uuid(),

    -- Domain Properties
    email               varchar(150) not null,
    first_name          varchar(100) not null,
    last_name           varchar(100) not null,
    microsoft365_id     varchar(100),
    password_hash       varchar(500),
    organization_id      uuid not null,

    -- IBaseEntity
    is_active            boolean not null default true,

    -- IAuditableEntity
    created_by           uuid not null,
    created_at           timestamptz not null default current_timestamp,
    updated_by           uuid,
    updated_at           timestamptz,

    -- ISoftDeleteEntity
    is_deleted           boolean not null default false,
    deleted_by           uuid,
    deleted_at           timestamptz,

    constraint fk_app_user_org
        foreign key (organization_id)
        references app_organization (id)
);

-- =============================================
-- app_role  
-- =============================================

create table if not exists app_role (
    -- IBaseEntity
    id              uuid primary key default gen_random_uuid(),

    -- Domain Properties
    role_name       varchar(100) not null,
    description     varchar(1000),

    -- Flags
    is_default      boolean not null default false,
    is_active       boolean not null default true,

    -- IAuditableEntity
    created_by      uuid not null,
    created_at      timestamptz not null default current_timestamp,
    updated_by      uuid,
    updated_at      timestamptz
);

-- =============================================
-- app_privilege  
-- =============================================

create table if not exists app_privilege (
    -- IBaseEntity
    id               uuid primary key default gen_random_uuid(),

    -- Domain Properties
    privilege_code   varchar(100) not null,
    privilege_name   varchar(150) not null,
    description      varchar(1000),

    -- IBaseEntity
    is_active        boolean not null default true,

    -- IAuditableEntity
    created_by       uuid not null,
    created_at       timestamptz not null default current_timestamp,
    updated_by       uuid,
    updated_at       timestamptz
);

-- =============================================
-- app_user_role  
-- =============================================
create table if not exists app_user_role (
    -- IBaseEntity
    id          uuid primary key default gen_random_uuid(),

    -- Relationship
    user_id     uuid not null,
    role_id     uuid not null,

    -- IBaseEntity
    is_active   boolean not null default true,

    constraint fk_user_role_user
        foreign key (user_id)
        references app_user (id),

    constraint fk_user_role_role
        foreign key (role_id)
        references app_role (id)
);

-- =============================================
-- app_role_privilege  
-- =============================================

create table if not exists app_role_privilege (
    -- IBaseEntity
    id              uuid primary key default gen_random_uuid(),

    -- Relationship
    role_id         uuid not null,
    privilege_code  varchar(100) not null,

    -- Enum (string)
    access_level    varchar(20) not null,

    -- IBaseEntity
    is_active       boolean not null default true,

    -- Enum constraint
    constraint chk_access_level
        check (access_level in ('None','User','Organization','All')),

    constraint fk_role_privilege_role
        foreign key (role_id)
        references app_role (id)
);

-- =============================================
-- app_login_history  
-- =============================================

create table if not exists app_user_login (
    -- IBaseEntity
    id                          uuid primary key default gen_random_uuid(),

    -- Relationship
    user_id                     uuid not null,

    -- Domain Properties
    login_date                  timestamptz not null,
    logout_date                 timestamptz,

    access_token_id             varchar(100) not null,
    access_token_expires_at     timestamptz not null,

    refresh_token_id               varchar(100) not null,
    refresh_token_expires_at    timestamptz not null,
    refresh_count               int not null default 0,

    ip_address                  varchar(50),
    user_agent                  varchar(1000),

    -- IBaseEntity
    is_active                   boolean not null default true,

    constraint fk_login_user
        foreign key (user_id)
        references app_user (id)
);

