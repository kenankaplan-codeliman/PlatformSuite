using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Identities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppOrganizations.Queries.SearchAppOrganizations;

public sealed class SearchAppOrganizationsHandler : IRequestHandler<SearchAppOrganizationsQuery, Result<PagedResult<EntityReference>>>
{
    private readonly IApplicationDbContext _db;

    public SearchAppOrganizationsHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<PagedResult<EntityReference>>> Handle(SearchAppOrganizationsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Organization.AsNoTracking().Where(o => o.IsActive);

        if (!string.IsNullOrWhiteSpace(request.SearchText))
        {
            var pattern = $"%{request.SearchText}%";
            query = query.Where(o =>
                EF.Functions.ILike(o.OrganizationName, pattern)
                || EF.Functions.ILike(o.OrganizationCode, pattern)
                || (o.Title != null && EF.Functions.ILike(o.Title, pattern)));
        }

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var skip = Math.Max(pageNumber - 1, 0) * pageSize;

        var items = await query
            .OrderBy(o => o.Title ?? o.OrganizationName)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(o => new EntityReference(nameof(Organization))
            {
                Id = o.Id,
                Name = o.Title ?? o.OrganizationName,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<EntityReference>
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
