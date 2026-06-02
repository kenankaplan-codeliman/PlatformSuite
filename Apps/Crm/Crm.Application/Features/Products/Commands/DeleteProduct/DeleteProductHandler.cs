using Platform.Application.Common.Results;
using Crm.Application.Interfaces;
using MediatR;

namespace Crm.Application.Features.Products.Commands.DeleteProduct;

public sealed class DeleteProductHandler : IRequestHandler<DeleteProductCommand, Result>
{
    private readonly IProductRepository _repository;

    public DeleteProductHandler(IProductRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        foreach (var id in request.Ids)
        {
            var entity = await _repository.GetAsync(id, cancellationToken);
            if (entity is null) return ProductErrors.NotFound;
            await _repository.DeleteAsync(entity, cancellationToken);
        }

        return Result.Success();
    }
}
