using CodePro.Application.Features.ProductPrices.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductPrices.Queries.ListProductPrices;

public sealed class ListProductPricesHandler : IRequestHandler<ListProductPricesQuery, Result<PagedResult<ProductPriceListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListProductPricesHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<ProductPriceListItem>>> Handle(ListProductPricesQuery request, CancellationToken cancellationToken)
    {
        var query = _db.ProductPrice.AsNoTracking();
        var filters = request.Filters;

        if (filters.ProductId.HasValue)
            query = query.Where(p => p.ProductId == filters.ProductId.Value);

        if (filters.SupplierAccountId.HasValue)
            query = query.Where(p => p.SupplierAccountId == filters.SupplierAccountId.Value);

        if (filters.PriceListId.HasValue)
            query = query.Where(p => p.PriceListId == filters.PriceListId.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(p => p.ValidFrom)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(p => new ProductPriceListItem
            {
                Id = p.Id,
                ProductId = p.ProductId,
                ProductCode = _db.Product.Where(x => x.Id == p.ProductId).Select(x => x.Code).FirstOrDefault(),
                ProductName = _db.Product.Where(x => x.Id == p.ProductId).Select(x => x.Name).FirstOrDefault(),
                SupplierAccountId = p.SupplierAccountId,
                SupplierAccountName = _db.Account.Where(a => a.Id == p.SupplierAccountId).Select(a => a.AccountName).FirstOrDefault(),
                PriceListId = p.PriceListId,
                PriceListName = p.PriceListId.HasValue
                    ? _db.PriceList.Where(pl => pl.Id == p.PriceListId).Select(pl => pl.Name).FirstOrDefault()
                    : null,
                MinimumQuantity = p.MinimumQuantity,
                UnitPrice = p.UnitPrice,
                Currency = p.Currency,
                ValidFrom = p.ValidFrom,
                ValidUntil = p.ValidUntil,
                IsActive = p.IsActive,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<ProductPriceListItem>
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
