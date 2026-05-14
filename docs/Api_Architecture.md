# API Architecture

> PlatformSuite monorepo'sundaki çoklu uygulama (Platform + Crm + CodePro) backend mimarisinin rehberidir. Hedef: ekipteki herkesin "bu handler nereye gider, şu validation hangi katmanda çalışır, bu hata niye exception değil?" sorusunu aynı şekilde cevaplayabilmesi.

---

## 1. Felsefe

Bu proje **Clean Architecture** katman disiplinini, **CQRS + MediatR** request/response modeliyle birleştirir. Çoklu uygulama (CRM, CodePro, gelecek app'ler) **Platform** kütüphanesini paylaşır; her app kendi Domain/Application/Infrastructure/Api katmanlarını ekler. Beş temel kural:

1. **Bağımlılık içe doğru akar.** `<App>.Api → <App>.Application → <App>.Domain ← <App>.Infrastructure`. Üst katman alt katmanı tanımaz, Domain hiçbir katmana bağımlı değildir.
2. **Platform paylaşılır, app'ler izole.** Birden fazla app'te aynı semantikle yer alan kavram (Identity, Activity, Attachment) Platform'da; tek app'in iş kavramı (Account → CRM, Supplier → CodePro) o app'in Domain'inde. **Cross-app domain importu yasak**.
3. **Command ve Query ayrıdır.** Yazma (Command) ve okuma (Query) path'leri farklı soyutlamalar kullanır. Bir handler tek bir niyet üstlenir.
4. **Result<T> > Exception.** İş kuralı ihlali exception değildir. Handler sonucunu `Result` olarak döner; yalnızca beklenmedik hatalar exception olur.
5. **Cross-cutting concern'ler pipeline'da.** Validation, logging, transaction, audit — hiçbirini handler tekrar etmez; `IPipelineBehavior` üzerinden zincirlenir.

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

## 3. Repo ve Katman Yapısı

```
PlatformSuite/
├── Platform/
│   ├── Platform.Domain/        # Identity, Activity, Attachment, common interfaces
│   ├── Platform.Application/   # Activity feature'ları, IApplicationDbContext, IEntityReferenceResolver
│   ├── Platform.Infrastructure/# PlatformDbContext (abstract), referans/identity repository'leri
│   └── Platform.Api/           # Host orkestrasyonu (AddPlatformApi<TDbContext>)
└── Apps/
    ├── Crm/
    │   ├── Crm.Domain/         # Account, Contact, Lead, Opportunity
    │   ├── Crm.Application/    # CRM feature'ları, ICrmDbContext
    │   ├── Crm.Infrastructure/ # CrmDbContext, CRM repository'leri/resolver'ları
    │   └── Crm.Api/            # CRM controller'ları
    └── CodePro/
        ├── CodePro.Domain/     # Supplier, PurchaseOrder, Budget, ...
        ├── CodePro.Application/# CodePro feature'ları, ICodeProDbContext
        ├── CodePro.Infrastructure/
        └── CodePro.Api/
```

### 3.1 Bağımlılık Yönü

```
Platform.Api ──→ Platform.Application ──→ Platform.Domain ←── Platform.Infrastructure
     ▲                  ▲                       ▲                       ▲
     │                  │                       │                       │
<App>.Api ──→ <App>.Application ──→ <App>.Domain ←── <App>.Infrastructure
```

| Katman | İmport edebildiği | Sorumluluk |
|---|---|---|
| `Platform.Api` | Platform.Application, Platform.Domain | Host orkestrasyonu (`AddPlatformApi<TDbContext>`, pipeline middleware), platform-seviyesi controller'lar (Auth, User, Activity, Attachment, AppRole, AppOrganization, Audit) |
| `Platform.Application` | Platform.Domain | Platform-merkezli use case'ler, `IApplicationDbContext`, `IEntityReferenceResolver` registry interface'leri, MappingConfig (User/Org/Role/Attachment) |
| `Platform.Domain` | — (hiçbir proje) | Identity, Activity, Attachment entity'leri; ortak marker interface'ler (`IBaseEntity`, `IAuditableEntity`, `IOwnedEntity`, `ISoftDeleteEntity`); Platform PrivilegeCodes |
| `Platform.Infrastructure` | Platform.Application, Platform.Domain | Abstract `PlatformDbContext`, EF behavior (audit/soft-delete/owner filter), Activity/User/Org/Role/Attachment repository'leri, `EntityReferenceResolverRegistry`, `UserReferenceResolver` |
| `<App>.Api` | Platform.Api, <App>.Application, <App>.Domain | App'e özgü controller'lar (AccountController, SupplierController, ...). Program.cs `AddPlatformApi<<App>DbContext>` çağırır + `Add<App>Application` + `Add<App>Infrastructure` |
| `<App>.Application` | Platform.Application, <App>.Domain | App-spesifik use case'ler, `I<App>DbContext`, `<App>MappingConfig`, app-spesifik repository interface'leri |
| `<App>.Domain` | Platform.Domain | App'in domain entity'leri ve enum'ları, app PrivilegeCodes |
| `<App>.Infrastructure` | Platform.Infrastructure, <App>.Application, <App>.Domain | `<App>DbContext : PlatformDbContext, I<App>DbContext`, app repository'leri ve `<Entity>ReferenceResolver`'ları |

### 3.2 Yasaklar

- `<App>.Api` → `<App>.Infrastructure` veya `Platform.Infrastructure` importu **yasak** (DbContext dahil). Infrastructure sadece DI kompozisyon kökünden bağlanır (Program.cs).
- `<App>.Application` → herhangi bir Infrastructure tip importu **yasak**. Application interface tanımlar, Infrastructure implement eder.
- `Platform.Domain` ve `<App>.Domain` → başka hiçbir proje. Dış paket bağımlılığı yok.
- **Cross-app domain importu yasak**: `CodePro.Domain` `Crm.Domain.Entities.Accounts.Account`'ı import edemez. CRM Account'a CodePro'dan referans gerekiyorsa polimorfik `EntityReference` (string EntityType + Guid Id) kullanılır; resolver registry üzerinden çözülür.
- Controller'da DbContext / repository doğrudan inject etmek **yasak**. Her şey `ISender.Send(request)` üzerinden gider.
- Handler içinde `throw new BusinessException(...)` **yasak**. İş kuralı ihlali `Result.Failure(...)` ile döner.
- Query handler'da repository kullanmak **yasak**. Read path uygun DbContext interface'i (`IApplicationDbContext` / `ICrmDbContext` / `ICodeProDbContext`) + projection ile çalışır.

### 3.3 Host Kompozisyonu

Her app'in `Program.cs` aynı paterne uyar:

```csharp
// Apps/Crm/Crm.Api/Program.cs
var builder = WebApplication.CreateBuilder(...);

builder.Services
    .AddPlatformApi<CrmDbContext>(builder.Configuration)  // platform DI + DbContext bind
    .AddCrmApplication()                                    // CRM mapping + privilege register
    .AddCrmInfrastructure(builder.Configuration);           // CRM repos + resolver kayıtları

var app = builder.Build();
app.UsePlatformPipeline();
app.Run();
```

`AddPlatformApi<TDbContext>` (`Platform.Api/Configuration/HostBuilderExtensions.cs`):
- `TDbContext` (örn. `CrmDbContext`) DbContext olarak kayıt edilir.
- `PlatformDbContext` ve `IApplicationDbContext` aynı `TDbContext`'e forward edilir; repository ve query handler'lar concrete tipi bilmez.
- Platform-seviyesi DI: MediatR, mapping, validation, JWT, privilege auth, hosted services.

---

## 4. CQRS Pattern — KRİTİK

### 4.1 Marker Interface'ler

Platform.Application'da iki temel marker (her app aynı `ICommand`/`IQuery` arayüzlerini kullanır):

```csharp
// Platform.Application/Common/Abstractions/ICommand.cs
public interface ICommand<TResponse> : IRequest<Result<TResponse>> { }
public interface ICommand : IRequest<Result> { }

// Platform.Application/Common/Abstractions/IQuery.cs
public interface IQuery<TResponse> : IRequest<Result<TResponse>> { }
```

Fark neden önemli: `TransactionBehavior` sadece `ICommand` implementasyonlarını sarar. `IQuery` okuma olduğu için transaction açılmaz.

### 4.2 Feature Klasör Şablonu

```
<App>.Application/Features/<Entity>/
├── Commands/
│   └── <Action>/
│       ├── <Action>Command.cs       # record, ICommand<T>
│       ├── <Action>Handler.cs       # IRequestHandler
│       └── <Action>Validator.cs     # AbstractValidator<Command>
├── Queries/
│   └── <Action>/
│       ├── <Action>Query.cs         # record, IQuery<T>
│       └── <Action>Handler.cs
├── Dtos/
│   ├── <Entity>DetailItem.cs
│   ├── <Entity>ListItem.cs
│   └── <Entity>ListFilter.cs
├── <Entity>Errors.cs
└── <Entity>Mappings.cs
```

### 4.3 Örnek — CreateAccount (CRM)

**Command** (record — immutable, equality built-in):

```csharp
// Apps/Crm/Crm.Application/Features/Accounts/Commands/CreateAccount/CreateAccountCommand.cs
public sealed class CreateAccountCommand : ICommand<AccountDetailItem>
{
    public string AccountName { get; init; } = string.Empty;
    public AccountType AccountType { get; init; }
    public AccountStatus AccountStatus { get; init; } = AccountStatus.Prospect;
    public string? Industry { get; init; }
    // ...
}
```

**Validator** (input validation — state-less):

```csharp
public sealed class CreateAccountValidator : AbstractValidator<CreateAccountCommand>
{
    public CreateAccountValidator()
    {
        RuleFor(x => x.AccountName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.AccountType).IsInEnum();
        RuleFor(x => x.AccountStatus).IsInEnum();
    }
}
```

**Handler** (write path — repository + Mapster):

```csharp
public sealed class CreateAccountHandler
    : IRequestHandler<CreateAccountCommand, Result<AccountDetailItem>>
{
    private readonly IAccountRepository _repository;
    private readonly ICrmDbContext _db;

    public CreateAccountHandler(IAccountRepository repository, ICrmDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<AccountDetailItem>> Handle(
        CreateAccountCommand cmd, CancellationToken ct)
    {
        var entity = cmd.Adapt<Account>();
        await _repository.CreateAsync(entity, ct);
        return await BuildDetailAsync(entity.Id, ct);
    }

    // ...
}
```

Handler `try-catch-rollback` yazmaz, `SaveChangesAsync` çağırmaz, log yazmaz. Hepsi pipeline'da.

### 4.4 Örnek — ListSuppliers (CodePro Query)

Query handler repository değil, app-spesifik DbContext interface'ini kullanır. Mapster `.ProjectToType<T>()` ile DTO'ya doğrudan SQL projection.

```csharp
// Apps/CodePro/CodePro.Application/Features/Suppliers/Queries/ListSuppliers/ListSuppliersHandler.cs
public sealed class ListSuppliersHandler
    : IRequestHandler<ListSuppliersQuery, Result<PagedResult<SupplierListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListSuppliersHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<SupplierListItem>>> Handle(
        ListSuppliersQuery request, CancellationToken ct)
    {
        var query = _db.Supplier.AsNoTracking();
        var f = request.Filters;

        if (!string.IsNullOrWhiteSpace(f.Search))
            query = query.Where(s => EF.Functions.ILike(s.Name, $"%{f.Search}%"));
        if (f.SupplierStatus.HasValue)
            query = query.Where(s => s.SupplierStatus == f.SupplierStatus.Value);
        // ...

        var items = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip(skip).Take(pageSize + 1)
            .ProjectToType<SupplierListItem>()
            .ToListAsync(ct);

        // ...
    }
}
```

**Hangi DbContext interface'i?**

| Ne sorgulanıyor? | DbContext |
|---|---|
| Identity (User, AppRole, AppOrganization), Activity, Attachment | `IApplicationDbContext` (Platform) |
| CRM entity'leri (Account, Contact, Lead, Opportunity) | `ICrmDbContext` (Crm.Application) |
| CodePro entity'leri (Supplier, PurchaseOrder, Budget, ...) | `ICodeProDbContext` (CodePro.Application) |

`ICrmDbContext` ve `ICodeProDbContext`, `IApplicationDbContext`'i extend eder — yani CRM handler'ı Activity'ye de erişebilir, ama CodePro entity'sine **erişemez** (cross-app yasak).

---

## 5. Result<T> Pattern

Handler her durumda **aynı tip** döner: `Result` veya `Result<T>`. Başarı ve başarısızlık farklı exception path'i değil, aynı return path'te gelir.

```csharp
// Platform.Application/Common/Results/Result.cs
public class Result
{
    public bool IsSuccess { get; }
    public Error Error { get; }
    public bool IsFailure => !IsSuccess;

    public static Result Success() => new(true, Error.None);
    public static Result Failure(Error error) => new(false, error);
    public static Result<T> Success<T>(T value) => new(value, true, Error.None);
    public static Result<T> Failure<T>(Error error) => new(default!, false, error);
}
```

**Error** (kod + mesaj + tip):

```csharp
public sealed record Error(string Code, string Message, ErrorType Type);

public enum ErrorType
{
    Validation,    // 400 — input format
    NotFound,      // 404
    Conflict,      // 409 — business rule ihlali
    Unauthorized,  // 401/403
    Failure        // 500
}
```

**Entity-spesifik error sınıfları** (her app kendi error'larını yazar):

```csharp
// Apps/Crm/Crm.Application/Features/Accounts/AccountErrors.cs
public static class AccountErrors
{
    public static readonly Error NotFound =
        new("Account.NotFound", "Firma bulunamadı.", ErrorType.NotFound);
}

// Apps/CodePro/CodePro.Application/Features/Suppliers/SupplierErrors.cs
public static class SupplierErrors
{
    public static readonly Error NotFound =
        new("Supplier.NotFound", "Tedarikçi bulunamadı.", ErrorType.NotFound);
    public static readonly Error DuplicateVkn =
        new("Supplier.DuplicateVkn", "Bu vergi numarasıyla kayıtlı bir tedarikçi zaten mevcut.", ErrorType.Conflict);
}
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

Her app kendi `Add<App>Application` metodunda Platform behavior'larını miras alır; app'e özgü ek behavior gerekmedikçe yeniden kaydetmez. Detaylar Platform.Application'da.

### 6.1 LoggingBehavior

Her request için structured log + süre. `RequestName` ve `DurationMs` Serilog scope'una eklenir.

### 6.2 ValidationBehavior

FluentValidation çalıştırır. Hata varsa **throw etmez** — `Result.Failure(ValidationError)` döner.

**Yasak:** Validator içinde DB sorgusu (`MustAsync` + repository). O kural business rule — handler'a bırakılır.

### 6.3 TransactionBehavior

Sadece `ICommand` implementasyonlarını sarar. Handler success döndüyse commit, başarısızsa rollback. Exception oluşursa rollback + rethrow.

---

## 7. Validation Stratejisi — KRİTİK

Validation tek bir yerde değil, **katmanlı** yapılır. Her katman farklı bir soruya cevap verir:

| Soru | Katman | Araç | Örnek |
|---|---|---|---|
| İstek şekli doğru mu? | **Input validation** | FluentValidation (ValidationBehavior) | `Name` boş değil, `Email` format, `Page >= 1` |
| Veritabanı durumu buna izin veriyor mu? | **Business rule** | Handler içinde `Result.Failure` | Aynı VKN'li tedarikçi var mı, kapalı sipariş güncellenebilir mi |
| Entity kendi tutarlılığını koruyor mu? | **Domain invariant** | Entity metodu + Result | `Opportunity.Recalculate()`, `Lead.Convert()` |

### 7.1 Business rule örneği — DuplicateVkn

```csharp
public async Task<Result<SupplierDetailItem>> Handle(
    CreateSupplierCommand request, CancellationToken ct)
{
    if (!string.IsNullOrWhiteSpace(request.Vkn))
    {
        var duplicate = await _db.Supplier.AsNoTracking()
            .AnyAsync(s => s.Vkn == request.Vkn, ct);
        if (duplicate) return SupplierErrors.DuplicateVkn;
    }

    var entity = request.Adapt<Supplier>();
    await _repository.CreateAsync(entity, ct);
    return entity.Adapt<SupplierDetailItem>();
}
```

---

## 8. DbContext Hiyerarşisi ve IApplicationDbContext

### 8.1 Sözleşme — Application

`IApplicationDbContext` yalnız platform-merkezli DbSet'leri expose eder:

```csharp
// Platform.Application/Common/Abstractions/IApplicationDbContext.cs
public interface IApplicationDbContext
{
    // Identity
    DbSet<Organization> Organization { get; }
    DbSet<User> User { get; }
    DbSet<AppRole> AppRole { get; }
    DbSet<AppPrivilege> AppPrivilege { get; }
    DbSet<AppUserRole> AppUserRole { get; }
    DbSet<AppRolePrivilege> AppRolePrivilege { get; }
    DbSet<AppLogin> AppLogin { get; }

    // Activity
    DbSet<ActivityBase> Activity { get; }
    DbSet<ActivityParty> ActivityParty { get; }
    DbSet<EmailActivity> EmailActivity { get; }
    DbSet<PhoneCallActivity> PhoneCallActivity { get; }
    DbSet<TaskActivity> TaskActivity { get; }
    DbSet<AppointmentActivity> AppointmentActivity { get; }

    // Attachment
    DbSet<AttachmentFileData> AttachmentFileData { get; }
    DbSet<AttachmentFileMetadata> AttachmentFileMetadata { get; }
    DbSet<AttachmentFileRelation> AttachmentFileRelation { get; }

    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
```

App-spesifik kontratlar Platform interface'ini extend eder:

```csharp
// Apps/Crm/Crm.Application/Interfaces/ICrmDbContext.cs
public interface ICrmDbContext : IApplicationDbContext
{
    DbSet<Account> Account { get; }
    DbSet<AccountEmail> AccountEmail { get; }
    DbSet<AccountPhone> AccountPhone { get; }
    DbSet<AccountAddress> AccountAddress { get; }
    DbSet<AccountContact> AccountContact { get; }
    DbSet<Contact> Contact { get; }
    DbSet<ContactEmail> ContactEmail { get; }
    DbSet<ContactPhone> ContactPhone { get; }
    DbSet<ContactAddress> ContactAddress { get; }
    DbSet<Lead> Lead { get; }
    DbSet<Opportunity> Opportunity { get; }
}

// Apps/CodePro/CodePro.Application/Interfaces/ICodeProDbContext.cs
public interface ICodeProDbContext : IApplicationDbContext
{
    DbSet<Supplier> Supplier { get; }
    DbSet<SupplierProductCategory> SupplierProductCategory { get; }
    DbSet<PurchaseOrder> PurchaseOrder { get; }
    // ... CodePro aggregate'leri
}
```

### 8.2 Implementation — Infrastructure

```csharp
// Platform.Infrastructure/Data/PlatformDbContext.cs
public abstract class PlatformDbContext : DbContext, IApplicationDbContext
{
    public DbSet<Organization> Organization { get; set; }
    public DbSet<User> User { get; set; }
    // ... Identity + Activity + Attachment DbSet'leri
}

// Apps/Crm/Crm.Infrastructure/Data/CrmDbContext.cs
public sealed class CrmDbContext : PlatformDbContext, ICrmDbContext
{
    public DbSet<Account> Account { get; set; }
    public DbSet<Contact> Contact { get; set; }
    public DbSet<Lead> Lead { get; set; }
    public DbSet<Opportunity> Opportunity { get; set; }
    // ... CRM-specific config
}

// Apps/CodePro/CodePro.Infrastructure/Data/CodeProDbContext.cs
public sealed class CodeProDbContext : PlatformDbContext, ICodeProDbContext
{
    public DbSet<Supplier> Supplier { get; set; }
    public DbSet<SupplierProductCategory> SupplierProductCategory { get; set; }
    public DbSet<PurchaseOrder> PurchaseOrder { get; set; }
    // ...
}
```

### 8.3 DI

`AddPlatformApi<TDbContext>` (Platform.Api) `IApplicationDbContext`'i `TDbContext`'e forward eder. `Add<App>Infrastructure` ek olarak `I<App>DbContext`'i de aynı concrete'e bağlar:

```csharp
// Apps/Crm/Crm.Infrastructure/DependencyInjection.cs
services.AddScoped<ICrmDbContext>(sp => sp.GetRequiredService<CrmDbContext>());
```

### 8.4 Command ve Query'de kullanım

| Path | Kullanılır | Neden |
|---|---|---|
| **Platform-wide query** (Activity, User) | `IApplicationDbContext` | Cross-app, platform-merkezli |
| **App-spesifik query** (Account, Supplier) | `I<App>DbContext` (örn. `ICrmDbContext.Account`) | App'in DbSet'leri |
| **Command handler** | `I<Entity>Repository` (write path) | Aggregate tutarlılığı, transaction |

---

## 9. Mapping (Mapster)

### 9.1 İki kademeli yapı

- **Platform mapping** (`Platform.Application/Mapping/MappingConfig.cs`): User, AppOrganization, AppRole, Attachment, Communication base map'leri.
- **App mapping** (`Crm.Application/Mapping/CrmMappingConfig.cs`, `CodePro.Application/Mapping/CodeProMappingConfig.cs`): App'e özgü entity ↔ DTO kuralları.

Platform mapping `AddApplication()` içinde, app mapping `Add<App>Application()` içinde register edilir. App config Platform config'in **üzerine** ekler:

```csharp
// Apps/Crm/Crm.Application/Mapping/CrmMappingConfig.cs
public static class CrmMappingConfig
{
    public static void Register(TypeAdapterConfig config)
    {
        AccountMappings.Register(config);
        ContactMappings.Register(config);
        LeadMappings.Register(config);
        OpportunityMappings.Register(config);
    }
}

// Apps/Crm/Crm.Application/DependencyInjection.cs
public static IServiceCollection AddCrmApplication(this IServiceCollection services)
{
    services.AddMediatR(...);
    services.AddValidatorsFromAssembly(assembly);
    CrmMappingConfig.Register(TypeAdapterConfig.GlobalSettings);
    PrivilegeRegistry.Register(typeof(CrmPrivilegeCodes));
    return services;
}
```

### 9.2 Handler'da kullanım

```csharp
var entity = cmd.Adapt<Account>();                          // Command → Entity
cmd.Adapt(existingEntity);                                   // in-place update
return entity.Adapt<AccountDetailItem>();                    // Entity → DTO
query.ProjectToType<AccountListItem>().ToListAsync();        // EF projection
```

### 9.3 Yasak

- Controller veya repository içinde manuel mapping kodu yazmak. Mapping sadece `<App>MappingConfig.cs` + `.Adapt<T>()` ile yapılır.
- Handler içinde el ile property set etmek.

---

## 10. Controller Pattern

Controller **tek sorumluluğa** sahiptir: HTTP request'i MediatR request'ine çevir, sonucu HTTP cevabına dönüştür.

```csharp
// Apps/Crm/Crm.Api/Controllers/AccountController.cs
[ApiController]
[Route("api/account")]
public sealed class AccountController : ControllerBase
{
    private readonly ISender _sender;
    public AccountController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListAccountsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAccountCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    // ... update, delete, ...
}
```

### Adlandırma kuralları

| Öğe | Kural | Örnek |
|---|---|---|
| Controller | `<Entity>Controller` (singular) | `AccountController`, `SupplierController` |
| Method | `<Action>Async` | `ListAsync`, `GetAsync`, `CreateAsync`, ... |
| Route | lowercase kebab-case | `list`, `get`, `create`, `update`, `delete`, `set-state`, `bulk-update-status`, `assign`, `search` |
| HTTP verb | Hepsi **POST** | (REST fiillerine geçiş ayrı karar) |
| Privilege | `[PrivilegeAuthorize(...)]` her method'ta | App'in PrivilegeCodes'undan |

---

## 11. Authorization & PrivilegeCodes

JWT + custom **privilege-based** attribute. Privilege kodları üç katmanda toplanır:

| Katman | Sınıf | İçerik |
|---|---|---|
| Platform | `Platform.Domain.Authorization.PrivilegeCodes` | `UserPrivilegeCodes`, `ActivityPrivilegeCodes`, `AppOrganizationPrivilegeCodes`, `AppRolePrivilegeCodes`, `AttachmentPrivilegeCodes` |
| CRM | `Crm.Domain.Authorization.CrmPrivilegeCodes` | `AccountPrivilegeCodes`, `ContactPrivilegeCodes`, `LeadPrivilegeCodes`, `OpportunityPrivilegeCodes` |
| CodePro | `CodePro.Domain.Authorization.CodeProPrivilegeCodes` | `SupplierPrivilegeCodes`, `PurchaseRequestPrivilegeCodes`, `PurchaseOrderPrivilegeCodes`, ... |

`PrivilegeRegistry` (Platform.Domain): tüm privilege kodlarını toplayan singleton. Platform `PrivilegeCodes` otomatik kayıtlı; her app `Add<App>Application()` içinde `PrivilegeRegistry.Register(typeof(<App>PrivilegeCodes))` çağırır.

```csharp
[HttpPost("delete")]
[PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Delete)]
public async Task<IActionResult> DeleteAsync([FromBody] DeleteAccountCommand cmd, CancellationToken ct)
    => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);
```

`PrivilegeAuthorizationHandler` endpoint metadata'daki kodu context'teki privilege listesiyle karşılaştırır. Kayıtlı olmayan privilege kodu kullanılamaz.

---

## 12. EntityReference — İlişki Sözleşmesi

`EntityReference` bu projede iki işi birden görür: (1) DTO ve Command'larda bir entity'nin başka bir entity'ye verdiği ilişkiyi taşımanın **varsayılan biçimi**, (2) polimorfik (cross-app) referansların temel tipi. Böylece client ilişkileri tek bir sözleşmeyle görür ve `EntityLookupField` doğrudan bu tipe bağlanır.

```csharp
// Platform.Application/Modals/Common/EntityReference.cs
public class EntityReference
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;   // "Account", "Supplier", "Lead", ...
    public string? Email { get; set; }
    public string? Phone { get; set; }
}
```

### 12.1 Varsayılan Kural — İlişkiler EntityReference ile Taşınır

Bir entity'nin başka bir entity'ye ilişkisi DTO/Command sözleşmesine girerken **varsayılan olarak `EntityReference`** kullanılır; ham `Guid <Entity>Id` alanı sözleşmeye konmaz.

| Katman | İlişki nasıl temsil edilir |
|---|---|
| **Domain entity** | FK olarak `Guid <Entity>Id` (+ opsiyonel nav property) — değişmez |
| **DetailItem DTO** | `EntityReference <Entity>` — id + görünen ad birlikte gelir |
| **Create/Update Command** | `EntityReference <Entity>` — client lookup'tan ne seçtiyse onu gönderir |
| **ListItem DTO** | Performans için düz `string <Entity>Name` projection kabul edilir (liste satırında lookup yok) |

Domain entity FK olarak `Guid` tutmaya devam eder; `EntityReference ↔ Guid` dönüşümünü Mapster mapping katmanı üstlenir, handler ham id ile çalışır:

```csharp
// Command (EntityReference) → Entity (Guid FK)
config.NewConfig<CreateOpportunityCommand, Opportunity>()
    .Map(d => d.AccountId, s => s.Account != null ? s.Account.Id : Guid.Empty)
    .Map(d => d.PrimaryContactId, s => s.PrimaryContact != null ? (Guid?)s.PrimaryContact.Id : null)
    .Ignore(d => d.Account!, d => d.PrimaryContact!)
    .IgnoreAuditFields();

// Entity (nav property) → DetailItem (EntityReference)
config.NewConfig<Opportunity, OpportunityDetailItem>()
    .Map(d => d.Account, s => s.Account != null
        ? new EntityReference(nameof(Account)) { Id = s.Account.Id, Name = s.Account.AccountName }
        : null);
```

**Neden:** Client her ilişkide aynı şekli (`{ entityType, id, name }`) görür; `EntityLookupField` ekstra map'leme olmadan bağlanır; normal ve polimorfik referanslar aynı tiple ifade edilir; ilişkinin görünen adını ayrı sorgulamak için ek endpoint gerekmez.

**Tek istisna:** Performans-kritik `ListItem` projection'larında düz `<Entity>Name` string'i. Bunun dışında DetailItem ve Command'da ilişki = `EntityReference`.

### 12.2 Polimorfik Referans — IEntityReferenceResolver Registry

Activity'nin `RegardingEntityType` (string) + `RegardingEntityId` (Guid?) polimorfik referansı ve `EntityLookupField`'in cross-app araması — her ikisi de `IEntityReferenceResolver` registry pattern'ı üzerinden çözülür.

### 12.3 Sözleşme

```csharp
// Platform.Application/Common/References/IEntityReferenceResolver.cs
public interface IEntityReferenceResolver
{
    string EntityType { get; }
    EntityReference GetReference(Guid id);
    EntityReferenceList LookupReference(string? searchText, PaginationInfo paginationInfo);
}

// Platform.Application/Common/References/IEntityReferenceResolverRegistry.cs
public interface IEntityReferenceResolverRegistry
{
    IEntityReferenceResolver? GetResolver(string entityType);
    IReadOnlyCollection<string> RegisteredTypes { get; }
}
```

### 12.4 Implementation

```csharp
// Platform.Infrastructure/References/EntityReferenceResolverRegistry.cs
public class EntityReferenceResolverRegistry : IEntityReferenceResolverRegistry
{
    private readonly Dictionary<string, IEntityReferenceResolver> resolvers;

    public EntityReferenceResolverRegistry(IEnumerable<IEntityReferenceResolver> resolvers)
    {
        this.resolvers = resolvers.ToDictionary(r => r.EntityType, StringComparer.Ordinal);
    }

    public IEntityReferenceResolver? GetResolver(string entityType) =>
        resolvers.TryGetValue(entityType, out var resolver) ? resolver : null;

    public IReadOnlyCollection<string> RegisteredTypes => resolvers.Keys.ToList();
}
```

`ReferenceRepository` (Platform.Infrastructure) registry üzerinden dispatch eder; bilinmeyen tip için `EntityReference { Id, Name=entityType }` placeholder döner.

### 12.5 App'in resolver kayıtları

```csharp
// Apps/Crm/Crm.Infrastructure/References/AccountReferenceResolver.cs
public class AccountReferenceResolver : IEntityReferenceResolver
{
    private readonly CrmDbContext dbContext;
    public string EntityType => nameof(Account);

    public EntityReference GetReference(Guid id) { /* ... */ }
    public EntityReferenceList LookupReference(string? searchText, PaginationInfo p) { /* ... */ }
}

// Apps/Crm/Crm.Infrastructure/DependencyInjection.cs
services.AddScoped<IEntityReferenceResolver, AccountReferenceResolver>();
services.AddScoped<IEntityReferenceResolver, ContactReferenceResolver>();

// Apps/CodePro/CodePro.Infrastructure/DependencyInjection.cs
services.AddScoped<IEntityReferenceResolver, SupplierReferenceResolver>();
```

Platform yalnız `UserReferenceResolver`'ı kayıt eder. ASP.NET Core `IEnumerable<IEntityReferenceResolver>` enjekte ederken DI'a kayıtlı tüm implementasyonları toplar; registry constructor'ı dictionary'ye dönüştürür.

### 12.6 Yeni entity'i regarding zincirine sokmak

1. `<App>.Infrastructure/References/<Entity>ReferenceResolver.cs` oluştur, `IEntityReferenceResolver` implement et.
2. `EntityType` => `nameof(<Entity>)` döndür.
3. `GetReference(id)` ve `LookupReference(...)` içinde app'in DbContext'inden veriyi çek (Name, Email, Phone alanları).
4. `<App>.Infrastructure/DependencyInjection.cs`'e `services.AddScoped<IEntityReferenceResolver, <Entity>ReferenceResolver>();` satırı ekle.
5. **Platform veya başka app'e dokunmaya gerek yok** — registry runtime'da otomatik genişler.

Activity create command'ında `RegardingEntityType = nameof(Supplier)` set edildiğinde, Get response'unda CodePro'nun `SupplierReferenceResolver`'ı tetiklenir ve doğru ad/email/telefon döner. Cross-app polimorfik referans bu sayede çalışır.

---

## 13. Error Handling — ProblemDetails (RFC 7807)

Tüm hata cevapları RFC 7807 ProblemDetails formatındadır.

```json
{
  "type": "https://platform.local/errors/Supplier.DuplicateVkn",
  "title": "Business rule ihlali",
  "status": 409,
  "detail": "Bu vergi numarasıyla kayıtlı bir tedarikçi zaten mevcut.",
  "instance": "/api/supplier/create",
  "traceId": "00-...-01",
  "code": "Supplier.DuplicateVkn"
}
```

`IExceptionHandler` implementasyonu yakalar, 500 ProblemDetails üretir. `Result.Failure` için bu path'e girilmez.

---

## 14. Logging & Correlation

**Middleware zinciri** (Program.cs / `UsePlatformPipeline`):

```
CorrelationIdMiddleware  →  Authentication  →  LoggingMiddleware  →  ExceptionHandler  →  Authorization  →  Endpoint
```

Her log satırında otomatik property'ler: `CorrelationId`, `UserId`, `OrganizationId`, `RequestName`, `DurationMs`, `HttpMethod`, `Path`, `StatusCode`.

---

## 15. DbContext Davranışları

`PlatformDbContext` üç davranış uygular (entity'nin marker interface'ine göre):

### 15.1 Global Query Filters

- **SoftDelete:** `ISoftDeleteEntity` için `e => !e.IsDeleted`.
- **Ownership:** `IOwnedEntity` için `AccessLevel`'a göre `e.OwnerId == currentUserId` veya `e.OrganizationId in accessibleOrgs`.

Query handler `_db.Account.Where(...)` çağırdığında bu filter'lar otomatik uygulanır.

### 15.2 SaveChanges Override

`ApplySaveRules`:
- `IAuditableEntity` → `CreatedBy/At`, `UpdatedBy/At` set edilir.
- `ISoftDeleteEntity` → `EntityState.Deleted` yakalanır, `IsDeleted = true` olarak işaretlenir.
- `IOwnedEntity` → yazma sırasında mevcut kullanıcının erişim seviyesi doğrulanır; yetkisizse `UnauthorizedAccessException`.

### 15.3 Marker Interface'ler

| Interface | Namespace | Tetiklediği davranış |
|---|---|---|
| `IBaseEntity` | `Platform.Domain.Entities.Common` | `Id`, `IsActive` |
| `IAuditableEntity` | `Platform.Domain.Entities.Common` | `CreatedBy/At`, `UpdatedBy/At` auto-fill |
| `ISoftDeleteEntity` | `Platform.Domain.Entities.Common` | Query filter `IsDeleted = false`; delete mantıksal |
| `IOwnedEntity` | `Platform.Domain.Entities.Common` | Multi-tenant query filter + yazma guard |

---

## 16. Adlandırma Kuralları

| Öğe | Format | Örnek |
|---|---|---|
| Domain proje | `<App>.Domain` | `Crm.Domain`, `CodePro.Domain` |
| Application proje | `<App>.Application` | `Crm.Application`, `CodePro.Application` |
| Command class | `<Action><Entity>Command` | `CreateAccountCommand`, `CreateSupplierCommand` |
| Query class | `<Action><Entity>Query` | `GetAccountQuery`, `ListSuppliersQuery` |
| Handler | `<Action><Entity>Handler` | `CreateAccountHandler` |
| Validator | `<Action><Entity>Validator` | `CreateSupplierValidator` |
| DTO | `<Entity>DetailItem`, `<Entity>ListItem`, `<Entity>ListFilter` | `SupplierDetailItem` |
| Error sınıfı | `<Entity>Errors` (static) | `AccountErrors.NotFound`, `SupplierErrors.DuplicateVkn` |
| Error kodu | `<Entity>.<Reason>` | `"Account.NotFound"`, `"Supplier.DuplicateVkn"` |
| Repository | `I<Entity>Repository` / `<Entity>Repository` | `IAccountRepository`, `ISupplierRepository` |
| Resolver | `<Entity>ReferenceResolver` | `AccountReferenceResolver`, `SupplierReferenceResolver` |
| Controller | `<Entity>Controller` (singular) | `AccountController`, `SupplierController` |
| Route base | `api/<entity>` kebab-case | `api/account`, `api/supplier` |
| Action route | kebab-case | `set-state`, `bulk-update-status` |
| Privilege code | `<Entity>.<Operation>` | `"Account.Create"`, `"Supplier.Create"` |
| Privilege sınıfı | `<App>PrivilegeCodes.<Entity>PrivilegeCodes` | `CrmPrivilegeCodes.AccountPrivilegeCodes`, `CodeProPrivilegeCodes.SupplierPrivilegeCodes` |
| Namespace (CRM örnek) | `Crm.Application.Features.<Entity>s.<Commands/Queries>.<Action>` | `Crm.Application.Features.Accounts.Commands.CreateAccount` |

---

## 17. Kaçınılması Gerekenler

- **Cross-app domain importu:** `CodePro.Domain` `Crm.Domain.Entities.Accounts.Account` import edemez. Polimorfik `EntityReference` + resolver registry kullan.
- **DTO/Command'da ham ilişki id'si:** DetailItem ve Create/Update Command'da bir ilişki `Guid <Entity>Id` olarak değil, varsayılan olarak `EntityReference` ile taşınır (bkz. §12.1). Düz id yalnız domain entity FK'sinde ve ListItem projection'ında kalır.
- **Handler içinde exception throw** — `Result.Failure(...)` kullan. Exception sadece beklenmedik hatalar için.
- **Query handler'da repository kullanmak** — Uygun DbContext interface'i + projection kullan. Repository write path için.
- **Command handler'da `SaveChangesAsync` çağırmak** — TransactionBehavior yapar.
- **Controller'da iş mantığı** — Tek görevi `_sender.Send(...).ToActionResult()`.
- **Controller'da DbContext / repository inject etmek** — Sadece `ISender`.
- **DbContext'i Application'dan direkt kullanmak** — `IApplicationDbContext` / `I<App>DbContext` abstraction üzerinden.
- **Manuel mapping kodu yazmak** — Mapster + MappingConfig / `<App>MappingConfig`.
- **FluentValidation'da DB sorgulayan kural** — O bir business rule, handler'a bırak.
- **Tek handler'da birden çok aggregate'e yazmak** — Command sınırı aggregate sınırıdır.
- **MediatR pipeline'ı bypass etmek** — Hep `ISender`.
- **Inline query key / magic string** — Privilege code, error code, route adı → sabit.
- **Yeni privilege'i Platform'a koymak** (CRM'e ait olduğu halde) — App'in `<App>PrivilegeCodes`'una ekle.

---

## 18. Claude İçin Çalışma Talimatları

Yeni bir endpoint / feature eklerken sırayla:

1. **App'i belirle.** Account → CRM, Supplier → CodePro, Activity → Platform. Birden fazla app aynı semantikle paylaşacaksa Platform; tek app ise o app.
2. **Önce Command mı Query mi belirle.** Yazma → Command, okuma → Query.
3. **Klasörü aç.** `<App>.Application/Features/<Entity>/Commands/<Action>/` veya `Queries/<Action>/`.
4. **Command/Query, Validator, Handler yaz.** İlgili `ICommand<T>` / `IQuery<T>` marker'ı uygula.
5. **Handler'da DbContext seçimi:**
   - Command → repository + UnitOfWork
   - App-spesifik query → `I<App>DbContext` (örn. `ICrmDbContext.Account`)
   - Platform-wide query → `IApplicationDbContext`
6. **Business rule'ları `Result.Failure(<Entity>Errors.<Reason>)` ile ifade et.**
7. **İlişki alanlarını `EntityReference` olarak tanımla.** DetailItem ve Create/Update Command'da başka bir entity'ye referans = `EntityReference` (varsayılan, §12.1); ham `Guid <Entity>Id` yalnız domain entity FK'sinde ve performans-kritik ListItem projection'larında.
8. **Mapping için Mapster.** App'in `<App>MappingConfig`'ine kural ekle; `EntityReference ↔ Guid` dönüşümünü `.Map(...)` ile burada yap.
9. **Controller method'unu ekle.** `[PrivilegeAuthorize(...)]` + tek satır `(await _sender.Send(...)).ToActionResult()`.
10. **Privilege kodu kontrol et.** Yoksa app'in `<App>PrivilegeCodes`'una ekle.
11. **Activity regarding zincirine girecekse:** `<App>.Infrastructure/References/<Entity>ReferenceResolver.cs` ekle, `IEntityReferenceResolver` implement et, DI'da kayıt et.
12. **Test et.** Success path, validation failure (400), business rule failure (409/404), authorization failure (403).

Belirsizlikte sor:
- Bu entity hangi app'e ait? Birden fazla app tüketecekse Platform; tek app'e özelse o app.
- Bu bir input validation mı yoksa business rule mi?
- Bu command yeni aggregate mi yazıyor, yoksa mevcutunu mu güncelliyor?
- Bu entity'nin başka bir entity'ye ilişkisi var mı? Varsa DTO/Command'da `EntityReference` ile taşınmalı (varsayılan, §12.1).
- Hata `ErrorType` olarak Validation/NotFound/Conflict/Unauthorized/Failure hangisi?
- Yeni entity Activity regarding olarak gösterilecek mi? Çağrılacaksa resolver gerekli.
