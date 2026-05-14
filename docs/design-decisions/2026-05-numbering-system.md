# Numbering System — Design Decisions & Implementation Spec

> **Tarih:** 2026-05
> **Durum:** Onaylandı, implementasyona hazır
> **Bağlam:** .NET Web API projesinde sipariş, fatura vb. kayıtlar için
> benzersiz numarator altyapısı. Format örneği: `ORD-2026-000001`

---

## 1. Amaç

Sipariş, fatura ve benzeri kayıtlar için:

- **Gapless** (boşluksuz) artan numara üretimi
- **Concurrency-safe** (eş zamanlı isteklerde aynı numarayı vermez)
- **Format'ı pluggable** (strategy pattern ile her doküman tipi kendi formatını tanımlar)
- **Reset period'u esnek** (yıllık, aylık, çeyreklik veya sıfırlamasız)

---

## 2. Mimari Kararlar

### 2.1 Neden Counter Tablosu + UPDLOCK?

Üç alternatif değerlendirildi:

| Yaklaşım | Avantaj | Dezavantaj | Karar |
|----------|---------|------------|-------|
| Counter tablosu + UPDLOCK | Gapless, transactional, esnek | DB roundtrip her seferinde | ✅ Seçildi |
| EF Core HiLo | Yüksek performans | **Gapless DEĞİL** — restart'ta gap olur | ❌ Fatura için uygun değil |
| Redis distributed counter | Çok yüksek throughput | Overkill, ek altyapı | ❌ Gerek yok |

**Seçim sebebi:** Fatura gibi yasal/denetimsel kayıtlarda gap olmamalı.
Counter tablosu DB transaction'ı ile aynı scope'ta çalıştığı için iş
transaction'ı rollback olursa sayaç da geri gelir.

### 2.2 Neden Strategy Pattern (Format İçin)?

Format kuralları doküman tipine göre çok farklı olabilir:

- `ORD-2026-000001` (basit)
- `FTR/26/000001` (kısa yıl, farklı separator)
- `INT-2026-Q4-000001` (çeyrek bilgisi)
- `ORD-W-2026-000001` (kanal bilgisi)

Tek bir `string.Format` ile bunları yönetmek `if/else` patlamasına yol açar.
Strategy pattern her formatı kendi sınıfında izole eder, **Open/Closed
Principle**'a uyar.

### 2.3 Neden ResetPeriod Strategy İçinde?

İlk iterasyonda `ICounterPolicyProvider` ayrı bir abstraction olarak vardı.
Sonra şu sebeplerle strategy'nin içine birleştirildi:

- **Single source of truth:** Yeni doküman tipi eklemek için tek yer
- **Cohesion artar:** Bir doküman tipinin tüm kuralları aynı sınıfta
- **Yanlış konfigürasyon imkansız:** Compile-time olarak zorunlu

### 2.4 Transaction Davranışı — KRİTİK

**Servis kendi transaction'ını AÇMAZ.** Caller'ın transaction'ını kullanır.

**Sebep:** Numara üretimi her zaman bir iş transaction'ı içinde çağrılır
(sipariş yarat → sayaç al → kaydet → commit). Eğer servis kendi
transaction'ını açarsa ve iş transaction'ı rollback olursa **gap oluşur**.

Doğru kullanım:

```csharp
await using var tx = await _db.Database.BeginTransactionAsync(ct);
var orderNo = await _numberGen.GenerateAsync("ORDER", ct: ct);
_db.Orders.Add(new Order { OrderNumber = orderNo, ... });
await _db.SaveChangesAsync(ct);
await tx.CommitAsync(ct);
// Hata olursa hem order hem sayaç rollback olur — gap yok
```

---

## 3. Veritabanı Şeması

```sql
CREATE TABLE NumberCounters (
    Id INT IDENTITY PRIMARY KEY,
    DocumentType NVARCHAR(50) NOT NULL,
    ResetPeriod INT NOT NULL DEFAULT 1,        -- enum değeri
    PeriodKey NVARCHAR(20) NOT NULL,           -- "2026", "2026-05", "2026-Q4", "ALL"
    LastValue BIGINT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    RowVersion ROWVERSION,
    CONSTRAINT UQ_DocType_Period UNIQUE (DocumentType, PeriodKey)
);

CREATE INDEX IX_NumberCounters_DocType_Period
    ON NumberCounters (DocumentType, PeriodKey) INCLUDE (LastValue);
```

**PeriodKey mantığı:**
- `Never` → `"ALL"`
- `Yearly` → `"2026"`
- `Monthly` → `"2026-05"`
- `Quarterly` → `"2026-Q4"`

Unique constraint `(DocumentType, PeriodKey)` üzerinde, bu sayede yıl/ay/çeyrek
değişiminde yeni satır oluşur, sayaç otomatik sıfırlanır.

---

## 4. Implementasyon — Final Kodlar

### 4.1 Enum

```csharp
public enum CounterResetPeriod
{
    Never = 0,    // Sürekli artar: 1, 2, 3, ...
    Yearly = 1,   // Her yıl sıfırlanır
    Monthly = 2,  // Her ay sıfırlanır
    Quarterly = 3 // Her çeyrek sıfırlanır
}
```

### 4.2 Entity

```csharp
public class NumberCounter
{
    public int Id { get; set; }
    public string DocumentType { get; set; } = default!;
    public CounterResetPeriod ResetPeriod { get; set; }
    public string PeriodKey { get; set; } = default!;
    public long LastValue { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public byte[] RowVersion { get; set; } = default!;
}
```

### 4.3 EF Configuration

```csharp
public class NumberCounterConfiguration : IEntityTypeConfiguration<NumberCounter>
{
    public void Configure(EntityTypeBuilder<NumberCounter> builder)
    {
        builder.ToTable("NumberCounters");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.DocumentType).HasMaxLength(50).IsRequired();
        builder.Property(x => x.PeriodKey).HasMaxLength(20).IsRequired();
        builder.Property(x => x.ResetPeriod).HasConversion<int>();
        builder.Property(x => x.RowVersion).IsRowVersion();

        builder.HasIndex(x => new { x.DocumentType, x.PeriodKey })
               .IsUnique()
               .HasDatabaseName("UQ_DocType_Period");
    }
}
```

DbContext'e DbSet eklenmeli:

```csharp
public DbSet<NumberCounter> NumberCounters => Set<NumberCounter>();

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.ApplyConfiguration(new NumberCounterConfiguration());
}
```

### 4.4 Format Context Record

```csharp
public record NumberFormatContext(
    string DocumentType,
    long Sequence,
    DateTime GeneratedAt,
    IReadOnlyDictionary<string, string>? ExtraTokens = null
);
```

`ExtraTokens` opsiyonel — kanal bilgisi, şube kodu gibi domain-specific
verileri taşımak için.

### 4.5 Format Strategy Interface

```csharp
public interface INumberFormatStrategy
{
    string DocumentType { get; }
    CounterResetPeriod ResetPeriod { get; }
    string Format(NumberFormatContext context);
}
```

### 4.6 Concrete Strategy'ler

```csharp
public class DefaultOrderFormatStrategy : INumberFormatStrategy
{
    public string DocumentType => "ORDER";
    public CounterResetPeriod ResetPeriod => CounterResetPeriod.Yearly;

    public string Format(NumberFormatContext ctx)
    {
        var seq = ctx.Sequence.ToString("D6");
        return $"ORD-{ctx.GeneratedAt.Year}-{seq}";
    }
}

public class InvoiceFormatStrategy : INumberFormatStrategy
{
    public string DocumentType => "INVOICE";
    public CounterResetPeriod ResetPeriod => CounterResetPeriod.Yearly;

    public string Format(NumberFormatContext ctx)
    {
        var shortYear = ctx.GeneratedAt.Year % 100;
        var seq = ctx.Sequence.ToString("D6");
        return $"FTR/{shortYear:D2}/{seq}";
    }
}

public class InternationalInvoiceFormatStrategy : INumberFormatStrategy
{
    public string DocumentType => "INVOICE_INTL";
    public CounterResetPeriod ResetPeriod => CounterResetPeriod.Quarterly;

    public string Format(NumberFormatContext ctx)
    {
        var year = ctx.GeneratedAt.Year;
        var quarter = (ctx.GeneratedAt.Month - 1) / 3 + 1;
        var seq = ctx.Sequence.ToString("D6");
        return $"INT-{year}-Q{quarter}-{seq}";
    }
}

public class ChannelBasedOrderFormatStrategy : INumberFormatStrategy
{
    public string DocumentType => "ORDER_CHANNEL";
    public CounterResetPeriod ResetPeriod => CounterResetPeriod.Yearly;

    public string Format(NumberFormatContext ctx)
    {
        var channel = ctx.ExtraTokens?.GetValueOrDefault("channel")
                      ?? throw new InvalidOperationException("channel token required");
        var seq = ctx.Sequence.ToString("D6");
        return $"ORD-{channel}-{ctx.GeneratedAt.Year}-{seq}";
    }
}
```

### 4.7 Strategy Resolver

```csharp
public interface INumberFormatStrategyResolver
{
    INumberFormatStrategy Resolve(string documentType);
}

public class NumberFormatStrategyResolver : INumberFormatStrategyResolver
{
    private readonly IReadOnlyDictionary<string, INumberFormatStrategy> _strategies;

    public NumberFormatStrategyResolver(IEnumerable<INumberFormatStrategy> strategies)
    {
        _strategies = strategies.ToDictionary(
            s => s.DocumentType.ToUpperInvariant(),
            s => s,
            StringComparer.OrdinalIgnoreCase);
    }

    public INumberFormatStrategy Resolve(string documentType)
    {
        var key = documentType.ToUpperInvariant();
        if (!_strategies.TryGetValue(key, out var strategy))
        {
            throw new InvalidOperationException(
                $"No format strategy registered for document type '{documentType}'. " +
                $"Registered types: {string.Join(", ", _strategies.Keys)}");
        }
        return strategy;
    }
}
```

### 4.8 PeriodKey Helper

```csharp
internal static class PeriodKeyCalculator
{
    public static string Calculate(CounterResetPeriod period, DateTime utcNow)
    {
        return period switch
        {
            CounterResetPeriod.Never     => "ALL",
            CounterResetPeriod.Yearly    => utcNow.Year.ToString(),
            CounterResetPeriod.Monthly   => $"{utcNow.Year}-{utcNow.Month:D2}",
            CounterResetPeriod.Quarterly => $"{utcNow.Year}-Q{(utcNow.Month - 1) / 3 + 1}",
            _ => throw new ArgumentOutOfRangeException(nameof(period))
        };
    }
}
```

### 4.9 Generator Service Interface

```csharp
public interface INumberGeneratorService
{
    Task<string> GenerateAsync(
        string documentType,
        IReadOnlyDictionary<string, string>? extraTokens = null,
        CancellationToken ct = default);
}
```

### 4.10 Generator Service — Final Implementasyon

```csharp
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;

public class NumberGeneratorService : INumberGeneratorService
{
    private readonly AppDbContext _db;
    private readonly INumberFormatStrategyResolver _resolver;
    private readonly ILogger<NumberGeneratorService> _logger;

    private const int MaxRetryAttempts = 3;

    public NumberGeneratorService(
        AppDbContext db,
        INumberFormatStrategyResolver resolver,
        ILogger<NumberGeneratorService> logger)
    {
        _db = db;
        _resolver = resolver;
        _logger = logger;
    }

    public async Task<string> GenerateAsync(
        string documentType,
        IReadOnlyDictionary<string, string>? extraTokens = null,
        CancellationToken ct = default)
    {
        var strategy = _resolver.Resolve(documentType);
        var sequence = await GetNextSequenceAsync(strategy, ct);

        var context = new NumberFormatContext(
            DocumentType: documentType,
            Sequence: sequence,
            GeneratedAt: DateTime.UtcNow,
            ExtraTokens: extraTokens);

        var formatted = strategy.Format(context);
        _logger.LogInformation("Generated {Number} for {DocType} (seq={Seq})",
            formatted, documentType, sequence);

        return formatted;
    }

    private async Task<long> GetNextSequenceAsync(
        INumberFormatStrategy strategy,
        CancellationToken ct)
    {
        var normalizedType = strategy.DocumentType.ToUpperInvariant();
        var periodKey = PeriodKeyCalculator.Calculate(strategy.ResetPeriod, DateTime.UtcNow);

        for (int attempt = 1; attempt <= MaxRetryAttempts; attempt++)
        {
            try
            {
                // 1. Mevcut satırı atomik artırmayı dene
                var nextValue = await TryIncrementExistingAsync(normalizedType, periodKey, ct);
                if (nextValue.HasValue)
                    return nextValue.Value;

                // 2. Satır yok — yaratmayı dene
                var created = await TryCreateInitialAsync(
                    normalizedType, strategy.ResetPeriod, periodKey, ct);
                if (created.HasValue)
                    return created.Value;

                _logger.LogDebug("Race on cold-start for {DocType}/{Period}, retry {Attempt}",
                    normalizedType, periodKey, attempt);
            }
            catch (DbUpdateException ex) when (IsUniqueConstraintViolation(ex))
            {
                // INSERT'te yarış kazandık ve kaybettik — bir sonraki turda UPDATE'e düşer
                _logger.LogDebug("Unique constraint hit, retrying for {DocType}/{Period}",
                    normalizedType, periodKey);
            }
        }

        throw new InvalidOperationException(
            $"Failed to generate sequence for {normalizedType}/{periodKey} after {MaxRetryAttempts} attempts.");
    }

    private async Task<long?> TryIncrementExistingAsync(
        string documentType,
        string periodKey,
        CancellationToken ct)
    {
        const string sql = @"
            UPDATE NumberCounters WITH (UPDLOCK, ROWLOCK)
            SET LastValue = LastValue + 1,
                UpdatedAt = SYSUTCDATETIME()
            OUTPUT INSERTED.LastValue
            WHERE DocumentType = @docType AND PeriodKey = @periodKey;";

        var connection = _db.Database.GetDbConnection();
        var wasOpen = connection.State == ConnectionState.Open;
        if (!wasOpen) await connection.OpenAsync(ct);

        try
        {
            await using var cmd = connection.CreateCommand();
            cmd.CommandText = sql;

            // Caller'ın transaction'ı varsa kullan — kendi transaction'ımızı AÇMA
            var currentTx = _db.Database.CurrentTransaction;
            if (currentTx is not null)
                cmd.Transaction = currentTx.GetDbTransaction();

            cmd.Parameters.Add(new SqlParameter("@docType", SqlDbType.NVarChar, 50) { Value = documentType });
            cmd.Parameters.Add(new SqlParameter("@periodKey", SqlDbType.NVarChar, 20) { Value = periodKey });

            var result = await cmd.ExecuteScalarAsync(ct);
            return result is null or DBNull ? null : Convert.ToInt64(result);
        }
        finally
        {
            // Sadece biz açtıysak ve transaction yoksa kapat
            if (!wasOpen && _db.Database.CurrentTransaction is null)
                await connection.CloseAsync();
        }
    }

    private async Task<long?> TryCreateInitialAsync(
        string documentType,
        CounterResetPeriod resetPeriod,
        string periodKey,
        CancellationToken ct)
    {
        var counter = new NumberCounter
        {
            DocumentType = documentType,
            ResetPeriod = resetPeriod,
            PeriodKey = periodKey,
            LastValue = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.NumberCounters.Add(counter);
        await _db.SaveChangesAsync(ct);
        return 1;
    }

    private static bool IsUniqueConstraintViolation(DbUpdateException ex)
    {
        // SQL Server: 2627 = unique constraint, 2601 = duplicate key
        return ex.InnerException is SqlException sqlEx
               && sqlEx.Number is 2627 or 2601;
    }
}
```

---

## 5. Document Types Sabitleri

Magic string kullanma. Merkezi bir sabit class:

```csharp
public static class DocumentTypes
{
    public const string Order = "ORDER";
    public const string Invoice = "INVOICE";
    public const string InternationalInvoice = "INVOICE_INTL";
    public const string OrderChannel = "ORDER_CHANNEL";
}
```

---

## 6. DI Registration

```csharp
// Program.cs

// Resolver — singleton
builder.Services.AddSingleton<INumberFormatStrategyResolver, NumberFormatStrategyResolver>();

// Strategy'ler — singleton (stateless)
builder.Services.AddSingleton<INumberFormatStrategy, DefaultOrderFormatStrategy>();
builder.Services.AddSingleton<INumberFormatStrategy, InvoiceFormatStrategy>();
builder.Services.AddSingleton<INumberFormatStrategy, InternationalInvoiceFormatStrategy>();
builder.Services.AddSingleton<INumberFormatStrategy, ChannelBasedOrderFormatStrategy>();

// Generator — scoped (DbContext ile aynı lifecycle)
builder.Services.AddScoped<INumberGeneratorService, NumberGeneratorService>();
```

> **Not:** Scrutor kullanıyorsan otomatik kayıt için:
> ```csharp
> builder.Services.Scan(scan => scan
>     .FromAssemblyOf<INumberFormatStrategy>()
>     .AddClasses(c => c.AssignableTo<INumberFormatStrategy>())
>     .As<INumberFormatStrategy>()
>     .WithSingletonLifetime());
> ```

---

## 7. Kullanım Örneği

```csharp
public class OrderService
{
    private readonly INumberGeneratorService _numberGen;
    private readonly AppDbContext _db;

    public OrderService(INumberGeneratorService numberGen, AppDbContext db)
    {
        _numberGen = numberGen;
        _db = db;
    }

    public async Task<Order> CreateOrderAsync(CreateOrderDto dto, CancellationToken ct)
    {
        // ÖNEMLİ: Numarator çağrısı aynı transaction içinde
        await using var tx = await _db.Database.BeginTransactionAsync(ct);

        var orderNo = await _numberGen.GenerateAsync(DocumentTypes.Order, ct: ct);
        // → "ORD-2026-000042"

        var order = new Order { OrderNumber = orderNo, /* ... */ };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync(ct);

        await tx.CommitAsync(ct);
        return order;
    }

    public async Task<Order> CreateChannelOrderAsync(string channel, CancellationToken ct)
    {
        await using var tx = await _db.Database.BeginTransactionAsync(ct);

        var tokens = new Dictionary<string, string> { ["channel"] = channel };
        var orderNo = await _numberGen.GenerateAsync(DocumentTypes.OrderChannel, tokens, ct);
        // → "ORD-W-2026-000042" veya "ORD-S-2026-000042"

        // ...
        await tx.CommitAsync(ct);
        return order;
    }
}
```

---

## 8. Yeni Document Type Eklemek

1. `INumberFormatStrategy` implement eden bir sınıf yaz
2. `DocumentType` ve `ResetPeriod` property'lerini tanımla
3. `Format(NumberFormatContext)` metodunu implement et
4. `DocumentTypes` sabit class'ına ekle
5. Program.cs'de DI'a kaydet
6. Unit test yaz

---

## 9. Test Senaryoları

Production'a çıkmadan önce test edilmesi gerekenler:

1. **Cold start:** Boş DB, ilk istek → `1` dönmeli
2. **Concurrent cold start:** 50 paralel istek aynı anda → 1'den 50'ye gap'siz
3. **Yıl değişimi:** `2026-12-31 23:59:59` ve `2027-01-01 00:00:01` → ayrı sayaçlar
4. **Rollback senaryosu:** İş transaction'ı rollback → sayaç da geri gelmeli
5. **Reset period değişimi:** Aynı doc type'ın Yearly'den Monthly'ye geçişi → yeni satır
6. **Format strategy unit testleri:** Her strategy için izole format kontrolü

### Örnek Unit Test

```csharp
[Fact]
public void InvoiceFormat_ShouldUseShortYear()
{
    var strategy = new InvoiceFormatStrategy();
    var ctx = new NumberFormatContext(
        "INVOICE", 42, new DateTime(2026, 5, 14));

    var result = strategy.Format(ctx);

    Assert.Equal("FTR/26/000042", result);
}

[Fact]
public void InternationalInvoice_ShouldIncludeQuarter()
{
    var strategy = new InternationalInvoiceFormatStrategy();
    var ctx = new NumberFormatContext(
        "INVOICE_INTL", 5, new DateTime(2026, 11, 15));

    var result = strategy.Format(ctx);

    Assert.Equal("INT-2026-Q4-000005", result);
}
```

---

## 10. Önemli Notlar ve Uyarılar

- **`MAX(Id) + 1` ile numara üretme** — race condition garantili
- **Guid ile prefix birleştirme** — okunabilirlik kötü
- **`HOLDLOCK` (SERIALIZABLE) gereksiz** — `UPDLOCK + ROWLOCK` yeterli, deadlock riski daha düşük
- **`DateTime.UtcNow` kullan** — timezone bug'larını engeller
- **Strategy'ler stateless olmalı** — singleton lifecycle için
- **Format string'i DB'de tutma** — kodda kalsın, iki kaynak senkronizasyon problemi yaratır
- **Document type karşılaştırması case-insensitive** — `ToUpperInvariant()` ile normalize ediliyor
- **Servis kendi transaction'ını AÇMA** — caller'ınkini kullan, gap önleme için kritik

---

## 11. Klasör Yapısı Önerisi

Clean Architecture için:

```
src/
├── Application/
│   └── Numbering/
│       ├── INumberGeneratorService.cs
│       ├── INumberFormatStrategy.cs
│       ├── INumberFormatStrategyResolver.cs
│       ├── NumberFormatContext.cs
│       ├── CounterResetPeriod.cs
│       ├── DocumentTypes.cs
│       └── Strategies/
│           ├── DefaultOrderFormatStrategy.cs
│           ├── InvoiceFormatStrategy.cs
│           ├── InternationalInvoiceFormatStrategy.cs
│           └── ChannelBasedOrderFormatStrategy.cs
└── Infrastructure/
    └── Numbering/
        ├── NumberCounter.cs
        ├── NumberCounterConfiguration.cs
        ├── NumberFormatStrategyResolver.cs
        ├── PeriodKeyCalculator.cs
        └── NumberGeneratorService.cs
```

Daha basit (tek katmanlı) projeler için:

```
src/
└── Numbering/
    ├── Core/             # interface, enum, record, sabitler
    ├── Strategies/       # format strategy implementasyonları
    ├── Persistence/      # entity, configuration
    └── Services/         # generator service, resolver, helper
```

---

## 12. Migration Komutu

```bash
dotnet ef migrations add Add_NumberCounters
dotnet ef database update
```

---

## 13. Performans Notları

- Tek `UPDATE` query, normal koşulda < 1 ms
- `(DocumentType, PeriodKey)` covering index ile seek + update tek operasyon
- Retry loop sadece cold start'ta devreye girer
- Concurrent 1000+ request'te bottleneck satır lock'u — gapless istediğimiz için kabul edilebilir
- Non-gapless ve çok yüksek throughput gerekirse HiLo/Snowflake'e geçilmeli (ama o zaman format'taki sequence anlamını kaybeder)
