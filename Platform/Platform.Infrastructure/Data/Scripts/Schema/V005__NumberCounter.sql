-- =============================================
-- number_counter — Gapless doküman numarası sayaç altyapısı
--
-- (document_type, period_key) başına tek satır tutulur. Numara üretimi iş
-- transaction'ı içinde atomik UPDATE ... RETURNING ile yapılır; PostgreSQL
-- satır kilidini otomatik alır.
--
-- Global sistem verisidir — owner/organization filtresine tabi DEĞİLDİR.
-- Bir iş entity'si değildir; audit/soft-delete kolonları yoktur.
-- =============================================

CREATE TABLE IF NOT EXISTS number_counter (
    id             INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    document_type  VARCHAR(50) NOT NULL,
    reset_period   INTEGER     NOT NULL DEFAULT 1,   -- CounterResetPeriod enum değeri
    period_key     VARCHAR(20) NOT NULL,             -- "ALL", "2026", "2026-05", "2026-Q4"
    last_value     BIGINT      NOT NULL DEFAULT 0,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Doküman tipi + periyot başına tek satır. Yıl/ay/çeyrek değişiminde
-- yeni period_key → yeni satır → sayaç otomatik sıfırlanır.
ALTER TABLE number_counter
    DROP CONSTRAINT IF EXISTS uq_number_counter_doctype_period;

ALTER TABLE number_counter
    ADD CONSTRAINT uq_number_counter_doctype_period UNIQUE (document_type, period_key);
