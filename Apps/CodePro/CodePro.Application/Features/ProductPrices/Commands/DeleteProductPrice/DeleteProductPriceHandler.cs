using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.ProductPrices.Commands.DeleteProductPrice;

public sealed class DeleteProductPriceHandler : IRequestHandler<DeleteProductPriceCommand, Result>
{
    private readonly IProductPriceRepository _repository;

    public DeleteProductPriceHandler(IProductPriceRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteProductPriceCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ProductPriceErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
