using DbUp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Platform.Application.Common.Database;
using Platform.Application.Common.Security;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Migrations;

namespace CodePro.Infrastructure.Data.Migrations;

/// <summary>
/// CodePro veritabanı için DbUp tabanlı migration runner. Platform paylaşılan script'leri ve
/// CodePro script'leri tek bir sıralı pipeline'da koşturulur; sıra
/// <see cref="ScriptOrderComparer"/> tarafından belirlenir:
/// <c>Schema</c> (DDL: CREATE/ALTER/DROP) → <c>InitData</c> (zorunlu seed) → <c>SampleData</c>
/// (production hariç ortamlarda). Platform InitData'nın referans verdiği password hash
/// değişkenleri runtime'da <see cref="IPasswordHasher"/> ile hesaplanır.
/// </summary>
public sealed class CodeProDatabaseMigrator(
    IConfiguration configuration,
    IPasswordHasher passwordHasher,
    IHostEnvironment hostEnvironment,
    ILogger<CodeProDatabaseMigrator> logger) : IDatabaseMigrator
{
    private const string AppScriptsNamespace = "CodePro.Infrastructure.Data.Scripts";
    private const long AdvisoryLockKey = 727_002L;

    public async Task MigrateAsync(CancellationToken cancellationToken)
    {
        var connectionString = PlatformConnectionString.Build(configuration);
        var variables = SeedPasswordVariables.Build(passwordHasher);
        var includeSampleData = !hostEnvironment.IsProduction();

        await using var _ = await PostgresAdvisoryLock.AcquireAsync(connectionString, AdvisoryLockKey, cancellationToken);

        var upgrader = DeployChanges.To.PostgresqlDatabase(connectionString)
            .WithScriptsEmbeddedInAssembly(
                PlatformScriptSource.Assembly,
                PlatformScriptSource.MatchesFor(includeSampleData))
            .WithScriptsEmbeddedInAssembly(
                typeof(CodeProDatabaseMigrator).Assembly,
                ScriptFilter.Build(AppScriptsNamespace, includeSampleData))
            .WithTransactionPerScript()
            .WithExecutionTimeout(TimeSpan.FromMinutes(5))
            .WithScriptNameComparer(ScriptOrderComparer.Instance)
            .WithVariables(variables)
            .JournalToPostgresqlTable("public", "__schema_versions")
            .LogTo(new SerilogDbUpLogAdapter(logger))
            .Build();

        var result = upgrader.PerformUpgrade();
        if (!result.Successful)
            throw new InvalidOperationException(
                $"CodePro migrations failed (last script: {result.ErrorScript?.Name}).",
                result.Error);

        logger.LogInformation(
            "CodePro migrations completed. {Count} script(s) applied (SampleData {SampleDataState}).",
            result.Scripts.Count(),
            includeSampleData ? "included" : "excluded");
    }
}
