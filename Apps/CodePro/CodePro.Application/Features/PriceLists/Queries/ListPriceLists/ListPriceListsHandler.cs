using CodePro.Application.Features.PriceLists.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PriceLists.Queries.ListPriceLists;

public sealed class ListPriceListsHandler : IRequestHandler<ListPriceListsQuery, Result<PagedResult<PriceListListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListPriceListsHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<PriceListListItem>>> Handle(ListPriceListsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.PriceList.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = $"%{filters.Search}%";
            query = query.Where(p =>
                EF.Functions.ILike(p.Name, pattern)
                || EF.Functions.ILike(p.Code, pattern));
        }

        if (filters.SupplierId.HasValue)
            query = query.Where(p => p.SupplierId == filters.SupplierId.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(p => new PriceListListItem
            {
                Id = p.Id,
                Code = p.Code,
                Name = p.Name,
                SupplierId = p.SupplierId,
                SupplierName = _db.Supplier.Where(a => a.Id == p.SupplierId)
                    .Select(a => a.Name).FirstOrDefault(),
                IsActive = p.IsActive,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<PriceListListItem>
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
