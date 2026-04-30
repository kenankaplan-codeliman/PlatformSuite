using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Platform.Application.Common.Behaviors;

public sealed class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;

        using var scope = _logger.BeginScope(new Dictionary<string, object>
        {
            ["RequestName"] = requestName,
        });

        var sw = Stopwatch.StartNew();
        try
        {
            var response = await next();
            sw.Stop();

            _logger.LogInformation(
                "{RequestName} tamamlandı ({DurationMs} ms)",
                requestName, sw.ElapsedMilliseconds);

            return response;
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex,
                "{RequestName} hata ({DurationMs} ms)",
                requestName, sw.ElapsedMilliseconds);
            throw;
        }
    }
}
