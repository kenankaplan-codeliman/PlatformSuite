# Contributing Guide

Bu doküman, Business Application Platform monorepo'suna katkıda bulunmak isteyen geliştiriciler için rehberdir. Okumadan önce `docs/Platform-Refactoring-Plan.md` dosyasını incelemeni öneririz — mimari kararların gerekçeleri orada.

---

## İçindekiler

1. [Repo Yapısı](#1-repo-yapısı)
2. [Geliştirme Ortamının Kurulumu](#2-geliştirme-ortamının-kurulumu)
3. [Branch Stratejisi](#3-branch-stratejisi)
4. [Commit Convention](#4-commit-convention)
5. [Pull Request Süreci](#5-pull-request-süreci)
6. [Yeni Uygulama Ekleme Rehberi](#6-yeni-uygulama-ekleme-rehberi)
7. [Platform'a Değişiklik Yapma Rehberi](#7-platforma-değişiklik-yapma-rehberi)
8. [Entity Tasarım Kuralları](#8-entity-tasarım-kuralları)
9. [SQL Migration Yazım Kuralları](#9-sql-migration-yazım-kuralları)
10. [Versiyonlama](#10-versiyonlama)
11. [Test Politikası](#11-test-politikası)
12. [Code Review Checklist](#12-code-review-checklist)

---

## 1. Repo Yapısı

```
PlatformSuite/
├── Platform/                       # Paylaşılan altyapı
│   ├── Platform.Domain/            # Identity, Activity, Attachment, ortak interface'ler + PrivilegeCodes
│   ├── Platform.Application/       # IApplicationDbContext, IEntityReferenceResolver, MediatR pipeline,
│   │                               # platform-merkezli feature'lar (User/Org/Role/Activity/Attachment)
│   ├── Platform.Infrastructure/    # PlatformDbContext (abstract), audit/soft-delete davranışları,
│   │                               # EntityReferenceResolverRegistry, UserReferenceResolver
│   ├── Platform.Api/               # AddPlatformApi<TDbContext> + UsePlatformPipeline, platform controller'ları
│   ├── Platform.Web/               # @platform/ui — paylaşılan React component/hook/types paketi
│   └── Platform.Database/          # Platform-seviyesi SQL (Identity, Activity, Attachment, Logs)
├── Apps/
│   ├── Crm/                        # CRM uygulaması
│   │   ├── Crm.Domain/             # Account, Contact, Lead, Opportunity + CrmPrivilegeCodes
│   │   ├── Crm.Application/        # ICrmDbContext, CRM feature'ları, CrmMappingConfig
│   │   ├── Crm.Infrastructure/     # CrmDbContext (PlatformDbContext extend), CRM repository'leri,
│   │   │                           # AccountReferenceResolver / ContactReferenceResolver
│   │   ├── Crm.Api/                # AccountController, ContactController, LeadController, OpportunityController
│   │   ├── Crm.Web/                # @app/crm-web — CRM React app'i
│   │   ├── Crm.Database/           # CRM SQL schema scriptleri
│   │   ├── docker-compose.yaml
│   │   └── README.md
│   └── CodePro/                    # CodePro (procurement) uygulaması
│       ├── CodePro.Domain/         # Supplier, PurchaseOrder, Budget, Offer, Contract, Product, ...
│       │                           # + CodeProPrivilegeCodes
│       ├── CodePro.Application/    # ICodeProDbContext, CodePro feature'ları, CodeProMappingConfig
│       ├── CodePro.Infrastructure/ # CodeProDbContext, CodePro repo'ları, SupplierReferenceResolver
│       ├── CodePro.Api/            # SupplierController, PurchaseOrderController, ...
│       ├── CodePro.Web/            # CodePro React app'i
│       ├── CodePro.Database/       # CodePro SQL schema scriptleri
│       ├── docker-compose.yaml
│       └── README.md
├── docs/                           # Mimari dokümanlar (Api_Architecture, Client_Architecture, ADR'ler)
├── PlatformSuite.slnx              # Solution dosyası
├── pnpm-workspace.yaml             # Frontend workspace (Platform.Web + Apps/*/.../Web)
├── package.json                    # Root workspace
└── CLAUDE.md                       # Repo-wide kurallar
```

**Temel prensip:** `Platform/` içindeki her şey **paylaşılan**, `Apps/<App>/` içindeki her şey **uygulamaya özel**. Birden fazla app'in aynı semantikle ihtiyaç duyduğu kavram (User, Activity, Attachment) Platform'a; tek app'in iş kavramı (Account → CRM, Supplier → CodePro) o app'e ait. Cross-app domain importu yasak.

Detaylı katman kuralları: `docs/Api_Architecture.md` (backend) ve `docs/Client_Architecture.md` (frontend).

---

## 2. Geliştirme Ortamının Kurulumu

### Gereksinimler

- .NET SDK 10
- Node.js 20+ ve **pnpm** (frontend workspace pnpm tabanlı)
- Docker Desktop (local DB için)
- PostgreSQL 17 (Docker image yeterli)
- Git 2.40+

### İlk Kurulum

```bash
# Repo'yu klonla
git clone <repo-url>
cd PlatformSuite

# Backend bağımlılıklar — solution build alırken NuGet otomatik restore eder
dotnet restore PlatformSuite.slnx

# Frontend bağımlılıklar (pnpm workspace; Platform.Web + Apps/*/.../Web hepsi tek seferde)
pnpm install

# Local DB'leri ayağa kaldır — her app'in kendi compose'u var
cd Apps/Crm && docker compose up -d crm-db
cd ../CodePro && docker compose up -d codepro-db
cd ../..

# API'ler ilk açılışta SQL scriptlerini DbInitializerHostedService aracılığıyla çalıştırır
# (Crm.Database/*.sql, CodePro.Database/*.sql ve Platform.Database/*.sql)
```

### Local Çalıştırma

Her uygulama bağımsız çalışır. CRM ve CodePro paralel olarak ayrı host'ta açılabilir:

```bash
# CRM API
cd Apps/Crm/Crm.Api && dotnet run

# CRM Web (Vite dev server)
pnpm --filter @app/crm-web dev

# CodePro API (paralel terminal'de)
cd Apps/CodePro/CodePro.Api && dotnet run

# CodePro Web
pnpm --filter @app/codepro-web dev
```

VSCode kullananlar için her app'te `.vscode/launch.json` "Full Stack" compound config'leri hazır (`Crm Full Stack`, `CodePro Full Stack`). Detaylar app'lerin README'lerinde.

---

## 3. Branch Stratejisi

**Trunk-based development** kullanıyoruz. Long-lived branch'lerden kaçınıyoruz.

### Ana Branch'ler

- `main` — production'a deploy edilen kod. Her zaman green olmalı.
- `develop` — (opsiyonel, sadece release koordinasyonu gerekirse) staging için.

### Feature Branch'ler

```
feature/<issue-id>-<short-description>
fix/<issue-id>-<short-description>
chore/<short-description>
docs/<short-description>
refactor/<short-description>
```

**Örnekler:**

- `feature/PLAT-123-add-industry-field`
- `fix/CRM-456-lead-score-validation`
- `refactor/platform-dbcontext-abstract`

### Kurallar

- Feature branch'ler kısa ömürlü olmalı (max 3-5 gün).
- `main`'den fork edilir, PR ile `main`'e merge edilir.
- Merge stratejisi: **Squash and merge** (commit history temiz kalsın).
- Merge'den sonra branch silinir.

---

## 4. Commit Convention

**Conventional Commits** kullanıyoruz.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type'lar

- `feat` — yeni özellik
- `fix` — bug fix
- `refactor` — davranış değiştirmeyen refactor
- `chore` — dependency güncelleme, config değişikliği
- `docs` — sadece doküman
- `test` — test ekleme/güncelleme
- `perf` — performans iyileştirme
- `style` — formatting (kod davranışı değişmez)
- `build` — build system değişiklikleri
- `ci` — CI/CD değişiklikleri

### Scope'lar

- `platform-core`, `platform-entities`, `platform-domain`, `platform-infra`, `platform-api`, `platform-ui`
- `crm`, `hrm`, `procurement`
- `migrator`, `ci`, `docs`

### Örnekler

```
feat(platform-entities): add Industry field to Account

Adds a new optional Industry enum field to the Account entity.
All consumer apps need to run Platform_V012_AddAccountIndustry.sql
migration before upgrading to platform 1.3.0.

Refs: PLAT-123
```

```
fix(crm): correct lead score validation boundary

Lead score was incorrectly rejecting the value 100.
Changed comparison from < to <= for upper bound.

Fixes: CRM-456
```

```
refactor(platform-infra): make PlatformDbContext abstract

Part of Faz 3 refactoring. CRMDbContext and HRMDbContext
now inherit from abstract base. No behavior change.
```

### Breaking Change

Breaking change'ler footer'da `BREAKING CHANGE:` ile işaretlenir:

```
feat(platform-entities): change Account.TaxNumber to required

BREAKING CHANGE: Account.TaxNumber is now required (non-nullable).
All consumer apps must provide this field. Migration path in
docs/migrations/platform-2.0.0.md.
```

---

## 5. Pull Request Süreci

### Açmadan Önce

- [ ] Local'de build başarılı
- [ ] Unit test'ler geçiyor
- [ ] Lint/format hatası yok
- [ ] `main`'den güncel (`git pull --rebase origin main`)
- [ ] SQL migration eklediysen script'i test ettin

### PR Açarken

**Başlık:** Conventional commit formatında.

**Açıklama template'i:**

```markdown
## Ne Değişti?

(Kısa özet)

## Neden?

(Bu değişikliğin gerekçesi, linked issue)

## Nasıl Test Edildi?

(Hangi test'ler koşuldu, hangi senaryolar manuel doğrulandı)

## Breaking Change?

(Evet/Hayır. Evetse migration notu)

## İlgili Doküman Güncellemeleri

- [ ] CONTRIBUTING.md
- [ ] Platform-Refactoring-Plan.md (task checkbox'ları)
- [ ] ADR eklendi mi?
- [ ] API doc güncellendi mi?

## Checklist

- [ ] Unit test eklendi/güncellendi
- [ ] Integration test eklendi (gerekiyorsa)
- [ ] SQL migration script yazıldı (schema değişikliği varsa)
- [ ] Rollback script yazıldı
- [ ] Version bump yapıldı (platform paketi için)
```

### Review Kuralları

- **Minimum 1 approval** gerekli
- **Platform değişiklikleri:** 2 approval + en az 1 senior
- **SQL migration'lar:** DBA veya senior developer mutlaka review etmeli
- **Breaking change'ler:** Tech lead approval şart

---

## 6. Yeni Uygulama Ekleme Rehberi

> **Örnek:** `Finance` uygulaması eklenecek. Mevcut `Apps/Crm/` ve `Apps/CodePro/` paterni birebir izlenir.

### Adım 1: Proje İskeleti

```bash
cd Apps
mkdir Finance && cd Finance

dotnet new classlib -n Finance.Domain
dotnet new classlib -n Finance.Application
dotnet new classlib -n Finance.Infrastructure
dotnet new webapi    -n Finance.Api
mkdir Finance.Web Finance.Database
```

### Adım 2: Project References

**Domain → Platform.Domain:**

```xml
<!-- Finance.Domain/Finance.Domain.csproj -->
<ItemGroup>
  <ProjectReference Include="..\..\..\Platform\Platform.Domain\Platform.Domain.csproj" />
</ItemGroup>
```

**Application → Platform.Application + Finance.Domain:**

```xml
<!-- Finance.Application/Finance.Application.csproj -->
<ItemGroup>
  <ProjectReference Include="..\..\..\Platform\Platform.Application\Platform.Application.csproj" />
  <ProjectReference Include="..\Finance.Domain\Finance.Domain.csproj" />
</ItemGroup>
```

**Infrastructure → Platform.Infrastructure + Finance.Application + Finance.Domain:**

```xml
<!-- Finance.Infrastructure/Finance.Infrastructure.csproj -->
<ItemGroup>
  <ProjectReference Include="..\..\..\Platform\Platform.Infrastructure\Platform.Infrastructure.csproj" />
  <ProjectReference Include="..\Finance.Application\Finance.Application.csproj" />
  <ProjectReference Include="..\Finance.Domain\Finance.Domain.csproj" />
</ItemGroup>
```

**Api → Platform.Api + Finance.Application + Finance.Domain:**

```xml
<!-- Finance.Api/Finance.Api.csproj -->
<ItemGroup>
  <ProjectReference Include="..\..\..\Platform\Platform.Api\Platform.Api.csproj" />
  <ProjectReference Include="..\Finance.Application\Finance.Application.csproj" />
  <ProjectReference Include="..\Finance.Domain\Finance.Domain.csproj" />
</ItemGroup>
```

> Cross-app reference yasak: `Finance.Domain` `Crm.Domain.Entities.Accounts.Account`'ı import edemez. CRM Account'a Finance içinden gerekirse polimorfik `EntityReference` (string EntityType + Guid Id) kullanılır.

### Adım 3: DbContext + Application Interface

```csharp
// Finance.Application/Interfaces/IFinanceDbContext.cs
public interface IFinanceDbContext : IApplicationDbContext
{
    DbSet<Invoice> Invoice { get; }
    DbSet<PaymentRecord> PaymentRecord { get; }
}

// Finance.Infrastructure/Data/FinanceDbContext.cs
public sealed class FinanceDbContext : PlatformDbContext, IFinanceDbContext
{
    public FinanceDbContext(
        DbContextOptions<FinanceDbContext> options,
        IContextUser contextUser,
        IContextAuthorization contextAuthorization)
        : base(options, contextUser, contextAuthorization) { }

    public DbSet<Invoice> Invoice { get; set; }
    public DbSet<PaymentRecord> PaymentRecord { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(FinanceDbContext).Assembly);
    }
}
```

### Adım 4: DI Setup

```csharp
// Finance.Application/DependencyInjection.cs
public static IServiceCollection AddFinanceApplication(this IServiceCollection services)
{
    var assembly = Assembly.GetExecutingAssembly();
    services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
    services.AddValidatorsFromAssembly(assembly);

    FinanceMappingConfig.Register(TypeAdapterConfig.GlobalSettings);
    PrivilegeRegistry.Register(typeof(FinancePrivilegeCodes));
    return services;
}

// Finance.Infrastructure/DependencyInjection.cs
public static IServiceCollection AddFinanceInfrastructure(
    this IServiceCollection services, IConfiguration configuration)
{
    services.AddScoped<IFinanceDbContext>(sp => sp.GetRequiredService<FinanceDbContext>());
    services.AddScoped<IInvoiceRepository, InvoiceRepository>();

    // Activity regarding zincirine sokulacak entity'ler için resolver kayıtları:
    services.AddScoped<IEntityReferenceResolver, InvoiceReferenceResolver>();
    return services;
}

// Finance.Api/Program.cs
builder.Services
    .AddPlatformApi<FinanceDbContext>(builder.Configuration)
    .AddFinanceApplication()
    .AddFinanceInfrastructure(builder.Configuration);

var app = builder.Build();
app.UsePlatformPipeline();
app.Run();
```

### Adım 5: Privilege Codes

```csharp
// Finance.Domain/Authorization/FinancePrivilegeCodes.cs
public static class FinancePrivilegeCodes
{
    public static class InvoicePrivilegeCodes
    {
        public const string Read = "Invoice.Read";
        public const string Create = "Invoice.Create";
        public const string Update = "Invoice.Update";
        public const string Delete = "Invoice.Delete";
    }
}
```

### Adım 6: SQL Schema

```sql
-- Apps/Finance/Finance.Database/01-Invoice.sql
CREATE TABLE IF NOT EXISTS invoice (
    id              UUID PRIMARY KEY,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    invoice_number  VARCHAR(50) NOT NULL,
    amount          NUMERIC(18,2) NOT NULL,
    due_date        TIMESTAMP NOT NULL,
    -- multi-tenant
    owner_id        UUID NOT NULL,
    organization_id UUID NOT NULL,
    -- audit
    created_by      UUID NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_by      UUID,
    updated_at      TIMESTAMP,
    -- soft delete
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by      UUID,
    deleted_at      TIMESTAMP
);
```

CRM Account'a referans gerekiyorsa **FK kurmayın** — cross-app DB ayrı. Polimorfik `EntityReference { entityType: "Account", id: <guid> }` ile UI lookup yapın; `AccountReferenceResolver` (CRM Infrastructure'da kayıtlı) çağrılır.

### Adım 7: Frontend Kurulumu

```bash
cd Apps/Finance/Finance.Web
pnpm init   # name: @app/finance-web
```

`package.json`:

```json
{
  "name": "@app/finance-web",
  "type": "module",
  "dependencies": {
    "@platform/ui": "workspace:*",
    "@tanstack/react-query": "^5.59.0",
    "antd": "^6.1.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.11.0"
  }
}
```

App'in Vite + Router/menu/i18n iskeletini mevcut `Apps/Crm/Crm.Web/`'i şablon olarak kullanarak çıkar:

- `src/app/router/{paths,routes}.tsx` — Platform paths spread + Finance rotaları
- `src/app/menu/useFinanceMenu.tsx`
- `src/app/i18n.config.ts` — `registerFinanceTranslations()`
- `src/shared/api/{queryKeys,servicePaths}.ts`
- `src/entities/invoice/`, `src/pages/invoices/`

### Adım 8: Solution & Workspace

- `PlatformSuite.slnx`'a yeni proje'leri ekle.
- `pnpm-workspace.yaml`'a `Apps/Finance/Finance.Web` zaten glob'la dahil edilir; doğrula.

### Adım 9: Docker & Deploy

`Apps/Finance/docker-compose.yaml` ve `docker-compose.override.yml` için `Apps/Crm/` veya `Apps/CodePro/`'yu şablon al. Port'ları başka app'lerle çakışmayacak şekilde seç.

### Adım 10: Doküman

- `Apps/Finance/README.md` ekle (CRM/CodePro README'lerini şablon al).
- `CLAUDE.md`'deki "Multi-App Yapısı" bölümünde Finance'ı listele (gerekirse).

---

## 7. Platform'a Değişiklik Yapma Rehberi

Platform'a yapılan her değişiklik **tüm uygulamaları (Crm, CodePro, ...) etkiler**. Aynı solution içindeki project reference'lar nedeniyle bir Platform değişikliği build sırasında tüm app'lere yansır. Bu yüzden çok dikkatli olunmalı.

### Kritik Soru: Gerçekten Platform'a mı Ait?

Bir entity, alan veya davranış eklemeden önce şu soruları sor:

1. **Tüm uygulamaların ihtiyacı var mı?** (User, Organization, Activity, Attachment, AuditLog gibi) → Platform'a ekle.
2. **Bir bounded context'e mi ait?** (Account/Contact CRM'e, Supplier/Product CodePro'ya) → İlgili App'e ekle.
3. **Cross-cutting concern mı ama uygulamaya göre farklı veri tutuyor mu?** → Platform'da interface, App'te entity (`IEntityReferenceResolver` deseni).
4. **Sadece 1 app'in ihtiyacı var ama Platform'da çözmek "kolay" mı görünüyor?** → Hayır. App'te kalsın.

### Platform'a Eklenebilecek Tipik Şeyler

- Cross-cutting interface'ler: `IBaseEntity`, `IOwnedEntity`, `IAuditableEntity`, `ISoftDeleteEntity`.
- Identity/Authorization: `User`, `Role`, `Privilege`, `AppRole`, `AppUser`, `Organization`.
- Activity (polimorfik regarding referansı, app-spesifik resolver'lar üzerinden).
- Attachment, AuditLog gibi tüm app'lerin paylaştığı altyapı.
- Pipeline behaviors (`ValidationBehavior`, `TransactionBehavior`, `LoggingBehavior`).
- Result<T>, Error, ProblemDetails dönüşümü.
- Mapster + MediatR + FluentValidation altyapısı (`AddPlatformApi<TDbContext>`).

### Platform'a Eklenmemesi Gereken Şeyler

- Bounded context entity'leri: Account, Contact (CRM), Supplier, Product, Budget (CodePro).
- App-spesifik privilege kodları (`Account.Read` CRM'e, `Supplier.Read` CodePro'ya ait).
- App-spesifik DbContext'ler — `PlatformDbContext` abstract; somut DbContext app'in altında.

### Platform Değişikliği İş Akışı

1. **Issue aç** — Platform'da ne değişecek, hangi uygulamaları etkileyecek.
2. **ADR yaz** — Mimari karar gerektiren değişiklikler için `docs/adr/` altında yeni bir karar kaydı.
3. **Feature branch** — Değişikliği yap, hem Platform'u hem etkilenen App'leri build et: `dotnet build PlatformSuite.slnx`.
4. **Schema etkisi varsa Platform.Database script'i yaz** — `Platform/Platform.Database/` altında yeni `.sql` dosyası ekle (idempotent, PostgreSQL).
5. **Tüm App'lerde uyumu doğrula** — Solution'ı build et + her App.Web için `pnpm typecheck` çalıştır.
6. **Tek PR'da gönder** — Monorepo + project reference olduğu için Platform + tüm etkilenen App'ler aynı PR'da koordine edilir.

### Breaking Change Protokolü

Aynı solution + project reference olduğu için Platform breaking change'leri **derhal tüm app'leri etkiler**. Yine de süreç:

1. Öncesinde `#platform-architecture` kanalında duyuru.
2. Mümkünse deprecation phase: yeni API ekle, eski API'yi `[Obsolete]` ile işaretle.
3. Tüm App'lerin migrate olduğunu doğrulayan PR'lar bağımsız çalışmalı (her app ayrı PR olabilir).
4. Eski API son aşamada kaldırılır; commit message'da `BREAKING CHANGE:` prefix.
5. Migration guide yaz: `docs/migrations/platform-{date}.md`.

---

## 8. Entity Tasarım Kuralları

### Hangi App'e Ait?

Yeni entity ekleyeceksen önce konumunu belirle:

| Entity tipi | Konum | Namespace |
|---|---|---|
| Cross-cutting (User, Organization, Activity, Attachment) | `Platform.Domain` | `Platform.Domain.Entities.<Klasör>` |
| CRM bounded context (Account, Contact, Lead, Opportunity) | `Apps/Crm/Crm.Domain` | `Crm.Domain.Entities.<Klasör>` |
| CodePro bounded context (Supplier, Product, Budget, PurchaseOrder) | `Apps/CodePro/CodePro.Domain` | `CodePro.Domain.Entities.<Klasör>` |

**Bounded context çakışıyorsa:** "Account" CRM'de müşteri, CodePro'da Supplier — aynı isim iki context'te farklı semantik taşır. Bu durumda **iki ayrı entity** olur, ortak base sınıf değil.

### İsimlendirme

- Entity isimleri ham olsun: `Account`, `Contact`, `Supplier`, `Activity`. Prefix kullanma.
- Ayrım **namespace** ile yapılır: `Crm.Domain.Entities.Accounts.Account` vs. `CodePro.Domain.Entities.Suppliers.Supplier`.

### Inheritance Yerine Behavior Interface

Cross-cutting concern'ler için inheritance kullanma — `Platform.Domain` interface'lerini implemente et:

```csharp
public class Supplier : IBaseEntity, IOwnedEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public Guid OrganizationId { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public Guid CreatedByUserId { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
    public Guid? UpdatedByUserId { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAtUtc { get; set; }

    public string Name { get; set; } = string.Empty;
    // ... domain alanları
}
```

`AuditBehavior`, `SoftDeleteQueryFilter`, `MultiTenantQueryFilter` gibi pipeline davranışları bu interface'lere bakarak otomatik devreye girer.

### Cross-App Inheritance YASAK

```csharp
// YASAK: CodePro entity'si Crm entity'sinden türeyemez
public class Supplier : Crm.Domain.Entities.Accounts.Account { }

// YASAK: App entity'si Platform business entity'sinden türeyemez
// (Platform'da bounded context entity'si zaten yok)
```

App entity'leri **sadece Platform interface'lerini** implemente eder, Platform sınıflarından türemez.

### TPH Yerine Bağımsız Entity

CodePro Supplier eskiden `Supplier : Account` (TPH) idi. Bu pattern terk edildi:

- Bounded context netleşti (Account ≠ Supplier).
- Discriminator karmaşıklığı kalktı.
- Her app kendi entity'sinin yaşam döngüsünü kontrol ediyor.

Yeni entity tasarımında **TPH discriminator kullanma**. Aynı tabloda farklı tipler tutmaya ihtiyacın varsa bounded context'i sorgula — muhtemelen iki ayrı entity gerek.

### Polimorfik Referans (Activity Regarding gibi)

Bir Platform entity'si app-spesifik entity'ye referans veriyorsa (`Activity.RegardingEntityType` + `RegardingEntityId`), `IEntityReferenceResolver` registry pattern'ı kullan:

```csharp
// Apps/CodePro/CodePro.Infrastructure/References/SupplierReferenceResolver.cs
public class SupplierReferenceResolver : IEntityReferenceResolver
{
    public string EntityType => nameof(Supplier);
    public Task<EntityReference?> ResolveAsync(Guid id, CancellationToken ct) { ... }
}
```

DI'da kayıt: `services.AddScoped<IEntityReferenceResolver, SupplierReferenceResolver>()`.

---

## 9. SQL Migration Yazım Kuralları

### Temel Kurallar

1. **EF Core migration üretme.** Tüm schema değişiklikleri manuel `.sql` dosyalarıyla.
2. **PostgreSQL syntax** — `IF NOT EXISTS`, `snake_case` tablo/kolon adı, `uuid` PK, `timestamptz` zaman.
3. **Idempotent olmalı** — `IF NOT EXISTS` / `IF EXISTS` ile birden fazla çalıştırılsa bile hata vermemeli.
4. **Bir script, bir amaç** — Birden fazla bağımsız değişikliği tek dosyaya tıkıştırma.
5. **Forward-only kurulumda script sırası önemli** — FK'lar bağımlı tabloların üstünde durur.

### Konum

| Scope | Klasör |
|---|---|
| Platform (Identity, Activity, Attachment, vs.) | `Platform/Platform.Database/` |
| CRM bounded context | `Apps/Crm/Crm.Database/` |
| CodePro bounded context | `Apps/CodePro/CodePro.Database/` |

### Naming Convention

```
{Sıra}-{TabloVeyaKonu}.sql

01-Identity.sql
02-Activity.sql
03-Account.sql
04-Contact.sql
00-Supplier.sql
```

Sıra prefix'i bağımlılık yönüne göre belirlenir (parent tablo önce). Açıklayıcı PascalCase isim.

### Idempotent Örnek (PostgreSQL)

```sql
-- Apps/CodePro/CodePro.Database/00-Supplier.sql
CREATE TABLE IF NOT EXISTS supplier (
    id                    uuid PRIMARY KEY,
    organization_id       uuid NOT NULL,
    name                  text NOT NULL,
    supplier_type         int  NOT NULL,
    supplier_status       int  NOT NULL,
    vkn                   varchar(20),
    contact_person_email  text,
    is_deleted            boolean NOT NULL DEFAULT false,
    deleted_at_utc        timestamptz,
    created_at_utc        timestamptz NOT NULL DEFAULT now(),
    created_by_user_id    uuid NOT NULL,
    updated_at_utc        timestamptz,
    updated_by_user_id    uuid,
    CONSTRAINT fk_supplier_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id)
);

CREATE INDEX IF NOT EXISTS ix_supplier_organization_id
    ON supplier(organization_id) WHERE is_deleted = false;

CREATE UNIQUE INDEX IF NOT EXISTS ux_supplier_vkn
    ON supplier(organization_id, vkn) WHERE is_deleted = false AND vkn IS NOT NULL;
```

### Schema Değişikliği

Mevcut tabloya kolon eklerken ayrı script ekle, mevcut script'i güncelleme (eğer DB sıfırlanmadığı bir ortam söz konusu ise):

```sql
-- Apps/Crm/Crm.Database/02-Account-Add-Industry.sql
ALTER TABLE account ADD COLUMN IF NOT EXISTS industry text;

CREATE INDEX IF NOT EXISTS ix_account_industry
    ON account(industry) WHERE is_deleted = false;
```

Geliştirme aşamasında DB sıfırlanabiliyorsa: doğrudan kaynak script'i güncelle, ek dosya açma.

### Expand/Contract Pattern (Production Breaking Change)

Production'da çalışan bir DB'de breaking change için:

1. **Expand**: Yeni kolon/tablo ekle, nullable.
2. **Deploy app v1.1**: Hem eski hem yeni yapıyı yazar.
3. **Data migration**: Eski veriyi yeni yapıya taşıyan script.
4. **Deploy app v1.2**: Sadece yeni yapıyı kullanır.
5. **Contract**: Eski kolonu/tabloyu kaldır.

### Cross-App Bağımlılık

App migration script'i **Platform tablolarına FK verebilir** (`organization`, `app_user`). Tersi yasak — Platform script'i App tablosunu bilmez.

### Script Review Kuralları

SQL script PR'ları **özel dikkat** ister:

- `DROP TABLE`, `DROP COLUMN`, `ALTER COLUMN TYPE` içeren script'ler için ekstra göz.
- Production'a deploy öncesi staging'de en az 1 kez çalışması gerekir.
- Büyük tablolarda (>1M satır) `EXPLAIN ANALYZE` ile plan kontrolü.
- Index ekleme — `CONCURRENTLY` opsiyonu (PostgreSQL) production'da kilitleme önler.

---

## 10. Versiyonlama

PlatformSuite tek bir repo + tek bir solution + project reference modeliyle çalışıyor. NuGet paketi olarak yayınlanan bir Platform sürümü yok — tüm App'ler her zaman Platform'un main branch'indeki halini kullanır.

### Repo / Tag Versiyonlama

- Tüm repo için `MAJOR.MINOR.PATCH` git tag'leri.
- **MAJOR**: API breaking, schema breaking veya frontend public component breaking.
- **MINOR**: Yeni özellik, yeni endpoint, yeni entity.
- **PATCH**: Bug fix, küçük iyileştirme.

### Per-App Sürüm

Her App **bağımsız deploy edilebilir**. Versiyonu kendi `Apps/<App>/<App>.Api.csproj` veya CI tag'i üzerinden yönetilir. Ortak Platform değişikliği geldiğinde tüm App'ler birden yeniden build edilir.

### Frontend Package Versiyonlama

`@platform/ui` pnpm workspace package'ı `package.json` üzerinden versiyonlanır. App.Web'ler `workspace:*` ile bağlı, dolayısıyla repo build'i sırasında her zaman güncel. Eksterne yayınlanmaz.

### Breaking Change Kararı

Şunlar **breaking**:

- Entity'den alan çıkarma veya tipi değiştirme.
- `IApplicationDbContext`, `IUnitOfWork`, `IEntityReferenceResolver` gibi public interface'lerden method çıkarma.
- Mevcut REST endpoint'i kaldırma veya request/response şemasını değiştirme.
- `@platform/ui`'den export edilen component'in public prop'unu kaldırma.
- DB schema'da non-backward-compatible değişiklik (kolon tipi değişmesi, NOT NULL ekleme vb.).

Şunlar **breaking DEĞİL**:

- Yeni optional alan ekleme.
- Yeni endpoint, yeni handler, yeni entity ekleme.
- Internal refactor (App entity'lerinin bir context'ten diğerine taşınması — App tüketicisinin Build'i etkilenmediği sürece).
- Bug fix (davranış aslında hatalıysa).

### Changelog

Her release için `CHANGELOG.md` güncellenir. [Keep a Changelog](https://keepachangelog.com/) formatı:

```markdown
## [1.3.0] - 2026-05-01

### Added

- CodePro Supplier entity (standalone, replaces Account TPH inheritance).
- IEntityReferenceResolver registry pattern for polymorphic Activity regarding.

### Changed

- Account/Contact moved from Platform.Domain to Crm.Domain.
- ReferenceRepository now delegates to resolver registry instead of switch-case.

### Removed

- Platform.Domain.Entities.Accounts (moved to Crm.Domain).
- 00-AccountCodeProExtension.sql (replaced with 00-Supplier.sql).
```

---

## 11. Test Politikası

### Test Katmanları

1. **Unit Test** — Handler, Validator, Reducer, Domain method.
   - Handler: mock repository / DbContext, Result dönüşünü doğrula.
   - Validator: FluentValidation `TestValidate()` ile her kural.
   - Reducer: `(state, intent) => state` — saf, hızlı.
2. **Integration Test** — DbContext davranışları, query filter'lar, audit pipeline.
   - PostgreSQL TestContainers ile gerçek DB. EF in-memory provider **kullanma** (filter/query davranışları farklılaşır).
3. **API Test** — Controller + handler + DB end-to-end (`WebApplicationFactory<Program>`).
   - Privilege authorization, ProblemDetails dönüşü, Result → HTTP status mapping.
4. **Frontend Test** — Vitest + React Testing Library. Component, hook, reducer ayrı.

### Test Projesi Konumu

| Test türü | Konum |
|---|---|
| Platform unit/integration | `Platform/Platform.Application.Tests/`, `Platform.Infrastructure.Tests/` |
| App unit/integration | `Apps/<App>/<App>.Application.Tests/` |
| App API integration | `Apps/<App>/<App>.Api.Tests/` |
| Frontend | `Apps/<App>/<App>.Web/src/**/*.test.{ts,tsx}` |

### Coverage Hedefleri

- Platform.Domain, Platform.Application: **>80%**
- App.Application (handler/validator): **>70%**
- App.Infrastructure (repository): **>60%**
- Critical business logic (pricing, state machines, authorization): **>90%**

### Test Yazım Kuralları

- **AAA Pattern:** Arrange, Act, Assert.
- **Descriptive naming:** `CreateSupplier_WhenVknDuplicate_ReturnsConflictError`.
- **Bir test, bir mantıksal assert.**
- **Flaky test sıfır tolerans** — flaky ise düzelt veya sil.

### Örnek: Handler Test

```csharp
public class CreateSupplierHandlerTests
{
    [Fact]
    public async Task Handle_WhenVknAlreadyExists_ReturnsDuplicateError()
    {
        var repo = Substitute.For<ISupplierRepository>();
        repo.ExistsByVknAsync("1234567890", Arg.Any<CancellationToken>()).Returns(true);
        var handler = new CreateSupplierHandler(repo, Substitute.For<IUnitOfWork>());

        var result = await handler.Handle(
            new CreateSupplierCommand { Name = "Acme", Vkn = "1234567890" },
            CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Be(SupplierErrors.DuplicateVkn);
    }
}
```

---

## 12. Code Review Checklist

Reviewer olarak PR'ları değerlendirirken kontrol edilecekler:

### Mimari

- [ ] Değişiklik doğru katmanda mı? (Platform vs `<App>`)
- [ ] Platform'a eklenen şey gerçekten cross-cutting mi (tüm app'lerin ihtiyacı)?
- [ ] App entity'si Platform interface'lerini implemente ediyor mu (inheritance yerine)?
- [ ] Bounded context çakışması yok mu (Account/Supplier ayrımı)?
- [ ] Polimorfik referans varsa `IEntityReferenceResolver` kayıtlı mı?
- [ ] Frontend katman yönü doğru mu (app → pages → widgets → features → entities → shared)?

### Backend Kod Kalitesi

- [ ] Command/Query ayrımı doğru mu? (yazma → ICommand, okuma → IQuery)
- [ ] Handler exception fırlatmıyor, `Result.Failure` dönüyor mu?
- [ ] Query handler `IApplicationDbContext` + `.ProjectToType<T>()` kullanıyor mu?
- [ ] Command handler repository + UnitOfWork kullanıyor mu (manuel SaveChanges yok)?
- [ ] FluentValidation input için, Result.Failure business rule için ayrılmış mı?
- [ ] Mapster `MappingConfig` kullanılıyor mu (manuel mapping yok)?
- [ ] Controller tek satır, sadece `ISender.Send(...).ToActionResult()` mı?
- [ ] `[PrivilegeAuthorize]` her endpoint'te var mı?

### Frontend Kod Kalitesi

- [ ] DetailPageLayout / ListPageLayout kullanılıyor mu?
- [ ] Mode kararları field primitive'inde, sayfa kodunda `mode === 'view'` yok mu?
- [ ] Mode prop yerine `FormModeProvider` kontekst kullanılıyor mu?
- [ ] httpClient üzerinden çağrı (doğrudan axios yok)?
- [ ] Query key fabrikası (`accountKeys.detail(id)`) kullanılıyor mu?
- [ ] Reducer saf mı, yan etki yok mu?

### Test

- [ ] Handler unit test yazılmış mı?
- [ ] Validator test yazılmış mı (input kuralları için)?
- [ ] Integration test gerekli miydi, TestContainers ile yazılmış mı?
- [ ] Edge case'ler düşünülmüş mü?

### Database

- [ ] SQL migration script doğru klasörde mi (Platform / `<App>`)?
- [ ] Script idempotent (`IF NOT EXISTS`) ve PostgreSQL syntax mı?
- [ ] FK yönü doğru mu (App → Platform, Platform → App yasak)?
- [ ] Production'a etkisi varsa expand/contract pattern düşünüldü mü?

### Dokümantasyon

- [ ] Public API'ye XML doc comment eklendi mi (gerekiyorsa)?
- [ ] CHANGELOG.md güncellendi mi (kullanıcıya görünür değişiklik için)?
- [ ] ADR gerekli miydi, yazıldı mı?
- [ ] `CLAUDE.md` veya `docs/*.md` etkilenen kuralları içeriyor mu (mimari değişikliği varsa)?

### Security

- [ ] SQL injection riski yok mu (parametreli sorgular)?
- [ ] `[PrivilegeAuthorize]` her endpoint'te var mı?
- [ ] `MultiTenantQueryFilter` etkili mi (yeni entity için config'de)?
- [ ] Sensitive data log'lara sızıyor mu (parola, token)?

---

## Yardım ve İletişim

- **Mimari sorular:** `docs/Api_Architecture.md` ve `docs/Client_Architecture.md` dokümanlarını incele, hâlâ belirsizse tech lead'e sor.
- **Bug report:** GitHub Issues.
- **Feature request:** Önce issue ile tartışılır, sonra PR.
- **Acil durum:** Slack `#platform-emergency` kanalı.

---

**Son Güncelleme:** 2026-05-08 — Multi-app refactor (Account/Contact → CRM, Supplier standalone, IEntityReferenceResolver registry)
**Doküman Versiyonu:** 1.0
