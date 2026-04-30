using CodePro.Application.Features.Offers.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Offers.Queries.ListOffers;

public sealed class ListOffersHandler : IRequestHandler<ListOffersQuery, Result<PagedResult<OfferListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListOffersHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<OfferListItem>>> Handle(ListOffersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Offer.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = filters.Search.ToLower();
            query = query.Where(o =>
                o.Subject.ToLower().Contains(pattern)
                || o.OfferNumber.ToLower().Contains(pattern)
                || o.CounterpartyName.ToLower().Contains(pattern));
        }

        if (filters.OfferType.HasValue)
            query = query.Where(o => o.OfferType == filters.OfferType.Value);

        if (filters.Status.HasValue)
            query = query.Where(o => o.Status == filters.Status.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(o => o.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(o => new OfferListItem
            {
                Id = o.Id,
                OfferNumber = o.OfferNumber,
                OfferType = o.OfferType,
                Subject = o.Subject,
                CounterpartyName = o.CounterpartyName,
                Status = o.Status,
                ValidUntil = o.ValidUntil,
                Currency = o.Currency,
                GrandTotal = o.GrandTotal,
                IsActive = o.IsActive,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<OfferListItem>
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
