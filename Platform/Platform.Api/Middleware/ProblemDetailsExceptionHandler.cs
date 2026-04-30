using Platform.Application.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Middleware;

/// <summary>
/// Result.Failure path'i ResultExtensions.ToActionResult ile ProblemDetails üretir.
/// Bu handler yalnızca handler'a ulaşmadan veya Result sözleşmesi dışında oluşan
/// beklenmedik exception'ları yakalar ve RFC 7807 ProblemDetails cevabı döner.
/// Eski domain exception tiplerine de geriye uyumluluk için map uygular.
/// </summary>
public sealed class ProblemDetailsExceptionHandler : IExceptionHandler
{
    private readonly ILogger<ProblemDetailsExceptionHandler> _logger;

    public ProblemDetailsExceptionHandler(ILogger<ProblemDetailsExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (status, title, type) = exception switch
        {
            BusinessException       => (StatusCodes.Status400BadRequest, "İş kuralı ihlali", "Business"),
            UnAuthenticatedException => (StatusCodes.Status401Unauthorized, "Kimlik doğrulanamadı", "Unauthenticated"),
            UnauthorizedAccessException => (StatusCodes.Status403Forbidden, "Yetkisiz erişim", "Unauthorized"),
            KeyNotFoundException     => (StatusCodes.Status404NotFound, "Kayıt bulunamadı", "NotFound"),
            _                        => (StatusCodes.Status500InternalServerError, "Beklenmeyen hata", "Unhandled"),
        };

        if (status == StatusCodes.Status500InternalServerError)
            _logger.LogError(exception, "Unhandled exception — Path: {Path}", httpContext.Request.Path);

        var problem = new ProblemDetails
        {
            Type = $"https://crm.local/errors/{type}",
            Title = title,
            Status = status,
            Detail = exception.Message,
            Instance = httpContext.Request.Path,
        };
        problem.Extensions["code"] = type;
        problem.Extensions["traceId"] = httpContext.TraceIdentifier;

        httpContext.Response.StatusCode = status;
        httpContext.Response.ContentType = "application/problem+json";
        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);

        return true;
    }
}
