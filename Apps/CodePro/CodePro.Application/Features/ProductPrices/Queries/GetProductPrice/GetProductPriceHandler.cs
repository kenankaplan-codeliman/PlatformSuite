using CodePro.Application.Features.ProductPrices.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductPrices.Queries.GetProductPrice;

public sealed class GetProductPriceHandler : IRequestHandler<GetProductPriceQuery, Result<ProductPriceDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetProductPriceHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<ProductPriceDetailItem>> Handle(GetProductPriceQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.ProductPrice.AsNoTracking()
            .Include(p => p.Product)
            .Include(p => p.SupplierAccount)
            .Include(p => p.PriceList)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (entity is null) return ProductPriceErrors.NotFound;
        return entity.Adapt<ProductPriceDetailItem>();
    }
}
