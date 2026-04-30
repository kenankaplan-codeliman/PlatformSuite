using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.ProductCategories.Commands.DeleteProductCategory;

public sealed class DeleteProductCategoryHandler : IRequestHandler<DeleteProductCategoryCommand, Result>
{
    private readonly IProductCategoryRepository _repository;

    public DeleteProductCategoryHandler(IProductCategoryRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteProductCategoryCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ProductCategoryErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
