using CodePro.Application.Features.Brands.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Brands.Queries.GetBrand;

public sealed class GetBrandHandler : IRequestHandler<GetBrandQuery, Result<BrandDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetBrandHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<BrandDetailItem>> Handle(GetBrandQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Brand
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (entity is null) return BrandErrors.NotFound;

        return entity.Adapt<BrandDetailItem>();
    }
}
