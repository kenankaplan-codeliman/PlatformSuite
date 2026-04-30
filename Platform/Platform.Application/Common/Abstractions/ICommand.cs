using Platform.Application.Common.Results;
using MediatR;

namespace Platform.Application.Common.Abstractions;

public interface ICommand : IRequest<Result>, IBaseCommand { }

public interface ICommand<TResponse> : IRequest<Result<TResponse>>, IBaseCommand { }

// TransactionBehavior bu marker'ı arar. ICommand ve ICommand<T> bunu miras alır.
public interface IBaseCommand { }
