using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppOrganizations.Dtos;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppOrganizations.Queries.ListAppOrganizations;

public sealed class ListAppOrganizationsHandler : IRequestHandler<ListAppOrganizationsQuery, Result<PagedResult<AppOrganizationListItem>>>
{
    private readonly IApplicationDbContext _db;

    public ListAppOrganizationsHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<PagedResult<AppOrganizationListItem>>> Handle(ListAppOrganizationsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.AuthOrganization.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.OrganizationName))
        {
            var pattern = $"%{filters.OrganizationName}%";
            query = query.Where(o => EF.Functions.ILike(o.OrganizationName, pattern));
        }

        if (!string.IsNullOrWhiteSpace(filters.OrganizationCode))
        {
            var pattern = $"%{filters.OrganizationCode}%";
            query = query.Where(o => EF.Functions.ILike(o.OrganizationCode, pattern));
        }

        if (filters.Type.HasValue)
            query = query.Where(o => o.Type == filters.Type.Value);

        if (filters.ParentOrganizationId.HasValue)
            query = query.Where(o => o.ParentOrganizationId == filters.ParentOrganizationId.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(o => o.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderBy(o => o.Title ?? o.OrganizationName)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<AppOrganizationListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        // Parent isimlerini bir batch sorgu ile doldur.
        var parentIds = items.Where(i => i.ParentOrganizationId.HasValue)
            .Select(i => i.ParentOrganizationId!.Value)
            .Distinct()
            .ToList();

        if (parentIds.Count > 0)
        {
            var parents = await _db.AuthOrganization.AsNoTracking()
                .Where(o => parentIds.Contains(o.Id))
                .Select(o => new { o.Id, o.OrganizationName })
                .ToDictionaryAsync(o => o.Id, o => o.OrganizationName, cancellationToken);

            foreach (var item in items)
            {
                if (item.ParentOrganizationId.HasValue && parents.TryGetValue(item.ParentOrganizationId.Value, out var name))
                    item.ParentOrganizationName = name;
            }
        }

        return new PagedResult<AppOrganizationListItem>
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
