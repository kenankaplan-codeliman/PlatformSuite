using CodePro.Application.Features.PurchaseBaskets.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseBaskets.Queries.ListPurchaseBaskets;

public sealed class ListPurchaseBasketsHandler : IRequestHandler<ListPurchaseBasketsQuery, Result<PagedResult<PurchaseBasketListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListPurchaseBasketsHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<PurchaseBasketListItem>>> Handle(ListPurchaseBasketsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.PurchaseBasket.AsNoTracking();
        var filters = request.Filters;

        if (filters.Status.HasValue)
            query = query.Where(b => b.Status == filters.Status.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(b => b.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(b => new PurchaseBasketListItem
            {
                Id = b.Id,
                Status = b.Status,
                PurchaseRequestId = b.PurchaseRequestId,
                LineCount = _db.PurchaseBasketLine.Count(l => l.PurchaseBasketId == b.Id),
                IsActive = b.IsActive,
                CreatedAt = b.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<PurchaseBasketListItem>
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
