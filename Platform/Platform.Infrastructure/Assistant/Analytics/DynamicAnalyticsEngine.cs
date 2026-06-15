using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;
using Platform.Application.Common.Assistant.Analytics;
using Platform.Domain.Entities.Common;
using Platform.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Platform.Infrastructure.Assistant.Analytics;

/// <summary>
/// Reflection + expression-tree tabanlı, entity-bağımsız analitik motoru. Entity'ler ve alanlar
/// runtime'da <see cref="DbContext.Model"/>'den keşfedilir (yalnız IOwnedEntity); sorgular
/// <see cref="DbContext.Set{TEntity}()"/> üzerinden kurulur, böylece EF global query filter'ı
/// satır-bazlı yetkiyi otomatik uygular. Ham SQL ve dış bağımlılık yok.
/// </summary>
public sealed class DynamicAnalyticsEngine : IAnalyticsEngine
{
    // Teknik alanlar — analitikte ne boyut ne ölçü olarak sunulur.
    private static readonly HashSet<string> ExcludedFields = new(StringComparer.OrdinalIgnoreCase)
    {
        "Id", "OwnerId", "OrganizationId", "CreatedBy", "UpdatedBy", "DeletedBy",
        "IsDeleted", "DeletedAt",
    };

    private static readonly MethodInfo EfPropertyGeneric =
        typeof(EF).GetMethod(nameof(EF.Property))!;

    private readonly PlatformDbContext _db;

    public DynamicAnalyticsEngine(PlatformDbContext db) => _db = db;

    // ── Catalog (analytics_schema) ───────────────────────────────────────────
    public AnalyticsCatalog GetCatalog(string? entity)
    {
        if (string.IsNullOrWhiteSpace(entity))
            return new AnalyticsCatalog { Entities = AnalyzableEntityTypes().Select(e => e.ClrType.Name).OrderBy(n => n).ToList() };

        var et = ResolveEntity(entity);
        var (dimensions, measures, dates, _) = Categorize(et);
        return new AnalyticsCatalog
        {
            Entity = et.ClrType.Name,
            Dimensions = dimensions.OrderBy(n => n).ToList(),
            Measures = measures.OrderBy(n => n).ToList(),
            DateFields = dates.OrderBy(n => n).ToList(),
        };
    }

    // ── Run (analytics_query) ────────────────────────────────────────────────
    public Task<AnalyticsResult> RunAsync(AnalyticsSpec spec, CancellationToken cancellationToken = default)
    {
        var et = ResolveEntity(spec.Entity);
        var (dimensions, measures, _, propTypes) = Categorize(et);

        // GroupBy doğrula (string boyut)
        string? groupBy = null;
        if (!string.IsNullOrWhiteSpace(spec.GroupBy))
        {
            groupBy = Canonical(dimensions, spec.GroupBy)
                ?? throw new ArgumentException($"Geçersiz groupBy alanı '{spec.GroupBy}'. Geçerli boyutlar: {string.Join(", ", dimensions)}");
        }

        // Measure doğrula (sayısal)
        string? measure = null;
        if (!string.IsNullOrWhiteSpace(spec.Measure))
        {
            measure = Canonical(measures, spec.Measure)
                ?? throw new ArgumentException($"Geçersiz measure alanı '{spec.Measure}'. Geçerli ölçüler: {string.Join(", ", measures)}");
        }

        // Aggregations
        var aggs = (spec.Aggregations.Count == 0 ? new List<string> { "count" } : spec.Aggregations)
            .Select(a => a.Trim().ToLowerInvariant() == "average" ? "avg" : a.Trim().ToLowerInvariant())
            .ToList();
        var needsMeasure = aggs.Any(a => a is "sum" or "avg" or "min" or "max");
        if (needsMeasure && measure is null)
            throw new ArgumentException($"sum/avg/min/max için 'measure' (sayısal alan) gerekli. Geçerli ölçüler: {string.Join(", ", measures)}");

        // Filtreler doğrula + canonical isim
        var filters = new List<(string Field, string Op, Type Type, object? Value)>();
        foreach (var f in spec.Filters)
        {
            if (!propTypes.TryGetValue(f.Field, out var ftype) || ExcludedFields.Contains(f.Field))
                throw new ArgumentException($"Geçersiz filtre alanı '{f.Field}'.");
            var canonField = propTypes.Keys.First(k => string.Equals(k, f.Field, StringComparison.OrdinalIgnoreCase));
            var op = f.Op.Trim().ToLowerInvariant();
            var value = ParseValue(ftype, f.Value, canonField, op);
            filters.Add((canonField, op, ftype, value));
        }

        var resolvedSpec = new ResolvedSpec(measure, measure is null ? null : propTypes[measure], groupBy, aggs, filters);

        var method = typeof(DynamicAnalyticsEngine)
            .GetMethod(nameof(RunTypedAsync), BindingFlags.NonPublic | BindingFlags.Instance)!
            .MakeGenericMethod(et.ClrType);

        return (Task<AnalyticsResult>)method.Invoke(this, new object[] { resolvedSpec, et.ClrType.Name, cancellationToken })!;
    }

    private sealed record ResolvedSpec(
        string? Measure, Type? MeasureType, string? GroupBy, List<string> Aggregations,
        List<(string Field, string Op, Type Type, object? Value)> Filters);

    private async Task<AnalyticsResult> RunTypedAsync<TEntity>(ResolvedSpec spec, string entityName, CancellationToken ct)
        where TEntity : class
    {
        IQueryable<TEntity> query = _db.Set<TEntity>().AsNoTracking();

        var param = Expression.Parameter(typeof(TEntity), "e");

        // Filtreler
        foreach (var f in spec.Filters)
        {
            var predicate = BuildFilter<TEntity>(param, f.Field, f.Op, f.Type, f.Value);
            query = query.Where(predicate);
        }

        // Key (string) + Value (decimal?) projeksiyonu → IQueryable<AggRow>
        Expression keyExpr = spec.GroupBy is null
            ? Expression.Constant(string.Empty)
            : Expression.Coalesce(EfProp(param, spec.GroupBy, typeof(string)), Expression.Constant("(Belirtilmemiş)"));

        Expression valueExpr = spec.Measure is null
            ? Expression.Constant(null, typeof(decimal?))
            : Expression.Convert(EfProp(param, spec.Measure, spec.MeasureType!), typeof(decimal?));

        var projection = Expression.Lambda<Func<TEntity, AggRow>>(
            Expression.MemberInit(
                Expression.New(typeof(AggRow)),
                Expression.Bind(typeof(AggRow).GetProperty(nameof(AggRow.Key))!, keyExpr),
                Expression.Bind(typeof(AggRow).GetProperty(nameof(AggRow.Value))!, valueExpr)),
            param);

        var projected = query.Select(projection);

        var hasMeasure = spec.Measure is not null;
        List<AnalyticsRow> rows;

        if (spec.GroupBy is null)
        {
            // Tek toplam satır — sabit anahtara göre grupla(ma); doğrudan aggregate (en sağlam EF çevirisi).
            var row = new AnalyticsRow { Key = string.Empty, Count = await projected.LongCountAsync(ct) };
            if (hasMeasure)
            {
                if (spec.Aggregations.Contains("sum")) row.Sum = await projected.SumAsync(x => x.Value, ct);
                if (spec.Aggregations.Contains("avg")) row.Average = await projected.AverageAsync(x => x.Value, ct);
                if (spec.Aggregations.Contains("min")) row.Min = await projected.MinAsync(x => x.Value, ct);
                if (spec.Aggregations.Contains("max")) row.Max = await projected.MaxAsync(x => x.Value, ct);
            }
            rows = new List<AnalyticsRow> { row };
        }
        else
        {
            List<AggOut> raw = hasMeasure
                ? await projected.GroupBy(x => x.Key)
                    .Select(g => new AggOut
                    {
                        Key = g.Key,
                        Count = g.Count(),
                        Sum = g.Sum(x => x.Value),
                        Average = g.Average(x => x.Value),
                        Min = g.Min(x => x.Value),
                        Max = g.Max(x => x.Value),
                    })
                    .ToListAsync(ct)
                : await projected.GroupBy(x => x.Key)
                    .Select(g => new AggOut { Key = g.Key, Count = g.Count() })
                    .ToListAsync(ct);

            rows = raw
                .Select(r => new AnalyticsRow
                {
                    Key = r.Key,
                    Count = r.Count,
                    Sum = hasMeasure && spec.Aggregations.Contains("sum") ? r.Sum : null,
                    Average = hasMeasure && spec.Aggregations.Contains("avg") ? r.Average : null,
                    Min = hasMeasure && spec.Aggregations.Contains("min") ? r.Min : null,
                    Max = hasMeasure && spec.Aggregations.Contains("max") ? r.Max : null,
                })
                .OrderByDescending(r => r.Sum ?? r.Count)
                .ToList();
        }

        return new AnalyticsResult
        {
            Description = BuildDescription(entityName, spec),
            Rows = rows,
        };
    }

    // ── Expression helpers ───────────────────────────────────────────────────
    private static Expression EfProp(Expression param, string name, Type propType) =>
        Expression.Call(EfPropertyGeneric.MakeGenericMethod(propType), param, Expression.Constant(name));

    private static Expression<Func<TEntity, bool>> BuildFilter<TEntity>(
        ParameterExpression param, string field, string op, Type type, object? value)
    {
        var left = EfProp(param, field, type);
        var underlying = Nullable.GetUnderlyingType(type) ?? type;

        Expression body;
        if (op == "contains")
        {
            if (underlying != typeof(string))
                throw new ArgumentException($"'contains' yalnız metin alanlarında kullanılır ('{field}').");
            var containsMethod = typeof(string).GetMethod(nameof(string.Contains), new[] { typeof(string) })!;
            body = Expression.Call(left, containsMethod, Expression.Constant(value, typeof(string)));
        }
        else
        {
            var right = Expression.Constant(value, type);
            body = op switch
            {
                "eq" => Expression.Equal(left, right),
                "neq" => Expression.NotEqual(left, right),
                "gt" => Expression.GreaterThan(left, right),
                "gte" => Expression.GreaterThanOrEqual(left, right),
                "lt" => Expression.LessThan(left, right),
                "lte" => Expression.LessThanOrEqual(left, right),
                _ => throw new ArgumentException($"Geçersiz operatör '{op}'. (eq/neq/gt/gte/lt/lte/contains)"),
            };
        }

        return Expression.Lambda<Func<TEntity, bool>>(body, param);
    }

    private static object? ParseValue(Type type, string? raw, string field, string op)
    {
        if (raw is null)
            return null;

        var underlying = Nullable.GetUnderlyingType(type) ?? type;
        try
        {
            object parsed = underlying switch
            {
                _ when underlying == typeof(string) => raw,
                _ when underlying == typeof(int) => int.Parse(raw, CultureInfo.InvariantCulture),
                _ when underlying == typeof(long) => long.Parse(raw, CultureInfo.InvariantCulture),
                _ when underlying == typeof(short) => short.Parse(raw, CultureInfo.InvariantCulture),
                _ when underlying == typeof(decimal) => decimal.Parse(raw, CultureInfo.InvariantCulture),
                _ when underlying == typeof(double) => double.Parse(raw, CultureInfo.InvariantCulture),
                _ when underlying == typeof(float) => float.Parse(raw, CultureInfo.InvariantCulture),
                _ when underlying == typeof(bool) => bool.Parse(raw),
                _ when underlying == typeof(DateTime) => DateTime.Parse(raw, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind),
                _ when underlying == typeof(Guid) => Guid.Parse(raw),
                _ => throw new ArgumentException($"'{field}' alanı için filtre desteklenmiyor."),
            };
            return parsed;
        }
        catch (FormatException)
        {
            throw new ArgumentException($"'{field}' için geçersiz değer: '{raw}'.");
        }
    }

    // ── Discovery / categorization ───────────────────────────────────────────
    private IEnumerable<IEntityType> AnalyzableEntityTypes() =>
        _db.Model.GetEntityTypes()
            .Where(et => !et.IsOwned()
                         && et.ClrType is not null
                         && typeof(IOwnedEntity).IsAssignableFrom(et.ClrType))
            .GroupBy(et => et.ClrType)
            .Select(g => g.First());

    private IEntityType ResolveEntity(string entity)
    {
        var match = AnalyzableEntityTypes()
            .FirstOrDefault(et => string.Equals(et.ClrType.Name, entity, StringComparison.OrdinalIgnoreCase));
        if (match is null)
            throw new ArgumentException(
                $"Geçersiz entity '{entity}'. Geçerli entity'ler: {string.Join(", ", AnalyzableEntityTypes().Select(e => e.ClrType.Name).OrderBy(n => n))}");
        return match;
    }

    private static (List<string> Dimensions, List<string> Measures, List<string> Dates, Dictionary<string, Type> PropTypes)
        Categorize(IEntityType et)
    {
        var dimensions = new List<string>();
        var measures = new List<string>();
        var dates = new List<string>();
        var propTypes = new Dictionary<string, Type>(StringComparer.OrdinalIgnoreCase);

        foreach (var p in et.GetProperties())
        {
            var name = p.Name;
            if (ExcludedFields.Contains(name))
                continue;

            var type = p.ClrType;
            propTypes[name] = type;
            var underlying = Nullable.GetUnderlyingType(type) ?? type;

            if (underlying == typeof(string))
                dimensions.Add(name);
            else if (IsNumeric(underlying))
                measures.Add(name);
            else if (underlying == typeof(DateTime))
                dates.Add(name);
        }

        return (dimensions, measures, dates, propTypes);
    }

    private static bool IsNumeric(Type t) =>
        t == typeof(int) || t == typeof(long) || t == typeof(short) ||
        t == typeof(decimal) || t == typeof(double) || t == typeof(float);

    private static string? Canonical(IEnumerable<string> allowed, string name) =>
        allowed.FirstOrDefault(a => string.Equals(a, name, StringComparison.OrdinalIgnoreCase));

    private static string BuildDescription(string entityName, ResolvedSpec spec)
    {
        var olcu = spec.Measure is null ? "adet" : $"{spec.Measure} ({string.Join("/", spec.Aggregations)})";
        var kirilim = spec.GroupBy is null ? "toplam" : $"{spec.GroupBy} kırılımı";
        return $"{entityName} — {kirilim}, ölçü: {olcu}";
    }

    // ── Intermediate shapes (EF projeksiyonu) ────────────────────────────────
    private sealed class AggRow
    {
        public string Key { get; set; } = string.Empty;
        public decimal? Value { get; set; }
    }

    private sealed class AggOut
    {
        public string Key { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal? Sum { get; set; }
        public decimal? Average { get; set; }
        public decimal? Min { get; set; }
        public decimal? Max { get; set; }
    }
}
