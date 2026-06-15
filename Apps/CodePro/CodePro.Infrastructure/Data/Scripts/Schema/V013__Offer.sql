CREATE TABLE offer (
    id                        UUID         NOT NULL DEFAULT gen_random_uuid(),
    offer_number              VARCHAR(30)  NOT NULL,
    offer_type                VARCHAR(30)  NOT NULL,
    subject                   VARCHAR(500) NOT NULL,
    counterparty_name         VARCHAR(300) NOT NULL,
    counterparty_id           UUID,
    responsible_user_id       UUID         NOT NULL,
    valid_from                DATE,
    valid_until               DATE         NOT NULL,
    currency                  VARCHAR(10)  NOT NULL DEFAULT 'TRY',
    discount_percentage       NUMERIC(5,2) NOT NULL DEFAULT 0,
    subtotal                  NUMERIC(18,2) NOT NULL DEFAULT 0,
    vat_total                 NUMERIC(18,2) NOT NULL DEFAULT 0,
    grand_total               NUMERIC(18,2) NOT NULL DEFAULT 0,
    notes                     TEXT,
    status                    VARCHAR(50)  NOT NULL DEFAULT 'Draft',
    result_reason             TEXT,
    result_reason_category    VARCHAR(30),
    converted_contract_id     UUID,

    sent_to_counterparty_at   TIMESTAMPTZ,
    result_marked_at          TIMESTAMPTZ,

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

    CONSTRAINT pk_offer PRIMARY KEY (id),
    CONSTRAINT uq_offer_number UNIQUE (offer_number),
    CONSTRAINT fk_offer_contract
        FOREIGN KEY (converted_contract_id) REFERENCES contract(id)
);

CREATE INDEX ix_offer_status ON offer(status);
CREATE INDEX ix_offer_valid_until ON offer(valid_until);

-- ---------- OFFER INVITEE (davetli tedarikçiler) ----------
CREATE TABLE offer_invitee (
    id              UUID         NOT NULL DEFAULT gen_random_uuid(),
    offer_id        UUID         NOT NULL,
    supplier_id     UUID,
    supplier_name   VARCHAR(300) NOT NULL,
    supplier_email  VARCHAR(300),
    invited_at      TIMESTAMPTZ,
    status          VARCHAR(30)  NOT NULL DEFAULT 'Invited',
    quote_amount    NUMERIC(18,2),
    quote_currency  VARCHAR(10),
    quote_notes     TEXT,
    quoted_at       TIMESTAMPTZ,
    CONSTRAINT pk_offer_invitee PRIMARY KEY (id),
    CONSTRAINT fk_offer_invitee_offer
        FOREIGN KEY (offer_id) REFERENCES offer(id) ON DELETE CASCADE
);

CREATE INDEX ix_offer_invitee_offer_id ON offer_invitee(offer_id);
CREATE INDEX ix_offer_responsible_user ON offer(responsible_user_id);

CREATE TABLE offer_item (
    id              UUID           NOT NULL DEFAULT gen_random_uuid(),
    offer_id        UUID           NOT NULL REFERENCES offer(id) ON DELETE CASCADE,
    order_index     INT            NOT NULL DEFAULT 0,
    product_id      UUID,
    product_name    VARCHAR(500)   NOT NULL,
    quantity        NUMERIC(18,4)  NOT NULL DEFAULT 1,
    unit            VARCHAR(30)    NOT NULL DEFAULT 'Piece',
    unit_price      NUMERIC(18,4)  NOT NULL DEFAULT 0,
    vat_rate        VARCHAR(20)    NOT NULL DEFAULT 'Twenty',
    line_total      NUMERIC(18,2)  NOT NULL DEFAULT 0,
    line_vat        NUMERIC(18,2)  NOT NULL DEFAULT 0,

    CONSTRAINT pk_offer_item PRIMARY KEY (id)
);

CREATE INDEX ix_offer_item_offer_id ON offer_item(offer_id);

CREATE TABLE offer_approval_step (
    id                UUID         NOT NULL DEFAULT gen_random_uuid(),
    offer_id          UUID         NOT NULL REFERENCES offer(id) ON DELETE CASCADE,
    order_index       INT          NOT NULL,
    approver_user_id  UUID         NOT NULL,
    role_label        VARCHAR(200) NOT NULL,
    status            VARCHAR(30)  NOT NULL DEFAULT 'NotYet',
    actioned_at       TIMESTAMPTZ,
    rejection_reason  VARCHAR(2000),

    CONSTRAINT pk_offer_approval_step PRIMARY KEY (id)
);

CREATE INDEX ix_offer_approval_step_offer_id ON offer_approval_step(offer_id);

CREATE TABLE offer_form (
    id                 UUID         NOT NULL DEFAULT gen_random_uuid(),
    offer_id           UUID         NOT NULL REFERENCES offer(id) ON DELETE CASCADE,
    questionnaire_id   UUID         NOT NULL REFERENCES questionnaire(id),
    status             VARCHAR(30)  NOT NULL DEFAULT 'Empty',
    filled_by_user_id  UUID,
    filled_at          TIMESTAMPTZ,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT pk_offer_form PRIMARY KEY (id)
);

CREATE INDEX ix_offer_form_offer_id ON offer_form(offer_id);

CREATE TABLE offer_form_answer (
    id                          UUID           NOT NULL DEFAULT gen_random_uuid(),
    offer_form_id               UUID           NOT NULL REFERENCES offer_form(id) ON DELETE CASCADE,
    questionnaire_question_id   UUID           NOT NULL REFERENCES questionnaire_question(id),
    answer_text                 VARCHAR(2000),
    answer_number               NUMERIC(18,4),
    answer_date                 DATE,
    answer_bool                 BOOLEAN,
    answer_options              VARCHAR(2000),

    CONSTRAINT pk_offer_form_answer PRIMARY KEY (id)
);

CREATE INDEX ix_offer_form_answer_form_id ON offer_form_answer(offer_form_id);

-- Not: contract.related_offer_id ile offer.converted_contract_id arasında circular FK var.
-- Offer → Contract FK V013'te inline tanımlı (yukarıda). Contract → Offer yönü ise weak
-- ref (sadece UUID, DB FK yok) — referans bütünlüğü Application/Domain katmanında sağlanır.
-- Bu sayede tüm şema "ALTER" gerektirmeden from-zero CREATE'lerle kurulabilir.
