using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Crm.Application.Features.Products.Dtos;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Products.Queries.ListProducts;

public sealed class ListProductsHandler : IRequestHandler<ListProductsQuery, Result<PagedResult<ProductListItem>>>
{
    private readonly ICrmDbContext _db;

    public ListProductsHandler(ICrmDbContext db) => _db = db;

    public async Task<Result<PagedResult<ProductListItem>>> Handle(ListProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Product.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.name))
        {
            var pattern = $"%{filters.name}%";
            query = query.Where(p => EF.Functions.ILike(p.Name, pattern));
        }

        if (!string.IsNullOrWhiteSpace(filters.productCode))
        {
            var pattern = $"%{filters.productCode}%";
            query = query.Where(p => EF.Functions.ILike(p.ProductCode, pattern));
        }

        if (!string.IsNullOrWhiteSpace(filters.category))
            query = query.Where(p => p.Category == filters.category);

        if (filters.isActive.HasValue)
            query = query.Where(p => p.IsActive == filters.isActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
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
