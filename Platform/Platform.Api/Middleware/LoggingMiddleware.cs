using System.Diagnostics;
using System.Text;
using Serilog.Context;
using Platform.Api.Common;
using System.Net;

namespace Platform.Api.Middleware;

public sealed class LoggingMiddleware
{
    public sealed record LogDecision(LogLevel Level, string Message);

    private readonly RequestDelegate _next;
    private readonly ILogger<LoggingMiddleware> _logger;

    public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        var correlationId =
            context.Items["X-Correlation-Id"]?.ToString();

        // -------- REQUEST --------
        context.Request.EnableBuffering();

        var requestBody = await ReadRequestBodyAsync(context.Request);
        requestBody = LogMaskingHelper.MaskJson(requestBody);

        var requestHeaders = LogMaskingHelper.MaskHeaders(context.Request.Headers);

        // -------- RESPONSE --------
        var originalBody = context.Response.Body;
        await using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        var userId = context.User?.Identity?.Name
              ?? context.User?.FindFirst("sub")?.Value;


        using (LogContext.PushProperty("CorrelationId", correlationId))
        using (LogContext.PushProperty("UserId", userId))
        using (LogContext.PushProperty("HttpMethod", context.Request.Method))
        using (LogContext.PushProperty("Path", context.Request.Path.Value))
        {
            try
            {
                await _next(context);
            }
            finally
            {
                stopwatch.Stop();

                var responseText = await ReadResponseBodyAsync(context.Response);
                responseText = LogMaskingHelper.MaskJson(responseText);

                Exception? exception = context.Items.TryGetValue("__exception", out var ex) ? ex as Exception : null;

                // -------- STRUCTURED LOGGING --------

                using (LogContext.PushProperty("StatusCode", context.Response.StatusCode))
                using (LogContext.PushProperty("DurationMs", stopwatch.ElapsedMilliseconds))
                using (LogContext.PushProperty("RequestHeaders", requestHeaders))
                using (LogContext.PushProperty("RequestBody", requestBody))
                using (LogContext.PushProperty("ResponseBody", responseText))
                using (LogContext.PushProperty("Exception", exception, destructureObjects: true))
                {
                    var decision = GetLogDecision(context.Response.StatusCode, exception);

                    _logger.Log(decision.Level, exception, decision.Message);
                }
            }

            responseBody.Position = 0;
            await responseBody.CopyToAsync(originalBody);
        }
    }




    // ----------------- Helpers -----------------

    private static async Task<string> ReadRequestBodyAsync(HttpRequest request)
    {
        request.Body.Position = 0;

        using var reader = new StreamReader(
            request.Body,
            Encoding.UTF8,
            leaveOpen: true);

        var body = await reader.ReadToEndAsync();
        request.Body.Position = 0;

        return body;
    }

    private static async Task<string> ReadResponseBodyAsync(HttpResponse response)
    {
        response.Body.Position = 0;

        using var reader = new StreamReader(
            response.Body,
            Encoding.UTF8,
            leaveOpen: true);

        var text = await reader.ReadToEndAsync();
        response.Body.Position = 0;

        return text;
    }

    private LogDecision GetLogDecision(int statusCode, Exception? exception)
    {
        if (exception != null)
        {
            return new LogDecision(
                LogLevel.Error,
                "HTTP request failed with exception");
        }

        if (statusCode >= StatusCodes.Status500InternalServerError)
        {
            return new LogDecision(
                LogLevel.Error,
                $"HTTP request failed with server error {statusCode}");
        }

        if (statusCode == StatusCodes.Status401Unauthorized)
        {
            return new LogDecision(
                LogLevel.Warning,
                "Authentication failed (401 Unauthorized)");
        }

        if (statusCode == StatusCodes.Status403Forbidden)
        {
            return new LogDecision(
                LogLevel.Warning,
                "Authorization failed (403 Forbidden)");
        }

        if (statusCode >= StatusCodes.Status400BadRequest)
        {
            return new LogDecision(
                LogLevel.Warning,
                $"HTTP request completed with client error {statusCode}");
        }

        return new LogDecision(
            LogLevel.Information,
            $"HTTP request completed successfully with status code {statusCode}");
    }

}
