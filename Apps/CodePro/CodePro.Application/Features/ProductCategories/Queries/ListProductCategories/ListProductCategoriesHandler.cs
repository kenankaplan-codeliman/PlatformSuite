using CodePro.Application.Features.ProductCategories.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductCategories.Queries.ListProductCategories;

public sealed class ListProductCategoriesHandler : IRequestHandler<ListProductCategoriesQuery, Result<PagedResult<ProductCategoryListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListProductCategoriesHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<ProductCategoryListItem>>> Handle(ListProductCategoriesQuery request, CancellationToken cancellationToken)
    {
        var query = _db.ProductCategory.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = $"%{filters.Search}%";
            query = query.Where(c =>
                EF.Functions.ILike(c.Name, pattern)
                || EF.Functions.ILike(c.Title, pattern)
                || (c.Code != null && EF.Functions.ILike(c.Code, pattern)));
        }

        if (filters.ParentCategoryId.HasValue)
            query = query.Where(c => c.ParentCategoryId == filters.ParentCategoryId.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(c => c.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderBy(c => c.Title)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<ProductCategoryListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        // Parent isimlerini doldur
        var parentIds = items.Where(i => i.ParentCategoryId.HasValue)
            .Select(i => i.ParentCategoryId!.Value).Distinct().ToList();

        if (parentIds.Count > 0)
        {
            var parents = await _db.ProductCategory.AsNoTracking()
                .Where(c => parentIds.Contains(c.Id))
                .Select(c => new { c.Id, c.Name })
                .ToDictionaryAsync(c => c.Id, c => c.Name, cancellationToken);

            foreach (var item in items)
            {
                if (item.ParentCategoryId.HasValue && parents.TryGetValue(item.ParentCategoryId.Value, out var name))
                    item.ParentCategoryName = name;
            }
        }

        return new PagedResult<ProductCategoryListItem>
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
