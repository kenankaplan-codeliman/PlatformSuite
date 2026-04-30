# Business Application Platform — Refactoring Plan & Mimari Referans

> **Amaç:** Mevcut React + .NET API tabanlı base Business Application platformunu, üzerine birden fazla uygulama (CRM, HRM, Procurement vb.) inşa edilebilecek şekilde yeniden yapılandırmak. Bu doküman hem refactoring iş planı hem de devam eden geliştirmelerde referans alınacak mimari karar kaydıdır.

---

## 1. Mevcut Durum

- **Frontend:** React
- **Backend:** .NET API
- **Base Entity'ler:** Account, Contact, Activity
- **Hedef:** Bu base platform üzerinde CRM, HRM, Procurement gibi birden fazla uygulama geliştirmek. Account, Contact, Activity gibi core entity'lerdeki değişikliklerin (ör. Identity tarafındaki bir ekleme) tüm uygulamalara yansıması.

---

## 2. Mimari Kararlar Özeti

| Konu | Karar |
|------|-------|
| Kod paylaşım modeli | **Monorepo + ProjectReference / pnpm workspaces** (Faz 1). Internal NuGet/npm feed sinyal görününce ileride. |
| Repo yapısı | Tek monorepo, `Platform/` ve `Apps/` klasörleri |
| Kod paylaşımı | .NET: ProjectReference. Frontend: pnpm workspace `@platform/ui`. Release birimi = Docker image. |
| Bağımsız release | App-prefix git tag (`crm-v*`, `codepro-v*`) → kendi Dockerfile + kendi CI workflow. |
| Veri izolasyonu | **Her uygulama kendi DB'si** |
| Entity extension stratejisi | **Default paylaşım + gerektiğinde extend** (YAGNI) |
| Inheritance mapping | EF Core **TPH (Table Per Hierarchy)** — uygulama bazında |
| Cross-cutting concerns | **Behavior Interfaces** (`IAddressable`, `IContactable`, `IAuditable`, `ISoftDeletable`) |
| DbContext | **Abstract `PlatformDbContext`**, her uygulama extend eder |
| Global query filter'lar | Platform seviyesinde (soft delete, multi-tenant vb.) |
| Audit | SaveChanges override veya Interceptor ile otomatik |
| Domain event | MediatR + Pipeline Behaviors |
| Repository pattern | Abstract `PlatformRepository<T>` base |
| DB schema yönetimi | **Manuel SQL script + DbUp** (EF Core migration KULLANILMAYACAK) |
| Migration çalıştırma | Ayrı `DatabaseMigrator` console uygulaması (CI/CD'de) |
| Entity isimlendirme | **Prefix YOK** — `Account`, `Contact`, `Activity` (ham isimler) |

---

## 3. Hedef Mimari

### 3.1. Repo Yapısı

```
platform-suite/
├── platform/
│   ├── Platform.Core/                  # Base classes, interfaces, utilities
│   ├── Platform.Entities/              # Account, Contact, Activity, Address, PhoneNumber, Email
│   ├── Platform.Domain/                # Domain services, business rules, extension methods
│   ├── Platform.Infrastructure/        # PlatformDbContext, PlatformRepository, config'ler
│   │   └── Database/
│   │       ├── Migrations/             # SQL script'leri (embedded resource)
│   │       ├── Rollbacks/
│   │       ├── Seeds/
│   │       └── Functions/
│   ├── Platform.Api/                   # Base controllers, middleware, filters
│   └── platform-ui/                    # React component library (npm package)
├── apps/
│   ├── crm/
│   │   ├── CRM.Domain/
│   │   ├── CRM.Infrastructure/
│   │   │   └── Database/Migrations/
│   │   ├── CRM.Api/
│   │   └── crm-web/
│   ├── hrm/
│   └── procurement/
├── tools/
│   └── DatabaseMigrator/               # Console app — CI/CD'de çalışır
└── .github/
    └── workflows/                      # CI/CD pipeline'ları
```

### 3.2. Kod Paylaşım Mekanizması

**Faz 1 (mevcut karar — küçük ekip, erken evre):**
- .NET projeleri **ProjectReference** ile birbirini tüketir. Apps/Crm/Crm.Api.csproj → Platform/*.csproj.
- Frontend **pnpm workspaces**. `Platform/Platform.Web` paket adı `@platform/ui`, app'ler `workspace:*` ile tüketir.
- **Paket sürümü YOK.** Sürüm dondurma git commit hash ile, release artifact = Docker image.
- App-prefix git tag (`crm-v1.4.2`, `codepro-v0.7.1`) tetikler app-spesifik CI release workflow'unu.
- Detaylı tasarım kararı: `/Users/kenankaplan/.claude/plans/platform-klasoru-ui-ve-federated-newell.md`

**Faz 2 (sinyal görününce — ertelendi):**
- Şu üç sinyalden biri görünene kadar paketlemeye geçilmez:
  1. Platform'u dış bir ekip/şirket tüketmeye başlarsa,
  2. CRM ve CodePro release takvimleri ciddi şekilde ayrışırsa,
  3. Monorepo CI build süresi kabul edilemez seviyeye ulaşırsa.
- O noktada: Internal NuGet (GitHub Packages/Azure Artifacts) + npm registry, SemVer (patch/minor/major) ile paketlenir.

### 3.3. Veri Paylaşım Stratejisi

- Her uygulama **kendi DB'sine sahip** (CRM DB, HRM DB, Procurement DB).
- Base entity'ler (Account, Contact, Activity) her DB'de aynı tablo yapısıyla bulunur.
- Uygulamalar arası veri senkronizasyonu gerekirse (örn. Account değişikliğinin diğer uygulamalara yansıması):
  - **İleri faz:** Event bus (MassTransit + RabbitMQ/Azure Service Bus) ile domain event yayını
  - **Başlangıç:** Bu doküman kapsamı DIŞINDA — ayrı bir faz

---

## 4. Entity Tasarımı

> **Not:** Entity isimlerinde `Platform` prefix'i KULLANILMAYACAK. Ham isimler (`Account`, `Contact`, `Activity`) kullanılacak. Namespace üzerinden ayrım yapılır: `Platform.Entities.Account` vs. `CRM.Domain.Entities.LeadAccount` gibi.

### 4.1. Base Entity'ler (Platform.Entities)

```csharp
namespace Platform.Entities;

public class Account : IAuditable, IAddressable, IContactable, ISoftDeletable
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? TaxNumber { get; set; }
    public string? TaxOffice { get; set; }
    public AccountType Type { get; set; }
    public AccountStatus Status { get; set; }

    // Collections (polymorphic via OwnerId/OwnerType)
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<PhoneNumber> PhoneNumbers { get; set; } = new List<PhoneNumber>();
    public ICollection<EmailAddress> Emails { get; set; } = new List<EmailAddress>();

    // IAuditable
    public DateTime CreatedAt { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }

    // ISoftDeletable
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}

public class Contact : IAuditable, IAddressable, IContactable, ISoftDeletable { /* ... */ }

public class Activity : IAuditable, ISoftDeletable
{
    public Guid Id { get; set; }
    public ActivityType Type { get; set; }  // Call, Meeting, Email, Task
    public string Subject { get; set; }
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public ActivityStatus Status { get; set; }

    // Polymorphic association (hangi entity ile ilişkili)
    public Guid RegardingId { get; set; }
    public string RegardingType { get; set; }  // "Account", "Contact", "Lead" etc.

    // Audit & soft delete...
}
```

### 4.2. Behavior Interfaces (Platform.Core)

```csharp
namespace Platform.Core.Abstractions;

public interface IAddressable
{
    ICollection<Address> Addresses { get; set; }
}

public interface IContactable
{
    ICollection<PhoneNumber> PhoneNumbers { get; set; }
    ICollection<EmailAddress> Emails { get; set; }
}

public interface IAuditable
{
    DateTime CreatedAt { get; set; }
    Guid CreatedBy { get; set; }
    DateTime? UpdatedAt { get; set; }
    Guid? UpdatedBy { get; set; }
}

public interface ISoftDeletable
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
}

public interface IMultiTenant
{
    Guid TenantId { get; set; }
}
```

### 4.3. Shared Value Objects (Platform.Entities)

```csharp
public class Address
{
    public Guid Id { get; set; }
    public AddressType Type { get; set; }  // Billing, Shipping, Home, Work
    public string Line1 { get; set; }
    public string? Line2 { get; set; }
    public string City { get; set; }
    public string? State { get; set; }
    public string Country { get; set; }
    public string PostalCode { get; set; }
    public bool IsPrimary { get; set; }

    // Polymorphic association
    public Guid OwnerId { get; set; }
    public string OwnerType { get; set; }
}

public class PhoneNumber { /* benzer yapı */ }
public class EmailAddress { /* benzer yapı */ }
```

### 4.4. Behavior Extension Methods (Platform.Domain)

```csharp
public static class AddressableExtensions
{
    public static Address? GetPrimaryAddress(this IAddressable entity, AddressType type)
    {
        return entity.Addresses
            .Where(a => a.Type == type)
            .FirstOrDefault(a => a.IsPrimary)
            ?? entity.Addresses.FirstOrDefault(a => a.Type == type);
    }

    public static void AddAddress(this IAddressable entity, Address address)
    {
        if (address.IsPrimary)
        {
            foreach (var existing in entity.Addresses.Where(a => a.Type == address.Type))
                existing.IsPrimary = false;
        }
        entity.Addresses.Add(address);
    }
}

public static class ContactableExtensions
{
    public static string? GetPrimaryEmail(this IContactable entity) =>
        entity.Emails.FirstOrDefault(e => e.IsPrimary)?.Value
        ?? entity.Emails.FirstOrDefault()?.Value;

    public static string? GetPrimaryPhone(this IContactable entity) =>
        entity.PhoneNumbers.FirstOrDefault(p => p.IsPrimary)?.Value
        ?? entity.PhoneNumbers.FirstOrDefault()?.Value;
}
```

### 4.5. Extension Stratejisi — TPH

**Kural:** Default paylaşım. Gerekirse extend.

- **CRM:** Başlangıçta Account'u olduğu gibi kullanır. İleride ihtiyaç olursa extend eder.
- **HRM:** Aynı şekilde Account'u olduğu gibi kullanır.
- **Procurement:** Account'a ek alanlar (VendorCode, PaymentTerms, CreditLimit) gerekiyor → **TPH ile extend**.

```csharp
// Procurement.Domain
namespace Procurement.Domain.Entities;

public class VendorAccount : Platform.Entities.Account
{
    public string? VendorCode { get; set; }
    public PaymentTerms PaymentTerms { get; set; }
    public int CreditDays { get; set; }
    public decimal CreditLimit { get; set; }
    public VendorCategory Category { get; set; }
}
```

**Öngörülü Yaklaşım:** Platform config'inde discriminator column baştan hazır olsun. Böylece ileride başka bir uygulama da extend etmek istediğinde sadece yeni `HasValue<>` tanımı eklenir, mevcut DB schema değişmez.

```csharp
// Platform.Infrastructure/Configurations/AccountConfiguration.cs
builder.Entity<Account>()
    .ToTable("Accounts")
    .HasDiscriminator<string>("AccountCategory")
    .HasValue<Account>("Standard");
```

---

## 5. DbContext Tasarımı

### 5.1. Abstract PlatformDbContext (Platform.Infrastructure)

```csharp
public abstract class PlatformDbContext : DbContext
{
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<PhoneNumber> PhoneNumbers { get; set; }
    public DbSet<EmailAddress> Emails { get; set; }

    protected readonly ICurrentUserService _currentUser;
    protected readonly ITenantProvider _tenantProvider;

    protected PlatformDbContext(
        DbContextOptions options,
        ICurrentUserService currentUser,
        ITenantProvider tenantProvider)
        : base(options)
    {
        _currentUser = currentUser;
        _tenantProvider = tenantProvider;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        ApplyPlatformConfigurations(modelBuilder);
        ApplyGlobalQueryFilters(modelBuilder);
        ConfigureApp(modelBuilder);   // Türetilmiş sınıfın hook'u
    }

    private void ApplyPlatformConfigurations(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PlatformDbContext).Assembly);
    }

    private void ApplyGlobalQueryFilters(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(ISoftDeletable.IsDeleted));
                var filter = Expression.Lambda(Expression.Not(property), parameter);
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
            }
            // IMultiTenant filter benzer şekilde
        }
    }

    // Hook: türetilmiş class kendi konfigürasyonunu burada uygular
    protected virtual void ConfigureApp(ModelBuilder modelBuilder) { }

    public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        ApplyAuditFields();
        await PublishDomainEventsAsync();
        return await base.SaveChangesAsync(ct);
    }

    private void ApplyAuditFields()
    {
        foreach (var entry in ChangeTracker.Entries<IAuditable>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.CreatedBy = _currentUser.UserId;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedBy = _currentUser.UserId;
            }
        }
    }

    protected virtual Task PublishDomainEventsAsync() => Task.CompletedTask;
}
```

### 5.2. CRM DbContext Örneği

```csharp
public class CRMDbContext : PlatformDbContext
{
    public DbSet<Lead> Leads { get; set; }
    public DbSet<Opportunity> Opportunities { get; set; }

    public CRMDbContext(
        DbContextOptions<CRMDbContext> options,
        ICurrentUserService currentUser,
        ITenantProvider tenantProvider)
        : base(options, currentUser, tenantProvider) { }

    protected override void ConfigureApp(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CRMDbContext).Assembly);
    }
}
```

### 5.3. Procurement DbContext — TPH Extension

```csharp
public class ProcurementDbContext : PlatformDbContext
{
    public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    public DbSet<VendorAccount> VendorAccounts { get; set; }

    public ProcurementDbContext(/* ... */) : base(/* ... */) { }

    protected override void ConfigureApp(ModelBuilder modelBuilder)
    {
        // Discriminator'ı extend et
        modelBuilder.Entity<Account>()
            .HasDiscriminator<string>("AccountCategory")
            .HasValue<Account>("Standard")
            .HasValue<VendorAccount>("Vendor");

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProcurementDbContext).Assembly);
    }
}
```

### 5.4. DI Extension Method

```csharp
// Platform.Infrastructure
public static class PlatformServiceExtensions
{
    public static IServiceCollection AddPlatformServices<TContext>(
        this IServiceCollection services,
        IConfiguration configuration,
        string connectionStringName = "DefaultConnection")
        where TContext : PlatformDbContext
    {
        services.AddDbContext<TContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString(connectionStringName)));

        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<ITenantProvider, TenantProvider>();

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(PlatformDbContext).Assembly);
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuditBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        });

        return services;
    }
}

// CRM.Api — Program.cs
builder.Services.AddPlatformServices<CRMDbContext>(builder.Configuration);
builder.Services.AddCRMServices();
```

---

## 6. Repository Pattern

### 6.1. Base Repository

```csharp
public abstract class PlatformRepository<TEntity> : IRepository<TEntity>
    where TEntity : class
{
    protected readonly PlatformDbContext _context;
    protected DbSet<TEntity> DbSet => _context.Set<TEntity>();

    protected PlatformRepository(PlatformDbContext context)
    {
        _context = context;
    }

    public virtual async Task<TEntity?> GetByIdAsync(Guid id) =>
        await DbSet.FindAsync(id);

    public virtual IQueryable<TEntity> Query() => DbSet.AsQueryable();

    public virtual async Task<TEntity> AddAsync(TEntity entity)
    {
        await DbSet.AddAsync(entity);
        return entity;
    }
}
```

### 6.2. Uygulama Repository'si

```csharp
public class LeadRepository : PlatformRepository<Lead>, ILeadRepository
{
    public LeadRepository(CRMDbContext context) : base(context) { }

    public async Task<List<Lead>> GetHighPriorityLeadsAsync() =>
        await Query().Where(l => l.Priority == Priority.High).ToListAsync();
}
```

---

## 7. Database Schema Yönetimi (Manuel SQL + DbUp)

### 7.1. Karar

- **EF Core migration KULLANILMAYACAK.**
- Tüm schema değişiklikleri manuel SQL script'leri ile yönetilecek.
- **DbUp** kütüphanesi ile embedded script'ler otomatik sırayla uygulanır.
- Ayrı bir `DatabaseMigrator` console uygulaması CI/CD'de çalışır (API startup'ında DEĞİL).

### 7.2. Klasör Yapısı

```
Platform.Infrastructure/Database/
├── Migrations/
│   ├── Platform_V001_20250101_InitialCoreSchema.sql
│   ├── Platform_V002_20250115_AddSoftDeleteColumns.sql
│   └── Platform_V003_20250120_AddAccountDiscriminator.sql
├── Rollbacks/
│   ├── Platform_V001_Rollback.sql
│   └── ...
├── Seeds/
│   └── Platform_DefaultLookups.sql
└── Functions/
    └── fn_GetPrimaryAddress.sql

CRM.Infrastructure/Database/
├── Migrations/
│   ├── CRM_V001_20250125_InitialCRMSchema.sql
│   ├── CRM_V002_20250201_AddLeadsTable.sql
│   └── ...
├── Rollbacks/
└── Seeds/
```

### 7.3. Naming Convention

```
{Scope}_{Version}_{Timestamp}_{Description}.sql

Platform_V001_20250101_InitialCoreSchema.sql
CRM_V001_20250125_InitialCRMSchema.sql
```

- **Scope:** `Platform` veya `{AppName}` (CRM, HRM, Procurement)
- **Version:** Sıralı versiyon numarası (V001, V002, ...)
- **Timestamp:** yyyyMMdd
- **Sıralama:** Alfabetik → Platform script'leri app script'lerinden önce çalışır.

### 7.4. Embedded Resource Konfigürasyonu

```xml
<!-- Platform.Infrastructure.csproj -->
<ItemGroup>
    <EmbeddedResource Include="Database\Migrations\*.sql" />
    <EmbeddedResource Include="Database\Seeds\*.sql" />
</ItemGroup>
```

### 7.5. DbUp Entegrasyonu (DatabaseMigrator Console App)

```csharp
public static class DatabaseMigrator
{
    public static int Run(string connectionString, string appName)
    {
        EnsureDatabase.For.SqlDatabase(connectionString);

        var assemblies = appName switch
        {
            "crm" => new[] {
                typeof(Platform.Infrastructure.Marker).Assembly,
                typeof(CRM.Infrastructure.Marker).Assembly
            },
            "hrm" => new[] {
                typeof(Platform.Infrastructure.Marker).Assembly,
                typeof(HRM.Infrastructure.Marker).Assembly
            },
            _ => throw new ArgumentException("Unknown app")
        };

        var upgrader = DeployChanges.To
            .SqlDatabase(connectionString)
            .WithScriptsEmbeddedInAssemblies(assemblies)
            .WithTransactionPerScript()
            .LogToConsole()
            .Build();

        var result = upgrader.PerformUpgrade();

        if (!result.Successful)
        {
            Console.WriteLine($"Migration failed: {result.Error}");
            return -1;
        }

        Console.WriteLine("Migration successful.");
        return 0;
    }
}
```

### 7.6. Script Yazım Kuralları

1. **Idempotent olsun:** Script birden fazla çalıştırılsa bile hata vermemeli.
   ```sql
   IF NOT EXISTS (SELECT 1 FROM sys.columns
                  WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND name = 'LeadScore')
   BEGIN
       ALTER TABLE [dbo].[Accounts] ADD [LeadScore] INT NULL;
   END
   GO
   ```
2. **Transaction içinde çalışsın:** DbUp `WithTransactionPerScript()` ile otomatik.
3. **Breaking change'leri böl (expand/contract):**
   - V010: Yeni kolon ekle (nullable)
   - App deploy: hem eski hem yeni kolonu yazsın
   - V011: Data migration
   - V012: Eski kolonu kaldır
4. **Her script bir amaç:** Bir script'te 15 şey yapma.
5. **Rollback script'i her zaman olsun:** Forward migration ile birlikte yaz.
6. **Büyük tablolarda online operation kullan.**
7. **Her script code review'dan geçmeli** (özellikle DROP, ALTER COLUMN, index değişiklikleri).

### 7.7. CI/CD Akışı

```
Build → SQL scripts embedded resource olarak paketlenir
  ↓
Test → Ephemeral DB'ye scripts uygulanır, integration test'ler koşar
  ↓
Pre-deploy → DatabaseMigrator console app hedef DB'ye scripts uygular
             (önce Platform, sonra App)
  ↓
Deploy → API container deploy edilir
  ↓
Post-deploy → Smoke tests, schema health check
```

### 7.8. Schema Health Check

```csharp
public class DatabaseSchemaHealthCheck : IHealthCheck
{
    private readonly DbContext _context;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context, CancellationToken ct = default)
    {
        try
        {
            // SchemaVersions tablosunun varlığı ve son version kontrolü
            return HealthCheckResult.Healthy();
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Schema mismatch detected", ex);
        }
    }
}
```

---

## 8. Frontend (React) Mimari

### 8.1. Paylaşılan UI Library

```
platform/platform-ui/ (npm package: @yourorg/platform-ui)
├── components/
│   ├── AccountForm/
│   ├── ContactForm/
│   ├── ActivityTimeline/
│   ├── AddressList/
│   └── PhoneNumberList/
├── hooks/
│   ├── useAccount.ts
│   ├── useAddressable.ts
│   └── useAuditable.ts
└── types/
    └── index.ts
```

### 8.2. Composition Pattern (Props-based Extension)

```typescript
// @yourorg/platform-ui
export interface AccountFormProps<T extends Account> {
  account: T;
  additionalFields?: React.ReactNode;
  onSubmit: (account: T) => void;
  validationSchema?: ZodSchema;
}

export function AccountForm<T extends Account>({
  account, additionalFields, onSubmit, validationSchema
}: AccountFormProps<T>) {
  return (
    <Form>
      <BaseFields />
      {additionalFields}
      <SubmitButton />
    </Form>
  );
}

// apps/crm/crm-web
export function CRMAccountForm({ account, onSubmit }) {
  return (
    <AccountForm
      account={account}
      onSubmit={onSubmit}
      additionalFields={
        <>
          <LeadScoreField />
          <SalesOwnerSelect />
        </>
      }
    />
  );
}
```

---

## 9. Refactoring İş Planı

> **Metodoloji:** Feature branch üzerinde incremental refactoring. Her aşama kendi içinde test edilebilir ve deploy edilebilir olmalı.

### **Faz 0 — Hazırlık (Pre-Refactoring)**

- [ ] **Task 0.1:** Mevcut kodun snapshot'ı alınır, `legacy` tag'i ile işaretlenir.
- [ ] **Task 0.2:** Monorepo strateji dokümanı ekip ile gözden geçirilir.
- [ ] **Task 0.3:** Internal NuGet feed seçimi ve setup (GitHub Packages veya Azure Artifacts).
- [ ] **Task 0.4:** CI/CD platform seçimi ve temel pipeline iskeleti (GitHub Actions / Azure DevOps).
- [ ] **Task 0.5:** Mevcut DB schema'sının ilk SQL export'u alınır (`Platform_V001_InitialCoreSchema.sql`'in temeli).
- [ ] **Task 0.6:** `CONTRIBUTING.md` hazırlanır — branch stratejisi, commit convention, PR süreci, yeni uygulama ekleme rehberi, entity tasarım kuralları, SQL script yazım kuralları, code review checklist.
- [ ] **Task 0.7:** `docs/architecture/` klasörü oluşturulur, refactoring plan ve ilk ADR'lar buraya konur.

---

### **Faz 1 — Repo Yapısını Kur**

- [ ] **Task 1.1:** Monorepo oluştur, `platform/` ve `apps/` klasör yapısını kur.
- [ ] **Task 1.2:** Mevcut base platform kodunu `platform/` altındaki yeni projelere taşı:
  - `Platform.Core` — base interfaces, utilities
  - `Platform.Entities` — Account, Contact, Activity, Address, PhoneNumber, Email
  - `Platform.Domain` — domain services, extension methods
  - `Platform.Infrastructure` — DbContext, Repository
  - `Platform.Api` — base controllers, middleware
- [ ] **Task 1.3:** Her platform projesi için `.csproj`'u NuGet paket olarak publish edilebilir hale getir.
- [ ] **Task 1.4:** React UI library'yi `platform/platform-ui/` altına taşı, Turborepo/Nx workspace kur.
- [ ] **Task 1.5:** İlk internal NuGet versiyonunu (`0.1.0`) internal feed'e publish et.
- [ ] **Task 1.6:** İlk npm versiyonunu internal registry'ye publish et.

---

### **Faz 2 — Behavior Interfaces & Base Entity'leri Refactor Et**

- [ ] **Task 2.1:** `Platform.Core.Abstractions` namespace'inde interface'leri tanımla:
  - `IAuditable`
  - `IAddressable`
  - `IContactable`
  - `ISoftDeletable`
  - `IMultiTenant` (opsiyonel, ileride kullanılacaksa)
- [ ] **Task 2.2:** Account, Contact, Activity entity'lerini bu interface'leri implement edecek şekilde güncelle.
- [ ] **Task 2.3:** Address, PhoneNumber, EmailAddress value object'lerini polymorphic association (OwnerId/OwnerType) ile tanımla.
- [ ] **Task 2.4:** `AddressableExtensions`, `ContactableExtensions` gibi extension method'ları `Platform.Domain`'e ekle.
- [ ] **Task 2.5:** Unit test yaz: her behavior'ın davranışı.

---

### **Faz 3 — PlatformDbContext & Configuration Refactor**

- [ ] **Task 3.1:** Mevcut DbContext'i `abstract PlatformDbContext`'e dönüştür.
  - Constructor'a `ICurrentUserService` ve `ITenantProvider` inject et.
  - `OnModelCreating` içinde `ApplyPlatformConfigurations`, `ApplyGlobalQueryFilters`, `ConfigureApp` hook'larını ekle.
- [ ] **Task 3.2:** Entity configuration'ları ayrı dosyalara böl (`IEntityTypeConfiguration<T>`).
  - Her entity için ayrı dosya: `AccountConfiguration.cs`, `ContactConfiguration.cs` vs.
- [ ] **Task 3.3:** Account için **discriminator column'ı baştan tanımla** (TPH hazırlığı):
  ```csharp
  builder.HasDiscriminator<string>("AccountCategory").HasValue<Account>("Standard");
  ```
- [ ] **Task 3.4:** Global query filter'ları implement et (soft delete).
- [ ] **Task 3.5:** `SaveChangesAsync` override — audit fields otomatik doldurma.
- [ ] **Task 3.6:** `ICurrentUserService` ve `ITenantProvider` implementation'larını yaz.
- [ ] **Task 3.7:** `DesignTimeDbContextFactory` ekle (gerekirse tooling için).

---

### **Faz 4 — Repository Pattern**

- [ ] **Task 4.1:** `IRepository<T>` interface'i ve `PlatformRepository<T>` base class'ı yaz.
- [ ] **Task 4.2:** Account, Contact, Activity için concrete repository'ler.
- [ ] **Task 4.3:** DI extension method: `AddPlatformServices<TContext>`.
- [ ] **Task 4.4:** Unit test: repository davranışları.

---

### **Faz 5 — MediatR Pipeline Behaviors**

- [ ] **Task 5.1:** `Platform.Domain`'e MediatR entegrasyonu.
- [ ] **Task 5.2:** `ValidationBehavior<TRequest, TResponse>` yaz (FluentValidation ile).
- [ ] **Task 5.3:** `AuditBehavior<TRequest, TResponse>` yaz.
- [ ] **Task 5.4:** `LoggingBehavior<TRequest, TResponse>` yaz.
- [ ] **Task 5.5:** (Opsiyonel) `DomainEventBehavior` — SaveChanges sonrası event publish.
- [ ] **Task 5.6:** DI registration'ları `AddPlatformServices` içine ekle.

---

### **Faz 6 — Manuel SQL Migration Altyapısı**

- [ ] **Task 6.1:** Mevcut DB schema'sını dump et, `Platform_V001_20{YY}{MM}{DD}_InitialCoreSchema.sql` olarak kaydet.
- [ ] **Task 6.2:** Platform.Infrastructure'a `Database/Migrations/`, `Database/Rollbacks/`, `Database/Seeds/` klasörlerini ekle.
- [ ] **Task 6.3:** `.csproj`'a embedded resource konfigürasyonu ekle.
- [ ] **Task 6.4:** DbUp NuGet paketini `tools/DatabaseMigrator` projesine ekle.
- [ ] **Task 6.5:** `DatabaseMigrator` console app'ini yaz (app parametresi ile hangi uygulama için çalışacağını al).
- [ ] **Task 6.6:** `SchemaVersions` tablosunu ve script history tracking'i test et.
- [ ] **Task 6.7:** Script yazım kurallarını `README.md` olarak `tools/DatabaseMigrator/` içine koy.
- [ ] **Task 6.8:** İlk rollback script'lerini yaz.
- [ ] **Task 6.9:** CI pipeline'a migration step'i ekle.
- [ ] **Task 6.10:** Schema health check endpoint'i implement et.

---

### **Faz 7 — İlk Uygulamanın (CRM) Platform Üzerine Taşınması**

- [ ] **Task 7.1:** `apps/crm/` altında CRM.Domain, CRM.Infrastructure, CRM.Api, crm-web projelerini kur.
- [ ] **Task 7.2:** `CRMDbContext : PlatformDbContext` ile extend et.
- [ ] **Task 7.3:** CRM'in ilk SQL migration'ını yaz: `CRM_V001_20{YY}{MM}{DD}_InitialCRMSchema.sql`.
- [ ] **Task 7.4:** CRM.Api'de `AddPlatformServices<CRMDbContext>()` çağrısı ile platform altyapısını aktive et.
- [ ] **Task 7.5:** crm-web'de `@yourorg/platform-ui` paketini tüket.
- [ ] **Task 7.6:** CRM'in Account sayfasında `AccountForm` component'ini ek field'larla (LeadScore, SalesOwner vs.) extend et.
- [ ] **Task 7.7:** End-to-end test: Account CRUD işlemleri CRM tarafında çalışıyor mu?
- [ ] **Task 7.8:** Integration test'ler.

---

### **Faz 8 — Second App: HRM**

- [ ] **Task 8.1:** `apps/hrm/` iskeleti.
- [ ] **Task 8.2:** `HRMDbContext : PlatformDbContext`.
- [ ] **Task 8.3:** HRM SQL migrations.
- [ ] **Task 8.4:** HRM'in Account kullanımı (aynı yapı, özel field yok).
- [ ] **Task 8.5:** HRM'e özel entity: Employee (IAddressable, IContactable, IAuditable implement eder → platform extension method'ları otomatik çalışır).
- [ ] **Task 8.6:** crm-web pattern'inin hrm-web'e replike edilmesi.

---

### **Faz 9 — Third App: Procurement (TPH Extension Senaryosu)**

- [ ] **Task 9.1:** `apps/procurement/` iskeleti.
- [ ] **Task 9.2:** `VendorAccount : Account` entity'sini Procurement.Domain'de tanımla.
- [ ] **Task 9.3:** `ProcurementDbContext : PlatformDbContext` — `ConfigureApp`'te discriminator'ı extend et.
- [ ] **Task 9.4:** SQL migration: `Procurement_V001_20{YY}{MM}{DD}_InitialProcurementSchema.sql` — VendorAccount'a özel kolonları içerir.
- [ ] **Task 9.5:** EF Core TPH query'lerinin doğru çalıştığını doğrula (polymorphic).
- [ ] **Task 9.6:** VendorAccount'a özel iş kuralları ve UI component'leri.

---

### **Faz 10 — Ortak Kullanım Senaryolarının Doğrulanması**

- [ ] **Task 10.1:** Platform'a yeni bir field ekle (örn. `Account.Industry`). Bunun etkisini ölç:
  - Platform NuGet versiyonunu bump et (minor).
  - Her uygulamada paket güncelle.
  - Her uygulamada migration script yaz (`{App}_V{N}_AddIndustryColumn.sql`).
- [ ] **Task 10.2:** Breaking change senaryosu test et:
  - Platform'da bir field'ın tipini değiştir.
  - Expand/contract pattern ile migrate et.
  - Major version bump.
- [ ] **Task 10.3:** Behavior interface senaryosu: `IAddressable` implement eden yeni bir entity (örn. Employee) ekle ve extension method'ların otomatik çalıştığını doğrula.

---

### **Faz 11 — Dokümantasyon & Developer Experience**

- [ ] **Task 11.1:** `CONTRIBUTING.md`'nin refactoring süreci boyunca yaşanan deneyimlere göre güncellenmesi (ilk hali Faz 0.6'da hazırlandı, süreç içinde öğrenilenlerle zenginleştirilir).
- [ ] **Task 11.2:** Platform paketinin public API dokümantasyonu.
- [ ] **Task 11.3:** SQL script yazım rehberi (`tools/DatabaseMigrator/README.md`).
- [ ] **Task 11.4:** Troubleshooting rehberi — sık karşılaşılan sorunlar.
- [ ] **Task 11.5:** Architecture Decision Records (ADR) klasörü ve mevcut kararların yazıya dökülmesi.

---

### **Faz 12 — (İleri Faz, Opsiyonel) Cross-App Event Integration**

> **Bu faz mevcut refactoring kapsamı DIŞINDADIR.** İleride Account değişikliğinin CRM → HRM → Procurement arası yayılması gerektiğinde ele alınacak.

- [ ] Event bus seçimi (MassTransit + RabbitMQ veya Azure Service Bus).
- [ ] Domain event contract'larının Platform.Core'da tanımlanması.
- [ ] Her uygulamada event handler'lar.
- [ ] Eventual consistency test senaryoları.

---

## 10. Riskler & Önlemler

| Risk | Önlem |
|------|-------|
| Platform breaking change'leri uygulamaları bozuyor | SemVer disiplini, deprecation süreci, migration guide yaz |
| SQL script çakışmaları | Naming convention, code review, version lock |
| Monorepo CI/CD yavaşlığı | Incremental build (Nx/Turborepo cache) |
| Derin inheritance zincirleri | Max 2 seviye kuralı, composition over inheritance |
| DB schema drift | Schema health check, integration test'ler |
| Büyük tablolar üzerinde ALTER yavaş | Online operation'lar, off-hours deployment |
| Production migration hatası | Otomatik backup pipeline step, rollback script'leri |
| Platform'a gereksiz alan eklenmesi | "3 uygulamanın da ihtiyacı var mı?" sorusu her eklemede sorulacak |

---

## 11. Dikkat Edilecek Prensipler

1. **YAGNI (You Aren't Gonna Need It):** Platform'a alan eklemeden önce 3 uygulamanın da ihtiyacı var mı sor.
2. **LSP (Liskov Substitution):** Derived Account base Account'un yerine geçebilmeli.
3. **Composition over Inheritance:** Interface + extension method > deep inheritance.
4. **Max 2 Seviye Inheritance:** `Account → VendorAccount → SupplierAccount` yeterli. Daha derine gitme.
5. **Semantic Versioning:** Breaking change = major bump, istisnasız.
6. **Every Schema Change = SQL Script:** EF Core migration asla üretilmez.
7. **Idempotent Scripts:** Her script birden fazla çalışabilmeli.
8. **Separation of Concerns:** Platform core işleri yapar, uygulamalar domain'lerine odaklanır.
9. **Minimal Shared Kernel:** Ne kadar küçük, o kadar iyi.
10. **Contract Tests:** Her derived entity'nin base davranışları sağladığını doğrulayan test'ler.

---

## 12. Bu Doküman Nasıl Kullanılır

- Refactoring süreci boyunca bu doküman **tek referans kaynağıdır**.
- Yeni bir mimari karar alındığında önce bu dokümana eklenmeli, sonra koda dökülmelidir.
- Task'lar tamamlandıkça checkbox'lar işaretlenir.
- Doküman repo'nun root'unda `docs/architecture/Platform-Refactoring-Plan.md` olarak tutulur, Git üzerinden versiyonlanır.
- Claude ile her yeni oturumda bu doküman paylaşıldığında, kararlar hatırlanmış ve tutarlı şekilde uygulanmış olur.

---

**Doküman Versiyonu:** 1.0
**Son Güncelleme:** Faz 0 — başlangıç
