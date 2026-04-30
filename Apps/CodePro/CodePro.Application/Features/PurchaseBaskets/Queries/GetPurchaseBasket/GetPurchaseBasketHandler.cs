using CodePro.Application.Features.PurchaseBaskets.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.PurchaseBaskets.Queries.GetPurchaseBasket;

public sealed class GetPurchaseBasketHandler : IRequestHandler<GetPurchaseBasketQuery, Result<PurchaseBasketDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetPurchaseBasketHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PurchaseBasketDetailItem>> Handle(GetPurchaseBasketQuery request, CancellationToken cancellationToken)
    {
        var detail = await PurchaseBasketDetailBuilder.BuildAsync(_db, request.Id, cancellationToken);
        if (detail is null) return PurchaseBasketErrors.NotFound;
        return detail;
    }
}
