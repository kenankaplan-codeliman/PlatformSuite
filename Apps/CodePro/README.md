# CodePro Uygulaması

CodePro uygulamasının izole stack'i: **Web (React + Vite)** + **API (.NET 10)** + **PostgreSQL 17** + **Elasticsearch 8** + **Kibana** + **Nginx**.

Repo'daki `Platform/*` projeleri kütüphane olarak kullanılır; Dockerfile'lar build context'ine repo root'unu alır.

> **Not:** CodePro, CRM ile aynı host'ta çakışmasın diye farklı portlar kullanır (nginx 81 / db 5433 / es 9201 / kibana 5602).

---

## Hızlı Başlangıç (Dev)

İki yol var: **(A)** API'yi VSCode debugger ile, sadece DB'yi container'da koşturmak — günlük geliştirme için. **(B)** Tüm stack'i container'da koşturmak — entegrasyon testi için.

### A) Sadece DB Container'da, Geri Kalanı Lokalde

```bash
cd Apps/CodePro
docker compose up -d codepro-db
```

> Bu repo'da `docker-compose.override.yml` zaten mevcut — DB'yi host'a `127.0.0.1:5432` üzerinden açar ve API'yi `Development` moduna geçirir. Detay: [DB'ye Host'tan Erişim](#dbye-hosttan-erişim).

API + Web'i F5 ile başlat (VSCode):

- `CodePro Full Stack` (compound) → API + Vite birlikte
- ya da ayrı ayrı: `CodePro API`, `CodePro Web (vite)`

### B) Tüm Stack'i Container'da

```bash
cd Apps/CodePro
docker compose up -d --build
```

İlk build birkaç dakika sürer. Sonra [Linkler](#linkler) bölümündeki container URL'leri ile erişilir.

Temizlik:

```bash
docker compose down            # container'ları durdur
docker compose down -v         # volume'lar dahil sil (DB sıfırlanır)
```

---

## DB'ye Host'tan Erişim

VSCode'dan API'yi debug ederken veya pgAdmin/DataGrip gibi araçlarla bağlanmak için DB'nin host'a açılması gerekir. `Apps/CodePro/docker-compose.override.yml` bunu sağlıyor:

```yaml
services:
  codepro-db:
    ports:
      - "127.0.0.1:5432:5432"
    networks:
      - codepro_db_net
      - codepro_app_net

  codepro-api:
    environment:
      ASPNETCORE_ENVIRONMENT: Development

  codepro-web:
    build:
      args:
        VITE_ENVIRONMENT: development
```

Override neden gerekli:

- `codepro_db_net` `internal: true` → port publishing devre dışı kalır. Non-internal `codepro_app_net`'e de bağlamak port'u host'a çıkarır.
- API container'ı `Development` moduna geçer → Swagger açılır, detaylı hata.

Override sadece dev için. **Prod sunucusunda bu dosya bulunmamalıdır.**

Recreate:

```bash
docker compose up -d --force-recreate codepro-db
```

> CodePro'da host port'u override'da `5432` (default Postgres). Base compose `5433` üzerinden de yayımlamaya çalışır ama internal network nedeniyle çalışmaz — yalnızca override'daki `5432` aktif.

---

## Debug

### VSCode F5 (Önerilen)

`.vscode/launch.json` hazır:

| Configuration | Yapar |
|---|---|
| **CodePro API** | API'yi `Development` modda başlatır, Swagger'ı tarayıcıda açar |
| **CodePro Web (vite)** | Vite dev server'ı başlatır, Chrome'u attach eder |
| **CodePro Full Stack** (compound) | Yukarıdaki ikisini birden |
| **CodePro Browser (attach)** | Çalışan Vite'a Chrome attach |

API debug için DB host'tan erişilebilir olmalı — override zaten bunu sağlıyor.

### CLI ile

```bash
# API
cd Apps/CodePro/CodePro.Api
dotnet run

# Web (repo root'tan)
pnpm dev:codepro
```

### DB CLI

```bash
# Container içinden
docker compose exec codepro-db psql -U $POSTGRES_USER -d codepro_db

# Host'tan (override aktifken)
psql -h localhost -p 5432 -U <user> -d codepro_db
```

---

## Linkler

### Dev — Lokal (F5 + DB container)

| Servis | URL |
|---|---|
| Frontend (Vite) | http://localhost:5181 |
| API | http://localhost:5010 |
| API (HTTPS) | https://localhost:5011 |
| Swagger | http://localhost:5010/swagger |
| PostgreSQL | localhost:5432 (override) |

> Vite, `/api` ve `/auth` path'lerini API'ye proxy'liyor — browser'dan tek URL yeter.

### Dev — Container Stack (`docker compose up -d`)

| Servis | URL |
|---|---|
| Web (nginx) | http://localhost:81 |
| API (nginx üzerinden) | http://localhost:81/api |
| Swagger | http://localhost:81/api/swagger (override `Development` aktifken) |
| Kibana | http://localhost:81/kibana |
| Elasticsearch | http://localhost:9201 |
| PostgreSQL | localhost:5432 (override) |

### Prod

| Servis | URL |
|---|---|
| Web | https://codepro.\<prod-domain\> |
| API | https://codepro.\<prod-domain\>/api |
| Kibana | https://codepro.\<prod-domain\>/kibana (kısıtlı erişim) |
| Swagger | **Yok** (Production modunda kapalı) |
| PostgreSQL | Dışarıdan erişim **yok** (internal network) |

> Prod domain'ini sunucudaki nginx/reverse proxy konfigürasyonuna göre güncelle.

---

## Prod Deploy (SSH)

Prod sunucusunda `git` + `docker` + `docker compose v2` kurulu olmalı.

### İlk Kurulum (sunucuda bir kez)

```bash
ssh <user>@<prod-host>
git clone <repo-url> ~/PlatformSuite
cd ~/PlatformSuite/Apps/CodePro
cp .env.example .env       # yoksa elle oluştur
nano .env                  # prod credential'ları gir
```

`.env` içinde **prod değerleriyle** ayarlanması gereken zorunlu değişkenler:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `ELASTIC_PASSWORD`, `KIBANA_SYSTEM_PASSWORD`
- `Logging__Elastic__Username`, `Logging__Elastic__Password`
- `VITE_AZURE_CLIENT_ID`, `VITE_AZURE_TENANT_ID`
- JWT/auth secret'ları

### Deploy / Güncelleme

```bash
ssh <user>@<prod-host>
cd ~/PlatformSuite
git pull
cd Apps/CodePro

# override.yml prod'da bulunmasın
ls docker-compose.override.yml 2>/dev/null && echo "UYARI: override dosyası prod'da olmamalı — sil"

docker compose pull                 # external image güncellemeleri
docker compose up -d --build        # web + api yeniden build, geri kalanı recreate
docker compose ps                   # sağlık kontrolü
docker compose logs -f codepro-api  # canlı log
```

> **DİKKAT:** `docker-compose.override.yml` ve `.env` şu an `.gitignore`'a eklenmemiş — prod sunucusunda dev override'ı oluşmaması ve secret'ların commit edilmemesi için bunları en kısa sürede `.gitignore`'a ekle.

### Rollback

```bash
git checkout <önceki-commit>
docker compose up -d --build
```

### DB Backup

```bash
docker compose exec codepro-db pg_dump -U $POSTGRES_USER codepro_db | gzip > codepro_$(date +%F).sql.gz
```

### DB Restore

```bash
gunzip -c codepro_<tarih>.sql.gz | docker compose exec -T codepro-db psql -U $POSTGRES_USER -d codepro_db
```

---

## Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|---|---|
| `Connection to localhost:5432 refused` | DB container yok ya da override uygulanmadı → `docker compose up -d --force-recreate codepro-db` |
| Container'da Swagger 404 | Override yoksa container `Production` modunda; override'ı oluştur, recreate |
| `port is already allocated` | CRM 5432'yi tutmuş olabilir (`lsof -i :5432`) → birini kapat ya da override'da port değiştir |
| Vite 5181 yerine farklı port'ta açılıyor | `vite.config.ts` içindeki `port: 5181` çakışmış → o porttaki process'i kapat |
| ES sağlık kontrolü kırmızı | `ES_JAVA_OPTS` belleği yetmiyor → compose'da `-Xmx` artır |

---

## Dosya Yapısı

```
Apps/CodePro/
├── CodePro.Api/             # ASP.NET Core API
├── CodePro.Application/     # CQRS + handlers
├── CodePro.Domain/          # Domain entities + privilege codes
├── CodePro.Infrastructure/  # EF Core, repositories
├── CodePro.Database/        # SQL migration script'leri
├── Web/                     # React + Vite frontend
├── docker/
│   ├── db-init/             # ilk açılışta çalışan SQL'ler
│   └── nginx/               # nginx.conf + conf.d
├── docker-compose.yaml          # base (prod-uyumlu)
├── docker-compose.override.yml  # dev-only (.gitignore'a eklenmeli, prod'a gitmesin)
└── .env                         # secret'lar (.gitignore'a eklenmeli)
```

---

## İlgili Dokümanlar

- Mimari (genel): `docs/Api_Architecture.md`, `docs/Client_Architecture.md`
- Yeni entity ekleme rehberi: repo'da arama yap (`new-entity-guide`)
- Proje root CLAUDE.md: katman bağımlılıkları ve konvansiyonlar
