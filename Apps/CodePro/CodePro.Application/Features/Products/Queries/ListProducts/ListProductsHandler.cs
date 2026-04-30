using CodePro.Application.Features.Products.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Products.Queries.ListProducts;

public sealed class ListProductsHandler : IRequestHandler<ListProductsQuery, Result<PagedResult<ProductListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListProductsHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<ProductListItem>>> Handle(ListProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Product.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = filters.Search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(pattern)
                || p.Code.ToLower().Contains(pattern)
                || p.ShortDescription.ToLower().Contains(pattern));
        }

        if (filters.ProductCategoryId.HasValue)
            query = query.Where(p => p.ProductCategoryId == filters.ProductCategoryId.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderBy(p => p.Name)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<ProductListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<ProductListItem>
        {
            Data = items,
            Pagination = new PaginationResponse
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                HasMoreRecord = hasMore,
            },
        };
    }
}
