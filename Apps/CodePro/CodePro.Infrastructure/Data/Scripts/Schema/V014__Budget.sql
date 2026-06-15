-- =====================================================
-- BUDGET MANAGEMENT MODULE
-- =====================================================

-- ---------- BUDGET CATEGORY ----------
CREATE TABLE budget_category (
    id                 UUID         NOT NULL DEFAULT gen_random_uuid(),
    name               VARCHAR(200) NOT NULL,
    code               VARCHAR(50),
    description        VARCHAR(1000),
    parent_category_id UUID,

    is_active          BOOLEAN      NOT NULL DEFAULT true,
    owner_id           UUID         NOT NULL,
    organization_id    UUID         NOT NULL,

    created_by         UUID         NOT NULL,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_by         UUID,
    updated_at         TIMESTAMPTZ,

    is_deleted         BOOLEAN      NOT NULL DEFAULT false,
    deleted_by         UUID,
    deleted_at         TIMESTAMPTZ,

    CONSTRAINT pk_budget_category PRIMARY KEY (id),
    CONSTRAINT fk_budget_category_parent
        FOREIGN KEY (parent_category_id) REFERENCES budget_category(id) ON DELETE RESTRICT
);

CREATE INDEX ix_budget_category_code   ON budget_category(code);
CREATE INDEX ix_budget_category_parent ON budget_category(parent_category_id);

-- ---------- BUDGET ----------
CREATE TABLE budget (
    id                          UUID           NOT NULL DEFAULT gen_random_uuid(),

    name                        VARCHAR(300)   NOT NULL,
    description                 VARCHAR(1000),

    scope_organization_id       UUID,
    budget_category_id          UUID,

    period_type                 VARCHAR(30)    NOT NULL,
    start_date                  DATE           NOT NULL,
    end_date                    DATE           NOT NULL,

    total_amount                NUMERIC(18,2)  NOT NULL DEFAULT 0,
    currency                    VARCHAR(10)    NOT NULL DEFAULT 'TRY',

    overflow_behavior           VARCHAR(30)    NOT NULL DEFAULT 'Block',
    reservation_release_point   VARCHAR(30)    NOT NULL DEFAULT 'PurchaseOrder',

    alert_threshold_percentage  INT            NOT NULL DEFAULT 80,
    carry_over_enabled          BOOLEAN        NOT NULL DEFAULT false,

    responsible_user_id         UUID           NOT NULL,

    status                      VARCHAR(30)    NOT NULL DEFAULT 'Active',

    is_active                   BOOLEAN        NOT NULL DEFAULT true,
    owner_id                    UUID           NOT NULL,
    organization_id             UUID           NOT NULL,

    created_by                  UUID           NOT NULL,
    created_at                  TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_by                  UUID,
    updated_at                  TIMESTAMPTZ,

    is_deleted                  BOOLEAN        NOT NULL DEFAULT false,
    deleted_by                  UUID,
    deleted_at                  TIMESTAMPTZ,

    CONSTRAINT pk_budget PRIMARY KEY (id),
    CONSTRAINT fk_budget_scope_organization
        FOREIGN KEY (scope_organization_id) REFERENCES auth_organization(id) ON DELETE RESTRICT,
    CONSTRAINT fk_budget_category
        FOREIGN KEY (budget_category_id) REFERENCES budget_category(id) ON DELETE RESTRICT
);

CREATE INDEX ix_budget_scope_category_period
    ON budget(scope_organization_id, budget_category_id, start_date, end_date);
CREATE INDEX ix_budget_status   ON budget(status);
CREATE INDEX ix_budget_end_date ON budget(end_date);

-- ---------- BUDGET TRANSACTION ----------
CREATE TABLE budget_transaction (
    id                      UUID           NOT NULL DEFAULT gen_random_uuid(),
    budget_id               UUID           NOT NULL,

    transaction_type        VARCHAR(30)    NOT NULL,
    amount                  NUMERIC(18,2)  NOT NULL,

    source_type             VARCHAR(30),
    source_id               VARCHAR(100),

    description             TEXT,

    performed_by            UUID           NOT NULL,
    performed_at            TIMESTAMPTZ    NOT NULL DEFAULT now(),

    related_transaction_id  UUID,

    CONSTRAINT pk_budget_transaction PRIMARY KEY (id),
    CONSTRAINT fk_budget_transaction_budget
        FOREIGN KEY (budget_id) REFERENCES budget(id) ON DELETE CASCADE,
    CONSTRAINT fk_budget_transaction_related
        FOREIGN KEY (related_transaction_id) REFERENCES budget_transaction(id) ON DELETE SET NULL
);

CREATE INDEX ix_budget_transaction_budget ON budget_transaction(budget_id);
CREATE INDEX ix_budget_transaction_source ON budget_transaction(source_type, source_id);

-- ---------- BUDGET ALLOCATION ----------
CREATE TABLE budget_allocation (
    id                UUID           NOT NULL DEFAULT gen_random_uuid(),
    budget_id         UUID           NOT NULL,

    source_type       VARCHAR(30)    NOT NULL,
    source_id         VARCHAR(100)   NOT NULL,

    allocated_amount  NUMERIC(18,2)  NOT NULL,

    status            VARCHAR(30)    NOT NULL DEFAULT 'Reserved',

    created_at        TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ,

    CONSTRAINT pk_budget_allocation PRIMARY KEY (id),
    CONSTRAINT fk_budget_allocation_budget
        FOREIGN KEY (budget_id) REFERENCES budget(id) ON DELETE CASCADE
);

CREATE INDEX ix_budget_allocation_budget ON budget_allocation(budget_id);
CREATE INDEX ix_budget_allocation_source ON budget_allocation(source_type, source_id);

-- ---------- BUDGET APPROVAL STEP ----------
CREATE TABLE budget_approval_step (
    id                UUID           NOT NULL DEFAULT gen_random_uuid(),
    budget_id         UUID           NOT NULL,

    order_index       INT            NOT NULL,
    approver_user_id  UUID           NOT NULL,
    role_label        VARCHAR(200)   NOT NULL,

    status            VARCHAR(30)    NOT NULL DEFAULT 'NotYet',

    actioned_at       TIMESTAMPTZ,
    rejection_reason  VARCHAR(2000),

    CONSTRAINT pk_budget_approval_step PRIMARY KEY (id),
    CONSTRAINT fk_budget_approval_step_budget
        FOREIGN KEY (budget_id) REFERENCES budget(id) ON DELETE CASCADE
);

CREATE INDEX ix_budget_approval_step_budget ON budget_approval_step(budget_id);
