CREATE TABLE contract (
    id                        UUID         NOT NULL DEFAULT gen_random_uuid(),
    contract_number           VARCHAR(30)  NOT NULL,
    subject                   VARCHAR(500) NOT NULL,
    type                      VARCHAR(50)  NOT NULL,
    counterparty_name         VARCHAR(300) NOT NULL,
    counterparty_id           UUID,
    related_offer_id          UUID,
    start_date                DATE         NOT NULL,
    end_date                  DATE,
    renewal_type              VARCHAR(30)  NOT NULL DEFAULT 'None',
    amount                    NUMERIC(18,2),
    currency                  VARCHAR(10),
    payment_type              VARCHAR(30),
    responsible_user_id       UUID         NOT NULL,
    additional_responsible_user_ids TEXT,
    reminder_days_before      INT          NOT NULL DEFAULT 30,
    notes                     TEXT,
    status                    VARCHAR(50)  NOT NULL DEFAULT 'Draft',

    sent_to_counterparty_at   TIMESTAMPTZ,
    signed_at                 TIMESTAMPTZ,
    last_reminder_sent_at     TIMESTAMPTZ,

    is_active                 BOOLEAN      NOT NULL DEFAULT true,
    owner_id                  UUID         NOT NULL,
    organization_id           UUID         NOT NULL,

    created_by                UUID         NOT NULL,
    created_at                TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_by                UUID,
    updated_at                TIMESTAMPTZ,

    is_deleted                BOOLEAN      NOT NULL DEFAULT false,
    deleted_by                UUID,
    deleted_at                TIMESTAMPTZ,

    CONSTRAINT pk_contract PRIMARY KEY (id),
    CONSTRAINT uq_contract_number UNIQUE (contract_number)
);

CREATE INDEX ix_contract_status ON contract(status);
CREATE INDEX ix_contract_end_date ON contract(end_date);
CREATE INDEX ix_contract_responsible_user ON contract(responsible_user_id);

CREATE TABLE contract_approval_step (
    id                UUID         NOT NULL DEFAULT gen_random_uuid(),
    contract_id       UUID         NOT NULL REFERENCES contract(id) ON DELETE CASCADE,
    order_index       INT          NOT NULL,
    approver_user_id  UUID         NOT NULL,
    role_label        VARCHAR(200) NOT NULL,
    status            VARCHAR(30)  NOT NULL DEFAULT 'NotYet',
    actioned_at       TIMESTAMPTZ,
    rejection_reason  VARCHAR(2000),

    CONSTRAINT pk_contract_approval_step PRIMARY KEY (id)
);

CREATE INDEX ix_contract_approval_step_contract_id ON contract_approval_step(contract_id);

CREATE TABLE contract_form (
    id                 UUID         NOT NULL DEFAULT gen_random_uuid(),
    contract_id        UUID         NOT NULL REFERENCES contract(id) ON DELETE CASCADE,
    questionnaire_id   UUID         NOT NULL REFERENCES questionnaire(id),
    status             VARCHAR(30)  NOT NULL DEFAULT 'Empty',
    filled_by_user_id  UUID,
    filled_at          TIMESTAMPTZ,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT pk_contract_form PRIMARY KEY (id)
);

CREATE INDEX ix_contract_form_contract_id ON contract_form(contract_id);
CREATE INDEX ix_contract_form_questionnaire_id ON contract_form(questionnaire_id);

CREATE TABLE contract_form_answer (
    id                          UUID           NOT NULL DEFAULT gen_random_uuid(),
    contract_form_id            UUID           NOT NULL REFERENCES contract_form(id) ON DELETE CASCADE,
    questionnaire_question_id   UUID           NOT NULL REFERENCES questionnaire_question(id),
    answer_text                 VARCHAR(2000),
    answer_number               NUMERIC(18,4),
    answer_date                 DATE,
    answer_bool                 BOOLEAN,
    answer_options              VARCHAR(2000),

    CONSTRAINT pk_contract_form_answer PRIMARY KEY (id)
);

CREATE INDEX ix_contract_form_answer_form_id ON contract_form_answer(contract_form_id);
