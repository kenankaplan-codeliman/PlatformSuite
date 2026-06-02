using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Crm.Application.Features.Products.Dtos;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Products.Queries.SearchProducts;

/// <summary>
/// Opportunity satır kalemi lookup'ını besler. EntityReference yerine birim fiyat/para birimi
/// içeren ProductLookupItem döner ki ürün seçilince satır kalemi prefill edilebilsin.
/// </summary>
public sealed class SearchProductsHandler : IRequestHandler<SearchProductsQuery, Result<PagedResult<ProductLookupItem>>>
{
    private readonly ICrmDbContext _db;

    public SearchProductsHandler(ICrmDbContext db) => _db = db;

    public async Task<Result<PagedResult<ProductLookupItem>>> Handle(SearchProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Product.AsNoTracking().Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(request.SearchText))
        {
            var pattern = $"%{request.SearchText}%";
            query = query.Where(p =>
                EF.Functions.ILike(p.Name, pattern) || EF.Functions.ILike(p.ProductCode, pattern));
        }

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderBy(p => p.Name)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<ProductLookupItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<ProductLookupItem>
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
