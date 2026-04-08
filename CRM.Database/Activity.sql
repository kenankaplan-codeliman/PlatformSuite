-- =============================================
-- CRM Activity Tables - PostgreSQL
-- Version: 3.0
-- Description: Activity module - String-based enums (DB agnostic)
-- =============================================

-- =============================================
-- ACTIVITY TABLE (Base - TPT Strategy)
-- =============================================

CREATE TABLE IF NOT EXISTS activity (
    -- Primary Key
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core Activity Properties
    subject                 VARCHAR(200) NOT NULL,
    activity_type           VARCHAR(20) NOT NULL,  -- Email, PhoneCall, Task, Appointment
    status                  VARCHAR(20) NOT NULL DEFAULT 'NotStarted',  -- NotStarted, InProgress, Completed, Cancelled
    priority                VARCHAR(10) NOT NULL DEFAULT 'Normal',  -- Low, Normal, High
    
    start_date              TIMESTAMPTZ,
    end_date                TIMESTAMPTZ,
    due_date                TIMESTAMPTZ,
    
    -- Regarding Entity (Polymorphic Association)
    regarding_entity_type   VARCHAR(50),
    regarding_entity_id     UUID,
    
    -- IBaseEntity
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- IAuditableEntity
    created_by              UUID NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by              UUID,
    updated_at              TIMESTAMPTZ,
    
    -- ISoftDeleteEntity
    is_deleted              BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by              UUID,
    deleted_at              TIMESTAMPTZ,
    
    -- IOwnedEntity
    owner_id                UUID NOT NULL,
    organization_id         UUID NOT NULL
    
);

-- =============================================
-- ACTIVITY_PARTY TABLE (Katılımcılar)
-- =============================================

CREATE TABLE IF NOT EXISTS activity_party (
    -- Primary Key
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationship
    activity_id             UUID NOT NULL REFERENCES activity(id) ON DELETE CASCADE,
    
    -- Party Type (Rol)
    party_type              VARCHAR(20) NOT NULL,  -- From, To, Cc, Bcc, Organizer, Attendee, Caller, Recipient, Owner, Required, Optional
    
    -- Participant Type & Reference
    participant_type        VARCHAR(20) NOT NULL,  -- User, Account, Contact, Lead, External
    participant_id          UUID,
    
    -- External Participant Info
    name                    VARCHAR(200),
    email                   VARCHAR(255),
    phone_number            VARCHAR(50),
    
    -- Additional Info
    sort_order              INTEGER NOT NULL DEFAULT 0,
    response_status         VARCHAR(50),
    responded_at            TIMESTAMPTZ,
    
    -- IBaseEntity
    is_active               BOOLEAN NOT NULL DEFAULT TRUE

);

-- =============================================
-- ACTIVITY_EMAIL TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS activity_email (
    -- Foreign Key to base table
    id                      UUID PRIMARY KEY REFERENCES activity(id) ON DELETE CASCADE,
    
    -- Email Properties
    body                    TEXT,
    is_html                 BOOLEAN NOT NULL DEFAULT TRUE,
    is_sent                 BOOLEAN NOT NULL DEFAULT FALSE,
    is_read                 BOOLEAN NOT NULL DEFAULT FALSE,
    read_date               TIMESTAMPTZ
);



-- =============================================
-- activity_phone_call TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS activity_phone_call (
    -- Foreign Key to base table
    id                      UUID PRIMARY KEY REFERENCES activity(id) ON DELETE CASCADE,
    
    -- Phone Call Properties
    call_direction          VARCHAR(10) NOT NULL,  -- Incoming, Outgoing
    recording_url           VARCHAR(500),
    call_notes              TEXT
);

-- =============================================
-- activity_task TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS activity_task (
    -- Foreign Key to base table
    id                      UUID PRIMARY KEY REFERENCES activity(id) ON DELETE CASCADE,
    
    -- Task Properties
    task_description        TEXT,
    reminder_at             TIMESTAMPTZ,
    percent_complete        INTEGER NOT NULL DEFAULT 0
    
);


-- =============================================
-- activity_appointment TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS activity_appointment (
    -- Foreign Key to base table
    id                      UUID PRIMARY KEY REFERENCES activity(id) ON DELETE CASCADE,
    
    -- Appointment Properties
    location                VARCHAR(500),
    is_online               BOOLEAN NOT NULL DEFAULT FALSE,
    meeting_url             VARCHAR(500),
    
    is_all_day              BOOLEAN NOT NULL DEFAULT FALSE,
    reminder_minutes_before INTEGER,
    recurrence_rule         VARCHAR(500),
    is_recurring            BOOLEAN NOT NULL DEFAULT FALSE,
    recurring_parent_id     UUID REFERENCES activity(id),
    meeting_notes           TEXT
    
);


-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE activity IS 'Base table for all activity types';
COMMENT ON TABLE activity_party IS 'Activity participants';
COMMENT ON TABLE activity_email IS 'Email specific details';
COMMENT ON TABLE activity_phone_call IS 'Phone call specific details';
COMMENT ON TABLE activity_task IS 'Task specific details';
COMMENT ON TABLE activity_appointment IS 'Appointment specific details';

COMMENT ON COLUMN activity.activity_type IS 'Email, PhoneCall, Task, Appointment';
COMMENT ON COLUMN activity.status IS 'NotStarted, InProgress, Completed, Cancelled';
COMMENT ON COLUMN activity.priority IS 'Low, Normal, High';
COMMENT ON COLUMN activity_party.party_type IS 'From, To, Cc, Bcc, Organizer, Attendee, Caller, Recipient, Owner, Required, Optional';
COMMENT ON COLUMN activity_party.participant_type IS 'User, Account, Contact, Lead, External';