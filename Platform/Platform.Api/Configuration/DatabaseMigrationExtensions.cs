using Platform.Application.Common.Database;

namespace Platform.Api.Configuration;

/// <summary>
/// API başlatılırken DB migration'larını koşturur. <see cref="IDatabaseMigrator"/>
/// her app'in Infrastructure projesinde implement edilir (CrmDatabaseMigrator, CodeProDatabaseMigrator).
/// <c>Program.cs</c>'te <c>app.UsePlatformPipeline()</c>'tan önce çağrılmalı; migration başarısızsa
/// exception fırlatır ve <c>app.Run()</c> çalıştırılmaz.
/// </summary>
public static class DatabaseMigrationExtensions
{
    public static async Task RunDatabaseMigrationsAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var migrator = scope.ServiceProvider.GetRequiredService<IDatabaseMigrator>();
        await migrator.MigrateAsync(app.Lifetime.ApplicationStopping);
    }
}
