using CodePro.Application.Features.Manufacturers.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Manufacturers.Queries.ListManufacturers;

public sealed class ListManufacturersHandler : IRequestHandler<ListManufacturersQuery, Result<PagedResult<ManufacturerListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListManufacturersHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<ManufacturerListItem>>> Handle(ListManufacturersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Manufacturer.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = filters.Search.ToLower();
            query = query.Where(m => m.Name.ToLower().Contains(pattern));
        }

        if (filters.IsActive.HasValue)
            query = query.Where(m => m.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderBy(m => m.Name)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<ManufacturerListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<ManufacturerListItem>
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
