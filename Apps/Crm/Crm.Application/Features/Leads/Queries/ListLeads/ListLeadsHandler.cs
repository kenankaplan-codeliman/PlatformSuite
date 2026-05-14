using Crm.Application.Features.Leads.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Leads.Queries.ListLeads;

public sealed class ListLeadsHandler : IRequestHandler<ListLeadsQuery, Result<PagedResult<LeadListItem>>>
{
    private readonly ICrmDbContext _db;

    public ListLeadsHandler(ICrmDbContext db) => _db = db;

    public async Task<Result<PagedResult<LeadListItem>>> Handle(ListLeadsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Lead.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = $"%{filters.Search}%";
            query = query.Where(l =>
                EF.Functions.ILike(l.Subject, pattern)
                || (l.Company != null && EF.Functions.ILike(l.Company, pattern))
                || (l.Email != null && EF.Functions.ILike(l.Email, pattern))
                || (l.FirstName != null && EF.Functions.ILike(l.FirstName, pattern))
                || (l.LastName != null && EF.Functions.ILike(l.LastName, pattern)));
        }

        if (!string.IsNullOrWhiteSpace(filters.Status))
            query = query.Where(l => l.Status == filters.Status);

        if (!string.IsNullOrWhiteSpace(filters.Source))
            query = query.Where(l => l.Source == filters.Source);

        if (filters.IsActive.HasValue)
            query = query.Where(l => l.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<LeadListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<LeadListItem>
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
