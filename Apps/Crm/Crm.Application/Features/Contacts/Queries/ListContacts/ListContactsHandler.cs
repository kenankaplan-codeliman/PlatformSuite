using Platform.Application.Common.Abstractions;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Crm.Application.Features.Contacts.Dtos;
using Crm.Domain.Entities.Contacts;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Contacts.Queries.ListContacts;

public sealed class ListContactsHandler : IRequestHandler<ListContactsQuery, Result<PagedResult<ContactListItem>>>
{
    private readonly ICrmDbContext _db;

    public ListContactsHandler(ICrmDbContext db) => _db = db;

    public async Task<Result<PagedResult<ContactListItem>>> Handle(ListContactsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Contact.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.ContactName))
        {
            var pattern = $"%{filters.ContactName}%";
            query = query.Where(c => EF.Functions.ILike(c.FirstName + " " + c.LastName, pattern));
        }

        if (filters.AccountId.HasValue && filters.AccountId.Value != Guid.Empty)
        {
            query = query.Where(c => c.AccountContacts.Any(ac => ac.AccountId == filters.AccountId.Value));
        }

        if (!string.IsNullOrWhiteSpace(filters.Title))
        {
            var pattern = $"%{filters.Title}%";
            query = query.Where(c => c.Title != null && EF.Functions.ILike(c.Title, pattern));
        }

        if (!string.IsNullOrWhiteSpace(filters.Department))
        {
            var pattern = $"%{filters.Department}%";
            query = query.Where(c => c.Department != null && EF.Functions.ILike(c.Department, pattern));
        }

        if (filters.IsActive.HasValue)
            query = query.Where(c => c.IsActive == filters.IsActive.Value);

        if (!string.IsNullOrWhiteSpace(filters.ContactStatus))
            query = query.Where(c => c.ContactStatus == filters.ContactStatus);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<ContactListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        await FillPrimaryCommunicationsAsync(items, cancellationToken);

        return new PagedResult<ContactListItem>
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

    // Email/Phone polimorfik owner ile ayrı tablolarda; sayfa kümesinin primary değerlerini
    // tek seferde çekip doldururuz (first-wins, birden fazla primary'ye karşı güvenli).
    private async Task FillPrimaryCommunicationsAsync(List<ContactListItem> items, CancellationToken cancellationToken)
    {
        if (items.Count == 0) return;

        var ids = items.Select(i => i.Id).ToList();
        const string parentType = nameof(Contact);

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

        foreach (var item in items)
        {
            if (emailMap.TryGetValue(item.Id, out var email)) item.PrimaryEmail = email;
            if (phoneMap.TryGetValue(item.Id, out var phone)) item.PrimaryPhone = phone;
        }
    }
}
