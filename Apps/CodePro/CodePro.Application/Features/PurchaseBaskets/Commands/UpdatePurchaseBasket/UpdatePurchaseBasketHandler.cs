using CodePro.Application.Features.PurchaseBaskets.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.PurchaseBaskets.Commands.UpdatePurchaseBasket;

public sealed class UpdatePurchaseBasketHandler : IRequestHandler<UpdatePurchaseBasketCommand, Result<PurchaseBasketDetailItem>>
{
    private readonly IPurchaseBasketRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdatePurchaseBasketHandler(IPurchaseBasketRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<PurchaseBasketDetailItem>> Handle(UpdatePurchaseBasketCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return PurchaseBasketErrors.NotFound;

        entity.Status = request.Status;
        entity.PurchaseRequestId = request.PurchaseRequestId;
        await _repository.UpdateAsync(entity, cancellationToken);

        await PurchaseBasketSyncHelper.SyncLinesAsync(_db, entity.Id, request.Lines, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        var detail = await PurchaseBasketDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return PurchaseBasketErrors.NotFound;
        return detail;
    }
}
