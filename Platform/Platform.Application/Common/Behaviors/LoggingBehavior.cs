using MediatR;
using Platform.Application.Common.Results;
using Serilog.Context;

namespace Platform.Application.Common.Behaviors;

public sealed class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Push'lar bilinçli olarak dispose edilmiyor — middleware emit'i behavior
        // döndükten sonra olduğu için scope orada hâlâ aktif olmalı.
        // AsyncLocal request bitiminde otomatik temizleniyor.
        LogContext.PushProperty("MediatRRequestName", typeof(TRequest).Name);

        var response = await next();

        if (response is Result r)
            LogContext.PushProperty("ResultStatus", r.IsSuccess ? "success" : r.Error.Code);

        return response;
    }
}
