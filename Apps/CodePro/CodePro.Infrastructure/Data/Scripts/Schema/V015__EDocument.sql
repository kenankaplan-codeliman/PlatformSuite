CREATE TABLE e_document (
    id                UUID        NOT NULL DEFAULT gen_random_uuid(),
    subject           VARCHAR(500) NOT NULL,
    description       VARCHAR(2000),
    document_type     VARCHAR(50)  NOT NULL,
    status            VARCHAR(50)  NOT NULL DEFAULT 'Sent',
    entity_type       VARCHAR(50)  NOT NULL,
    entity_id         UUID         NOT NULL,
    attachment_url    VARCHAR(1000),
    is_active         BOOLEAN      NOT NULL DEFAULT true,
    owner_id          UUID         NOT NULL,
    organization_id   UUID         NOT NULL,
    created_by        UUID         NOT NULL,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_by        UUID,
    updated_at        TIMESTAMPTZ,
    is_deleted        BOOLEAN      NOT NULL DEFAULT false,
    deleted_by        UUID,
    deleted_at        TIMESTAMPTZ,
    routing_type      VARCHAR(50),
    routing_groups    VARCHAR(500),
    routing_person_ids  VARCHAR(2000),
    routing_person_names VARCHAR(2000),
    CONSTRAINT pk_e_document PRIMARY KEY (id)
);

CREATE TABLE e_document_approval (
    id               UUID        NOT NULL DEFAULT gen_random_uuid(),
    e_document_id    UUID        NOT NULL REFERENCES e_document(id),
    user_id          UUID        NOT NULL,
    user_name        VARCHAR(200),
    status           VARCHAR(50) NOT NULL DEFAULT 'pending',
    comment          VARCHAR(2000),
    action_date      TIMESTAMPTZ,
    seen_at          TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_e_document_approval PRIMARY KEY (id)
);

CREATE TABLE e_document_comment (
    id               UUID        NOT NULL DEFAULT gen_random_uuid(),
    e_document_id    UUID        NOT NULL REFERENCES e_document(id),
    user_id          UUID        NOT NULL,
    user_name        VARCHAR(200) NOT NULL DEFAULT '',
    content          VARCHAR(2000) NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_e_document_comment PRIMARY KEY (id)
);
