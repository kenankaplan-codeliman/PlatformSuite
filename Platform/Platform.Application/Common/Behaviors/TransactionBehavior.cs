using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Platform.Application.Common.Behaviors;

/// <summary>
/// ICommand / ICommand&lt;T&gt; implementasyonlarını UnitOfWork transaction içinde sarar.
/// Handler Result.Success döndürdüyse commit, failure ise rollback.
/// Exception durumunda rollback + rethrow.
/// </summary>
public sealed class TransactionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull, IBaseCommand
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<TransactionBehavior<TRequest, TResponse>> _logger;

    public TransactionBehavior(IUnitOfWork unitOfWork, ILogger<TransactionBehavior<TRequest, TResponse>> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            var response = await next();

            if (response is Result result && result.IsFailure)
            {
                _logger.LogDebug(
                    "{RequestName} Result.Failure döndü, transaction rollback yapılıyor.",
                    typeof(TRequest).Name);
                await _unitOfWork.RollbackTransactionAsync();
                return response;
            }

            await _unitOfWork.CommitTransactionAsync();
            return response;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
