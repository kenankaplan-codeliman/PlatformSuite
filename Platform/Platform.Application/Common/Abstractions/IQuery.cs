using Platform.Application.Common.Results;
using MediatR;

namespace Platform.Application.Common.Abstractions;

public interface IQuery<TResponse> : IRequest<Result<TResponse>> { }
