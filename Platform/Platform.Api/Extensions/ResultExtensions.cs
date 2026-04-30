using Platform.Application.Common.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Extensions;

/// <summary>
/// Application'dan dönen Result / Result&lt;T&gt; değerlerini ASP.NET Core
/// IActionResult'a çevirir. Failure durumlarında RFC 7807 ProblemDetails üretir.
/// </summary>
public static class ResultExtensions
{
    public static IActionResult ToActionResult<T>(this Result<T> result, HttpContext? httpContext = null)
        => result.IsSuccess
            ? new OkObjectResult(result.Value)
            : ToProblem(result.Error, httpContext);

    public static IActionResult ToActionResult(this Result result, HttpContext? httpContext = null)
        => result.IsSuccess
            ? new OkResult()
            : ToProblem(result.Error, httpContext);

    private static IActionResult ToProblem(Error error, HttpContext? httpContext)
    {
        if (error is ValidationError validationError)
        {
            var problem = new ValidationProblemDetails(
                validationError.Failures.ToDictionary(kvp => kvp.Key, kvp => kvp.Value))
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "İstek geçersiz",
                Status = StatusCodes.Status400BadRequest,
                Detail = validationError.Message,
                Instance = httpContext?.Request?.Path,
            };
            problem.Extensions["code"] = validationError.Code;
            problem.Extensions["traceId"] = httpContext?.TraceIdentifier;

            return new ObjectResult(problem) { StatusCode = StatusCodes.Status400BadRequest };
        }

        var statusCode = error.Type switch
        {
            ErrorType.Validation => StatusCodes.Status400BadRequest,
            ErrorType.NotFound => StatusCodes.Status404NotFound,
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            ErrorType.Unauthorized => StatusCodes.Status403Forbidden,
            _ => StatusCodes.Status500InternalServerError,
        };

        var pd = new ProblemDetails
        {
            Type = $"https://crm.local/errors/{error.Code}",
            Title = TitleFor(error.Type),
            Status = statusCode,
            Detail = error.Message,
            Instance = httpContext?.Request?.Path,
        };
        pd.Extensions["code"] = error.Code;
        pd.Extensions["traceId"] = httpContext?.TraceIdentifier;

        return new ObjectResult(pd) { StatusCode = statusCode };
    }

    private static string TitleFor(ErrorType type) => type switch
    {
        ErrorType.Validation => "İstek geçersiz",
        ErrorType.NotFound => "Kayıt bulunamadı",
        ErrorType.Conflict => "İş kuralı ihlali",
        ErrorType.Unauthorized => "Yetkisiz erişim",
        _ => "Beklenmeyen hata",
    };
}
