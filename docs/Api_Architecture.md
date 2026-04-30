# API Architecture

> .NET tabanlı CRM API projesi için mimari rehberidir. Hedef: ekipteki herkesin "bu handler nereye gider, şu validation hangi katmanda çalışır, bu hata niye exception değil?" sorusunu aynı şekilde cevaplayabilmesi.

---

## 1. Felsefe

Bu proje **Clean Architecture** katman disiplinini, **CQRS + MediatR** request/response modeliyle birleştirir. Dört temel kural:

1. **Bağımlılık içe doğru akar.** `Api → Application → Domain ← Infrastructure`. Üst katman alt katmanı tanımaz, Domain hiçbir katmana bağımlı değildir.
2. **Command ve Query ayrıdır.** Yazma (Command) ve okuma (Query) path'leri farklı soyutlamalar kullanır. Bir handler tek bir niyet üstlenir.
3. **Result<T> > Exception.** İş kuralı ihlali exception değildir. Handler sonucunu `Result` olarak döner; yalnızca beklenmedik hatalar exception olur.
4. **Cross-cutting concern'ler pipeline'da.** Validation, logging, transaction, audit — hiçbirini handler tekrar etmez; `IPipelineBehavior` üzerinden zincirlenir.

---

## 2. Teknoloji Stack

- **.NET 10** (C# 13), ASP.NET Core
- **Entity Framework Core 10** + **Npgsql** (PostgreSQL)
- **MediatR** — request/response + pipeline
- **FluentValidation** — input validation
- **Mapster** — entity ↔ DTO mapping (compile-time friendly)
- **Serilog** — structured logging + Elasticsearch sink
- **JWT Bearer** — authentication, custom privilege-based authorization

---

## 3. Katman Yapısı ve Bağımlılık Yönü

```
CRM.Api  →  CRM.Application  →  CRM.Domain  ←  CRM.Infrastructure
```

| Katman | İmport edebildiği | Sorumluluk |
|---|---|---|
| `CRM.Api` | Application, Domain (tip için) | HTTP giriş noktası: controller, middleware, DI, Swagger, exception handler |
| `CRM.Application` | Domain | Use case'ler: Command/Query/Handler/Validator, Result, abstraction'lar |
| `CRM.Domain` | — (hiçbir proje) | Entity'ler, enum'lar, privilege kodları, marker interface'ler |
| `CRM.Infrastructure` | Application, Domain | EF, repository implementasyonları, dış servisler (JWT, Graph, cache) |

### Yasaklar

- `CRM.Api` → `CRM.Infrastructure` importu **yasak** (DbContext dahil). Infrastructure sadece DI kompozisyon kökünden bağlanır.
- `CRM.Application` → `CRM.Infrastructure` tip importu **yasak**. Application interface tanımlar, Infrastructure implement eder.
- `CRM.Domain` → başka hiçbir proje. Dış paket bağımlılığı yok.
- Controller'da DbContext / repository doğrudan inject etmek **yasak**. Her şey `ISender.Send(request)` üzerinden gider.
- Handler içinde `throw new BusinessException(...)` **yasak**. İş kuralı ihlali `Result.Failure(...)` ile döner.
- Query handler'da repository kullanmak **yasak**. Read path `IApplicationDbContext` + projection ile çalışır.

---

## 4. CQRS Pattern — KRİTİK

### 4.1 Marker Interface'ler

Application'da iki temel marker:

```csharp
// CRM.Application/Common/Abstractions/ICommand.cs
public interface ICommand<TResponse> : IRequest<Result<TResponse>> { }
public interface ICommand : IRequest<Result> { }

// CRM.Application/Common/Abstractions/IQuery.cs
public interface IQuery<TResponse> : IRequest<Result<TResponse>> { }
```

Fark neden önemli: `TransactionBehavior` sadece `ICommand` implementasyonlarını sarar. `IQuery` okuma olduğu için transaction açılmaz. Bu ayrım olmadan tüm request'ler gereksiz transaction içine girer.

### 4.2 Feature Klasör Şablonu

```
CRM.Application/Features/<Entity>/
├── Commands/
│   └── <Action>/
│       ├── <Action>Command.cs       # record, ICommand<T>
│       ├── <Action>Handler.cs       # IRequestHandler
│       └── <Action>Validator.cs     # AbstractValidator<Command>
├── Queries/
│   └── <Action>/
│       ├── <Action>Query.cs         # record, IQuery<T>
│       └── <Action>Handler.cs
└── Dtos/
    ├── <Entity>DetailItem.cs
    ├── <Entity>ListItem.cs
    └── <Entity>ListFilters.cs
```

### 4.3 Örnek — CreateAccount

**Command** (record — immutable, equality built-in):

```csharp
// Features/Accounts/Commands/CreateAccount/CreateAccountCommand.cs
public sealed record CreateAccountCommand(
    string Name,
    string? AccountNumber,
    string? Website,
    AccountStatus Status
) : ICommand<AccountDetailItem>;
```

**Validator** (input validation — state-less):

```csharp
// Features/Accounts/Commands/CreateAccount/CreateAccountValidator.cs
public sealed class CreateAccountValidator : AbstractValidator<CreateAccountCommand>
{
    public CreateAccountValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.AccountNumber).MaximumLength(50);
        RuleFor(x => x.Website).MaximumLength(500)
            .Must(BeValidUrl).When(x => !string.IsNullOrEmpty(x.Website));
    }

    private static bool BeValidUrl(string? url) =>
        Uri.TryCreate(url, UriKind.Absolute, out _);
}
```

**Handler** (write path — repository + UnitOfWork):

```csharp
// Features/Accounts/Commands/CreateAccount/CreateAccountHandler.cs
public sealed class CreateAccountHandler
    : IRequestHandler<CreateAccountCommand, Result<AccountDetailItem>>
{
    private readonly IAccountRepository _repo;

    public CreateAccountHandler(IAccountRepository repo) => _repo = repo;

    public async Task<Result<AccountDetailItem>> Handle(
        CreateAccountCommand cmd, CancellationToken ct)
    {
        // Business rule (DB state gerektirir — FluentValidation'a giremez)
        if (await _repo.ExistsByNameAsync(cmd.Name, ct))
            return AccountErrors.DuplicateName;

        var entity = cmd.Adapt<Account>();
        await _repo.CreateAsync(entity, ct);

        // SaveChanges / Commit — TransactionBehavior tarafından yapılır
        return entity.Adapt<AccountDetailItem>();
    }
}
```

Handler `try-catch-rollback` yazmaz, `SaveChangesAsync` çağırmaz, log yazmaz. Hepsi pipeline'da.

### 4.4 Örnek — ListAccounts (Query)

Query handler repository değil, `IApplicationDbContext` kullanır. Mapster `.ProjectToType<T>()` ile DTO'ya doğrudan SQL projection — tüm entity hydrate edilmez.

```csharp
public sealed record ListAccountsQuery(
    AccountListFilters Filters,
    PaginationInfo Pagination
) : IQuery<PaginationResult<AccountListItem>>;

public sealed class ListAccountsHandler
    : IRequestHandler<ListAccountsQuery, Result<PaginationResult<AccountListItem>>>
{
    private readonly IApplicationDbContext _ctx;

    public ListAccountsHandler(IApplicationDbContext ctx) => _ctx = ctx;

    public async Task<Result<PaginationResult<AccountListItem>>> Handle(
        ListAccountsQuery q, CancellationToken ct)
    {
        var query = _ctx.Account.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(q.Filters.Name))
            query = query.Where(a => EF.Functions.ILike(a.Name, $"%{q.Filters.Name}%"));
        if (q.Filters.Status is { } status)
            query = query.Where(a => a.AccountStatus == status);

        var skip = Math.Max(q.Pagination.Page - 1, 0) * q.Pagination.PageSize;
        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip(skip).Take(q.Pagination.PageSize + 1)
            .ProjectToType<AccountListItem>()
            .ToListAsync(ct);

        var hasMore = items.Count > q.Pagination.PageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PaginationResult<AccountListItem>
        {
            Data = items, HasMore = hasMore,
            Page = q.Pagination.Page, PageSize = q.Pagination.PageSize,
        };
    }
}
```

---

## 5. Result<T> Pattern

Handler her durumda **aynı tip** döner: `Result` veya `Result<T>`. Başarı ve başarısızlık farklı exception path'i değil, aynı return path'te gelir.

```csharp
// CRM.Application/Common/Results/Result.cs
public class Result
{
    public bool IsSuccess { get; }
    public Error Error { get; }
    public bool IsFailure => !IsSuccess;

    protected Result(bool isSuccess, Error error) { IsSuccess = isSuccess; Error = error; }

    public static Result Success() => new(true, Error.None);
    public static Result Failure(Error error) => new(false, error);
    public static Result<T> Success<T>(T value) => new(value, true, Error.None);
    public static Result<T> Failure<T>(Error error) => new(default!, false, error);
}

public sealed class Result<T> : Result
{
    public T Value { get; }
    internal Result(T value, bool isSuccess, Error error) : base(isSuccess, error) => Value = value;

    public static implicit operator Result<T>(T value) => Success(value);
    public static implicit operator Result<T>(Error error) => Failure<T>(error);
}
```

**Error** (hata ile birlikte makine okunur kod):

```csharp
public sealed record Error(string Code, string Message, ErrorType Type)
{
    public static readonly Error None = new(string.Empty, string.Empty, ErrorType.Failure);
}

public enum ErrorType
{
    Validation,    // 400 — input format
    NotFound,      // 404
    Conflict,      // 409 — business rule ihlali
    Unauthorized,  // 401/403
    Failure        // 500
}
```

**Entity-spesifik error sınıfları** (static, discoverable):

```csharp
// Features/Accounts/AccountErrors.cs
public static class AccountErrors
{
    public static readonly Error NotFound =
        new("Account.NotFound", "Firma bulunamadı.", ErrorType.NotFound);
    public static readonly Error DuplicateName =
        new("Account.DuplicateName", "Aynı isimde başka bir firma zaten var.", ErrorType.Conflict);
}

// Features/Opportunities/OpportunityErrors.cs
public static class OpportunityErrors
{
    public static readonly Error NotFound =
        new("Opportunity.NotFound", "Fırsat bulunamadı.", ErrorType.NotFound);
    public static readonly Error InvalidTotalAmount =
        new("Opportunity.InvalidTotalAmount", "Toplam tutar negatif olamaz.", ErrorType.Conflict);
    public static readonly Error ClosedNotEditable =
        new("Opportunity.ClosedNotEditable", "Kapalı fırsat üzerinde değişiklik yapılamaz.", ErrorType.Conflict);
}
```

**Implicit cast** sayesinde handler kodu temiz kalır:

```csharp
if (opp is null) return OpportunityErrors.NotFound;          // Error → Result<T>
return opp.Adapt<OpportunityDetailItem>();                   // T → Result<T>
```

### Altın kural — Exception ne zaman atılır?

- **İş kuralı ihlali** (domain durumu, business invariant, duplicate check, permission): `Result.Failure(...)` — throw etme.
- **Beklenmedik hata** (DB bağlantı hatası, null reference, konfigürasyon yanlış): exception — `ProblemDetailsExceptionHandler` yakalar.
- **Authorization** (JWT geçersiz, privilege yok): framework/attribute tarafından zaten 401/403 döner — handler'a uğramaz.

---

## 6. Pipeline Behaviors

MediatR her request'i handler'a ulaşmadan önce behavior zincirinden geçirir. DI kayıt sırası = çalışma sırası.

```
Logging → Validation → Transaction → Handler
```

### 6.1 LoggingBehavior

Her request için structured log + süre.

```csharp
public sealed class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;
    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger) => _logger = logger;

    public async Task<TResponse> Handle(
        TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var name = typeof(TRequest).Name;
        using var _ = LogContext.PushProperty("RequestName", name);

        var sw = Stopwatch.StartNew();
        try
        {
            var response = await next();
            _logger.LogInformation("{RequestName} tamamlandı ({DurationMs}ms)", name, sw.ElapsedMilliseconds);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "{RequestName} hata ({DurationMs}ms)", name, sw.ElapsedMilliseconds);
            throw;
        }
    }
}
```

### 6.2 ValidationBehavior

FluentValidation çalıştırır. Hata varsa **throw etmez** — `Result.Failure` döner. Böylece pipeline zinciri bozulmaz, controller aynı kodla cevap üretir.

```csharp
public sealed class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
    where TResponse : Result
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators) => _validators = validators;

    public async Task<TResponse> Handle(
        TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (!_validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);
        var failures = (await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, ct))))
            .SelectMany(r => r.Errors).Where(f => f is not null).ToList();

        if (failures.Count == 0) return await next();

        // Result / Result<T> için reflection ile Failure üret
        var error = new ValidationError(failures);
        return ResultFactory.Failure<TResponse>(error);
    }
}
```

### 6.3 TransactionBehavior

Sadece `ICommand` implementasyonlarını sarar. Handler success döndüyse commit, başarısızsa rollback. Exception oluşursa rollback + rethrow.

```csharp
public sealed class TransactionBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : ICommand<TResponse> // veya ICommand
    where TResponse : Result
{
    private readonly IUnitOfWork _uow;
    public TransactionBehavior(IUnitOfWork uow) => _uow = uow;

    public async Task<TResponse> Handle(
        TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        await _uow.BeginTransactionAsync(ct);
        try
        {
            var response = await next();
            if (response.IsSuccess) await _uow.CommitTransactionAsync(ct);
            else                    await _uow.RollbackTransactionAsync(ct);
            return response;
        }
        catch
        {
            await _uow.RollbackTransactionAsync(ct);
            throw;
        }
    }
}
```

### 6.4 DI Kaydı

```csharp
// CRM.Application/DependencyInjection.cs
services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(ApplicationAssemblyMarker).Assembly);
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));      // 1
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));   // 2
    cfg.AddOpenBehavior(typeof(TransactionBehavior<,>));  // 3
});
services.AddValidatorsFromAssembly(typeof(ApplicationAssemblyMarker).Assembly);
```

---

## 7. Validation Stratejisi — KRİTİK

Validation tek bir yerde değil, **katmanlı** yapılır. Her katman farklı bir soruya cevap verir:

| Soru | Katman | Araç | Örnek |
|---|---|---|---|
| İstek şekli doğru mu? | **Input validation** | FluentValidation (ValidationBehavior) | `Name` boş değil, `Email` format, `Page >= 1` |
| Veritabanı durumu buna izin veriyor mu? | **Business rule** | Handler içinde `Result.Failure` | Aynı isimde firma var mı, kredi limiti aşıldı mı |
| Entity kendi tutarlılığını koruyor mu? | **Domain invariant** | Entity metodu + Result | `Opportunity.Recalculate()`, `Lead.Convert()` |
| Birden çok entity'yi ilgilendiren kural? | **Domain service** | ileride (şimdilik gerekmez) | "Açık fırsatı olan kontağı silemezsin" |

### 7.1 Input validation — FluentValidation

State-less. Request payload'ı tek başına kontrol edilir, DB'ye bakılmaz.

```csharp
public sealed class UpdateOpportunityValidator : AbstractValidator<UpdateOpportunityCommand>
{
    public UpdateOpportunityValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Lines).NotEmpty();
        RuleForEach(x => x.Lines).ChildRules(l =>
        {
            l.RuleFor(x => x.ProductId).NotEmpty();
            l.RuleFor(x => x.Quantity).GreaterThan(0);
            l.RuleFor(x => x.UnitPrice).GreaterThanOrEqualTo(0);
        });
    }
}
```

**Yasak:** FluentValidation validator içinde DB sorgusu (`MustAsync` + repository). O kural business rule — handler'a bırakılır.

### 7.2 Business rule — Handler + Result

State/DB gerektirir. Handler pipeline'dan geçtikten sonra çalışır.

```csharp
public async Task<Result<OpportunityDetailItem>> Handle(
    UpdateOpportunityCommand cmd, CancellationToken ct)
{
    var opp = await _ctx.Opportunity
        .Include(o => o.Lines)
        .FirstOrDefaultAsync(o => o.Id == cmd.Id, ct);
    if (opp is null) return OpportunityErrors.NotFound;

    // Business rule: kapalı fırsat değiştirilemez
    if (opp.Stage == OpportunityStage.Closed)
        return OpportunityErrors.ClosedNotEditable;

    cmd.Adapt(opp);
    var total = opp.Lines.Sum(l => l.UnitPrice * l.Quantity);
    if (total < 0) return OpportunityErrors.InvalidTotalAmount;
    opp.TotalAmount = total;

    return opp.Adapt<OpportunityDetailItem>();
}
```

### 7.3 Domain invariant — Entity metodu

Karmaşık kurallar entity içine taşınır; entity tutarlılığı kendi sorumluluğu olur.

```csharp
// CRM.Domain/Entities/Opportunities/Opportunity.cs
public class Opportunity : IBaseEntity, /* ... */
{
    public Result Recalculate()
    {
        var total = Lines.Sum(l => l.UnitPrice * l.Quantity);
        if (total < 0) return OpportunityErrors.InvalidTotalAmount;
        TotalAmount = total;
        return Result.Success();
    }
}
```

> Not: `OpportunityErrors` şu an Application'da. Entity'lerden kullanılması halinde `Domain/Errors/` altına taşınır. Şu an kapsam dışı.

---

## 8. IApplicationDbContext Abstraction

Query handler'ların Infrastructure'a bağımlı olmaması için Application'da interface tanımlanır, Infrastructure implement eder. Bu sayede:

- Clean Architecture bağımlılık yönü bozulmaz.
- Handler test edilebilir (in-memory context ile).
- Repository bloat'ı olmaz (her query için yeni metod açmaya gerek yok).

```csharp
// CRM.Application/Common/Abstractions/IApplicationDbContext.cs
public interface IApplicationDbContext
{
    DbSet<Account> Account { get; }
    DbSet<Contact> Contact { get; }
    DbSet<Lead> Leads { get; }
    DbSet<Opportunity> Opportunity { get; }
    DbSet<Activity> Activities { get; }
    DbSet<Product> Products { get; }
    // ...

    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
```

Infrastructure:

```csharp
// CRM.Infrastructure/Data/DatabaseContext.cs
public class DatabaseContext : DbContext, IApplicationDbContext
{
    // Mevcut DbSet'ler zaten interface'i karşılar.
}
```

DI:

```csharp
services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<DatabaseContext>());
```

### Command ve Query'de kullanım

| Path | Kullanılır | Neden |
|---|---|---|
| **Query handler** | `IApplicationDbContext` + `.ProjectToType<T>()` | SQL projection, read-only, repository gereksiz |
| **Command handler** | `IEntityRepository<T>` + `IUnitOfWork` | Yazma path'i, aggregate tutarlılığı, transaction |

---

## 9. Mapping (Mapster)

Manuel `.ToModal()` / `.UpdateFrom(...)` yazımı bırakılır. Tek noktada config tanımlanır, Mapster runtime'da IL üretir.

```csharp
// CRM.Application/Mapping/MappingConfig.cs
public static class MappingConfig
{
    public static void Register(TypeAdapterConfig config)
    {
        // Varsayılan: aynı isimli property'ler otomatik map'lenir.

        // Account: koleksiyon sync (email/phone/address mevcut entity'leri korur)
        config.NewConfig<AccountDetailItem, Account>()
            .AfterMapping((dto, entity) =>
            {
                SyncCollection(dto.Emails, entity.Emails, (d, e) => e.Value = d.Value);
                SyncCollection(dto.Phones, entity.Phones, (d, e) => e.Value = d.Value);
                SyncCollection(dto.Addresses, entity.Addresses, MapAddress);
            });

        // ListItem — custom projection (navigation property flatten)
        config.NewConfig<Account, AccountListItem>()
            .Map(d => d.OwnerName, s => s.Owner.DisplayName);
    }
}
```

Handler'da kullanım:

```csharp
var entity = cmd.Adapt<Account>();                          // Command → Entity
cmd.Adapt(existingEntity);                                   // in-place update
return entity.Adapt<AccountDetailItem>();                    // Entity → DTO
query.ProjectToType<AccountListItem>().ToListAsync();        // EF projection (SQL seviyesinde)
```

### Yasak

- Controller veya repository içinde manuel mapping kodu yazmak. Mapping sadece `MappingConfig.cs` + `.Adapt<T>()` ile yapılır.
- Handler içinde el ile property set etmek (`dto.Name = entity.Name; dto.Id = entity.Id; ...`).

---

## 10. Controller Pattern

Controller **tek sorumluluğa** sahiptir: HTTP request'i MediatR request'ine çevir, sonucu HTTP cevabına dönüştür.

```csharp
[ApiController]
[Route("api/account")]
public sealed class AccountController : ControllerBase
{
    private readonly ISender _sender;
    public AccountController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListAccountsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult();

    [HttpPost("get")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetAccountQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult();

    [HttpPost("create")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAccountCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult();

    // ... update, delete, set-state, bulk-update-status, assign, search
}
```

### Adlandırma kuralları

| Öğe | Kural | Örnek |
|---|---|---|
| Controller | `<Entity>Controller` (singular) | `AccountController`, route `api/account` |
| Method | `<Action>Async` | `ListAsync`, `GetAsync`, `CreateAsync`, `UpdateAsync`, `DeleteAsync`, `SetStateAsync`, `SearchAsync`, `BulkUpdateStatusAsync`, `AssignAsync` |
| Route | lowercase kebab-case | `list`, `get`, `create`, `update`, `delete`, `set-state`, `bulk-update-status`, `assign`, `search` |
| HTTP verb | Hepsi **POST** | (REST fiillerine geçiş ayrı karar — şu an kapsam dışı) |
| Privilege | `[PrivilegeAuthorize(...)]` her method'ta | okuma için `Read`, diğerleri için ilgili kod |

### Result → IActionResult

```csharp
// CRM.Api/Extensions/ResultExtensions.cs
public static class ResultExtensions
{
    public static IActionResult ToActionResult<T>(this Result<T> result)
        => result.IsSuccess
            ? new OkObjectResult(result.Value)
            : ToProblem(result.Error);

    public static IActionResult ToActionResult(this Result result)
        => result.IsSuccess
            ? new OkResult()
            : ToProblem(result.Error);

    private static IActionResult ToProblem(Error error) => error.Type switch
    {
        ErrorType.Validation   => new ObjectResult(BuildProblem(error, 400)) { StatusCode = 400 },
        ErrorType.NotFound     => new ObjectResult(BuildProblem(error, 404)) { StatusCode = 404 },
        ErrorType.Conflict     => new ObjectResult(BuildProblem(error, 409)) { StatusCode = 409 },
        ErrorType.Unauthorized => new ObjectResult(BuildProblem(error, 403)) { StatusCode = 403 },
        _                       => new ObjectResult(BuildProblem(error, 500)) { StatusCode = 500 },
    };
    // BuildProblem → RFC 7807 ProblemDetails
}
```

---

## 11. Authorization

JWT + custom **privilege-based** attribute. ASP.NET Core `[Authorize]` kullanılmaz; her endpoint için `[PrivilegeAuthorize(code)]` ile açık koda bağlanır.

```csharp
[HttpPost("delete")]
[PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Delete)]
public async Task<IActionResult> DeleteAsync([FromBody] DeleteAccountsCommand cmd, CancellationToken ct)
    => (await _sender.Send(cmd, ct)).ToActionResult();
```

- JWT `OnTokenValidated` sırasında `IContextUser` singleton'a (UserId, OrganizationId, Privileges) set edilir.
- `PrivilegeAuthorizationHandler` endpoint metadata'daki kodu context'teki privilege listesiyle karşılaştırır.
- Handler içinde `IContextUser` / `IContextAuthorization` inject edilerek "mevcut kullanıcı kim, org'u ne" sorgulanabilir. DbContext global query filter'ı ayrıca tenant isolation uygular.

---

## 12. Error Handling — ProblemDetails (RFC 7807)

Tüm hata cevapları RFC 7807 ProblemDetails formatındadır.

```json
{
  "type": "https://crm.local/errors/Account.DuplicateName",
  "title": "Business rule ihlali",
  "status": 409,
  "detail": "Aynı isimde başka bir firma zaten var.",
  "instance": "/api/account/create",
  "traceId": "00-...-01",
  "code": "Account.DuplicateName"
}
```

Validation hataları `ValidationProblemDetails` (`errors` sözlüğü ile):

```json
{
  "type": "https://crm.local/errors/Validation",
  "title": "İstek geçersiz",
  "status": 400,
  "errors": {
    "Name": ["Name is required."],
    "Lines[0].Quantity": ["Quantity must be greater than 0."]
  },
  "traceId": "00-...-01"
}
```

### Gerçek exception'lar (bug/infrastructure)

`IExceptionHandler` implementasyonu yakalar, 500 ProblemDetails üretir. `Result.Failure` için bu path'e girilmez — oraya sadece `NullReferenceException`, `DbUpdateException`, vs. düşer.

```csharp
public sealed class ProblemDetailsExceptionHandler : IExceptionHandler
{
    // loglama + 500 ProblemDetails response
}

// Program.cs
services.AddProblemDetails();
services.AddExceptionHandler<ProblemDetailsExceptionHandler>();
app.UseExceptionHandler();
```

---

## 13. Logging & Correlation

Mevcut altyapı korunur ve pipeline ile zenginleştirilir.

**Middleware zinciri** (Program.cs):

```
CorrelationIdMiddleware  →  Authentication  →  LoggingMiddleware  →  ExceptionHandler  →  Authorization  →  Endpoint
```

- `CorrelationIdMiddleware`: `X-Correlation-Id` header'ı üretir/yansıtır; `LogContext`'e push eder.
- `LoggingMiddleware`: HTTP düzeyinde request/response loglar (method, path, status, durationMs).
- `LoggingBehavior` (pipeline): Her MediatR request için `RequestName` + handler süresi.
- Serilog sinks: Console (template'te CorrelationId, UserId, HttpMethod, StatusCode, DurationMs), File (günlük, 31 gün), Elasticsearch.

Her log satırında otomatik property'ler: `CorrelationId`, `UserId`, `OrganizationId`, `RequestName`, `DurationMs`, `HttpMethod`, `Path`, `StatusCode`.

---

## 14. DbContext Davranışları

Mevcut davranışlar korunur; refactor kapsamında **değiştirilmez**. Handler'lar bu davranışları implicit olarak kullanır.

### 14.1 Global Query Filters

`DatabaseContext.OnModelCreating` iki filter uygular (entity'nin interface'ine göre):

- **SoftDelete:** `ISoftDeleteEntity` için `e => !e.IsDeleted`.
- **Ownership:** `IOwnedEntity` için `AccessLevel`'a göre `e.OwnerId == currentUserId` veya `e.OrganizationId == currentOrgId`.

Query handler `IApplicationDbContext.Accounts.Where(...)` çağırdığında bu filter'lar otomatik uygulanır.

### 14.2 SaveChanges Override

`ApplySaveRules`:
- `IAuditableEntity` → `CreatedBy/At`, `UpdatedBy/At` set edilir.
- `ISoftDeleteEntity` → `EntityState.Deleted` yakalanır, `IsDeleted = true` olarak işaretlenir (fiziksel silme yok).
- `IOwnedEntity` → yazma sırasında mevcut kullanıcının erişim seviyesi doğrulanır; yetkisizse `UnauthorizedAccessException`.

### 14.3 Marker Interface Tablosu

Detay: `NewDevelopmentGuide.md` ADIM 2. Bu tablo kısa referans içindir.

| Interface | Namespace | Tetiklediği davranış |
|---|---|---|
| `IBaseEntity` | `CRM.Domain.Entities.Common` | `Id`, `IsActive` — kimlik ve aktiflik |
| `IAuditableEntity` | `CRM.Domain.Entities.Common` | `CreatedBy/At`, `UpdatedBy/At` — SaveChanges'te auto-fill |
| `ISoftDeleteEntity` | `CRM.Domain.Entities.Common` | Query filter `IsDeleted = false`; delete fiziksel değil mantıksal |
| `IOwnedEntity` | `CRM.Domain.Entities.Common` | Multi-tenant query filter + yazma guard |

### 14.4 Handler'dan bakış

Handler bu mekanizmaları hissetmez; yazarken:
- **Delete** çağrıldığında entity `ISoftDeleteEntity` ise fiziksel silinmez, sadece işaretlenir. Query'lerde görünmez.
- **Audit alanları** (`CreatedBy`, `UpdatedAt`, …) DTO'dan set edilmez. Mapster config'inde bu alanlar ignore edilir:
  ```csharp
  config.NewConfig<UpdateAccountCommand, Account>()
      .Ignore(dest => dest.CreatedBy, dest => dest.CreatedAt, dest => dest.UpdatedBy, dest => dest.UpdatedAt);
  ```
- **Cross-org leak** olmaz: query handler listesi filter uyguladığı için tenant boundary ihlal edilemez.

---

## 15. Feature Şablonu

Yeni bir feature eklerken birebir bu yapıyı uygula:

```
CRM.Application/Features/<Entity>/
├── Commands/
│   ├── Create<Entity>/
│   │   ├── Create<Entity>Command.cs
│   │   ├── Create<Entity>Handler.cs
│   │   └── Create<Entity>Validator.cs
│   ├── Update<Entity>/
│   │   ├── Update<Entity>Command.cs
│   │   ├── Update<Entity>Handler.cs
│   │   └── Update<Entity>Validator.cs
│   ├── Delete<Entity>/
│   ├── SetState<Entity>/
│   ├── Assign<Entity>/
│   └── BulkUpdateStatus<Entity>/
├── Queries/
│   ├── Get<Entity>/
│   │   ├── Get<Entity>Query.cs
│   │   └── Get<Entity>Handler.cs
│   ├── List<Entity>s/
│   │   ├── List<Entity>sQuery.cs
│   │   └── List<Entity>sHandler.cs
│   └── Search<Entity>s/
├── Dtos/
│   ├── <Entity>DetailItem.cs
│   ├── <Entity>ListItem.cs
│   └── <Entity>ListFilters.cs
└── <Entity>Errors.cs
```

---

## 16. Adlandırma Kuralları

| Öğe | Format | Örnek |
|---|---|---|
| Command class | `<Action><Entity>Command` | `CreateAccountCommand`, `BulkUpdateStatusAccountCommand` |
| Query class | `<Action><Entity>Query` | `GetAccountQuery`, `ListAccountsQuery` |
| Handler | `<Action><Entity>Handler` | `CreateAccountHandler` |
| Validator | `<Action><Entity>Validator` | `CreateAccountValidator` |
| DTO | `<Entity>DetailItem`, `<Entity>ListItem`, `<Entity>ListFilters` | `AccountDetailItem` |
| Error sınıfı | `<Entity>Errors` (static) | `AccountErrors.DuplicateName` |
| Error kodu | `<Entity>.<Reason>` | `"Account.DuplicateName"` |
| Repository | `I<Entity>Repository` / `<Entity>Repository` | `IAccountRepository` |
| Controller | `<Entity>Controller` (singular) | `AccountController` |
| Route base | `api/<entity>` kebab-case | `api/account` |
| Action route | kebab-case | `set-state`, `bulk-update-status` |
| Privilege code | `<Entity>.<Operation>` | `"Account.Create"` |
| Namespace | `CRM.Application.Features.<Entity>s.<Commands/Queries>.<Action>` | `CRM.Application.Features.Accounts.Commands.CreateAccount` |

---

## 17. Kaçınılması Gerekenler

- **Handler içinde exception throw** — `Result.Failure(...)` kullan. Exception sadece beklenmedik hatalar için.
- **Query handler'da repository kullanmak** — `IApplicationDbContext` + projection kullan. Repository write path için.
- **Command handler'da `SaveChangesAsync` çağırmak** — TransactionBehavior yapar. Handler sadece mutation yapar.
- **Controller'da iş mantığı** — Tek görevi `_sender.Send(...).ToActionResult()`.
- **Controller'da DbContext / repository inject etmek** — Sadece `ISender`.
- **DbContext'i Application'dan direkt kullanmak** — `IApplicationDbContext` abstraction üzerinden.
- **Manuel mapping kodu yazmak** — Mapster + MappingConfig. DTO property'sini tek tek set etme.
- **FluentValidation'da DB sorgulayan kural (`MustAsync` + repo)** — O bir business rule, handler'a bırak.
- **Tek handler'da birden çok aggregate'e yazmak** — Command sınırı aggregate sınırıdır. Gerekirse command'ı böl ya da domain event (ileride).
- **MediatR pipeline'ı bypass etmek** — Controller'dan doğrudan handler çağırma, DI'dan `CreateAccountHandler` inject etme. Hep `ISender`.
- **Inline query key / magic string** — Privilege code, error code, route adı → sabit olarak tanımlı.
- **Yarım async** — Her handler `CancellationToken` alır ve ileri geçirir. Asenkron metotta `.Result` / `.Wait()` kullanma.
- **`throw new Exception(...)`** — Generic exception atma; ya `Result.Failure` ya da anlamlı bir exception türü.
- **`ProblemDetails` yerine custom envelope** — Yeni endpoint'ler de dahil her cevap RFC 7807 formatında.

---

## 18. Claude İçin Çalışma Talimatları

Yeni bir endpoint / feature eklerken sırayla:

1. **Önce Command mı Query mi belirle.** Yazma → Command, okuma → Query. İkisi aynı class olmaz.
2. **Klasörü aç.** `Features/<Entity>/Commands/<Action>/` veya `Features/<Entity>/Queries/<Action>/`.
3. **Record olarak Command/Query yaz.** İlgili `ICommand<T>` / `IQuery<T>` marker'ı uygula.
4. **Validator yaz** (eğer input validation gerekiyorsa). DB'ye bakan kural varsa validator'a koyma — handler'a koy.
5. **Handler yaz.**
   - Command → repository + UnitOfWork (transaction pipeline halleder).
   - Query → `IApplicationDbContext` + `.ProjectToType<T>()`.
6. **Business rule'ları `Result.Failure(<Entity>Errors.<Reason>)` ile ifade et.** Yeni error code `<Entity>Errors` sınıfına eklenir.
7. **Mapping için Mapster.** El ile mapping yazma; `MappingConfig.cs` içinde özel kural tanımla.
8. **Controller method'unu ekle.** `[PrivilegeAuthorize(...)]` + tek satır `(await _sender.Send(...)).ToActionResult()`.
9. **Privilege kodu var mı kontrol et.** Yoksa `CRM.Domain/Authorization/PrivilegeCodes.cs` içinde `<Entity>PrivilegeCodes` altına ekle.
10. **Test et.** Success path, validation failure (400), business rule failure (409/404), authorization failure (403). Log'da `RequestName`, `DurationMs`, `CorrelationId` görünür olmalı.

Belirsizlikte sor:
- Bu bir input validation mı yoksa business rule mi?
- Bu command yeni aggregate mi yazıyor, yoksa mevcutunu mu güncelliyor?
- Bu query write path'e ihtiyaç duyuyor mu (o zaman command'a çevir) yoksa sadece okuyor mu?
- `Result.Failure` için uygun `ErrorType` hangisi (Validation / NotFound / Conflict / Unauthorized / Failure)?
