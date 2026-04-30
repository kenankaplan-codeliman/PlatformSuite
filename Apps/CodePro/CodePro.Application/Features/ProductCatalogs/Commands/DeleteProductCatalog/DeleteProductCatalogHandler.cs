using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.ProductCatalogs.Commands.DeleteProductCatalog;

public sealed class DeleteProductCatalogHandler : IRequestHandler<DeleteProductCatalogCommand, Result>
{
    private readonly IProductCatalogRepository _repository;

    public DeleteProductCatalogHandler(IProductCatalogRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteProductCatalogCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ProductCatalogErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
