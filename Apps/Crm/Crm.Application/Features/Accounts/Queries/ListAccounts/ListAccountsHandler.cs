using Platform.Application.Common.Abstractions;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Crm.Application.Features.Accounts.Dtos;
using Crm.Domain.Entities.Accounts;
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
            var pattern = $"%{filters.accountName}%";
            query = query.Where(a => EF.Functions.ILike(a.AccountName, pattern));
        }

        if (!string.IsNullOrWhiteSpace(filters.accountType))
            query = query.Where(a => a.AccountType == filters.accountType);

        if (!string.IsNullOrWhiteSpace(filters.accountStatus))
            query = query.Where(a => a.AccountStatus == filters.accountStatus);

        if (!string.IsNullOrWhiteSpace(filters.Industry))
        {
            var pattern = $"%{filters.Industry}%";
            query = query.Where(a => a.Industry != null && EF.Functions.ILike(a.Industry, pattern));
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

        await FillPrimaryCommunicationsAsync(items, cancellationToken);

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

    // Email/Phone/Address polimorfik owner ile ayrı tablolarda; navigation olmadığı için
    // sayfa kümesinin primary değerlerini tek seferde (3 sorgu) çekip doldururuz.
    private async Task FillPrimaryCommunicationsAsync(List<AccountListItem> items, CancellationToken cancellationToken)
    {
        if (items.Count == 0) return;

        var ids = items.Select(i => i.Id).ToList();
        const string parentType = nameof(Account);

        // Birden fazla primary olabilecek (veri tutarsızlığı) duruma karşı first-wins.
        var emailMap = (await _db.EmailAddress.AsNoTracking()
                .Where(e => e.ParentEntityType == parentType && ids.Contains(e.ParentEntityId) && e.IsPrimary)
                .Select(e => new { e.ParentEntityId, e.Email })
                .ToListAsync(cancellationToken))
            .GroupBy(e => e.ParentEntityId).ToDictionary(g => g.Key, g => g.First().Email);

        var phoneMap = (await _db.Phone.AsNoTracking()
                .Where(p => p.ParentEntityType == parentType && ids.Contains(p.ParentEntityId) && p.IsPrimary)
                .Select(p => new { p.ParentEntityId, p.PhoneNumber })
                .ToListAsync(cancellationToken))
            .GroupBy(p => p.ParentEntityId).ToDictionary(g => g.Key, g => g.First().PhoneNumber);

        var cityMap = (await _db.Address.AsNoTracking()
                .Where(a => a.ParentEntityType == parentType && ids.Contains(a.ParentEntityId) && a.IsPrimary)
                .Select(a => new { a.ParentEntityId, a.CityName })
                .ToListAsync(cancellationToken))
            .GroupBy(a => a.ParentEntityId).ToDictionary(g => g.Key, g => g.First().CityName);

        foreach (var item in items)
        {
            if (emailMap.TryGetValue(item.Id, out var email)) item.PrimaryEmail = email;
            if (phoneMap.TryGetValue(item.Id, out var phone)) item.PrimaryPhone = phone;
            if (cityMap.TryGetValue(item.Id, out var city)) item.PrimaryCity = city;
        }
    }
}
