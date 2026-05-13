using Npgsql;

namespace Platform.Infrastructure.Data.Migrations;

/// <summary>
/// PostgreSQL session-level advisory lock. Birden fazla API replica'sı aynı anda
/// migration başlatırsa yalnızca biri ilerler, diğer(ler)i lock'u bekler. Lock
/// scope dispose edildiğinde otomatik bırakılır; uzun süre tutmamak gerekir.
/// </summary>
public sealed class PostgresAdvisoryLock : IAsyncDisposable
{
    private readonly NpgsqlConnection _connection;
    private readonly long _lockKey;

    private PostgresAdvisoryLock(NpgsqlConnection connection, long lockKey)
    {
        _connection = connection;
        _lockKey = lockKey;
    }

    public static async Task<PostgresAdvisoryLock> AcquireAsync(
        string connectionString,
        long lockKey,
        CancellationToken cancellationToken)
    {
        var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT pg_advisory_lock(@key)";
        cmd.Parameters.AddWithValue("key", lockKey);
        await cmd.ExecuteNonQueryAsync(cancellationToken);

        return new PostgresAdvisoryLock(connection, lockKey);
    }

    public async ValueTask DisposeAsync()
    {
        try
        {
            await using var cmd = _connection.CreateCommand();
            cmd.CommandText = "SELECT pg_advisory_unlock(@key)";
            cmd.Parameters.AddWithValue("key", _lockKey);
            await cmd.ExecuteNonQueryAsync();
        }
        finally
        {
            await _connection.DisposeAsync();
        }
    }
}
