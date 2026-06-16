using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.ListTopAccounts;

public sealed class ListTopAccountsHandler
    : IRequestHandler<ListTopAccountsQuery, Result<PagedResult<TopAccountItem>>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public ListTopAccountsHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<PagedResult<TopAccountItem>>> Handle(ListTopAccountsQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var skip = Math.Max(pageNumber - 1, 0) * pageSize;

        // Açık fırsatları hesaba göre grupla, değere göre sırala, sayfala.
        var openOpportunities = _db.Opportunity.AsNoTracking()
            .Where(o => o.IsActive && !DashboardConstants.ClosedStages.Contains(o.Stage));

        if (request.OwnerOnly)
            openOpportunities = openOpportunities.Where(o => o.OwnerId == _contextUser.UserId);

        var grouped = await openOpportunities
            .GroupBy(o => o.AccountId)
            .Select(g => new
            {
                AccountId = g.Key,
                Count = g.LongCount(),
                Value = g.Sum(x => (decimal?)x.EstimatedAmount) ?? 0m,
            })
            .OrderByDescending(x => x.Value)
            .ThenByDescending(x => x.Count)
            .Skip(skip)
            .Take(pageSize + 1)
            .ToListAsync(cancellationToken);

        var hasMore = grouped.Count > pageSize;
        if (hasMore) grouped.RemoveAt(grouped.Count - 1);

        // Hesap adlarını tek sorguda doldur (group sonucu navigation içermez).
        var accountIds = grouped.Select(g => g.AccountId).ToList();
        var names = await _db.Account.AsNoTracking()
            .Where(a => accountIds.Contains(a.Id))
            .Select(a => new { a.Id, a.AccountName })
            .ToDictionaryAsync(a => a.Id, a => a.AccountName, cancellationToken);

        var items = grouped.Select(g => new TopAccountItem
        {
            AccountId = g.AccountId,
            AccountName = names.GetValueOrDefault(g.AccountId, string.Empty),
            OpenOpportunityCount = g.Count,
            OpenOpportunityValue = g.Value,
        }).ToList();

        return new PagedResult<TopAccountItem>
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
