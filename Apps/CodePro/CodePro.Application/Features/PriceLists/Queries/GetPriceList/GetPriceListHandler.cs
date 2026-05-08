using CodePro.Application.Features.PriceLists.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PriceLists.Queries.GetPriceList;

public sealed class GetPriceListHandler : IRequestHandler<GetPriceListQuery, Result<PriceListDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetPriceListHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PriceListDetailItem>> Handle(GetPriceListQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.PriceList.AsNoTracking()
            .Include(p => p.Supplier)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (entity is null) return PriceListErrors.NotFound;
        return entity.Adapt<PriceListDetailItem>();
    }
}
