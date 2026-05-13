using CodePro.Application.Features.PurchaseRequests.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseRequests.Queries.ListPurchaseRequests;

public sealed class ListPurchaseRequestsHandler : IRequestHandler<ListPurchaseRequestsQuery, Result<PagedResult<PurchaseRequestListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListPurchaseRequestsHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<PurchaseRequestListItem>>> Handle(ListPurchaseRequestsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.PurchaseRequest.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = $"%{filters.Search}%";
            query = query.Where(p =>
                EF.Functions.ILike(p.Title, pattern)
                || EF.Functions.ILike(p.RequestNumber, pattern));
        }

        if (filters.Status.HasValue)
            query = query.Where(p => p.Status == filters.Status.Value);

        if (filters.Priority.HasValue)
            query = query.Where(p => p.Priority == filters.Priority.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(p => p.RequestDate)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(p => new PurchaseRequestListItem
            {
                Id = p.Id,
                RequestNumber = p.RequestNumber,
                Title = p.Title,
                Status = p.Status,
                Priority = p.Priority,
                RequestDate = p.RequestDate,
                RequiredDate = p.RequiredDate,
                TotalAmount = p.TotalAmount,
                CurrencyCode = p.CurrencyCode,
                LineCount = _db.PurchaseRequestLine.Count(l => l.PurchaseRequestId == p.Id),
                IsActive = p.IsActive,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<PurchaseRequestListItem>
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
