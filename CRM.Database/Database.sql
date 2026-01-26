-- 1. Kullanıcıyı oluştur
CREATE USER crm_user
WITH PASSWORD 'fIvOp82KCPtA1BpTwz9ifKs9qqsGR2d3';

-- 2. Database oluştur ve sahibi olarak crm_user ata
CREATE DATABASE crm_db
OWNER crm_user;

-- 3. crm_db veritabanına bağlan
\c crm_db;

-- 4. public schema üzerinde yetkiler
GRANT USAGE ON SCHEMA public TO crm_user;
GRANT CREATE ON SCHEMA public TO crm_user;

-- 5. Mevcut tablolar için tüm CRUD yetkileri
GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO crm_user;

-- 6. Mevcut sequence'ler için yetkiler (SERIAL / IDENTITY kolonlar için önemli)
GRANT USAGE, SELECT, UPDATE
ON ALL SEQUENCES IN SCHEMA public
TO crm_user;

-- 7. Gelecekte oluşturulacak tablolar için otomatik yetkiler
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLES
TO crm_user;

-- 8. Gelecekte oluşturulacak sequence'ler için otomatik yetkiler
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE
ON SEQUENCES
TO crm_user;
