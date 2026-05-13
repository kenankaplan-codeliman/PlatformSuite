using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Modals.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductCategories.Queries.SearchProductCategories;

public sealed class SearchProductCategoriesHandler : IRequestHandler<SearchProductCategoriesQuery, Result<PagedResult<EntityReference>>>
{
    private readonly ICodeProDbContext _db;

    public SearchProductCategoriesHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<EntityReference>>> Handle(SearchProductCategoriesQuery request, CancellationToken cancellationToken)
    {
        var query = _db.ProductCategory.AsNoTracking().Where(c => c.IsActive);

        if (!string.IsNullOrWhiteSpace(request.SearchText))
        {
            var pattern = $"%{request.SearchText}%";
            query = query.Where(c =>
                EF.Functions.ILike(c.Name, pattern)
                || EF.Functions.ILike(c.Title, pattern)
                || (c.Code != null && EF.Functions.ILike(c.Code, pattern)));
        }

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var skip = Math.Max(pageNumber - 1, 0) * pageSize;

        var items = await query
            .OrderBy(c => c.Title)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(c => new EntityReference(nameof(ProductCategory))
            {
                Id = c.Id,
                Name = c.Title,
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
