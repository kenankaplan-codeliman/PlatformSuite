CREATE TABLE questionnaire (
    id                UUID         NOT NULL DEFAULT gen_random_uuid(),
    name              VARCHAR(300) NOT NULL,
    related_module    VARCHAR(50)  NOT NULL,
    status            VARCHAR(50)  NOT NULL DEFAULT 'Draft',

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

    CONSTRAINT pk_questionnaire PRIMARY KEY (id)
);

CREATE TABLE questionnaire_question (
    id                UUID         NOT NULL DEFAULT gen_random_uuid(),
    questionnaire_id  UUID         NOT NULL REFERENCES questionnaire(id) ON DELETE CASCADE,
    question_text     VARCHAR(1000) NOT NULL,
    question_type     VARCHAR(50)  NOT NULL,
    is_required       BOOLEAN      NOT NULL DEFAULT false,
    order_index       INTEGER      NOT NULL DEFAULT 0,

    CONSTRAINT pk_questionnaire_question PRIMARY KEY (id)
);

CREATE INDEX ix_questionnaire_question_questionnaire_id
    ON questionnaire_question(questionnaire_id);

CREATE TABLE questionnaire_question_option (
    id                      UUID         NOT NULL DEFAULT gen_random_uuid(),
    questionnaire_question_id UUID       NOT NULL REFERENCES questionnaire_question(id) ON DELETE CASCADE,
    option_text             VARCHAR(500) NOT NULL,
    order_index             INTEGER      NOT NULL DEFAULT 0,

    CONSTRAINT pk_questionnaire_question_option PRIMARY KEY (id)
);

CREATE INDEX ix_questionnaire_question_option_question_id
    ON questionnaire_question_option(questionnaire_question_id);
