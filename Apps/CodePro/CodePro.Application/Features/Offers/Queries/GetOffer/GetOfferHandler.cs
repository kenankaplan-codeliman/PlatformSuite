using CodePro.Application.Features.Offers.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.Offers.Queries.GetOffer;

public sealed class GetOfferHandler : IRequestHandler<GetOfferQuery, Result<OfferDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetOfferHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<OfferDetailItem>> Handle(GetOfferQuery request, CancellationToken cancellationToken)
    {
        var detail = await OfferDetailBuilder.BuildAsync(_db, request.Id, cancellationToken);
        if (detail is null) return OfferErrors.NotFound;
        return detail;
    }
}
