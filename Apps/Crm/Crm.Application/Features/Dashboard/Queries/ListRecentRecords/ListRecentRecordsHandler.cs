using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.ListRecentRecords;

public sealed class ListRecentRecordsHandler
    : IRequestHandler<ListRecentRecordsQuery, Result<PagedResult<RecentRecordItem>>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public ListRecentRecordsHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<PagedResult<RecentRecordItem>>> Handle(ListRecentRecordsQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var skip = Math.Max(pageNumber - 1, 0) * pageSize;

        // İki ayrı entity'yi birleştiriyoruz: her kümeden sayfayı kapsayacak kadar çekip
        // bellekte tarihe göre birleştir, sırala, sayfala. (UNION yerine pragmatik yaklaşım.)
        var need = skip + pageSize + 1;

        var accountsQuery = _db.Account.AsNoTracking();
        var contactsQuery = _db.Contact.AsNoTracking();

        if (request.OwnerOnly)
        {
            accountsQuery = accountsQuery.Where(a => a.OwnerId == _contextUser.UserId);
            contactsQuery = contactsQuery.Where(c => c.OwnerId == _contextUser.UserId);
        }

        var accounts = await accountsQuery
            .OrderByDescending(a => a.CreatedAt)
            .Take(need)
            .Select(a => new RecentRecordItem
            {
                Id = a.Id,
                EntityType = "Account",
                Name = a.AccountName,
                CreatedAt = a.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        var contacts = await contactsQuery
            .OrderByDescending(c => c.CreatedAt)
            .Take(need)
            .Select(c => new RecentRecordItem
            {
                Id = c.Id,
                EntityType = "Contact",
                Name = (c.FirstName + " " + c.LastName).Trim(),
                CreatedAt = c.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        var merged = accounts.Concat(contacts)
            .OrderByDescending(r => r.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .ToList();

        var hasMore = merged.Count > pageSize;
        if (hasMore) merged.RemoveAt(merged.Count - 1);

        return new PagedResult<RecentRecordItem>
        {
            Data = merged,
            Pagination = new PaginationResponse { PageNumber = pageNumber, PageSize = pageSize, HasMoreRecord = hasMore },
        };
    }
}
