using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;
using Crm.Domain.Entities.Accounts;
using Crm.Infrastructure.Data;

namespace Crm.Infrastructure.References;

public class AccountReferenceResolver : IEntityReferenceResolver
{
    private readonly CrmDbContext dbContext;
    private readonly IConfiguration configuration;

    public AccountReferenceResolver(CrmDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(Account);

    public EntityReference GetReference(Guid id)
    {
        var account = dbContext.Account.Select(acc => new
        {
            acc.Id,
            acc.AccountName,
            PrimaryEmail = dbContext.EmailAddress
                .Where(e => e.ParentEntityType == nameof(Account) && e.ParentEntityId == acc.Id && e.IsPrimary)
                .Select(e => e.Email)
                .FirstOrDefault(),
            PrimaryPhone = dbContext.Phone
                .Where(p => p.ParentEntityType == nameof(Account) && p.ParentEntityId == acc.Id && p.IsPrimary)
                .Select(p => p.PhoneNumber)
                .FirstOrDefault(),
        }).FirstOrDefault(acc => acc.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(Account))
        {
            Id = account.Id,
            Name = account.AccountName,
            Email = account.PrimaryEmail,
            Phone = account.PrimaryPhone,
        };
    }

    public EntityReferenceList LookupReference(string? searchText, PaginationInfo paginationInfo)
    {
        int pageSize = int.Parse(configuration["DefaultValues:Search_Max_Record"]!);
        int skipCnt = 0;

        if (paginationInfo != null && paginationInfo.isValid())
        {
            pageSize = paginationInfo.PageSize;
            var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
            skipCnt = pageIndex * paginationInfo.PageSize;
        }

        var tempQuery = dbContext.Account.AsNoTracking().Where(x => x.IsActive);

        if (!string.IsNullOrEmpty(searchText))
        {
            tempQuery = tempQuery.Where(acc => EF.Functions.ILike(acc.AccountName, $"%{searchText}%"));
        }

        var query = tempQuery.Select(acc => new
        {
            acc.Id,
            acc.AccountName,
            PrimaryEmail = dbContext.EmailAddress
                .Where(e => e.ParentEntityType == nameof(Account) && e.ParentEntityId == acc.Id && e.IsPrimary)
                .Select(e => e.Email)
                .FirstOrDefault(),
            PrimaryPhone = dbContext.Phone
                .Where(p => p.ParentEntityType == nameof(Account) && p.ParentEntityId == acc.Id && p.IsPrimary)
                .Select(p => p.PhoneNumber)
                .FirstOrDefault(),
        });

        var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();
        var hasMore = entityList.Count > pageSize;

        var accountList = entityList.Take(pageSize)
            .Select(acc => new EntityReference(nameof(Account))
            {
                Id = acc.Id,
                Name = acc.AccountName,
                Email = acc.PrimaryEmail,
                Phone = acc.PrimaryPhone,
            })
            .ToList();

        return new EntityReferenceList
        {
            Data = accountList,
            HasMore = hasMore,
            Page = paginationInfo?.Page ?? 1,
            PageSize = pageSize,
        };
    }
}
