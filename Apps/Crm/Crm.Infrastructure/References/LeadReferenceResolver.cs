using Crm.Domain.Entities.Leads;
using Crm.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;

namespace Crm.Infrastructure.References;

public class LeadReferenceResolver : IEntityReferenceResolver
{
    private readonly CrmDbContext dbContext;
    private readonly IConfiguration configuration;

    public LeadReferenceResolver(CrmDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(Lead);

    public EntityReference GetReference(Guid id)
    {
        var lead = dbContext.Lead
            .Select(l => new
            {
                l.Id,
                l.Subject,
                l.FirstName,
                l.LastName,
                PrimaryEmail = dbContext.EmailAddress
                    .Where(e => e.ParentEntityType == nameof(Lead) && e.ParentEntityId == l.Id && e.IsPrimary)
                    .Select(e => e.Email)
                    .FirstOrDefault(),
                PrimaryPhone = dbContext.Phone
                    .Where(p => p.ParentEntityType == nameof(Lead) && p.ParentEntityId == l.Id && p.IsPrimary)
                    .Select(p => p.PhoneNumber)
                    .FirstOrDefault(),
            })
            .FirstOrDefault(l => l.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(Lead))
        {
            Id = lead.Id,
            Name = BuildName(lead.Subject, lead.FirstName, lead.LastName),
            Email = lead.PrimaryEmail,
            Phone = lead.PrimaryPhone,
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

        var tempQuery = dbContext.Lead.AsNoTracking().Where(x => x.IsActive);

        if (!string.IsNullOrEmpty(searchText))
        {
            var pattern = $"%{searchText}%";
            tempQuery = tempQuery.Where(l =>
                EF.Functions.ILike(l.Subject, pattern)
                || EF.Functions.ILike(((l.FirstName ?? "") + " " + (l.LastName ?? "")), pattern));
        }

        var entityList = tempQuery
            .Select(l => new
            {
                l.Id,
                l.Subject,
                l.FirstName,
                l.LastName,
                PrimaryEmail = dbContext.EmailAddress
                    .Where(e => e.ParentEntityType == nameof(Lead) && e.ParentEntityId == l.Id && e.IsPrimary)
                    .Select(e => e.Email)
                    .FirstOrDefault(),
                PrimaryPhone = dbContext.Phone
                    .Where(p => p.ParentEntityType == nameof(Lead) && p.ParentEntityId == l.Id && p.IsPrimary)
                    .Select(p => p.PhoneNumber)
                    .FirstOrDefault(),
            })
            .Skip(skipCnt).Take(pageSize + 1).ToList();

        var hasMore = entityList.Count > pageSize;

        var leadList = entityList.Take(pageSize)
            .Select(l => new EntityReference(nameof(Lead))
            {
                Id = l.Id,
                Name = BuildName(l.Subject, l.FirstName, l.LastName),
                Email = l.PrimaryEmail,
                Phone = l.PrimaryPhone,
            })
            .ToList();

        return new EntityReferenceList
        {
            Data = leadList,
            HasMore = hasMore,
            Page = paginationInfo?.Page ?? 1,
            PageSize = pageSize,
        };
    }

    private static string BuildName(string subject, string? firstName, string? lastName)
    {
        var person = $"{firstName} {lastName}".Trim();
        return string.IsNullOrEmpty(person) ? subject : $"{subject} — {person}";
    }
}
