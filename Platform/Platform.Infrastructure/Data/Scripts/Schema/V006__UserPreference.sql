create table user_preference (
    -- IBaseEntity
    id                uuid primary key default gen_random_uuid(),

    -- Domain Properties
    preference_key    varchar(150) not null,
    value             text not null,

    -- IBaseEntity
    is_active         boolean not null default true,

    -- IOwnedEntity
    owner_id          uuid not null,
    organization_id   uuid not null,

    -- IAuditableEntity
    created_by        uuid not null,
    created_at        timestamptz not null default current_timestamp,
    updated_by        uuid,
    updated_at        timestamptz,

    -- ISoftDeleteEntity
    is_deleted        boolean not null default false,
    deleted_by        uuid,
    deleted_at        timestamptz
);

-- Kullanıcı + anahtar başına tek tercih.
create unique index ux_user_preference_owner_key
    on user_preference (owner_id, preference_key)
    where is_deleted = false;
