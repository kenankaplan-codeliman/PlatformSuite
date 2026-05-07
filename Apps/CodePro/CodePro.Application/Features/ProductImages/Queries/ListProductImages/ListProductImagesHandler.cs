using CodePro.Application.Features.ProductImages.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductImages.Queries.ListProductImages;

public sealed class ListProductImagesHandler
    : IRequestHandler<ListProductImagesQuery, Result<List<ProductImageItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListProductImagesHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<List<ProductImageItem>>> Handle(
        ListProductImagesQuery request,
        CancellationToken cancellationToken)
    {
        var items = await _db.ProductImage
            .AsNoTracking()
            .Where(i => i.ProductId == request.Id)
            .OrderBy(i => i.SortOrder)
            .ThenBy(i => i.CreatedAt)
            .ProjectToType<ProductImageItem>()
            .ToListAsync(cancellationToken);

        return items;
    }
}
