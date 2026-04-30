using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.PurchaseRequests.Commands.DeletePurchaseRequest;

public sealed class DeletePurchaseRequestHandler : IRequestHandler<DeletePurchaseRequestCommand, Result>
{
    private readonly IPurchaseRequestRepository _repository;

    public DeletePurchaseRequestHandler(IPurchaseRequestRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeletePurchaseRequestCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return PurchaseRequestErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
