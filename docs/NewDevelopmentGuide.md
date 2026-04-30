# Yeni Entity Ekleme Rehberi

Bu rehber, CRM projesine yeni bir entity eklemek için izlenmesi gereken adımları kapsamaktadır.
Tüm örnekler `Lead` entity'si baz alınarak yazılmıştır. `{Entity}` ifadesini kendi entity adınızla (örn. `Invoice`) değiştirin.

---

## Genel Bakış

Bir entity eklemek için şu katmanlara dokunulur:

```
1. Database          → SQL tablo scripti
2. CRM.Domain        → Entity sınıfı, enum'lar, privilege kod'ları
3. CRM.Application   → Feature klasörü (Commands/Queries/Dtos), Errors, Validator, Mapster config, repository interface
4. CRM.Infrastructure → Repository implementasyonu, EF Core configuration, DbContext'e DbSet ekleme, IApplicationDbContext'e property ekle
5. CRM.Api           → Slim controller (ISender üzerinden), DI kaydı yalnızca repository için
6. CRM.Web (Frontend)→ Types, service, store, service paths, route paths, route dosyası, list page, detail page
```

> Mimari referansı: `docs/Api_Architecture.md`. Handler'lar Result<T> döner, iş kuralı ihlali için exception atılmaz; cross-cutting concern'ler (logging, validation, transaction) MediatR pipeline'ında çalışır. Bu rehber pratik adımları içerir, felsefe ve detay kararlar için `docs/Api_Architecture.md`'ye bak.

---

## ADIM 1 — Database: SQL Tablo Scripti

**Dosya:** `CRM.Database/{Entity}.sql`

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

> Script'i `docker/db-init/01-init.sh` içindeki sıraya göre çalıştırılacak şekilde kayıt altına alın.

---

## ADIM 2 — CRM.Domain

### 2.1 Enum'lar (varsa)

**Dosya:** `CRM.Domain/Enums/{Entity}Status.cs`

```csharp
namespace CRM.Domain.Enums
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

**Dosya:** `CRM.Domain/Entities/{Entity}s/{Entity}.cs`

```csharp
using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;

namespace CRM.Domain.Entities.{Entity}s
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

> Tüm cross-cutting concern'ler interface'ler aracılığıyla yönetilir. EF Core global query filter'ları `ISoftDeleteEntity` ve `IOwnedEntity` için otomatik uygulanır — ek kod yazmaya gerek yoktur.

### 2.3 Privilege Kodları

**Dosya:** `CRM.Domain/Authorization/PrivilegeCodes.cs` — mevcut sınıfa ekleyin:

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

---

## ADIM 3 — CRM.Application

Feature klasörü, DTO'lar, Errors sınıfı, repository interface, command/query handler'ları ve Mapster mapping kuralı.

### 3.1 Feature Klasör Yapısı

```
CRM.Application/Features/{Entity}s/
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

**Klasör:** `CRM.Application/Features/{Entity}s/Dtos/`

**`{Entity}ListItem.cs`** — Liste görünümü için hafif DTO:

```csharp
namespace CRM.Application.Features.{Entity}s.Dtos;

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
namespace CRM.Application.Features.{Entity}s.Dtos;

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
namespace CRM.Application.Features.{Entity}s.Dtos;

public class {Entity}ListFilters
{
    public string? Name { get; set; }
    public {Entity}Status? Status { get; set; }
    public bool? IsActive { get; set; }
}
```

> `{Entity}ListResponse` / `{Entity}ListRequest` artık yazılmaz. List sonucu `PaginationResult<{Entity}ListItem>`, request ise `List{Entity}sQuery` record'u içinde taşınır.

### 3.3 Errors

**Dosya:** `CRM.Application/Features/{Entity}s/{Entity}Errors.cs`

```csharp
using CRM.Application.Common.Results;

namespace CRM.Application.Features.{Entity}s;

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

**Dosya:** `CRM.Application/Interfaces/I{Entity}Repository.cs`

```csharp
using CRM.Domain.Entities.{Entity}s;

namespace CRM.Application.Interfaces;

public interface I{Entity}Repository : IEntityRepository<{Entity}>
{
    Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default);
}
```

> **Not:** Liste sorgusu için repository metodu **açma**. Query handler `IApplicationDbContext` + `.ProjectToType<T>()` ile doğrudan EF üzerinden projeksiyon yapar. Repository yalnızca write path'i (Create/Update/Delete) ve çok özel write-side sorguları (duplicate check gibi) içerir.

### 3.5 Mapster Mapping Config

**Dosya:** `CRM.Application/Mapping/MappingConfig.cs` — mevcut `Register` metoduna kural ekle:

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
using CRM.Application.Common.Abstractions;
using CRM.Application.Common.Results;
using CRM.Application.Features.{Entity}s.Dtos;

namespace CRM.Application.Features.{Entity}s.Commands.Create{Entity};

public sealed record Create{Entity}Command(
    string Name,
    string? Description,
    {Entity}Status Status
) : ICommand<{Entity}DetailItem>;
```

**Validator (input — state-less):**

```csharp
using FluentValidation;

namespace CRM.Application.Features.{Entity}s.Commands.Create{Entity};

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
using CRM.Application.Common.Results;
using CRM.Application.Features.{Entity}s.Dtos;
using CRM.Application.Interfaces;
using CRM.Domain.Entities.{Entity}s;
using Mapster;
using MediatR;

namespace CRM.Application.Features.{Entity}s.Commands.Create{Entity};

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
    private readonly IApplicationDbContext _ctx;
    public Get{Entity}Handler(IApplicationDbContext ctx) => _ctx = ctx;

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
    private readonly IApplicationDbContext _ctx;
    public List{Entity}sHandler(IApplicationDbContext ctx) => _ctx = ctx;

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

## ADIM 4 — CRM.Infrastructure

### 4.1 EF Core Configuration

**Dosya:** `CRM.Infrastructure/Data/Configurations/{Entity}s/{Entity}Configuration.cs`

```csharp
using CRM.Domain.Entities.{Entity}s;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CRM.Infrastructure.Data.Configurations.{Entity}s;

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

**Dosya:** `CRM.Infrastructure/Repositories/{Entity}Repository.cs`

```csharp
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.{Entity}Modal;
using CRM.Domain.Entities.{Entity}s;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories
{
    public class {Entity}Repository : BaseEntityRepository<{Entity}>, I{Entity}Repository
    {
        public {Entity}Repository(DatabaseContext dbContext) : base(dbContext) { }

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

**Dosya:** `CRM.Infrastructure/Data/DatabaseContext.cs`

```csharp
// Mevcut DbSet'lerin yanına ekleyin (çoğul isim):
public DbSet<{Entity}> {Entity}s { get; set; }
```

### 4.4 IApplicationDbContext'e Property Ekle

**Dosya:** `CRM.Application/Common/Abstractions/IApplicationDbContext.cs`

```csharp
// Query handler'ların {Entity}s üzerinden projection yapabilmesi için:
DbSet<{Entity}> {Entity}s { get; }
```

> Bu adım **kritik**: Query handler `IApplicationDbContext` üzerinden okur, `DatabaseContext`'i doğrudan import etmez. Yeni entity için property eklenmezse query handler derlenmez.

---

## ADIM 5 — CRM.Api

Controller tek satırdır. `ISender` inject edilir, gelen request doğrudan MediatR'a gönderilir. Command / Query / Validator hepsi `CRM.Application` tarafında yaşar; controller hiçbir iş mantığı taşımaz.

### 5.1 Controller

**Dosya:** `CRM.Api/Controllers/{Entity}Controller.cs`

```csharp
using CRM.Api.Authorization;
using CRM.Api.Extensions;                                // ToActionResult
using CRM.Application.Features.{Entity}s.Commands.Create{Entity};
using CRM.Application.Features.{Entity}s.Commands.Update{Entity};
using CRM.Application.Features.{Entity}s.Commands.Delete{Entity};
using CRM.Application.Features.{Entity}s.Commands.SetState{Entity};
using CRM.Application.Features.{Entity}s.Commands.Assign{Entity};
using CRM.Application.Features.{Entity}s.Queries.Get{Entity};
using CRM.Application.Features.{Entity}s.Queries.List{Entity}s;
using CRM.Application.Features.{Entity}s.Queries.Search{Entity}s;
using CRM.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers;

[ApiController]
[Route("api/{entity}")]
public sealed class {Entity}Controller : ControllerBase
{
    private readonly ISender _sender;
    public {Entity}Controller(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(PrivilegeCodes.{Entity}PrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync(
        [FromBody] List{Entity}sQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult();

    [HttpPost("search")]
    [PrivilegeAuthorize(PrivilegeCodes.{Entity}PrivilegeCodes.Read)]
    public async Task<IActionResult> SearchAsync(
        [FromBody] Search{Entity}sQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult();

    [HttpPost("get")]
    [PrivilegeAuthorize(PrivilegeCodes.{Entity}PrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync(
        [FromBody] Get{Entity}Query query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult();

    [HttpPost("create")]
    [PrivilegeAuthorize(PrivilegeCodes.{Entity}PrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync(
        [FromBody] Create{Entity}Command cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult();

    [HttpPost("update")]
    [PrivilegeAuthorize(PrivilegeCodes.{Entity}PrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync(
        [FromBody] Update{Entity}Command cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult();

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.{Entity}PrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync(
        [FromBody] Delete{Entity}Command cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult();

    [HttpPost("assign")]
    [PrivilegeAuthorize(PrivilegeCodes.{Entity}PrivilegeCodes.Assign)]
    public async Task<IActionResult> AssignAsync(
        [FromBody] Assign{Entity}Command cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult();

    [HttpPost("set-state")]
    [PrivilegeAuthorize(PrivilegeCodes.{Entity}PrivilegeCodes.State)]
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

**Dosya:** `CRM.Api/Configuration/DependencyInjection.cs`

Sadece repository kaydı yeterli. Handler / validator / MediatR registrasyonu `CRM.Application/DependencyInjection.cs` içinde `AddMediatR` + `AddValidatorsFromAssembly` ile assembly scan üzerinden yapılır — her yeni feature için ek kayıt gerekmez.

```csharp
// Sadece yeni repository:
services.AddScoped<I{Entity}Repository, {Entity}Repository>();
```

> Eski `AddScoped<{Entity}CommandHandler>()` kayıtları artık yok. MediatR handler'ları assembly scan ile bulur.

---

## ADIM 6 — Frontend (CRM.Web)

### 6.1 Type Tanımları

**Dosya:** `CRM.Web/src/types/{entity}.types.ts`

```typescript
import i18n from '@/config/i18n.config';

// Enum sabitleri
export const {Entity}Status = {
  Active:   'active',
  Inactive: 'inactive',
  Archived: 'archived',
} as const;

export type {Entity}StatusValue = (typeof {Entity}Status)[keyof typeof {Entity}Status];

// Liste DTO
export interface {Entity}ListItem {
  id: string;
  name: string;
  status: {Entity}StatusValue;
  isActive: boolean;
}

// Detay DTO
export interface {Entity}DetailItem {
  id: string;
  name: string;
  description?: string;
  status: {Entity}StatusValue;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Filtreler
export interface {Entity}ListFilters {
  name?: string;
  status?: {Entity}StatusValue;
  isActive?: boolean;
}

// API request/response
export interface {Entity}ListRequest {
  page: number;
  pageSize: number;
  filters?: {Entity}ListFilters;
}

export interface {Entity}ListResponse {
  data: {Entity}ListItem[];
  hasMore: boolean;
  page: number;
  pageSize: number;
}

// Renk haritası
const {Entity}StatusColors: Record<{Entity}StatusValue, string> = {
  [{Entity}Status.Active]:   'green',
  [{Entity}Status.Inactive]: 'default',
  [{Entity}Status.Archived]: 'red',
};

// Yardımcı fonksiyonlar
export const get{Entity}StatusLabel = (status: {Entity}StatusValue): string =>
  i18n.t(`enums:{entity}Status.${status}`, { defaultValue: status });

export const get{Entity}StatusColor = (status: {Entity}StatusValue): string =>
  {Entity}StatusColors[status] ?? 'default';

// Select bileşeni için seçenekler
export const {entity}StatusOptions = Object.values({Entity}Status).map((value) => ({
  label: get{Entity}StatusLabel(value),
  value,
}));

// Ant Design tablo filtresi için
export const {entity}StatusFilters = Object.values({Entity}Status).map((value) => ({
  text:  get{Entity}StatusLabel(value),
  value,
}));
```

### 6.2 Service Path'leri

**Dosya:** `CRM.Web/src/config/service.paths.ts` — `ControllerPaths` ve `ServicePath` nesnelerine ekleyin:

```typescript
// ControllerPaths'e ekle:
{Entity}Path: `${ServiceBasePath}/api/{entity}`,

// ServicePath'e ekle:
{Entity}: {
  List:   `${ControllerPaths.{Entity}Path}/list`,
  Search: `${ControllerPaths.{Entity}Path}/search`,
  Get:    `${ControllerPaths.{Entity}Path}/get`,
  Create: `${ControllerPaths.{Entity}Path}/create`,
  Update: `${ControllerPaths.{Entity}Path}/update`,
  Delete: `${ControllerPaths.{Entity}Path}/delete`,
  Assign: `${ControllerPaths.{Entity}Path}/assign`,
  State:  `${ControllerPaths.{Entity}Path}/set-state`,
},
```

### 6.3 Service

**Dosya:** `CRM.Web/src/services/{entity}.service.ts`

```typescript
import type {
  {Entity}DetailItem,
  {Entity}ListRequest,
  {Entity}ListFilters,
  {Entity}ListResponse,
} from '@/types/{entity}.types';
import apiClient from '@/services/api.client';
import { apiRequest } from '@/services/api.request';
import { ServicePath } from '@/config/service.paths';
import type { AssignRequest, IdListRequest, IdRequest, StatusRequest } from '@/types/common.types';

export const {entity}Service = {

  get{Entity}s: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {Entity}ListFilters
  ): Promise<{Entity}ListResponse> => {
    const request: {Entity}ListRequest = { page, pageSize, filters };
    return apiRequest(() =>
      apiClient.post<{Entity}ListResponse>(ServicePath.{Entity}.List, request).then(r => r.data)
    );
  },

  get{Entity}ById: async (id: string): Promise<{Entity}DetailItem> => {
    const request: IdRequest = { id };
    return apiRequest(() =>
      apiClient.post<{Entity}DetailItem>(ServicePath.{Entity}.Get, request).then(r => r.data)
    );
  },

  create{Entity}: async (
    data: Omit<Partial<{Entity}DetailItem>, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{Entity}DetailItem> => {
    return apiRequest(() =>
      apiClient.post<{Entity}DetailItem>(ServicePath.{Entity}.Create, data).then(r => r.data)
    );
  },

  update{Entity}: async (data: Partial<{Entity}DetailItem>): Promise<{Entity}DetailItem> => {
    return apiRequest(() =>
      apiClient.post<{Entity}DetailItem>(ServicePath.{Entity}.Update, data).then(r => r.data)
    );
  },

  delete{Entity}: async (request: IdListRequest): Promise<void> => {
    return apiRequest(() =>
      apiClient.post(ServicePath.{Entity}.Delete, request).then(() => undefined)
    );
  },

  setStatus{Entity}: async (request: StatusRequest): Promise<void> => {
    return apiRequest(() =>
      apiClient.post(ServicePath.{Entity}.State, request).then(() => undefined)
    );
  },

  assign{Entity}: async (request: AssignRequest): Promise<void> => {
    return apiRequest(() =>
      apiClient.post(ServicePath.{Entity}.Assign, request).then(() => undefined)
    );
  },
};

export default {entity}Service;
```

### 6.4 Zustand Store

**Dosya:** `CRM.Web/src/stores/{entity}.store.ts`

```typescript
import {entity}Service from '@/services/{entity}.service';
import type { {Entity}ListItem, {Entity}DetailItem, {Entity}ListFilters } from '@/types/{entity}.types';
import { createEntityStore } from './entity.store.factory';

const _store = createEntityStore<{Entity}ListItem, {Entity}DetailItem, {Entity}ListFilters, never>({
  storeName: '{entity}-store',
  defaultPageSize: 10,
  initialFilters: {
    name:     undefined,
    status:   undefined,
    isActive: undefined,
  },
  labels: { singular: '{Entity}', plural: '{Entity}ler' },
  service: {
    getList:  (page, pageSize, filters) => {entity}Service.get{Entity}s(page, pageSize, filters),
    getById:  (id)     => {entity}Service.get{Entity}ById(id),
    create:   (data)   => {entity}Service.create{Entity}(data as Omit<Partial<{Entity}DetailItem>, 'id' | 'createdAt' | 'updatedAt'>),
    update:   (data)   => {entity}Service.update{Entity}(data as Partial<{Entity}DetailItem>),
    delete:   (payload) => {entity}Service.delete{Entity}(payload),
    setStatus:(payload) => {entity}Service.setStatus{Entity}(payload),
    assign:   (payload) => {entity}Service.assign{Entity}(payload),
  },
});

// Entity'ye özel alias'lar ile wrapper hook
export function use{Entity}Store() {
  const s = _store();
  return {
    ...s,
    {entity}s:         s.items as {Entity}ListItem[],
    current{Entity}:   s.currentItem as {Entity}DetailItem | null,
    setCurrentItem:    s.setCurrentItem,
    fetch{Entity}s:    s.fetchItems,
    fetch{Entity}ById: s.fetchItemById,
    create{Entity}:    s.createItem as (data: Omit<Partial<{Entity}DetailItem>, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{Entity}DetailItem>,
    update{Entity}:    s.updateItem as (data: Partial<{Entity}DetailItem>) => Promise<{Entity}DetailItem>,
    delete{Entity}:    s.deleteItem,
    bulkDelete{Entity}s:     s.bulkDelete,
    bulkActivate{Entity}s:   s.bulkActivate,
    bulkDeactivate{Entity}s: s.bulkDeactivate,
    bulkAssign{Entity}s:     s.bulkAssign,
    activate{Entity}:   s.activateItem,
    deactivate{Entity}: s.deactivateItem,
    assign{Entity}:     s.assignItem,
  };
}

use{Entity}Store.getState = _store.getState;
export default use{Entity}Store;
```

> `updateStatus` (bulk status değişikliği) entity'nizde varsa `service` adapter'ına ekleyin ve store wrapper'ına `bulkUpdateStatus` alias'ını dahil edin. Yoksa `never` type parametresini olduğu gibi bırakın.

### 6.5 Route Path'leri

**Dosya:** `CRM.Web/src/config/route.paths.ts`

`BasePaths`'e base path ekleyin:

```typescript
{Entity}Path: '/{entity}',
```

Yeni path grubunu tanımlayın:

```typescript
export const {Entity} = {
  List:   BasePaths.{Entity}Path,
  New:    `${BasePaths.{Entity}Path}/new`,
  Detail: (id: string) => `${BasePaths.{Entity}Path}/${id}`,
  Edit:   (id: string) => `${BasePaths.{Entity}Path}/${id}?mode=edit`,
  View:   (id: string) => `${BasePaths.{Entity}Path}/${id}?mode=view`,
} as const;
```

`RoutePaths` export nesnesine ekleyin:

```typescript
export const RoutePaths = {
  ...BasePaths,
  // ... mevcut entity'ler ...
  {Entity}: {Entity},
} as const;
```

### 6.6 Route Dosyası

**Dosya:** `CRM.Web/src/routes/{entity}.routes.tsx`

```tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';

const {Entity}List   = lazy(() => import('@/pages/{entity}/{Entity}List'));
const {Entity}Detail = lazy(() => import('@/pages/{entity}/{Entity}Detail'));

export const {entity}Routes: RouteObject[] = [
  {
    path: RoutePaths.{Entity}.List,
    element: <{Entity}List />,
  },
  {
    path: RoutePaths.{Entity}.New,
    element: <{Entity}Detail />,
  },
  {
    path: RoutePaths.{Entity}.Detail(':id'),
    element: <{Entity}Detail />,
  },
];

export default {entity}Routes;
```

Route'ları ana router'a ekleyin (genellikle `App.tsx` veya `router.tsx`):

```tsx
import {entity}Routes from '@/routes/{entity}.routes';

// routes array'ine spread edin:
...{entity}Routes,
```

### 6.7 List Page

**Dosya:** `CRM.Web/src/pages/{entity}/{Entity}List.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Button, Table, Tag, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout } from '@/components/layout/ListPageLayout';
import { RoutePaths } from '@/config/route.paths';
import use{Entity}Store from '@/stores/{entity}.store';
import type { {Entity}ListItem } from '@/types/{entity}.types';
import { get{Entity}StatusLabel, get{Entity}StatusColor } from '@/types/{entity}.types';

export default function {Entity}List() {
  const navigate = useNavigate();
  const {
    {entity}s,
    fetchItems,
    hasMore,
    page,
    pageSize,
    isLoading,
    bulkDelete{Entity}s,
    bulkActivate{Entity}s,
    bulkDeactivate{Entity}s,
    bulkAssign{Entity}s,
    delete{Entity},
    activate{Entity},
    deactivate{Entity},
    filters,
    setFilters,
    resetFilters,
  } = use{Entity}Store();

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    fetchItems(1);
  }, []);

  const columns: ColumnsType<{Entity}ListItem> = [
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => navigate(RoutePaths.{Entity}.View(record.id))}>{text}</a>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={get{Entity}StatusColor(status)}>{get{Entity}StatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Aktif',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => <Tag color={isActive ? 'green' : 'default'}>{isActive ? 'Aktif' : 'Pasif'}</Tag>,
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => navigate(RoutePaths.{Entity}.Edit(record.id))}>
            Düzenle
          </Button>
          <Popconfirm title="Silmek istediğinizden emin misiniz?" onConfirm={() => delete{Entity}({ ids: [record.id] })}>
            <Button size="small" danger>Sil</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ListPageLayout
      title="{Entity} Listesi"
      onCreate={() => navigate(RoutePaths.{Entity}.New)}
      bulkActions={
        selectedRowKeys.length > 0 ? (
          <Space>
            <Popconfirm title="Seçilenleri silmek istediğinizden emin misiniz?" onConfirm={() => bulkDelete{Entity}s(selectedRowKeys)}>
              <Button danger>Sil ({selectedRowKeys.length})</Button>
            </Popconfirm>
            <Button onClick={() => bulkActivate{Entity}s(selectedRowKeys)}>Aktifleştir</Button>
            <Button onClick={() => bulkDeactivate{Entity}s(selectedRowKeys)}>Pasifleştir</Button>
          </Space>
        ) : null
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={{entity}s}
        loading={isLoading}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as string[]),
        }}
        pagination={{
          current: page,
          pageSize,
          showSizeChanger: false,
          // hasMore pattern: sonraki sayfa varlığını simüle eder
        }}
        onChange={(pagination) => fetchItems(pagination.current ?? 1)}
      />
    </ListPageLayout>
  );
}
```

### 6.8 Detail Page

**Dosya:** `CRM.Web/src/pages/{entity}/{Entity}Detail.tsx`

```tsx
import { useEffect } from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DetailPageLayout } from '@/components/layout/DetailPageLayout';
import { AuditCard } from '@/components/common/AuditCard';
import { RoutePaths } from '@/config/route.paths';
import use{Entity}Store from '@/stores/{entity}.store';
import type { {Entity}DetailItem } from '@/types/{entity}.types';
import { {entity}StatusOptions } from '@/types/{entity}.types';

export default function {Entity}Detail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<{Entity}DetailItem>();

  const mode = id ? (searchParams.get('mode') ?? 'view') : 'new';
  const isViewMode = mode === 'view';
  const isNew = !id;

  const {
    current{Entity},
    fetch{Entity}ById,
    create{Entity},
    update{Entity},
    isLoading,
  } = use{Entity}Store();

  useEffect(() => {
    if (id) {
      fetch{Entity}ById(id);
    }
  }, [id]);

  useEffect(() => {
    if (current{Entity} && !isNew) {
      form.setFieldsValue(current{Entity});
    }
  }, [current{Entity}]);

  const handleSubmit = async (values: {Entity}DetailItem) => {
    if (isNew) {
      const result = await create{Entity}(values);
      navigate(RoutePaths.{Entity}.View(result.id));
    } else {
      await update{Entity}({ ...values, id: id! });
      navigate(RoutePaths.{Entity}.View(id!));
    }
  };

  return (
    <DetailPageLayout
      title={isNew ? 'Yeni {Entity}' : (isViewMode ? '{Entity} Detayı' : '{Entity} Düzenle')}
      isLoading={isLoading}
      actions={
        isViewMode && id ? (
          <Button type="primary" onClick={() => navigate(RoutePaths.{Entity}.Edit(id))}>
            Düzenle
          </Button>
        ) : undefined
      }
    >
      <Form
        form={form}
        layout="vertical"
        disabled={isViewMode}
        onFinish={handleSubmit}
      >
        <Form.Item name="name" label="Ad" rules={[{ required: true, message: 'Ad zorunludur' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Açıklama">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="status" label="Durum" rules={[{ required: true }]}>
          <Select options={{entity}StatusOptions} />
        </Form.Item>

        {!isViewMode && (
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {isNew ? 'Oluştur' : 'Güncelle'}
              </Button>
              <Button onClick={() => navigate(-1)}>İptal</Button>
            </Space>
          </Form.Item>
        )}
      </Form>

      {/* Audit bilgisi — sadece mevcut kayıtlarda göster */}
      {current{Entity} && (
        <AuditCard
          createdAt={current{Entity}.createdAt}
          updatedAt={current{Entity}.updatedAt}
        />
      )}
    </DetailPageLayout>
  );
}
```

---

## Mevcut Entity'ye Yeni Bir Command / Query Eklemek

Entity zaten varsa ve yalnızca yeni bir use case ekliyorsanız (örn: `ConvertLeadToAccountCommand`, `GetOpportunitySummaryQuery`), kısaltılmış akış:

1. **Klasörü aç.** `CRM.Application/Features/{Entity}s/Commands/{Action}{Entity}/` veya `.../Queries/{Action}{Entity}/`.
2. **Command/Query record'ını yaz.** `ICommand<T>` veya `IQuery<T>` implement et.
3. **(Command ise) Validator yaz.** Sadece input validation — DB'ye bakma. DB gerektiren kural handler'a gider.
4. **Handler yaz.**
   - Command → `I{Entity}Repository` + domain metodu; iş kuralı için `return {Entity}Errors.XYZ;`
   - Query → `IApplicationDbContext` + `.ProjectToType<T>()`
5. **Error gerekiyorsa** `{Entity}Errors.cs` içine yeni `public static readonly Error ...` ekle.
6. **Mapster kuralı gerekliyse** `MappingConfig.cs` içine ekle.
7. **Controller'a method ekle.** Tek satır: `(await _sender.Send(cmd, ct)).ToActionResult()`. `[PrivilegeAuthorize(...)]` ekle.
8. **(Yeni privilege gerekiyorsa)** `PrivilegeCodes.{Entity}PrivilegeCodes` içine sabit ekle.

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
- [ ] `CRM.Database/{Entity}.sql` — Tablo scripti oluşturuldu
- [ ] `CRM.Domain/Enums/{Entity}Status.cs` — Enum'lar oluşturuldu
- [ ] `CRM.Domain/Entities/{Entity}s/{Entity}.cs` — Entity sınıfı oluşturuldu
- [ ] `CRM.Domain/Authorization/PrivilegeCodes.cs` — `{Entity}PrivilegeCodes` eklendi

**Application (feature klasörü):**
- [ ] `Features/{Entity}s/Dtos/{Entity}DetailItem.cs`
- [ ] `Features/{Entity}s/Dtos/{Entity}ListItem.cs`
- [ ] `Features/{Entity}s/Dtos/{Entity}ListFilters.cs`
- [ ] `Features/{Entity}s/{Entity}Errors.cs` — static Error sınıfı
- [ ] `CRM.Application/Interfaces/I{Entity}Repository.cs` — write path için
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
- [ ] `CRM.Infrastructure/Data/Configurations/{Entity}s/{Entity}Configuration.cs`
- [ ] `CRM.Infrastructure/Repositories/{Entity}Repository.cs` (yalnızca write path + gerekliyse `ExistsByNameAsync` gibi özel write-side query)
- [ ] `CRM.Infrastructure/Data/DatabaseContext.cs` — `DbSet<{Entity}> {Entity}s` eklendi
- [ ] `CRM.Application/Common/Abstractions/IApplicationDbContext.cs` — `DbSet<{Entity}> {Entity}s { get; }` eklendi

**Api:**
- [ ] `CRM.Api/Controllers/{Entity}Controller.cs` — Slim controller (`ISender` + `ToActionResult`)
- [ ] `CRM.Api/Configuration/DependencyInjection.cs` — Sadece `I{Entity}Repository` kaydı (MediatR ve validator'lar assembly scan ile yüklenir)

### Frontend

- [ ] `CRM.Web/src/types/{entity}.types.ts` — Type tanımları
- [ ] `CRM.Web/src/config/service.paths.ts` — Service path'leri eklendi
- [ ] `CRM.Web/src/config/route.paths.ts` — Route path'leri eklendi
- [ ] `CRM.Web/src/services/{entity}.service.ts` — Service oluşturuldu
- [ ] `CRM.Web/src/stores/{entity}.store.ts` — Zustand store oluşturuldu
- [ ] `CRM.Web/src/routes/{entity}.routes.tsx` — Route dosyası oluşturuldu
- [ ] Ana router'a `{entity}Routes` eklendi
- [ ] `CRM.Web/src/pages/{entity}/{Entity}List.tsx` — Liste sayfası
- [ ] `CRM.Web/src/pages/{entity}/{Entity}Detail.tsx` — Detay sayfası

---

## Önemli Notlar

### EF Core Global Query Filter'ları

`ISoftDeleteEntity` ve `IOwnedEntity` uygulayan tüm entity'lere `DatabaseContext` üzerinden otomatik global query filter uygulanır. Hiçbir repository'de `IsDeleted == false` veya ownership filter'ı manuel yazmanıza gerek yoktur.

### Audit Alanları Otomatik Doldurulur

`IAuditableEntity` uygulayan entity'lerde `CreatedBy`, `CreatedAt`, `UpdatedBy`, `UpdatedAt` alanları `DbContext.SaveChangesAsync()` override'ı tarafından otomatik set edilir.

### Pagination Paterni

Repository'de `PageSize + 1` kayıt çekilir. Eğer gelen kayıt sayısı `PageSize`'dan fazlaysa son kayıt listeden çıkarılır ve `HasMore = true` döner. Frontend bu bilgiyi kullanarak "daha fazla yükle" butonu gösterir.

### Enum Dönüşümü

C# enum'ları `EnumToStringConverter<T>` ile veritabanında `VARCHAR` olarak saklanır. Frontend'de enum değerleri lowercase string olarak tanımlanır ve C# tarafındaki enum değer adlarıyla eşleşmelidir.
