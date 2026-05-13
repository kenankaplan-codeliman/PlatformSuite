using Crm.Application.Features.Opportunities.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Opportunities.Queries.ListOpportunities;

public sealed class ListOpportunitiesHandler : IRequestHandler<ListOpportunitiesQuery, Result<PagedResult<OpportunityListItem>>>
{
    private readonly ICrmDbContext _db;

    public ListOpportunitiesHandler(ICrmDbContext db) => _db = db;

    public async Task<Result<PagedResult<OpportunityListItem>>> Handle(ListOpportunitiesQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Opportunity.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = $"%{filters.Search}%";
            query = query.Where(o => EF.Functions.ILike(o.Name, pattern));
        }

        if (filters.Stage.HasValue)
            query = query.Where(o => o.Stage == filters.Stage.Value);

        if (filters.AccountId.HasValue)
            query = query.Where(o => o.AccountId == filters.AccountId.Value);

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
            .ProjectToType<OpportunityListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<OpportunityListItem>
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
