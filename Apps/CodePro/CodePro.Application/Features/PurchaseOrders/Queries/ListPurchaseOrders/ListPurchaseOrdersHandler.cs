using CodePro.Application.Features.PurchaseOrders.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseOrders.Queries.ListPurchaseOrders;

public sealed class ListPurchaseOrdersHandler : IRequestHandler<ListPurchaseOrdersQuery, Result<PagedResult<PurchaseOrderListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListPurchaseOrdersHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<PurchaseOrderListItem>>> Handle(ListPurchaseOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.PurchaseOrder.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = $"%{filters.Search}%";
            query = query.Where(p =>
                EF.Functions.ILike(p.Title, pattern)
                || EF.Functions.ILike(p.OrderNumber, pattern));
        }

        if (filters.Status.HasValue)
            query = query.Where(p => p.Status == filters.Status.Value);

        if (filters.Priority.HasValue)
            query = query.Where(p => p.Priority == filters.Priority.Value);

        if (filters.SupplierId.HasValue)
            query = query.Where(p => p.SupplierId == filters.SupplierId.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(p => p.OrderDate)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(p => new PurchaseOrderListItem
            {
                Id = p.Id,
                OrderNumber = p.OrderNumber,
                Title = p.Title,
                SupplierId = p.SupplierId,
                SupplierName = _db.Supplier.Where(a => a.Id == p.SupplierId).Select(a => a.Name).FirstOrDefault(),
                Status = p.Status,
                Priority = p.Priority,
                OrderDate = p.OrderDate,
                TotalAmount = p.TotalAmount,
                CurrencyCode = p.CurrencyCode,
                LineCount = _db.PurchaseOrderLine.Count(l => l.PurchaseOrderId == p.Id),
                IsActive = p.IsActive,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<PurchaseOrderListItem>
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
