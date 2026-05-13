using DbUp.Engine.Output;
using Microsoft.Extensions.Logging;

namespace Platform.Infrastructure.Data.Migrations;

/// <summary>
/// DbUp <see cref="IUpgradeLog"/> mesajlarını standart <see cref="ILogger"/>'a forward eder.
/// Böylece migration log'ları Serilog'un Elasticsearch/Console sink'lerine düşer.
/// </summary>
public sealed class SerilogDbUpLogAdapter(ILogger logger) : IUpgradeLog
{
    public void LogTrace(string format, params object[] args) =>
        logger.LogTrace(format, args);

    public void LogDebug(string format, params object[] args) =>
        logger.LogDebug(format, args);

    public void LogInformation(string format, params object[] args) =>
        logger.LogInformation(format, args);

    public void LogWarning(string format, params object[] args) =>
        logger.LogWarning(format, args);

    public void LogError(string format, params object[] args) =>
        logger.LogError(format, args);

    public void LogError(System.Exception ex, string format, params object[] args) =>
        logger.LogError(ex, format, args);
}
