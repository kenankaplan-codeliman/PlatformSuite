using Platform.Application.Common.Abstractions;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Crm.Application.Features.Accounts.Dtos;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Accounts.Queries.ListAccounts;

public sealed class ListAccountsHandler : IRequestHandler<ListAccountsQuery, Result<PagedResult<AccountListItem>>>
{
    private readonly ICrmDbContext _db;

    public ListAccountsHandler(ICrmDbContext db) => _db = db;

    public async Task<Result<PagedResult<AccountListItem>>> Handle(ListAccountsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Account.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.accountName))
        {
            var pattern = filters.accountName.ToLower();
            query = query.Where(a => a.AccountName.ToLower().Contains(pattern));
        }

        if (filters.accountType.HasValue)
            query = query.Where(a => a.AccountType == filters.accountType.Value);

        if (filters.accountStatus.HasValue)
            query = query.Where(a => a.AccountStatus == filters.accountStatus.Value);

        if (!string.IsNullOrWhiteSpace(filters.Industry))
        {
            var pattern = filters.Industry.ToLower();
            query = query.Where(a => a.Industry != null && a.Industry.ToLower().Contains(pattern));
        }

        if (filters.isActive.HasValue)
            query = query.Where(a => a.IsActive == filters.isActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<AccountListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<AccountListItem>
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
