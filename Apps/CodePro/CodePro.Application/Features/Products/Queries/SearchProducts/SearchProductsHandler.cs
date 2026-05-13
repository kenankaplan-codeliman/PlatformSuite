using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Modals.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Products.Queries.SearchProducts;

public sealed class SearchProductsHandler : IRequestHandler<SearchProductsQuery, Result<PagedResult<EntityReference>>>
{
    private readonly ICodeProDbContext _db;

    public SearchProductsHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<EntityReference>>> Handle(SearchProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Product.AsNoTracking().Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(request.SearchText))
        {
            var pattern = $"%{request.SearchText}%";
            query = query.Where(p =>
                EF.Functions.ILike(p.Name, pattern)
                || EF.Functions.ILike(p.Code, pattern));
        }

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var skip = Math.Max(pageNumber - 1, 0) * pageSize;

        var items = await query
            .OrderBy(p => p.Name)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(p => new EntityReference(nameof(Product))
            {
                Id = p.Id,
                Name = p.Name,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<EntityReference>
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
