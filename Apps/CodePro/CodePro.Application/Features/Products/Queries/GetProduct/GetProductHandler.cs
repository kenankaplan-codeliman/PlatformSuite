using CodePro.Application.Features.Products.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.Products.Queries.GetProduct;

public sealed class GetProductHandler : IRequestHandler<GetProductQuery, Result<ProductDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetProductHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<ProductDetailItem>> Handle(GetProductQuery request, CancellationToken cancellationToken)
    {
        var detail = await ProductDetailBuilder.BuildAsync(_db, request.Id, cancellationToken);
        if (detail is null) return ProductErrors.NotFound;
        return detail;
    }
}
