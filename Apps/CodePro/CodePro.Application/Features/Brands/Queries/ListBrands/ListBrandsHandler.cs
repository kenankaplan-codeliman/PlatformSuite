using CodePro.Application.Features.Brands.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Brands.Queries.ListBrands;

public sealed class ListBrandsHandler : IRequestHandler<ListBrandsQuery, Result<PagedResult<BrandListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListBrandsHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<BrandListItem>>> Handle(ListBrandsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Brand.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = $"%{filters.Search}%";
            query = query.Where(b => EF.Functions.ILike(b.Name, pattern));
        }

        if (filters.IsActive.HasValue)
            query = query.Where(b => b.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderBy(b => b.Name)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<BrandListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<BrandListItem>
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
