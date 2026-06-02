using Platform.Application.Common.Results;
using Crm.Application.Interfaces;
using MediatR;

namespace Crm.Application.Features.Products.Commands.SetStateProduct;

public sealed class SetStateProductHandler : IRequestHandler<SetStateProductCommand, Result>
{
    private readonly IProductRepository _repository;

    public SetStateProductHandler(IProductRepository repository) => _repository = repository;

    public async Task<Result> Handle(SetStateProductCommand request, CancellationToken cancellationToken)
    {
        await _repository.SetStateAsync(request.Ids, request.IsActive, cancellationToken);
        return Result.Success();
    }
}
