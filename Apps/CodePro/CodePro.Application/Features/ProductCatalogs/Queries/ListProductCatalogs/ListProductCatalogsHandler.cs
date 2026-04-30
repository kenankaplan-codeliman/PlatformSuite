using CodePro.Application.Features.ProductCatalogs.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductCatalogs.Queries.ListProductCatalogs;

public sealed class ListProductCatalogsHandler : IRequestHandler<ListProductCatalogsQuery, Result<PagedResult<ProductCatalogListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListProductCatalogsHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<ProductCatalogListItem>>> Handle(ListProductCatalogsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.ProductCatalog.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = filters.Search.ToLower();
            query = query.Where(c =>
                c.Name.ToLower().Contains(pattern)
                || c.Code.ToLower().Contains(pattern));
        }

        if (filters.IsActive.HasValue)
            query = query.Where(c => c.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderBy(c => c.Name)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(c => new ProductCatalogListItem
            {
                Id = c.Id,
                Code = c.Code,
                Name = c.Name,
                ValidFrom = c.ValidFrom,
                ValidUntil = c.ValidUntil,
                PriceCode = c.PriceCode,
                ProductCount = _db.ProductCatalogProduct.Count(p => p.ProductCatalogId == c.Id),
                OrganizationCount = _db.ProductCatalogOrganization.Count(o => o.ProductCatalogId == c.Id),
                IsActive = c.IsActive,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<ProductCatalogListItem>
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
