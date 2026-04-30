-- 1. Kullanıcıyı oluştur
CREATE USER code_pro_user
WITH PASSWORD 'fIvOp82KCPtA1BpTwz9ifKs9qqsGR2d3';

-- 2. Database oluştur ve sahibi olarak code_pro_user ata
CREATE DATABASE code_pro_db
OWNER code_pro_user;

-- 3. code_pro_db veritabanına bağlan
\c code_pro_db;

-- 4. public schema üzerinde yetkiler
GRANT USAGE ON SCHEMA public TO code_pro_user;
GRANT CREATE ON SCHEMA public TO code_pro_user;

-- 5. Mevcut tablolar için tüm CRUD yetkileri
GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO code_pro_user;

-- 6. Mevcut sequence'ler için yetkiler (SERIAL / IDENTITY kolonlar için önemli)
GRANT USAGE, SELECT, UPDATE
ON ALL SEQUENCES IN SCHEMA public
TO code_pro_user;

-- 7. Gelecekte oluşturulacak tablolar için otomatik yetkiler
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLES
TO code_pro_user;

-- 8. Gelecekte oluşturulacak sequence'ler için otomatik yetkiler
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE
ON SEQUENCES
TO code_pro_user;
