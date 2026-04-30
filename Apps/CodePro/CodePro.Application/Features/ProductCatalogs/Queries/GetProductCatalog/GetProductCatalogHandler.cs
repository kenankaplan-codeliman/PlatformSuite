using CodePro.Application.Features.ProductCatalogs.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.ProductCatalogs.Queries.GetProductCatalog;

public sealed class GetProductCatalogHandler : IRequestHandler<GetProductCatalogQuery, Result<ProductCatalogDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetProductCatalogHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<ProductCatalogDetailItem>> Handle(GetProductCatalogQuery request, CancellationToken cancellationToken)
    {
        var detail = await ProductCatalogDetailBuilder.BuildAsync(_db, request.Id, cancellationToken);
        if (detail is null) return ProductCatalogErrors.NotFound;
        return detail;
    }
}
