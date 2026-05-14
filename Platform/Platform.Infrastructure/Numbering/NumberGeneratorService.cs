using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;
using Platform.Application.Common.Numbering;
using Platform.Domain.Entities.Numbering;
using Platform.Infrastructure.Data;

namespace Platform.Infrastructure.Numbering;

/// <summary>
/// Gapless doküman numarası üreticisi (PostgreSQL).
///
/// <para>
/// Sıra numarası tek bir atomik <c>UPDATE ... RETURNING</c> ile alınır; PostgreSQL
/// bu sırada satır kilidini otomatik alır (SQL Server'daki <c>UPDLOCK</c> hint'ine
/// gerek yoktur). Sorgu DbContext'in mevcut bağlantısı/transaction'ı üzerinde koşar —
/// servis kendi transaction'ını AÇMAZ. Çağıran command handler'ı <c>TransactionBehavior</c>
/// tarafından sarıldığı için numara üretimi iş transaction'ına dahildir: rollback
/// olursa sayaç da geri gelir, gap oluşmaz.
/// </para>
/// </summary>
public class NumberGeneratorService : INumberGeneratorService
{
    private readonly PlatformDbContext _db;
    private readonly INumberFormatStrategyResolver _resolver;
    private readonly ILogger<NumberGeneratorService> _logger;

    private const int MaxRetryAttempts = 3;

    public NumberGeneratorService(
        PlatformDbContext db,
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
                // 1. Mevcut satırı atomik artırmayı dene.
                var nextValue = await TryIncrementExistingAsync(normalizedType, periodKey, ct);
                if (nextValue.HasValue)
                    return nextValue.Value;

                // 2. Satır yok — ilk satırı yaratmayı dene.
                var created = await TryCreateInitialAsync(
                    normalizedType, strategy.ResetPeriod, periodKey, ct);
                if (created.HasValue)
                    return created.Value;

                _logger.LogDebug("Race on cold-start for {DocType}/{Period}, retry {Attempt}",
                    normalizedType, periodKey, attempt);
            }
            catch (DbUpdateException ex) when (IsUniqueConstraintViolation(ex))
            {
                // INSERT'te yarışı kaybettik — bir sonraki turda UPDATE yoluna düşer.
                _logger.LogDebug("Unique constraint hit, retrying for {DocType}/{Period}",
                    normalizedType, periodKey);
            }
        }

        throw new InvalidOperationException(
            $"Failed to generate sequence for {normalizedType}/{periodKey} after {MaxRetryAttempts} attempts.");
    }

    /// <summary>
    /// Mevcut sayaç satırını atomik olarak artırır ve yeni değeri döner.
    /// Satır yoksa <c>null</c> döner. UPDATE ... RETURNING DbContext'in mevcut
    /// bağlantısı/transaction'ı üzerinde koşar.
    /// </summary>
    private async Task<long?> TryIncrementExistingAsync(
        string documentType,
        string periodKey,
        CancellationToken ct)
    {
        const string sql = @"
            UPDATE number_counter
            SET last_value = last_value + 1,
                updated_at = now()
            WHERE document_type = {0} AND period_key = {1}
            RETURNING last_value AS ""Value""";

        var result = await _db.Database
            .SqlQueryRaw<long>(sql, documentType, periodKey)
            .ToListAsync(ct);

        return result.Count > 0 ? result[0] : null;
    }

    /// <summary>
    /// Sayaç satırı yoksa <c>LastValue = 1</c> ile ilk satırı oluşturur.
    /// Unique constraint ihlali olursa <see cref="DbUpdateException"/> fırlatır;
    /// çağıran retry loop bunu yakalar.
    /// </summary>
    private async Task<long?> TryCreateInitialAsync(
        string documentType,
        Domain.Enums.CounterResetPeriod resetPeriod,
        string periodKey,
        CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var counter = new NumberCounter
        {
            DocumentType = documentType,
            ResetPeriod = resetPeriod,
            PeriodKey = periodKey,
            LastValue = 1,
            CreatedAt = now,
            UpdatedAt = now
        };

        _db.NumberCounter.Add(counter);
        await _db.SaveChangesAsync(ct);
        return 1;
    }

    private static bool IsUniqueConstraintViolation(DbUpdateException ex) =>
        ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation };
}
