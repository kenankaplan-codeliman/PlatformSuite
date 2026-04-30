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
platform-suite/
├── platform/                   # Shared platform code (NuGet + npm packages)
│   ├── Platform.Core/
│   ├── Platform.Entities/
│   ├── Platform.Domain/
│   ├── Platform.Infrastructure/
│   ├── Platform.Api/
│   └── platform.ui/
├── apps/                       # Consumer applications
│   ├── crm/
│   ├── hrm/
│   └── procurement/
├── tools/
│   └── DatabaseMigrator/       # SQL migration runner
├── docs/
│   └── architecture/           # ADRs, refactoring plan
└── .github/workflows/          # CI/CD pipelines
```

**Temel prensip:** `platform/` içindeki her şey **paylaşılan**, `apps/` içindeki her şey **uygulamaya özel**. Bir değişikliğin hangi tarafa ait olduğundan emin değilsen, önce issue açıp tartış.

---

## 2. Geliştirme Ortamının Kurulumu

### Gereksinimler

- .NET SDK 8.0+
- Node.js 20+
- Docker Desktop (local DB için)
- SQL Server (veya Docker image)
- Git 2.40+

### İlk Kurulum

```bash
# Repo'yu klonla
git clone <repo-url>
cd platform-suite

# Internal NuGet feed'i yapılandır (gerekli credential'lar için team lead'e başvur)
dotnet nuget add source <feed-url> --name internal

# npm registry'yi yapılandır
npm config set @yourorg:registry <registry-url>

# Backend bağımlılıklar
dotnet restore

# Frontend bağımlılıklar (Turborepo/Nx workspace)
cd platform/platform-ui && npm install
cd ../../apps/crm/crm-web && npm install

# Local DB'leri ayağa kaldır
docker compose up -d

# DB migration'larını çalıştır
cd tools/DatabaseMigrator
dotnet run -- --app crm --connection "Server=...;Database=CRM_Dev;..."
dotnet run -- --app hrm --connection "Server=...;Database=HRM_Dev;..."
```

### Local Çalıştırma

Her uygulama bağımsız çalışır:

```bash
# CRM API
cd apps/crm/CRM.Api && dotnet run

# CRM Web
cd apps/crm/crm-web && npm run dev
```

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

> **Örnek:** Finance uygulaması eklenecek.

### Adım 1: Proje İskeletini Oluştur

```bash
cd apps
mkdir finance && cd finance

dotnet new classlib -n Finance.Domain
dotnet new classlib -n Finance.Infrastructure
dotnet new webapi -n Finance.Api

mkdir finance-web
cd finance-web && npm init -y
```

### Adım 2: Platform Paketlerini Referansla

**Backend:**

```xml
<!-- Finance.Api.csproj -->
<ItemGroup>
  <PackageReference Include="Platform.Core" Version="1.*" />
  <PackageReference Include="Platform.Entities" Version="1.*" />
  <PackageReference Include="Platform.Domain" Version="1.*" />
  <PackageReference Include="Platform.Infrastructure" Version="1.*" />
  <PackageReference Include="Platform.Api" Version="1.*" />
</ItemGroup>
```

**Frontend:**

```json
{
  "dependencies": {
    "@yourorg/platform-ui": "^1.0.0"
  }
}
```

### Adım 3: DbContext Oluştur

```csharp
// Finance.Infrastructure/FinanceDbContext.cs
public class FinanceDbContext : PlatformDbContext
{
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<PaymentRecord> Payments { get; set; }

    public FinanceDbContext(
        DbContextOptions<FinanceDbContext> options,
        ICurrentUserService currentUser,
        ITenantProvider tenantProvider)
        : base(options, currentUser, tenantProvider) { }

    protected override void ConfigureApp(ModelBuilder modelBuilder)
    {
        // Account'u extend etmek gerekirse:
        // modelBuilder.Entity<Account>()
        //     .HasDiscriminator<string>("AccountCategory")
        //     .HasValue<Account>("Standard")
        //     .HasValue<ClientAccount>("Client");

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(FinanceDbContext).Assembly);
    }
}
```

### Adım 4: DI Kurulumu

```csharp
// Finance.Api/Program.cs
builder.Services.AddPlatformServices<FinanceDbContext>(builder.Configuration);
builder.Services.AddFinanceServices();
```

### Adım 5: İlk SQL Migration

```sql
-- Finance.Infrastructure/Database/Migrations/Finance_V001_20250401_InitialFinanceSchema.sql
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Invoices')
BEGIN
    CREATE TABLE [dbo].[Invoices] (
        [Id] UNIQUEIDENTIFIER PRIMARY KEY,
        [AccountId] UNIQUEIDENTIFIER NOT NULL,
        [Amount] DECIMAL(18,2) NOT NULL,
        [DueDate] DATETIME2 NOT NULL,
        -- audit fields
        [CreatedAt] DATETIME2 NOT NULL,
        [CreatedBy] UNIQUEIDENTIFIER NOT NULL,
        [UpdatedAt] DATETIME2 NULL,
        [UpdatedBy] UNIQUEIDENTIFIER NULL,
        [IsDeleted] BIT NOT NULL DEFAULT 0,
        [DeletedAt] DATETIME2 NULL,
        CONSTRAINT FK_Invoices_Accounts FOREIGN KEY ([AccountId]) REFERENCES [dbo].[Accounts]([Id])
    );

    CREATE INDEX IX_Invoices_AccountId ON [dbo].[Invoices]([AccountId]);
    CREATE INDEX IX_Invoices_DueDate ON [dbo].[Invoices]([DueDate]) WHERE [IsDeleted] = 0;
END
GO
```

### Adım 6: DatabaseMigrator'a Ekle

```csharp
// tools/DatabaseMigrator/Program.cs (switch case'e ekle)
"finance" => new[] {
    typeof(Platform.Infrastructure.Marker).Assembly,
    typeof(Finance.Infrastructure.Marker).Assembly
},
```

### Adım 7: Frontend Kurulumu

```typescript
// apps/finance/finance-web/src/pages/AccountPage.tsx
import { AccountForm } from '@yourorg/platform-ui';

export function FinanceAccountPage({ account }) {
  return (
    <AccountForm
      account={account}
      onSubmit={handleSubmit}
      additionalFields={<CreditLimitField />}
    />
  );
}
```

### Adım 8: CI/CD Pipeline

`.github/workflows/finance.yml` dosyası oluştur, mevcut `crm.yml`'ı template olarak kullan.

### Adım 9: Refactoring Plan'ı Güncelle

`docs/Platform-Refactoring-Plan.md` dosyasına yeni uygulama için bir bölüm ekle.

---

## 7. Platform'a Değişiklik Yapma Rehberi

Platform'a yapılan her değişiklik **tüm consumer uygulamaları etkiler**. Bu yüzden çok dikkatli olunmalı.

### Kritik Soru: Gerçekten Platform'a mı Ait?

Bir alan veya davranış eklemeden önce şu soruları sor:

1. **3 uygulamanın da ihtiyacı var mı?** — Değilse platform'a koyma.
2. **2 uygulamanın ihtiyacı var ama 1'inin yok mu?** — Platform'a koymak yerine behavior interface veya shared module düşün.
3. **Sadece 1 uygulamanın mı?** — Kesinlikle o uygulamada kalsın.

### Platform Değişikliği İş Akışı

1. **Issue aç** — platform'da ne değişecek, hangi uygulamaları etkileyecek.
2. **ADR yaz** — mimari karar gerektiren değişiklikler için `docs/adr/` altında yeni bir karar kaydı.
3. **Feature branch** — değişikliği yap, test et.
4. **Version bump** — semantic versioning kurallarına göre.
5. **Migration script** — schema değişikliği varsa platform script'i yaz.
6. **Consumer uygulamalarda uyum** — her uygulamada ayrı PR ile paket güncellemesi ve gerekli app migration script'i.
7. **Koordineli release** — platform paketi önce, consumer uygulamalar sonra.

### Breaking Change Protokolü

1. Öncesinde `#platform-architecture` kanalında duyuru.
2. Deprecation phase: yeni API ekle, eski API'yi `[Obsolete]` ile işaretle.
3. En az 1 minor version deprecation için bekle.
4. Sonraki major version'da eski API'yi kaldır.
5. Migration guide yaz: `docs/migrations/platform-{version}.md`.

---

## 8. Entity Tasarım Kuralları

### İsimlendirme

- **Platform prefix KULLANMA.** Entity isimleri ham olsun: `Account`, `Contact`, `Activity`.
- Ayrım **namespace** ile yapılır: `Platform.Entities.Account` vs. `Procurement.Domain.Entities.VendorAccount`.
- Uygulama-özel extend'lerde anlamlı prefix: `VendorAccount`, `SupplierAccount`, `LeadAccount`.

### Base Entity Kuralları

Platform entity'leri **minimum ortak küme** olmalı. Ekleme yapmadan önce:

- [ ] 3 uygulamanın da ihtiyacı olduğunu doğrula.
- [ ] Alanın uygulamaya özel olup olmadığını sorgula.
- [ ] Alternatif olarak behavior interface + value object düşün.

### Extension Pattern (TPH)

Bir uygulamanın extend etmesi gerekiyorsa:

```csharp
// Doğru
public class VendorAccount : Platform.Entities.Account
{
    public string? VendorCode { get; set; }
    public decimal CreditLimit { get; set; }
}

// Yanlış: derin inheritance
public class SpecialVendorAccount : VendorAccount { }  // Max 2 seviye kuralını ihlal eder
```

### Inheritance Max 2 Seviye

- ✅ `Account → VendorAccount`
- ❌ `Account → VendorAccount → SupplierAccount → CertifiedSupplierAccount`

Derin hiyerarşi yerine composition kullan.

### Behavior Interface'leri Tercih Et

Cross-cutting concern'ler için inheritance yerine interface:

```csharp
public class Employee : IAddressable, IContactable, IAuditable
{
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    // ...
}
```

Bu sayede Employee, `AddressableExtensions.GetPrimaryAddress()` gibi tüm platform extension'larından otomatik faydalanır.

---

## 9. SQL Migration Yazım Kuralları

### Temel Kurallar

1. **EF Core migration üretme.** Tüm schema değişiklikleri manuel SQL ile.
2. **Idempotent olmalı** — birden fazla çalıştırılsa bile hata vermemeli.
3. **Transactional olmalı** — DbUp `WithTransactionPerScript()` ile otomatik.
4. **Bir script, bir amaç** — 15 şeyi tek script'e tıkıştırma.
5. **Her forward script'in rollback'i olmalı.**
6. **Büyük tablolarda online operation** — `ONLINE = ON` (SQL Server Enterprise).

### Naming Convention

```
{Scope}_{Version}_{Timestamp}_{Description}.sql

Platform_V001_20250101_InitialCoreSchema.sql
CRM_V005_20250315_AddLeadScoringColumns.sql
Finance_V001_20250401_InitialFinanceSchema.sql
```

- Scope: `Platform` veya app adı
- Version: `V001` sıralı
- Timestamp: `YYYYMMDD`
- Description: PascalCase, açıklayıcı

### Idempotent Örnek

```sql
-- Platform_V012_20250501_AddAccountIndustry.sql
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND name = 'Industry'
)
BEGIN
    ALTER TABLE [dbo].[Accounts] ADD [Industry] NVARCHAR(100) NULL;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND name = 'IX_Accounts_Industry'
)
BEGIN
    CREATE INDEX IX_Accounts_Industry ON [dbo].[Accounts]([Industry]) WHERE [IsDeleted] = 0;
END
GO
```

### Expand/Contract Pattern (Breaking Change)

Breaking DB change'leri **birden fazla deploy'a yay**:

1. **Expand** (V100): Yeni kolon/tablo ekle, nullable.
2. **Deploy app v1.1**: Hem eski hem yeni yapıyı yazar.
3. **Data migration** (V101): Eski veriyi yeni yapıya taşı.
4. **Deploy app v1.2**: Sadece yeni yapıyı kullanır.
5. **Contract** (V102): Eski kolonu/tabloyu kaldır.

### Rollback Script

Her forward script için rollback:

```sql
-- Platform_V012_Rollback.sql
IF EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND name = 'IX_Accounts_Industry'
)
BEGIN
    DROP INDEX IX_Accounts_Industry ON [dbo].[Accounts];
END
GO

IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND name = 'Industry'
)
BEGIN
    ALTER TABLE [dbo].[Accounts] DROP COLUMN [Industry];
END
GO
```

### Script Review Kuralları

SQL script PR'ları **özel dikkat** ister:

- DBA veya senior developer review etmeli.
- `DROP TABLE`, `DROP COLUMN`, `ALTER COLUMN` içeren script'ler için ekstra göz.
- Production migration öncesi staging'de en az 1 kez çalışması gerekir.
- Büyük tablolarda (>1M satır) execution plan kontrol edilmeli.

---

## 10. Versiyonlama

### Semantic Versioning (SemVer)

`MAJOR.MINOR.PATCH` — `1.3.2`

- **MAJOR** (1.x.x → 2.0.0): Breaking change.
- **MINOR** (1.2.x → 1.3.0): Geriye uyumlu yeni özellik.
- **PATCH** (1.2.3 → 1.2.4): Bug fix.

### Platform Paket Versiyonlama

Her platform paketi **bağımsız versiyonlanır**:

- `Platform.Core` → 1.2.0
- `Platform.Entities` → 1.5.3
- `Platform.Infrastructure` → 2.0.1

Ama pratikte **koordineli bump** yapılır — birinde major değişiklik varsa diğerleri de incelenip uygun şekilde güncellenir.

### Breaking Change Kararı

Şunlar **breaking**:

- Entity'den alan çıkarma.
- Entity alanının tipi değişmesi.
- Public method signature değişmesi.
- Interface'e yeni method eklenmesi (varsayılan implementasyon yoksa).
- DB schema'da non-backward-compatible değişiklik (kolon tipi değişmesi, NOT NULL ekleme vb.).

Şunlar **breaking DEĞİL**:

- Yeni optional alan ekleme.
- Yeni method ekleme (mevcut interface'leri bozmadan).
- Internal refactor.
- Bug fix (davranış aslında hatalıysa).

### Changelog

Her release için `CHANGELOG.md` güncellenir. [Keep a Changelog](https://keepachangelog.com/) formatı:

```markdown
## [1.3.0] - 2025-05-01

### Added

- Account entity now has optional Industry field.
- IAddressable.GetSecondaryAddresses() extension method.

### Changed

- Improved AuditBehavior performance (no breaking change).

### Deprecated

- Account.LegacyTaxCode (use TaxNumber instead). Removed in 2.0.0.
```

---

## 11. Test Politikası

### Test Katmanları

1. **Unit Test** — her sınıf/metod için.
   - Platform.Domain'deki extension method'ları %100 cover edilmeli.
   - Repository ve service sınıfları mock DbContext ile test edilir.
2. **Integration Test** — DbContext davranışları, query filter'lar, audit.
   - In-memory SQLite veya TestContainers ile gerçek DB.
3. **Contract Test** — derived entity'lerin base davranışı koruduğunu doğrular.
   - Örn: her `Account` türevi `IAuditable`, `ISoftDeletable` kurallarına uymalı.
4. **End-to-End Test** — API + frontend akışları (opsiyonel, kritik path'ler için).

### Coverage Hedefleri

- Platform.Core, Platform.Domain: **>80%**
- Platform.Infrastructure: **>70%**
- Apps: **>60%**
- Critical business logic: **>90%**

### Test Yazım Kuralları

- **AAA Pattern:** Arrange, Act, Assert.
- **Descriptive naming:** `Account_WhenPrimaryAddressAdded_SetsOthersAsNonPrimary`.
- **Bir test, bir assert** (mantıksal olarak).
- **Flaky test sıfır tolerans** — flaky ise düzelt veya sil.

### Örnek: Contract Test

```csharp
public abstract class AccountContractTests<TAccount> where TAccount : Account, new()
{
    [Fact]
    public void Account_ImplementsIAuditable()
    {
        typeof(TAccount).Should().BeAssignableTo<IAuditable>();
    }

    [Fact]
    public void Account_CanAddAddress()
    {
        var account = new TAccount();
        var address = new Address { Type = AddressType.Billing, IsPrimary = true };

        account.AddAddress(address);

        account.Addresses.Should().ContainSingle()
            .Which.IsPrimary.Should().BeTrue();
    }
}

public class PlatformAccountContractTests : AccountContractTests<Account> { }
public class VendorAccountContractTests : AccountContractTests<VendorAccount> { }
```

---

## 12. Code Review Checklist

Reviewer olarak PR'ları değerlendirirken kontrol edilecekler:

### Mimari

- [ ] Değişiklik doğru katmanda mı? (Platform vs App)
- [ ] Platform'a eklenen şey 3 uygulamanın da ihtiyacı mı?
- [ ] Behavior interface kullanılabilir miydi, inheritance yerine?
- [ ] Inheritance max 2 seviyeyi aşıyor mu?
- [ ] Entity ismi ham mı (prefix yok)?

### Kod Kalitesi

- [ ] İsimler açıklayıcı mı?
- [ ] Single Responsibility Principle'a uyuyor mu?
- [ ] Magic number/string yok mu?
- [ ] Null-safety düşünülmüş mü?
- [ ] Async/await doğru kullanılmış mı?

### Test

- [ ] Unit test yazılmış mı?
- [ ] Integration test gerekli miydi, yazılmış mı?
- [ ] Edge case'ler düşünülmüş mü?
- [ ] Contract test güncellendi mi (derived entity eklendiyse)?

### Database

- [ ] SQL migration script yazılmış mı (schema değişikliği varsa)?
- [ ] Script idempotent mi?
- [ ] Rollback script var mı?
- [ ] Büyük tablolarda online operation kullanılmış mı?

### Versiyonlama

- [ ] Platform paket versiyonu bump'landı mı?
- [ ] SemVer kuralına uygun mu?
- [ ] CHANGELOG.md güncellendi mi?
- [ ] Breaking change varsa migration guide yazıldı mı?

### Dokümantasyon

- [ ] Public API'ye XML doc comment eklendi mi?
- [ ] Refactoring plan checkbox'ı işaretlendi mi (ilgili task ise)?
- [ ] ADR gerekli miydi, yazıldı mı?

### Security

- [ ] SQL injection riski yok mu?
- [ ] Authorization kontrolü var mı (API endpoint'lerde)?
- [ ] Sensitive data log'lara sızıyor mu?
- [ ] Tenant isolation doğru mu?

---

## Yardım ve İletişim

- **Mimari sorular:** `docs/Platform-Refactoring-Plan.md` dosyasını incele, hâlâ belirsizse tech lead'e sor.
- **Bug report:** GitHub Issues.
- **Feature request:** Önce issue ile tartışılır, sonra PR.
- **Acil durum:** Slack `#platform-emergency` kanalı.

---

**Son Güncelleme:** Faz 0 — başlangıç
**Doküman Versiyonu:** 1.0
