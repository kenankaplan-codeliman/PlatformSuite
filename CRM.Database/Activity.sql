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
    
    -- Domain Identity
    activity_id             UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    
    -- Core Activity Properties
    subject                 VARCHAR(200) NOT NULL,
    activity_type           VARCHAR(20) NOT NULL,  -- Email, PhoneCall, Task, Appointment
    status                  VARCHAR(20) NOT NULL DEFAULT 'NotStarted',  -- NotStarted, InProgress, Completed, Cancelled
    priority                VARCHAR(10) NOT NULL DEFAULT 'Normal',  -- Low, Normal, High
    
    due_date                TIMESTAMPTZ,
    completed_date          TIMESTAMPTZ,
    duration                INTERVAL,
    
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
    organization_id         UUID NOT NULL,
    
    -- Check constraints for enum values
    CONSTRAINT chk_activity_type CHECK (activity_type IN ('Email', 'PhoneCall', 'Task', 'Appointment')),
    CONSTRAINT chk_activity_status CHECK (status IN ('NotStarted', 'InProgress', 'Completed', 'Cancelled')),
    CONSTRAINT chk_activity_priority CHECK (priority IN ('Low', 'Normal', 'High'))
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
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Check constraints
    CONSTRAINT chk_party_type CHECK (party_type IN ('From', 'To', 'Cc', 'Bcc', 'Organizer', 'Attendee', 'Caller', 'Recipient', 'Owner', 'Required', 'Optional')),
    CONSTRAINT chk_participant_type CHECK (participant_type IN ('User', 'Account', 'Contact', 'Lead', 'External'))
);

-- =============================================
-- ACTIVITY_EMAIL TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS activity_email (
    -- Foreign Key to base table
    id                      UUID PRIMARY KEY REFERENCES activity(id) ON DELETE CASCADE,
    
    -- Email Properties
    email_subject           VARCHAR(500),
    body                    TEXT,
    is_html                 BOOLEAN NOT NULL DEFAULT TRUE,
    sent_date               TIMESTAMPTZ,
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
    phone_number            VARCHAR(50),
    started_at              TIMESTAMPTZ,
    ended_at                TIMESTAMPTZ,
    recording_url           VARCHAR(500),
    call_notes              TEXT,
    call_result             VARCHAR(100),
    
    -- Check constraint
    CONSTRAINT chk_call_direction CHECK (call_direction IN ('Incoming', 'Outgoing'))
);

-- =============================================
-- activity_task TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS activity_task (
    -- Foreign Key to base table
    id                      UUID PRIMARY KEY REFERENCES activity(id) ON DELETE CASCADE,
    
    -- Task Properties
    task_description        TEXT,
    is_completed            BOOLEAN NOT NULL DEFAULT FALSE,
    task_completed_at       TIMESTAMPTZ,
    reminder_at             TIMESTAMPTZ,
    is_reminder_set         BOOLEAN NOT NULL DEFAULT FALSE,
    is_reminder_sent        BOOLEAN NOT NULL DEFAULT FALSE,
    percent_complete        INTEGER NOT NULL DEFAULT 0,
    start_date              TIMESTAMPTZ,
    
    -- Check constraint
    CONSTRAINT chk_percent_complete CHECK (percent_complete >= 0 AND percent_complete <= 100)
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
    start_time              TIMESTAMPTZ NOT NULL,
    end_time                TIMESTAMPTZ NOT NULL,
    is_all_day              BOOLEAN NOT NULL DEFAULT FALSE,
    reminder_minutes_before INTEGER,
    recurrence_rule         VARCHAR(500),
    is_recurring            BOOLEAN NOT NULL DEFAULT FALSE,
    recurring_parent_id     UUID REFERENCES activity(id),
    meeting_notes           TEXT,
    
    -- Check constraint
    CONSTRAINT chk_appointment_times CHECK (end_time > start_time)
);


-- =============================================
-- VIEWS
-- =============================================

-- View: Email activity
CREATE OR REPLACE VIEW vw_activity_email AS
SELECT 
    a.*,
    e.email_subject,
    e.body,
    e.is_html,
    e.sent_date,
    e.is_sent,
    e.is_read,
    e.read_date,
    (SELECT string_agg(COALESCE(p.email, p.name), ', ') FROM activity_party p WHERE p.activity_id = a.id AND p.party_type = 'From') AS from_addresses,
    (SELECT string_agg(COALESCE(p.email, p.name), ', ') FROM activity_party p WHERE p.activity_id = a.id AND p.party_type = 'To') AS to_addresses,
    (SELECT string_agg(COALESCE(p.email, p.name), ', ') FROM activity_party p WHERE p.activity_id = a.id AND p.party_type = 'Cc') AS cc_addresses,
    (SELECT string_agg(COALESCE(p.email, p.name), ', ') FROM activity_party p WHERE p.activity_id = a.id AND p.party_type = 'Bcc') AS bcc_addresses
FROM activity a
INNER JOIN activity_email e ON a.id = e.id
WHERE a.is_deleted = FALSE;

-- View: Phone Call activity
CREATE OR REPLACE VIEW vw_activity_phone_call AS
SELECT 
    a.*,
    p.call_direction,
    p.phone_number,
    p.started_at,
    p.ended_at,
    p.recording_url,
    p.call_notes,
    p.call_result,
    (p.ended_at - p.started_at) AS call_duration
FROM activity a
INNER JOIN activity_phone_call p ON a.id = p.id
WHERE a.is_deleted = FALSE;

-- View: Task activity
CREATE OR REPLACE VIEW vw_activity_task AS
SELECT 
    a.*,
    t.task_description,
    t.is_completed,
    t.task_completed_at,
    t.reminder_at,
    t.is_reminder_set,
    t.is_reminder_sent,
    t.percent_complete,
    t.start_date
FROM activity a
INNER JOIN activity_task t ON a.id = t.id
WHERE a.is_deleted = FALSE;

-- View: Appointment activity
CREATE OR REPLACE VIEW vw_activity_appointment AS
SELECT 
    a.*,
    ap.location,
    ap.is_online,
    ap.meeting_url,
    ap.start_time,
    ap.end_time,
    ap.is_all_day,
    ap.reminder_minutes_before,
    ap.recurrence_rule,
    ap.is_recurring,
    ap.recurring_parent_id,
    ap.meeting_notes,
    (ap.end_time - ap.start_time) AS appointment_duration,
    (SELECT COUNT(*) FROM activity_party p WHERE p.activity_id = a.id AND p.party_type IN ('Attendee', 'Required', 'Optional')) AS attendee_count
FROM activity a
INNER JOIN activity_appointment ap ON a.id = ap.id
WHERE a.is_deleted = FALSE;

-- View: Today's Appointments
CREATE OR REPLACE VIEW vw_todays_appointments AS
SELECT * FROM vw_activity_appointment
WHERE DATE(start_time) = CURRENT_DATE
ORDER BY start_time;

-- View: Pending Task Reminders
CREATE OR REPLACE VIEW vw_pending_task_reminders AS
SELECT 
    a.id,
    a.subject,
    a.owner_id,
    a.organization_id,
    t.reminder_at
FROM activity a
INNER JOIN activity_task t ON a.id = t.id
WHERE a.is_deleted = FALSE
  AND t.is_reminder_set = TRUE
  AND t.is_reminder_sent = FALSE
  AND t.reminder_at <= CURRENT_TIMESTAMP + INTERVAL '15 minutes';


-- =============================================
-- FUNCTIONS
-- =============================================

-- Function: Get activity by entity
CREATE OR REPLACE FUNCTION fn_get_activity_by_entity(
    p_entity_type VARCHAR(50),
    p_entity_id UUID
)
RETURNS TABLE (
    id UUID,
    subject VARCHAR(200),
    activity_type VARCHAR(20),
    status VARCHAR(20),
    priority VARCHAR(10),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ
)
LANGUAGE SQL STABLE
AS $$
    SELECT id, subject, activity_type, status, priority, due_date, created_at
    FROM activity
    WHERE regarding_entity_type = p_entity_type
      AND regarding_entity_id = p_entity_id
      AND is_deleted = FALSE
    ORDER BY created_at DESC;
$$;

-- Function: Get activity by participant
CREATE OR REPLACE FUNCTION fn_get_activity_by_participant(
    p_participant_type VARCHAR(20),
    p_participant_id UUID
)
RETURNS TABLE (
    id UUID,
    subject VARCHAR(200),
    activity_type VARCHAR(20),
    status VARCHAR(20),
    party_type VARCHAR(20),
    created_at TIMESTAMPTZ
)
LANGUAGE SQL STABLE
AS $$
    SELECT DISTINCT a.id, a.subject, a.activity_type, a.status, ap.party_type, a.created_at
    FROM activity a
    INNER JOIN activity_party ap ON a.id = ap.activity_id
    WHERE ap.participant_type = p_participant_type
      AND ap.participant_id = p_participant_id
      AND a.is_deleted = FALSE
    ORDER BY a.created_at DESC;
$$;


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