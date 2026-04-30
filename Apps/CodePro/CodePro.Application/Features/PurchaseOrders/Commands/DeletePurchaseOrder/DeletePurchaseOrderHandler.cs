using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.PurchaseOrders.Commands.DeletePurchaseOrder;

public sealed class DeletePurchaseOrderHandler : IRequestHandler<DeletePurchaseOrderCommand, Result>
{
    private readonly IPurchaseOrderRepository _repository;

    public DeletePurchaseOrderHandler(IPurchaseOrderRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeletePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return PurchaseOrderErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
