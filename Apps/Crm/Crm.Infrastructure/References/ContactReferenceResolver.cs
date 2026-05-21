using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;
using Crm.Domain.Entities.Contacts;
using Crm.Infrastructure.Data;

namespace Crm.Infrastructure.References;

public class ContactReferenceResolver : IEntityReferenceResolver
{
    private readonly CrmDbContext dbContext;
    private readonly IConfiguration configuration;

    public ContactReferenceResolver(CrmDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(Contact);

    public EntityReference GetReference(Guid id)
    {
        var contact = dbContext.Contact.Select(cnt => new
        {
            cnt.Id,
            cnt.FirstName,
            cnt.LastName,
            PrimaryEmail = dbContext.EmailAddress
                .Where(e => e.ParentEntityType == nameof(Contact) && e.ParentEntityId == cnt.Id && e.IsPrimary)
                .Select(e => e.Email)
                .FirstOrDefault(),
            PrimaryPhone = dbContext.Phone
                .Where(p => p.ParentEntityType == nameof(Contact) && p.ParentEntityId == cnt.Id && p.IsPrimary)
                .Select(p => p.PhoneNumber)
                .FirstOrDefault(),
        }).FirstOrDefault(c => c.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(Contact))
        {
            Id = contact.Id,
            Name = $"{contact.FirstName} {contact.LastName}",
            Email = contact.PrimaryEmail,
            Phone = contact.PrimaryPhone,
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

        var tempQuery = dbContext.Contact.AsNoTracking().Where(x => x.IsActive);

        if (!string.IsNullOrEmpty(searchText))
        {
            var pattern = $"%{searchText}%";
            tempQuery = tempQuery.Where(x => EF.Functions.ILike(x.FirstName + " " + x.LastName, pattern));
        }

        var query = tempQuery.Select(cnt => new
        {
            cnt.Id,
            cnt.FirstName,
            cnt.LastName,
            PrimaryEmail = dbContext.EmailAddress
                .Where(e => e.ParentEntityType == nameof(Contact) && e.ParentEntityId == cnt.Id && e.IsPrimary)
                .Select(e => e.Email)
                .FirstOrDefault(),
            PrimaryPhone = dbContext.Phone
                .Where(p => p.ParentEntityType == nameof(Contact) && p.ParentEntityId == cnt.Id && p.IsPrimary)
                .Select(p => p.PhoneNumber)
                .FirstOrDefault(),
        });

        var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();
        var hasMore = entityList.Count > pageSize;

        var contactList = entityList.Take(pageSize)
            .Select(item => new EntityReference(nameof(Contact))
            {
                Id = item.Id,
                Name = $"{item.FirstName} {item.LastName}",
                Email = item.PrimaryEmail,
                Phone = item.PrimaryPhone,
            })
            .ToList();

        return new EntityReferenceList
        {
            Data = contactList,
            HasMore = hasMore,
            Page = paginationInfo?.Page ?? 1,
            PageSize = pageSize,
        };
    }
}
