# CRM Uygulaması

CRM uygulamasının izole stack'i: **Web (React + Vite)** + **API (.NET 10)** + **PostgreSQL 17** + **Elasticsearch 8** + **Kibana** + **Nginx**.

Repo'daki `Platform/*` projeleri kütüphane olarak kullanılır; Dockerfile'lar build context'ine repo root'unu alır.

> **Port şeması:** CRM, CodePro ile aynı host'ta çakışmasın diye sabit port'lar kullanır. Hiçbir servis 80/443'e doğrudan bind etmez — prod'da harici reverse proxy / load balancer öne konur. Tüm host portları `.env` üzerinden override edilebilir.
>
> nginx **9080** / db **54321** / es **9201** / kibana **5601** / api dev **7100/7101** / web dev **7180**

---

## Hızlı Başlangıç (Dev)

İki yol var: **(A)** API'yi VSCode debugger ile, sadece DB'yi container'da koşturmak — günlük geliştirme için. **(B)** Tüm stack'i container'da koşturmak — entegrasyon testi için.

### A) Sadece DB Container'da, Geri Kalanı Lokalde

```bash
cd Apps/Crm
docker compose up -d crm-db
```

> **Not:** Base compose'da `crm_db_net` `internal: true` olduğu için bu komut tek başına host port'u **fiilen yayımlamıyor** (binding görünür ama TCP akmaz). DB'ye host'tan erişmek için `docker-compose.override.yml` gerekiyor — bkz. [DB'ye Host'tan Erişim](#dbye-hosttan-erişim).

API + Web'i F5 ile başlat (VSCode):

- `Crm Full Stack` (compound) → API + Vite birlikte
- ya da ayrı ayrı: `Crm API`, `Crm Web (vite)`

### B) Tüm Stack'i Container'da

```bash
cd Apps/Crm
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

VSCode'dan API'yi debug ederken veya pgAdmin/DataGrip gibi araçlarla bağlanmak için DB'nin host'a açılması gerekir. `Apps/Crm/docker-compose.override.yml` bunu sağlıyor:

```yaml
services:
  crm-db:
    ports: !override
      - "127.0.0.1:54321:5432"
    networks:
      - crm_db_net
      - crm_app_net

  crm-api:
    environment:
      ASPNETCORE_ENVIRONMENT: Development

  crm-web:
    build:
      args:
        VITE_ENVIRONMENT: development
```

Override neden gerekli:

- `crm_db_net` `internal: true` → port publishing devre dışı kalır. Non-internal `crm_app_net`'e de bağlamak port'u host'a çıkarır.
- API container'ı `Development` moduna geçer → Swagger açılır, detaylı hata.
- `ports: !override` direktifi base compose'daki port listesinin tamamen yer değiştirmesini sağlar (aksi halde liste birleşmesi olur).

Override sadece dev için. **Prod sunucusunda bu dosya bulunmamalıdır.**

Recreate:

```bash
docker compose up -d --force-recreate crm-db
```

---

## Debug

### VSCode F5 (Önerilen)

`.vscode/launch.json` hazır:

| Configuration | Yapar |
|---|---|
| **Crm API** | API'yi `Development` modda başlatır, Swagger'ı tarayıcıda açar |
| **Crm Web (vite)** | Vite dev server'ı başlatır, Chrome'u attach eder |
| **Crm Full Stack** (compound) | Yukarıdaki ikisini birden |
| **Crm Browser (attach)** | Çalışan Vite'a Chrome attach |

API debug için DB host'tan erişilebilir olmalı (yukarıdaki override).

### CLI ile

```bash
# API
cd Apps/Crm/Crm.Api
dotnet run

# Web (repo root'tan)
pnpm dev:crm
```

### DB CLI

```bash
# Container içinden
docker compose exec crm-db psql -U $POSTGRES_USER -d crm_db

# Host'tan (override aktifken)
psql -h localhost -p 54321 -U <user> -d crm_db
```

---

## Linkler

### Dev — Lokal (F5 + DB container)

| Servis | URL |
|---|---|
| Frontend (Vite) | http://localhost:7180 |
| API | http://localhost:7100 |
| API (HTTPS) | https://localhost:7101 |
| Swagger | http://localhost:7100/swagger |
| PostgreSQL | localhost:54321 (override gerekli) |

> Vite, `/api` ve `/auth` path'lerini API'ye proxy'liyor — browser'dan tek URL yeter.

### Dev — Container Stack (`docker compose up -d`)

| Servis | URL |
|---|---|
| Web (nginx) | http://localhost:9080 |
| API (nginx üzerinden) | http://localhost:9080/api |
| Swagger | **Yok** (container `Production` modunda; override ile `Development` yaparsan açılır) |
| Kibana | http://localhost:9080/kibana |
| Elasticsearch | http://localhost:9201 |
| PostgreSQL | localhost:54321 (override gerekli) |

### Prod

| Servis | URL |
|---|---|
| Web | https://crm.\<prod-domain\> (harici reverse proxy → http://\<host\>:9080) |
| API | https://crm.\<prod-domain\>/api |
| Kibana | https://crm.\<prod-domain\>/kibana (kısıtlı erişim) |
| Swagger | **Yok** (Production modunda kapalı) |
| PostgreSQL | Dışarıdan erişim **yok** (internal network) |

> Container nginx 80/443 değil **9080**'i bind eder. SSL termination ve `:80`/`:443` yayını **harici reverse proxy** (haproxy, traefik, sunucu nginx'i, ya da cloud LB) sorumluluğundadır.

---

## Prod Deploy (SSH)

Prod sunucusunda `git` + `docker` + `docker compose v2` kurulu olmalı.

### İlk Kurulum (sunucuda bir kez)

```bash
ssh <user>@<prod-host>
git clone <repo-url> ~/PlatformSuite
cd ~/PlatformSuite/Apps/Crm
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
cd Apps/Crm

# override.yml prod'da bulunmasın
ls docker-compose.override.yml 2>/dev/null && echo "UYARI: override dosyası prod'da olmamalı"

docker compose pull              # external image güncellemeleri (postgres, es, kibana)
docker compose up -d --build     # web + api yeniden build, geri kalanı recreate
docker compose ps                # sağlık kontrolü
docker compose logs -f crm-api   # canlı log
```

### Rollback

```bash
git checkout <önceki-commit>
docker compose up -d --build
```

### DB Backup

```bash
docker compose exec crm-db pg_dump -U $POSTGRES_USER crm_db | gzip > crm_$(date +%F).sql.gz
```

### DB Restore

```bash
gunzip -c crm_<tarih>.sql.gz | docker compose exec -T crm-db psql -U $POSTGRES_USER -d crm_db
```

---

## Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|---|---|
| `Connection to localhost:54321 refused` | DB-only çalıştırdın ama override yok → override'ı oluştur, recreate |
| Container'da Swagger 404 | Container `Production` modunda; override ile `Development` yap |
| `port is already allocated` | Başka servis 54321'i tutuyor (`lsof -i :54321`) → kapat veya `.env`'de `CRM_DB_HOST_PORT` değiştir |
| Vite 7180 yerine farklı port'ta açılıyor | `vite.config.ts` içindeki `port: 7180` çakışmış → o porttaki process'i kapat |
| API 7100 yerine 5000'de başlıyor | Eski cache → IDE'yi yeniden başlat, `.vscode/launch.json` ve `launchSettings.json` doğru olduğunu doğrula |
| ES sağlık kontrolü kırmızı | `ES_JAVA_OPTS` belleği yetmiyor → compose'da `-Xmx` artır |

---

## Dosya Yapısı

```
Apps/Crm/
├── Crm.Api/            # ASP.NET Core API
├── Crm.Application/    # CQRS + handlers
├── Crm.Domain/         # Domain entities + privilege codes
├── Crm.Infrastructure/ # EF Core, repositories
├── Crm.Database/       # SQL migration script'leri
├── Web/                # React + Vite frontend
├── docker/
│   ├── db-init/        # ilk açılışta çalışan SQL'ler
│   └── nginx/          # nginx.conf + conf.d
├── docker-compose.yaml          # base (prod-uyumlu)
├── docker-compose.override.yml  # dev-only (sen oluşturursun; .gitignore'a eklenmeli)
└── .env                         # secret'lar (.gitignore'a eklenmeli)
```

---

## İlgili Dokümanlar

- Mimari (genel): `docs/Api_Architecture.md`, `docs/Client_Architecture.md`
- Yeni entity ekleme rehberi: repo'da arama yap (`new-entity-guide`)
- Proje root CLAUDE.md: katman bağımlılıkları ve konvansiyonlar
