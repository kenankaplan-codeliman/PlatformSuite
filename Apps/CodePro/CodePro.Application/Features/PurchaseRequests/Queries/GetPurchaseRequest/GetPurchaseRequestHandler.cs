using CodePro.Application.Features.PurchaseRequests.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.PurchaseRequests.Queries.GetPurchaseRequest;

public sealed class GetPurchaseRequestHandler : IRequestHandler<GetPurchaseRequestQuery, Result<PurchaseRequestDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetPurchaseRequestHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PurchaseRequestDetailItem>> Handle(GetPurchaseRequestQuery request, CancellationToken cancellationToken)
    {
        var detail = await PurchaseRequestDetailBuilder.BuildAsync(_db, request.Id, cancellationToken);
        if (detail is null) return PurchaseRequestErrors.NotFound;
        return detail;
    }
}
