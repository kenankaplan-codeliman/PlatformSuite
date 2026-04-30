using CodePro.Application.Features.PurchaseOrders.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.PurchaseOrders.Queries.GetPurchaseOrder;

public sealed class GetPurchaseOrderHandler : IRequestHandler<GetPurchaseOrderQuery, Result<PurchaseOrderDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetPurchaseOrderHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PurchaseOrderDetailItem>> Handle(GetPurchaseOrderQuery request, CancellationToken cancellationToken)
    {
        var detail = await PurchaseOrderDetailBuilder.BuildAsync(_db, request.Id, cancellationToken);
        if (detail is null) return PurchaseOrderErrors.NotFound;
        return detail;
    }
}
