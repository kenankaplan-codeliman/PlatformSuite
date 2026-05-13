using Microsoft.Extensions.Configuration;

namespace Platform.Infrastructure.Data;

/// <summary>
/// PostgreSQL connection string'i POSTGRES_* env değişkenlerinden tek noktadan kurar.
/// Hem EF DbContext kaydı (<c>AddPlatformApi</c>) hem de migration runner aynı string'i kullansın diye.
/// </summary>
public static class PlatformConnectionString
{
    public static string Build(IConfiguration configuration)
    {
        var pgHost = configuration["POSTGRES_HOST"] ?? "localhost";
        var pgPort = configuration["POSTGRES_PORT"] ?? "5432";
        var pgDatabase = configuration["POSTGRES_DB"] ?? throw new InvalidOperationException("POSTGRES_DB is not set");
        var pgUser = configuration["POSTGRES_USER"] ?? throw new InvalidOperationException("POSTGRES_USER is not set");
        var pgPassword = configuration["POSTGRES_PASSWORD"] ?? throw new InvalidOperationException("POSTGRES_PASSWORD is not set");
        return $"Host={pgHost};Port={pgPort};Database={pgDatabase};Username={pgUser};Password={pgPassword}";
    }
}
