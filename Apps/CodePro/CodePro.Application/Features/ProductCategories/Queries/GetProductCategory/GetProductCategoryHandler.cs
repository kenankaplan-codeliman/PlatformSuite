using CodePro.Application.Features.ProductCategories.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductCategories.Queries.GetProductCategory;

public sealed class GetProductCategoryHandler : IRequestHandler<GetProductCategoryQuery, Result<ProductCategoryDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetProductCategoryHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<ProductCategoryDetailItem>> Handle(GetProductCategoryQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.ProductCategory
            .AsNoTracking()
            .Include(c => c.ParentCategory)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (entity is null) return ProductCategoryErrors.NotFound;

        return entity.Adapt<ProductCategoryDetailItem>();
    }
}
