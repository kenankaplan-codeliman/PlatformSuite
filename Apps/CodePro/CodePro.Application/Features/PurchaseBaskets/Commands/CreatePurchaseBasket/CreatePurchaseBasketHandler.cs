using CodePro.Application.Features.PurchaseBaskets.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.PurchaseBaskets;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.PurchaseBaskets.Commands.CreatePurchaseBasket;

public sealed class CreatePurchaseBasketHandler : IRequestHandler<CreatePurchaseBasketCommand, Result<PurchaseBasketDetailItem>>
{
    private readonly IPurchaseBasketRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreatePurchaseBasketHandler(IPurchaseBasketRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<PurchaseBasketDetailItem>> Handle(CreatePurchaseBasketCommand request, CancellationToken cancellationToken)
    {
        var entity = new PurchaseBasket
        {
            Status = request.Status,
            PurchaseRequestId = request.PurchaseRequestId,
        };
        await _repository.CreateAsync(entity, cancellationToken);

        if (request.Lines.Count > 0)
        {
            await PurchaseBasketSyncHelper.SyncLinesAsync(_db, entity.Id, request.Lines, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);
        }

        var detail = await PurchaseBasketDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return PurchaseBasketErrors.NotFound;
        return detail;
    }
}
