# Yeni Entity Ekleme Rehberi

Bu rehber, PlatformSuite repo'sunda **bir uygulamaya** (Crm, CodePro, ...) yeni bir entity eklemek için izlenmesi gereken adımları kapsamaktadır.
Tüm örneklerde `Crm` baz alınmıştır; CodePro veya başka bir app için aynı adımlar `Apps/CodePro/CodePro.<Layer>/` yolları ile uygulanır. `{Entity}` ifadesini kendi entity adınızla (örn. `Invoice`) değiştirin.

---

## Hangi App'e Ekleniyor? (Karar Ağacı)

Entity yazmaya başlamadan önce konumunu belirle:

| Entity tipi | Konum | Örnek |
|---|---|---|
| Cross-cutting (User, Organization, Activity, Attachment) | `Platform.Domain` | User, AuditLog |
| CRM bounded context (satış/müşteri) | `Apps/Crm/Crm.Domain` | Account, Contact, Lead, Opportunity |
| CodePro bounded context (satın alma/tedarik) | `Apps/CodePro/CodePro.Domain` | Supplier, Product, Budget, PurchaseOrder |

**Kural:** Bounded context çakışıyorsa (örn. "Account" CRM'de müşteri, CodePro'da Supplier) **iki ayrı entity** açılır, ortak base sınıf değil. Her app kendi semantiğini yönetir.

> Detaylar: `docs/CONTRIBUTING.md` § 7-8 (Platform'a Değişiklik / Entity Tasarım Kuralları).

---

## Genel Bakış

Bir entity eklemek için şu katmanlara dokunulur (her app kendi içinde aynı yapıyı tekrarlar):

```
1. <App>.Database          → SQL tablo scripti (PostgreSQL)
2. <App>.Domain            → Entity sınıfı, enum'lar, privilege kodları
3. <App>.Application       → Feature klasörü (Commands/Queries/Dtos), Errors, Validator, Mapster config, repository interface
4. <App>.Infrastructure    → Repository implementasyonu, EF Core configuration, DbContext'e DbSet ekleme, I<App>DbContext'e property ekle
5. <App>.Api               → Slim controller (ISender üzerinden), DI kaydı yalnızca repository için
6. <App>.Web (Frontend)    → entities/<x>/ (types, schema, api, model), pages/<x>/ (list, detail), router paths
```

`<App>` yerine `Crm`, `CodePro` veya yeni eklenen uygulamanın adı gelir. Aşağıdaki adımlarda `Crm` baz alındı; `CRM.X` görüldüğünde **`Crm`** klasörüne (veya hedef app'inize) eşleyin. Polimorfik referans gerekiyorsa `IEntityReferenceResolver` kaydı 5. adımda eklenir.

> Mimari referansı: `docs/Api_Architecture.md` (backend), `docs/Client_Architecture.md` (frontend). Handler'lar Result<T> döner, iş kuralı ihlali için exception atılmaz; cross-cutting concern'ler (logging, validation, transaction) MediatR pipeline'ında çalışır.

---

## ADIM 1 — Database: SQL Tablo Scripti

**Dosya:** `Apps/<App>/<App>.Database/{Entity}.sql` (örn. `Apps/Crm/Crm.Database/Lead.sql`)

```sql
CREATE TABLE {entity} (
    id                UUID        NOT NULL DEFAULT gen_random_uuid(),

    -- İş alanları buraya gelir
    name              VARCHAR(200) NOT NULL,
    description       VARCHAR(1000),

    -- Enum alanları (örnek)
    status            VARCHAR(50)  NOT NULL DEFAULT 'active',

    -- Temel entity
    is_active         BOOLEAN     NOT NULL DEFAULT true,

    -- Multi-tenant
    owner_id          UUID        NOT NULL,
    organization_id   UUID        NOT NULL,

    -- Audit
    created_by        UUID        NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by        UUID,
    updated_at        TIMESTAMPTZ,

    -- Soft delete
    is_deleted        BOOLEAN     NOT NULL DEFAULT false,
    deleted_by        UUID,
    deleted_at        TIMESTAMPTZ,

    CONSTRAINT pk_{entity} PRIMARY KEY (id)
);
```

> Script'i `Apps/<App>/<App>.Database/` içindeki sıralı dosya adı şemasına göre yerleştirin (parent tablolar önce, FK'lar sonra). DbUp script'leri alfabetik sırayla çalıştırır.

---

## ADIM 2 — `<App>.Domain`

### 2.1 Enum'lar (varsa)

**Dosya:** `Apps/<App>/<App>.Domain/Enums/{Entity}Status.cs`

```csharp
namespace <App>.Domain.Enums
{
    public enum {Entity}Status
    {
        Active,
        Inactive,
        Archived
    }
}
```

### 2.2 Entity Sınıfı

**Dosya:** `Apps/<App>/<App>.Domain/Entities/{Entity}s/{Entity}.cs`

```csharp
using Platform.Domain.Common;        // IBaseEntity, IOwnedEntity, IAuditableEntity, ISoftDeleteEntity
using <App>.Domain.Enums;

namespace <App>.Domain.Entities.{Entity}s
{
    public class {Entity} : IBaseEntity, ISoftDeleteEntity, IAuditableEntity, IOwnedEntity
    {
        public Guid Id { get; set; }

        // İş alanları
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public {Entity}Status Status { get; set; }

        // IBaseEntity
        public bool IsActive { get; private set; } = true;

        // IAuditableEntity
        public Guid CreatedBy { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public Guid? UpdatedBy { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        // ISoftDeleteEntity
        public bool IsDeleted { get; private set; }
        public Guid? DeletedBy { get; private set; }
        public DateTime? DeletedAt { get; private set; }

        // IOwnedEntity
        public Guid OwnerId { get; private set; }
        public Guid OrganizationId { get; private set; }
    }
}
```

> Tüm cross-cutting concern'ler `Platform.Domain` interface'leri aracılığıyla yönetilir. EF Core global query filter'ları `ISoftDeleteEntity` ve `IOwnedEntity` için otomatik uygulanır — ek kod yazmaya gerek yoktur. Inheritance YASAK; entity Platform interface'lerini implemente eder, Platform sınıflarından türemez.

### 2.3 Privilege Kodları

**Dosya:** `Apps/<App>/<App>.Domain/Authorization/<App>PrivilegeCodes.cs` — mevcut dosyaya ekleyin:

```csharp
public static class {Entity}PrivilegeCodes
{
    public const string Read   = "{Entity}.Read";
    public const string Create = "{Entity}.Create";
    public const string Update = "{Entity}.Update";
    public const string Delete = "{Entity}.Delete";
    public const string Assign = "{Entity}.Assign";
    public const string State  = "{Entity}.State";
}
```

> Platform-shared privilege'lar (`User.*`, `Activity.*`) `Platform.Domain/Authorization/PrivilegeCodes.cs` içindedir. App-spesifik privilege'lar her zaman `<App>PrivilegeCodes` içinde yaşar — Platform'a sızdırma.

---

## ADIM 3 — `<App>.Application`

Feature klasörü, DTO'lar, Errors sınıfı, repository interface, command/query handler'ları ve Mapster mapping kuralı.

### 3.1 Feature Klasör Yapısı

```
Apps/<App>/<App>.Application/Features/{Entity}s/
├── Commands/
│   ├── Create{Entity}/
│   │   ├── Create{Entity}Command.cs
│   │   ├── Create{Entity}Handler.cs
│   │   └── Create{Entity}Validator.cs
│   ├── Update{Entity}/
│   ├── Delete{Entity}/
│   ├── SetState{Entity}/
│   ├── Assign{Entity}/
│   └── BulkUpdateStatus{Entity}/
├── Queries/
│   ├── Get{Entity}/
│   ├── List{Entity}s/
│   └── Search{Entity}s/
├── Dtos/
│   ├── {Entity}DetailItem.cs
│   ├── {Entity}ListItem.cs
│   └── {Entity}ListFilters.cs
└── {Entity}Errors.cs
```

### 3.2 DTO'lar

**Klasör:** `Apps/<App>/<App>.Application/Features/{Entity}s/Dtos/`

**`{Entity}ListItem.cs`** — Liste görünümü için hafif DTO:

```csharp
namespace <App>.Application.Features.{Entity}s.Dtos;

public class {Entity}ListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public {Entity}Status Status { get; set; }
    public bool IsActive { get; set; }
}
```

**`{Entity}DetailItem.cs`** — View cevabı için tam DTO:

```csharp
namespace <App>.Application.Features.{Entity}s.Dtos;

public class {Entity}DetailItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public {Entity}Status Status { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

**`{Entity}ListFilters.cs`** — Sorgu filtreleri:

```csharp
namespace <App>.Application.Features.{Entity}s.Dtos;

public class {Entity}ListFilters
{
    public string? Name { get; set; }
    public {Entity}Status? Status { get; set; }
    public bool? IsActive { get; set; }
}
```

> `{Entity}ListResponse` / `{Entity}ListRequest` artık yazılmaz. List sonucu `PaginationResult<{Entity}ListItem>`, request ise `List{Entity}sQuery` record'u içinde taşınır.

### 3.3 Errors

**Dosya:** `Apps/<App>/<App>.Application/Features/{Entity}s/{Entity}Errors.cs`

```csharp
using <App>.Application.Common.Results;

namespace <App>.Application.Features.{Entity}s;

public static class {Entity}Errors
{
    public static readonly Error NotFound =
        new("{Entity}.NotFound", "{Entity} bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateName =
        new("{Entity}.DuplicateName", "Aynı isimde bir {entity} zaten var.", ErrorType.Conflict);

    // Entity'ye özgü iş kuralları:
    // public static readonly Error ClosedNotEditable =
    //     new("{Entity}.ClosedNotEditable", "Kapalı {entity} düzenlenemez.", ErrorType.Conflict);
}
```

### 3.4 Repository Interface (sadece write path)

**Dosya:** `Apps/<App>/<App>.Application/Interfaces/I{Entity}Repository.cs`

```csharp
using <App>.Domain.Entities.{Entity}s;

namespace <App>.Application.Interfaces;

public interface I{Entity}Repository : IEntityRepository<{Entity}>
{
    Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default);
}
```

> **Not:** Liste sorgusu için repository metodu **açma**. Query handler `I<App>DbContext` + `.ProjectToType<T>()` ile doğrudan EF üzerinden projeksiyon yapar. Repository yalnızca write path'i (Create/Update/Delete) ve çok özel write-side sorguları (duplicate check gibi) içerir.

### 3.5 Mapster Mapping Config

**Dosya:** `Apps/<App>/<App>.Application/Mapping/MappingConfig.cs` — mevcut `Register` metoduna kural ekle:

```csharp
config.NewConfig<{Entity}, {Entity}DetailItem>();
config.NewConfig<{Entity}, {Entity}ListItem>();

config.NewConfig<Create{Entity}Command, {Entity}>()
    .Ignore(d => d.Id,
            d => d.CreatedBy, d => d.CreatedAt,
            d => d.UpdatedBy, d => d.UpdatedAt,
            d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt,
            d => d.OwnerId, d => d.OrganizationId);

config.NewConfig<Update{Entity}Command, {Entity}>()
    .IgnoreNullValues(true)
    .Ignore(d => d.Id,
            d => d.CreatedBy, d => d.CreatedAt,
            d => d.UpdatedBy, d => d.UpdatedAt,
            d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt,
            d => d.OwnerId, d => d.OrganizationId);
```

> Audit / soft-delete / ownership alanları her zaman ignore edilir — bunlar `DbContext.ApplySaveRules` tarafından yönetilir.

### 3.6 Commands — Şablonlar

#### Create{Entity}

**Command:**

```csharp
// Features/{Entity}s/Commands/Create{Entity}/Create{Entity}Command.cs
using <App>.Application.Common.Abstractions;
using <App>.Application.Common.Results;
using <App>.Application.Features.{Entity}s.Dtos;

namespace <App>.Application.Features.{Entity}s.Commands.Create{Entity};

public sealed record Create{Entity}Command(
    string Name,
    string? Description,
    {Entity}Status Status
) : ICommand<{Entity}DetailItem>;
```

**Validator (input — state-less):**

```csharp
using FluentValidation;

namespace <App>.Application.Features.{Entity}s.Commands.Create{Entity};

public sealed class Create{Entity}Validator : AbstractValidator<Create{Entity}Command>
{
    public Create{Entity}Validator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.Status).IsInEnum();
    }
}
```

**Handler:**

```csharp
using <App>.Application.Common.Results;
using <App>.Application.Features.{Entity}s.Dtos;
using <App>.Application.Interfaces;
using <App>.Domain.Entities.{Entity}s;
using Mapster;
using MediatR;

namespace <App>.Application.Features.{Entity}s.Commands.Create{Entity};

public sealed class Create{Entity}Handler
    : IRequestHandler<Create{Entity}Command, Result<{Entity}DetailItem>>
{
    private readonly I{Entity}Repository _repo;

    public Create{Entity}Handler(I{Entity}Repository repo) => _repo = repo;

    public async Task<Result<{Entity}DetailItem>> Handle(
        Create{Entity}Command cmd, CancellationToken ct)
    {
        // Business rule — DB'ye bakar, validator'a giremez
        if (await _repo.ExistsByNameAsync(cmd.Name, ct))
            return {Entity}Errors.DuplicateName;

        var entity = cmd.Adapt<{Entity}>();
        await _repo.CreateAsync(entity, ct);

        // SaveChanges / transaction TransactionBehavior tarafından yapılır.
        return entity.Adapt<{Entity}DetailItem>();
    }
}
```

#### Update{Entity}

```csharp
public sealed record Update{Entity}Command(
    Guid Id,
    string Name,
    string? Description,
    {Entity}Status Status
) : ICommand<{Entity}DetailItem>;

public sealed class Update{Entity}Validator : AbstractValidator<Update{Entity}Command>
{
    public Update{Entity}Validator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Status).IsInEnum();
    }
}

public sealed class Update{Entity}Handler
    : IRequestHandler<Update{Entity}Command, Result<{Entity}DetailItem>>
{
    private readonly I{Entity}Repository _repo;
    public Update{Entity}Handler(I{Entity}Repository repo) => _repo = repo;

    public async Task<Result<{Entity}DetailItem>> Handle(Update{Entity}Command cmd, CancellationToken ct)
    {
        var entity = await _repo.GetAsync(cmd.Id, ct);
        if (entity is null) return {Entity}Errors.NotFound;

        cmd.Adapt(entity);                        // in-place update
        await _repo.UpdateAsync(entity, ct);

        return entity.Adapt<{Entity}DetailItem>();
    }
}
```

#### Delete{Entity}

```csharp
public sealed record Delete{Entity}Command(IReadOnlyList<Guid> Ids) : ICommand;

public sealed class Delete{Entity}Handler : IRequestHandler<Delete{Entity}Command, Result>
{
    private readonly I{Entity}Repository _repo;
    public Delete{Entity}Handler(I{Entity}Repository repo) => _repo = repo;

    public async Task<Result> Handle(Delete{Entity}Command cmd, CancellationToken ct)
    {
        foreach (var id in cmd.Ids)
        {
            var entity = await _repo.GetAsync(id, ct);
            if (entity is null) return {Entity}Errors.NotFound;
            await _repo.DeleteAsync(entity, ct);  // ISoftDeleteEntity → mantıksal silme
        }
        return Result.Success();
    }
}
```

> `SetState`, `Assign`, `BulkUpdateStatus` command'ları aynı şablonla eklenir — hepsi `ICommand` marker'ı taşır, handler içinde `_repo.SetStateAsync(...)` / `_repo.AssignAsync(...)` çağrılır, `Result.Success()` döner.

### 3.7 Queries — Şablonlar

#### Get{Entity}

```csharp
// Features/{Entity}s/Queries/Get{Entity}/Get{Entity}Query.cs
public sealed record Get{Entity}Query(Guid Id) : IQuery<{Entity}DetailItem>;

// Features/{Entity}s/Queries/Get{Entity}/Get{Entity}Handler.cs
public sealed class Get{Entity}Handler
    : IRequestHandler<Get{Entity}Query, Result<{Entity}DetailItem>>
{
    private readonly I<App>DbContext _ctx;
    public Get{Entity}Handler(I<App>DbContext ctx) => _ctx = ctx;

    public async Task<Result<{Entity}DetailItem>> Handle(Get{Entity}Query q, CancellationToken ct)
    {
        var dto = await _ctx.{Entity}s.AsNoTracking()
            .Where(e => e.Id == q.Id)
            .ProjectToType<{Entity}DetailItem>()
            .FirstOrDefaultAsync(ct);

        return dto is null ? {Entity}Errors.NotFound : dto;
    }
}
```

#### List{Entity}s

```csharp
public sealed record List{Entity}sQuery(
    {Entity}ListFilters Filters,
    PaginationInfo Pagination
) : IQuery<PaginationResult<{Entity}ListItem>>;

public sealed class List{Entity}sHandler
    : IRequestHandler<List{Entity}sQuery, Result<PaginationResult<{Entity}ListItem>>>
{
    private readonly I<App>DbContext _ctx;
    public List{Entity}sHandler(I<App>DbContext ctx) => _ctx = ctx;

    public async Task<Result<PaginationResult<{Entity}ListItem>>> Handle(
        List{Entity}sQuery q, CancellationToken ct)
    {
        var query = _ctx.{Entity}s.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(q.Filters.Name))
            query = query.Where(e => EF.Functions.ILike(e.Name, $"%{q.Filters.Name}%"));
        if (q.Filters.Status is { } status)
            query = query.Where(e => e.Status == status);
        if (q.Filters.IsActive is { } isActive)
            query = query.Where(e => e.IsActive == isActive);

        var skip = Math.Max(q.Pagination.Page - 1, 0) * q.Pagination.PageSize;
        var items = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip(skip).Take(q.Pagination.PageSize + 1)
            .ProjectToType<{Entity}ListItem>()
            .ToListAsync(ct);

        var hasMore = items.Count > q.Pagination.PageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PaginationResult<{Entity}ListItem>
        {
            Data = items, HasMore = hasMore,
            Page = q.Pagination.Page, PageSize = q.Pagination.PageSize,
        };
    }
}
```

> **Validation örneği — business rule (DB'ye bakan):** "Aynı isimde firma var mı?" input validation değildir. FluentValidation validator'ında **yazma**. Handler içinde `await _repo.ExistsByNameAsync(...)` → `return {Entity}Errors.DuplicateName;` şeklinde Result.Failure dön.
>
> **"Toplam < 0" örneği:** Handler entity'yi hesaplar, `if (opp.TotalAmount < 0) return {Entity}Errors.InvalidTotalAmount;`. Karmaşık hesap entity metoduna taşınabilir (`entity.Recalculate() → Result`), handler o Result'ı yukarı döner.

---

## ADIM 4 — <App>.Infrastructure

### 4.1 EF Core Configuration

**Dosya:** `Apps/<App>/<App>.Infrastructure/Data/Configurations/{Entity}s/{Entity}Configuration.cs`

```csharp
using <App>.Domain.Entities.{Entity}s;
using <App>.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace <App>.Infrastructure.Data.Configurations.{Entity}s;

public class {Entity}Configuration : IEntityTypeConfiguration<{Entity}>
{
    public void Configure(EntityTypeBuilder<{Entity}> builder)
    {
        builder.ToTable("{entity}"); // snake_case tablo adı

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        // İş alanları
        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(1000);

        // Enum → string dönüşümü
        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(50)
            .IsRequired()
            .HasConversion<EnumToStringConverter<{Entity}Status>>();

        // IBaseEntity
        builder.Property(e => e.IsActive).HasColumnName("is_active").IsRequired();

        // IOwnedEntity
        builder.Property(e => e.OwnerId).HasColumnName("owner_id").IsRequired();
        builder.Property(e => e.OrganizationId).HasColumnName("organization_id").IsRequired();

        // IAuditableEntity
        builder.Property(e => e.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(e => e.UpdatedBy).HasColumnName("updated_by");
        builder.Property(e => e.UpdatedAt).HasColumnName("updated_at");

        // ISoftDeleteEntity
        builder.Property(e => e.IsDeleted).HasColumnName("is_deleted").IsRequired();
        builder.Property(e => e.DeletedBy).HasColumnName("deleted_by");
        builder.Property(e => e.DeletedAt).HasColumnName("deleted_at");
    }
}
```

> `modelBuilder.ApplyConfigurationsFromAssembly(...)` zaten assembly'deki tüm konfigürasyonları otomatik yakalar. Configuration class'ını oluşturduktan sonra ek kayıt gerekmez.

### 4.2 Repository Implementasyonu

**Dosya:** `Apps/<App>/<App>.Infrastructure/Repositories/{Entity}Repository.cs`

```csharp
using <App>.Application.Interfaces;
using <App>.Application.Modals.Common;
using <App>.Application.Modals.{Entity}Modal;
using <App>.Domain.Entities.{Entity}s;
using <App>.Infrastructure.Data;
using <App>.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace <App>.Infrastructure.Repositories
{
    public class {Entity}Repository : BaseEntityRepository<{Entity}>, I{Entity}Repository
    {
        public {Entity}Repository(<App>DbContext dbContext) : base(dbContext) { }

        public override async Task<{Entity}?> GetAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await dbContext.{Entity}
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        }

        public async Task<PaginationResult<{Entity}ListItem>> List(
            {Entity}ListFilter filter,
            PaginationInfo paginationInfo,
            CancellationToken cancellationToken = default)
        {
            var query = dbContext.{Entity}.AsNoTracking();

            if (!string.IsNullOrEmpty(filter.Name))
                query = query.Where(e => EF.Functions.ILike(e.Name, $"%{filter.Name}%"));

            if (filter.Status.HasValue)
                query = query.Where(e => e.Status == filter.Status.Value);

            if (filter.IsActive != null)
                query = query.Where(e => e.IsActive == filter.IsActive);

            var pageIndex = Math.Max(paginationInfo.Page - 1, 0);
            var skip = pageIndex * paginationInfo.PageSize;

            var items = await query
                .Skip(skip)
                .Take(paginationInfo.PageSize + 1)
                .Select(e => new {Entity}ListItem
                {
                    id       = e.Id,
                    Name     = e.Name,
                    Status   = e.Status,
                    IsActive = e.IsActive,
                })
                .ToListAsync(cancellationToken);

            var hasMore = items.Count > paginationInfo.PageSize;
            if (hasMore) items.RemoveAt(items.Count - 1);

            return new PaginationResult<{Entity}ListItem>
            {
                Data     = items,
                HasMore  = hasMore,
                Page     = paginationInfo.Page,
                PageSize = paginationInfo.PageSize,
            };
        }
    }
}
```

### 4.3 DbContext'e DbSet Ekle

**Dosya:** `Apps/<App>/<App>.Infrastructure/Data/<App>DbContext.cs`

```csharp
// Mevcut DbSet'lerin yanına ekleyin (çoğul isim):
public DbSet<{Entity}> {Entity}s { get; set; }
```

### 4.4 I<App>DbContext'e Property Ekle

**Dosya:** `Apps/<App>/<App>.Application/Interfaces/I<App>DbContext.cs`

```csharp
// Query handler'ların {Entity}s üzerinden projection yapabilmesi için:
DbSet<{Entity}> {Entity}s { get; }
```

> Bu adım **kritik**: Query handler `I<App>DbContext` üzerinden okur, `<App>DbContext`'i doğrudan import etmez. Yeni entity için property eklenmezse query handler derlenmez.

---

## ADIM 5 — <App>.Api

Controller tek satırdır. `ISender` inject edilir, gelen request doğrudan MediatR'a gönderilir. Command / Query / Validator hepsi `<App>.Application` tarafında yaşar; controller hiçbir iş mantığı taşımaz.

### 5.1 Controller

**Dosya:** `Apps/<App>/<App>.Api/Controllers/{Entity}Controller.cs`

```csharp
using <App>.Api.Authorization;
using <App>.Api.Extensions;                                // ToActionResult
using <App>.Application.Features.{Entity}s.Commands.Create{Entity};
using <App>.Application.Features.{Entity}s.Commands.Update{Entity};
using <App>.Application.Features.{Entity}s.Commands.Delete{Entity};
using <App>.Application.Features.{Entity}s.Commands.SetState{Entity};
using <App>.Application.Features.{Entity}s.Commands.Assign{Entity};
using <App>.Application.Features.{Entity}s.Queries.Get{Entity};
using <App>.Application.Features.{Entity}s.Queries.List{Entity}s;
using <App>.Application.Features.{Entity}s.Queries.Search{Entity}s;
using <App>.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace <App>.Api.Controllers;

[ApiController]
[Route("api/{entity}")]
public sealed class {Entity}Controller : ControllerBase
{
    private readonly ISender _sender;
    public {Entity}Controller(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(<App>PrivilegeCodes.{Entity}PrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync(
        [FromBody] List{Entity}sQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult();

    [HttpPost("search")]
    [PrivilegeAuthorize(<App>PrivilegeCodes.{Entity}PrivilegeCodes.Read)]
    public async Task<IActionResult> SearchAsync(
        [FromBody] Search{Entity}sQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult();

    [HttpPost("get")]
    [PrivilegeAuthorize(<App>PrivilegeCodes.{Entity}PrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync(
        [FromBody] Get{Entity}Query query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult();

    [HttpPost("create")]
    [PrivilegeAuthorize(<App>PrivilegeCodes.{Entity}PrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync(
        [FromBody] Create{Entity}Command cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult();

    [HttpPost("update")]
    [PrivilegeAuthorize(<App>PrivilegeCodes.{Entity}PrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync(
        [FromBody] Update{Entity}Command cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult();

    [HttpPost("delete")]
    [PrivilegeAuthorize(<App>PrivilegeCodes.{Entity}PrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync(
        [FromBody] Delete{Entity}Command cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult();

    [HttpPost("assign")]
    [PrivilegeAuthorize(<App>PrivilegeCodes.{Entity}PrivilegeCodes.Assign)]
    public async Task<IActionResult> AssignAsync(
        [FromBody] Assign{Entity}Command cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult();

    [HttpPost("set-state")]
    [PrivilegeAuthorize(<App>PrivilegeCodes.{Entity}PrivilegeCodes.State)]
    public async Task<IActionResult> SetStateAsync(
        [FromBody] SetState{Entity}Command cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult();
}
```

> - Controller body'sinde **hiçbir zaman** iş mantığı, `if` dalı, exception yakalama, mapping olmaz.
> - `Result<T>.ToActionResult()` extension'ı Success → `200 Ok(value)`, Failure → `ProblemDetails` (ErrorType'a göre 400/404/409/403/500) üretir.
> - `CancellationToken` her method'a düşer ve `_sender.Send`'e geçirilir.
> - Route kebab-case: `set-state`, `bulk-update-status`. Method adı PascalCase + `Async`.

### 5.2 Dependency Injection Kaydı

**Dosya:** `Apps/<App>/<App>.Api/Configuration/DependencyInjection.cs`

Sadece repository kaydı yeterli. Handler / validator / MediatR registrasyonu `Apps/<App>/<App>.Application/DependencyInjection.cs` içinde `AddMediatR` + `AddValidatorsFromAssembly` ile assembly scan üzerinden yapılır — her yeni feature için ek kayıt gerekmez.

```csharp
// Sadece yeni repository:
services.AddScoped<I{Entity}Repository, {Entity}Repository>();
```

> Eski `AddScoped<{Entity}CommandHandler>()` kayıtları artık yok. MediatR handler'ları assembly scan ile bulur.

---

## ADIM 6 — Frontend (`<App>.Web`)

> Mimari referansı: `docs/Client_Architecture.md`. Frontend FSD katmanları (`app → pages → widgets → features → entities → shared`), MVI, TanStack Query + react-hook-form + zod kullanır. Aşağıdaki şablon mevcut `Apps/Crm/Crm.Web/src/entities/account/` yapısı baz alınarak yazıldı.

### 6.1 Entity Klasörü (FSD)

**Klasör:** `Apps/<App>/<App>.Web/src/entities/{entity}/`

```
entities/{entity}/
├── model/
│   ├── types.ts          # TypeScript tipleri
│   └── schema.ts         # zod şemaları
├── api/
│   ├── {entity}DataSource.ts    # HTTP çağrıları (httpClient üzerinden)
│   ├── use{Entity}Queries.ts    # TanStack Query hook'ları
│   └── use{Entity}Mutations.ts  # Create/Update/Delete mutation'ları
└── locales/
    └── tr.json
```

### 6.2 Types

**Dosya:** `entities/{entity}/model/types.ts`

```typescript
export const {Entity}Status = {
  Active:   1,
  Inactive: 2,
  Archived: 3,
} as const;

export type {Entity}StatusValue = typeof {Entity}Status[keyof typeof {Entity}Status];

export interface {Entity}ListItem {
  id: string;
  name: string;
  status: {Entity}StatusValue;
  isActive: boolean;
}

export interface {Entity}DetailItem {
  id: string;
  name: string;
  description?: string;
  status: {Entity}StatusValue;
  isActive: boolean;
  createdAtUtc?: string;
  updatedAtUtc?: string;
}

export interface {Entity}ListFilters {
  name?: string;
  status?: {Entity}StatusValue;
  isActive?: boolean;
}
```

### 6.3 Schema (zod)

**Dosya:** `entities/{entity}/model/schema.ts`

```typescript
import { z } from 'zod';

export const {entity}Schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Ad zorunludur').max(200),
  description: z.string().max(1000).optional(),
  status: z.number().int(),
  isActive: z.boolean().default(true),
});

export type {Entity}FormValues = z.infer<typeof {entity}Schema>;
```

### 6.4 ServicePath + QueryKeys

**Dosya:** `Apps/<App>/<App>.Web/src/shared/api/servicePaths.ts` — `<App>ServicePath` nesnesine ekle:

```typescript
{Entity}: crud(`${ApiBase}/{entity}`),    // List/Get/Create/Update/Delete
```

**Dosya:** `Apps/<App>/<App>.Web/src/shared/api/queryKeys.ts` — fabrika ekle:

```typescript
export const {entity}Keys = {
  all: ['{entity}'] as const,
  lists: () => [...{entity}Keys.all, 'list'] as const,
  list: (filters: unknown) => [...{entity}Keys.lists(), filters] as const,
  details: () => [...{entity}Keys.all, 'detail'] as const,
  detail: (id: string) => [...{entity}Keys.details(), id] as const,
};
```

### 6.5 DataSource

**Dosya:** `entities/{entity}/api/{entity}DataSource.ts`

```typescript
import { httpClient } from '@platform/ui';
import { <App>ServicePath } from '@/shared/api/servicePaths';
import type { {Entity}DetailItem, {Entity}ListItem, {Entity}ListFilters } from '../model/types';
import type { PaginationInfo, PaginationResult } from '@platform/ui';

export const {entity}DataSource = {
  list: (filters: {Entity}ListFilters, pagination: PaginationInfo) =>
    httpClient.post<PaginationResult<{Entity}ListItem>>(
      <App>ServicePath.{Entity}.List, { filters, pagination }
    ).then(r => r.data),

  get: (id: string) =>
    httpClient.post<{Entity}DetailItem>(
      <App>ServicePath.{Entity}.Get, { id }
    ).then(r => r.data),

  create: (data: Partial<{Entity}DetailItem>) =>
    httpClient.post<{Entity}DetailItem>(
      <App>ServicePath.{Entity}.Create, data
    ).then(r => r.data),

  update: (data: Partial<{Entity}DetailItem>) =>
    httpClient.post<{Entity}DetailItem>(
      <App>ServicePath.{Entity}.Update, data
    ).then(r => r.data),

  delete: (ids: string[]) =>
    httpClient.post(<App>ServicePath.{Entity}.Delete, { ids }).then(() => undefined),
};
```

### 6.6 Query / Mutation Hook'ları

**Dosya:** `entities/{entity}/api/use{Entity}Queries.ts`

```typescript
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { {entity}DataSource } from './{entity}DataSource';
import { {entity}Keys } from '@/shared/api/queryKeys';
import type { {Entity}ListFilters } from '../model/types';

export function use{Entity}Query(id: string | undefined) {
  return useQuery({
    queryKey: id ? {entity}Keys.detail(id) : ['{entity}', 'detail', 'none'],
    queryFn: () => {entity}DataSource.get(id!),
    enabled: !!id,
  });
}

export function use{Entity}sListQuery(filters: {Entity}ListFilters) {
  return useInfiniteQuery({
    queryKey: {entity}Keys.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      {entity}DataSource.list(filters, { page: pageParam, pageSize: 20 }),
    getNextPageParam: (last) => last.hasMore ? last.page + 1 : undefined,
    initialPageParam: 1,
  });
}
```

**Dosya:** `entities/{entity}/api/use{Entity}Mutations.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { {entity}DataSource } from './{entity}DataSource';
import { {entity}Keys } from '@/shared/api/queryKeys';
import type { {Entity}DetailItem } from '../model/types';

export function useUpsert{Entity}() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<{Entity}DetailItem>) =>
      data.id ? {entity}DataSource.update(data) : {entity}DataSource.create(data),
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: {entity}Keys.lists() });
      qc.invalidateQueries({ queryKey: {entity}Keys.detail(saved.id) });
    },
  });
}

export function useDelete{Entity}() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => {entity}DataSource.delete(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: {entity}Keys.lists() }),
  });
}
```

### 6.7 Route Paths + Routes

**Dosya:** `Apps/<App>/<App>.Web/src/app/router/paths.ts`

```typescript
export const RoutePaths = {
  // ... mevcut route'lar
  {Entities}List: '/{entity}',
  {Entity}New: '/{entity}/new',
  {Entity}Detail: (id: string) => `/{entity}/${id}`,
  {Entity}Edit:   (id: string) => `/{entity}/${id}/edit`,
} as const;

export const RoutePatterns = {
  {Entities}List:  '/{entity}',
  {Entity}New:    '/{entity}/new',
  {Entity}Detail: '/{entity}/:id',
  {Entity}Edit:   '/{entity}/:id/edit',
} as const;
```

**Dosya:** `Apps/<App>/<App>.Web/src/app/router/routes.tsx`

```tsx
import { {Entities}ListPage } from '@/pages/{entities}/list/ui/{Entities}ListPage';
import { {Entity}DetailPage } from '@/pages/{entities}/detail/ui/{Entity}DetailPage';

// routes array'ine ekle:
{ path: RoutePatterns.{Entities}List, element: <{Entities}ListPage /> },
{ path: RoutePatterns.{Entity}New,    element: <{Entity}DetailPage /> },
{ path: RoutePatterns.{Entity}Detail, element: <{Entity}DetailPage /> },
{ path: RoutePatterns.{Entity}Edit,   element: <{Entity}DetailPage /> },
```

### 6.8 List Page

**Dosya:** `Apps/<App>/<App>.Web/src/pages/{entities}/list/ui/{Entities}ListPage.tsx`

```tsx
import { useNavigate } from 'react-router-dom';
import { ListPageLayout, DataTable } from '@platform/ui';
import { use{Entity}sListQuery } from '@/entities/{entity}/api/use{Entity}Queries';
import { RoutePaths } from '@/app/router/paths';
import type { {Entity}ListItem } from '@/entities/{entity}/model/types';

export function {Entities}ListPage() {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isLoading } = use{Entity}sListQuery({});
  const rows = data?.pages.flatMap(p => p.data) ?? [];

  return (
    <ListPageLayout
      title="{Entity} Listesi"
      onCreate={() => navigate(RoutePaths.{Entity}New)}
    >
      <DataTable<{Entity}ListItem>
        rowKey="id"
        dataSource={rows}
        loading={isLoading}
        onRow={(record) => ({ onClick: () => navigate(RoutePaths.{Entity}Detail(record.id)) })}
        columns={[
          { title: 'Ad', dataIndex: 'name' },
          { title: 'Durum', dataIndex: 'status' },
        ]}
        onLoadMore={hasNextPage ? () => fetchNextPage() : undefined}
      />
    </ListPageLayout>
  );
}
```

### 6.9 Detail Page

**Dosya:** `Apps/<App>/<App>.Web/src/pages/{entities}/detail/ui/{Entity}DetailPage.tsx`

```tsx
import { DetailPageLayout, FormSection, TextField, SelectField } from '@platform/ui';
import { use{Entity}Query, useUpsert{Entity}, useDelete{Entity} } from '@/entities/{entity}/api/use{Entity}Queries';
import { {entity}Schema } from '@/entities/{entity}/model/schema';

export function {Entity}DetailPage() {
  return (
    <DetailPageLayout
      entityType="{entity}"
      useEntityQuery={use{Entity}Query}
      useUpsertMutation={useUpsert{Entity}}
      useDeleteMutation={useDelete{Entity}}
      schema={{entity}Schema}
      title={(mode, data) => mode === 'new' ? 'Yeni {Entity}' : (data?.name ?? '{Entity}')}
      afterSaveNavigation="view"
    >
      <FormSection title="Genel Bilgiler">
        <TextField name="name" label="Ad" required />
        <TextField name="description" label="Açıklama" />
        <SelectField name="status" label="Durum" required options={/* enum options */} />
      </FormSection>
    </DetailPageLayout>
  );
}
```

### 6.10 Menu + i18n

**Menu:** `Apps/<App>/<App>.Web/src/app/menu/use<App>Menu.tsx` — uygun grupta `{ key: '{entity}', label: t('{entity}'), to: RoutePaths.{Entities}List }` ekle.

**i18n:** `entities/{entity}/locales/tr.json` ve `pages/{entities}/{list,detail}/locales/tr.json` dosyalarını oluştur. `Apps/<App>/<App>.Web/src/app/i18n.config.ts` içindeki `register<App>Translations()` çağrısı `import.meta.glob` ile bunları otomatik yükler.

> **Yasaklar (CLAUDE.md):** `mode === 'view'` kontrolü sayfa kodunda yasak (field primitive'inde olmalı). Mode prop olarak geçirmek yasak (FormModeProvider kontekst). Doğrudan axios kullanımı yasak (sadece `httpClient`). Inline query key yasak (fabrika kullan).

## Mevcut Entity'ye Yeni Bir Command / Query Eklemek

Entity zaten varsa ve yalnızca yeni bir use case ekliyorsanız (örn: `ConvertLeadToAccountCommand`, `GetOpportunitySummaryQuery`), kısaltılmış akış:

1. **Klasörü aç.** `Apps/<App>/<App>.Application/Features/{Entity}s/Commands/{Action}{Entity}/` veya `.../Queries/{Action}{Entity}/`.
2. **Command/Query record'ını yaz.** `ICommand<T>` veya `IQuery<T>` implement et.
3. **(Command ise) Validator yaz.** Sadece input validation — DB'ye bakma. DB gerektiren kural handler'a gider.
4. **Handler yaz.**
   - Command → `I{Entity}Repository` + domain metodu; iş kuralı için `return {Entity}Errors.XYZ;`
   - Query → `I<App>DbContext` + `.ProjectToType<T>()`
5. **Error gerekiyorsa** `{Entity}Errors.cs` içine yeni `public static readonly Error ...` ekle.
6. **Mapster kuralı gerekliyse** `MappingConfig.cs` içine ekle.
7. **Controller'a method ekle.** Tek satır: `(await _sender.Send(cmd, ct)).ToActionResult()`. `[PrivilegeAuthorize(...)]` ekle.
8. **(Yeni privilege gerekiyorsa)** `<App>PrivilegeCodes.{Entity}PrivilegeCodes` içine sabit ekle.

**DI değişmez.** MediatR handler'ları ve FluentValidation validator'ları assembly scan ile otomatik bulunur. Yeni bir `AddScoped` kaydı **gerekmez**.

---

## Validation: Input vs Business Rule

Bu rehberde karıştırılması en kolay karar: bir kuralı `Validator`'a mı yoksa `Handler`'a mı koymalı?

| Kural türü | Nereye yazılır | Örnek |
|---|---|---|
| Format / zorunluluk / range / uzunluk | `Validator` (FluentValidation) | `Name NotEmpty`, `Quantity > 0`, `Email format` |
| DB durumu gerektiren kontrol | `Handler` → `return {Entity}Errors.XYZ;` | Aynı isimde kayıt var mı, kredi limiti aşıldı mı |
| Entity'nin tutarlılığı | Entity metodu (`entity.DoX() → Result`) | `Opportunity.Recalculate()`, `Lead.Convert()` |
| Birden fazla entity ilgilendiren kural | (Şimdilik) Handler; ileride Domain Service | "Açık fırsatı olan kontağı silemezsin" |

**Validator'da `MustAsync` + repo çağrısı yasak.** O kural handler'a aittir. Aksi takdirde validator pipeline'ı DB'ye bağımlı olur ve handler'ın sorumluluğunu gölgeler.

---

## Özet Kontrol Listesi

Her adımı tamamladıkça işaretleyin:

### Backend

**Database + Domain:**
- [ ] `Apps/<App>/<App>.Database/{Entity}.sql` — Tablo scripti oluşturuldu
- [ ] `Apps/<App>/<App>.Domain/Enums/{Entity}Status.cs` — Enum'lar oluşturuldu
- [ ] `Apps/<App>/<App>.Domain/Entities/{Entity}s/{Entity}.cs` — Entity sınıfı oluşturuldu
- [ ] `Apps/<App>/<App>.Domain/Authorization/<App>PrivilegeCodes.cs` — `{Entity}PrivilegeCodes` eklendi

**Application (feature klasörü):**
- [ ] `Features/{Entity}s/Dtos/{Entity}DetailItem.cs`
- [ ] `Features/{Entity}s/Dtos/{Entity}ListItem.cs`
- [ ] `Features/{Entity}s/Dtos/{Entity}ListFilters.cs`
- [ ] `Features/{Entity}s/{Entity}Errors.cs` — static Error sınıfı
- [ ] `Apps/<App>/<App>.Application/Interfaces/I{Entity}Repository.cs` — write path için
- [ ] `Mapping/MappingConfig.cs` — entity ↔ DTO / command config'i eklendi

**Application — Commands** (her biri kendi klasörü):
- [ ] `Create{Entity}Command + Handler + Validator`
- [ ] `Update{Entity}Command + Handler + Validator`
- [ ] `Delete{Entity}Command + Handler`
- [ ] `SetState{Entity}Command + Handler`
- [ ] `Assign{Entity}Command + Handler`
- [ ] (Varsa) `BulkUpdateStatus{Entity}Command + Handler + Validator`

**Application — Queries:**
- [ ] `Get{Entity}Query + Handler`
- [ ] `List{Entity}sQuery + Handler`
- [ ] `Search{Entity}sQuery + Handler`

**Infrastructure:**
- [ ] `Apps/<App>/<App>.Infrastructure/Data/Configurations/{Entity}s/{Entity}Configuration.cs`
- [ ] `Apps/<App>/<App>.Infrastructure/Repositories/{Entity}Repository.cs` (yalnızca write path + gerekliyse `ExistsByNameAsync` gibi özel write-side query)
- [ ] `Apps/<App>/<App>.Infrastructure/Data/<App>DbContext.cs` — `DbSet<{Entity}> {Entity}s` eklendi
- [ ] `Apps/<App>/<App>.Application/Interfaces/I<App>DbContext.cs` — `DbSet<{Entity}> {Entity}s { get; }` eklendi

**Api:**
- [ ] `Apps/<App>/<App>.Api/Controllers/{Entity}Controller.cs` — Slim controller (`ISender` + `ToActionResult`)
- [ ] `Apps/<App>/<App>.Api/Configuration/DependencyInjection.cs` — Sadece `I{Entity}Repository` kaydı (MediatR ve validator'lar assembly scan ile yüklenir)

### Frontend

**Entity (FSD):**
- [ ] `entities/{entity}/model/types.ts` — TS tipleri + enum sabitleri
- [ ] `entities/{entity}/model/schema.ts` — zod şeması
- [ ] `entities/{entity}/api/{entity}DataSource.ts` — httpClient çağrıları
- [ ] `entities/{entity}/api/use{Entity}Queries.ts` — TanStack Query hook'ları
- [ ] `entities/{entity}/api/use{Entity}Mutations.ts` — Upsert/Delete mutation'ları
- [ ] `entities/{entity}/locales/tr.json` — i18n metinleri

**Shared:**
- [ ] `shared/api/servicePaths.ts` — `{Entity}` endpoint'leri eklendi
- [ ] `shared/api/queryKeys.ts` — `{entity}Keys` fabrikası eklendi

**Router:**
- [ ] `app/router/paths.ts` — `{Entities}List`, `{Entity}Detail`, `{Entity}New`, `{Entity}Edit` path'leri
- [ ] `app/router/routes.tsx` — Sayfaları route'lara bağla

**Pages:**
- [ ] `pages/{entities}/list/ui/{Entities}ListPage.tsx` — `ListPageLayout` + `DataTable`
- [ ] `pages/{entities}/list/locales/tr.json`
- [ ] `pages/{entities}/detail/ui/{Entity}DetailPage.tsx` — `DetailPageLayout` + form alanları (20-40 satır)
- [ ] `pages/{entities}/detail/locales/tr.json`

**Menu + i18n:**
- [ ] `app/menu/use<App>Menu.tsx` — uygun grupta menü item eklendi
- [ ] `app/menu/locales/tr.json` — menü etiketi eklendi
- [ ] `app/i18n.config.ts` — yeni klasörler `register<App>Translations()` glob'larına dahil

---

## Önemli Notlar

### EF Core Global Query Filter'ları

`ISoftDeleteEntity` ve `IOwnedEntity` uygulayan tüm entity'lere `<App>DbContext` üzerinden otomatik global query filter uygulanır. Hiçbir repository'de `IsDeleted == false` veya ownership filter'ı manuel yazmanıza gerek yoktur.

### Audit Alanları Otomatik Doldurulur

`IAuditableEntity` uygulayan entity'lerde `CreatedBy`, `CreatedAt`, `UpdatedBy`, `UpdatedAt` alanları `DbContext.SaveChangesAsync()` override'ı tarafından otomatik set edilir.

### Pagination Paterni

Repository'de `PageSize + 1` kayıt çekilir. Eğer gelen kayıt sayısı `PageSize`'dan fazlaysa son kayıt listeden çıkarılır ve `HasMore = true` döner. Frontend bu bilgiyi kullanarak "daha fazla yükle" butonu gösterir.

### Enum Dönüşümü

C# enum'larının veritabanında nasıl saklanacağı entity konfigürasyonunda belirlenir:
- `EnumToStringConverter<T>` ile `VARCHAR` (insan-okur, schema sabit kalmalı)
- Enum'un underlying tipi (`int`) ile `int` kolon (kompakt, sıralanabilir)

Mevcut entity'lerin çoğu `int` saklıyor (örn. `SupplierStatus`); yeni entity için projede tutarlılığı koru. Frontend tip tanımı C# enum'unun underlying değerleriyle birebir aynı olmalı (`as const` literal map).

### Polimorfik Referans (Activity Regarding gibi)

App'in entity'sine Platform tarafından polimorfik referans veriliyorsa (`Activity.RegardingEntityType` gibi), `IEntityReferenceResolver` implementasyonu yaz ve DI'da kaydet:

```csharp
// Apps/<App>/<App>.Infrastructure/References/{Entity}ReferenceResolver.cs
public class {Entity}ReferenceResolver : IEntityReferenceResolver
{
    public string EntityType => nameof({Entity});
    public Task<EntityReference?> ResolveAsync(Guid id, CancellationToken ct) { ... }
    public Task<EntityReferenceList> SearchAsync(string? text, PaginationInfo p, CancellationToken ct) { ... }
}

// Apps/<App>/<App>.Infrastructure/DependencyInjection.cs
services.AddScoped<IEntityReferenceResolver, {Entity}ReferenceResolver>();
```

Detaylar: `docs/CONTRIBUTING.md` § 8 ve `Platform/Platform.Application/Common/References/IEntityReferenceResolver.cs`.
