using Platform.Application.Common.Results;
using Crm.Application.Interfaces;
using Crm.Application.Features.Products.Dtos;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Products.Queries.GetProduct;

public sealed class GetProductHandler : IRequestHandler<GetProductQuery, Result<ProductDetailItem>>
{
    private readonly ICrmDbContext _db;

    public GetProductHandler(ICrmDbContext db) => _db = db;

    public async Task<Result<ProductDetailItem>> Handle(GetProductQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Product
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (entity is null) return ProductErrors.NotFound;

        return entity.Adapt<ProductDetailItem>();
    }
}
