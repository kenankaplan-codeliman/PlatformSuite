using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.PurchaseBaskets.Commands.DeletePurchaseBasket;

public sealed class DeletePurchaseBasketHandler : IRequestHandler<DeletePurchaseBasketCommand, Result>
{
    private readonly IPurchaseBasketRepository _repository;

    public DeletePurchaseBasketHandler(IPurchaseBasketRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeletePurchaseBasketCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return PurchaseBasketErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
