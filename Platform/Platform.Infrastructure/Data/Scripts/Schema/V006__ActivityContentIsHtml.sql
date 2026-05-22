-- =============================================
-- Activity Content IsHtml Flag - PostgreSQL
-- Version: 1.0
-- Description: PhoneCall / Task / Appointment aktivitelerinin not/açıklama
--              içerikleri de (Email Body gibi) zengin metin (HTML) destekler.
--              Mevcut satırlar düz metin olduğu için DEFAULT FALSE.
-- =============================================

ALTER TABLE activity_phone_call
    ADD COLUMN IF NOT EXISTS is_html BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE activity_task
    ADD COLUMN IF NOT EXISTS is_html BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE activity_appointment
    ADD COLUMN IF NOT EXISTS is_html BOOLEAN NOT NULL DEFAULT FALSE;
