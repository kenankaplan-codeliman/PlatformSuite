using Crm.Domain.Entities.Opportunities;
using Crm.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;

namespace Crm.Infrastructure.References;

public class OpportunityReferenceResolver : IEntityReferenceResolver
{
    private readonly CrmDbContext dbContext;
    private readonly IConfiguration configuration;

    public OpportunityReferenceResolver(CrmDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(Opportunity);

    public EntityReference GetReference(Guid id)
    {
        var opp = dbContext.Opportunity
            .Select(o => new { o.Id, o.Name, o.OpportunityCode })
            .FirstOrDefault(o => o.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(Opportunity))
        {
            Id = opp.Id,
            Name = FormatLabel(opp.OpportunityCode, opp.Name),
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

        var tempQuery = dbContext.Opportunity.AsNoTracking().Where(x => x.IsActive);

        // Ad VEYA Fırsat Kodu üzerinden ara — kullanıcı koda göre de bulabilsin.
        if (!string.IsNullOrEmpty(searchText))
        {
            var pattern = $"%{searchText}%";
            tempQuery = tempQuery.Where(o =>
                EF.Functions.ILike(o.Name, pattern) ||
                EF.Functions.ILike(o.OpportunityCode, pattern));
        }

        var entityList = tempQuery
            .Select(o => new { o.Id, o.Name, o.OpportunityCode })
            .Skip(skipCnt).Take(pageSize + 1).ToList();

        var hasMore = entityList.Count > pageSize;

        var oppList = entityList.Take(pageSize)
            .Select(o => new EntityReference(nameof(Opportunity))
            {
                Id = o.Id,
                Name = FormatLabel(o.OpportunityCode, o.Name),
            })
            .ToList();

        return new EntityReferenceList
        {
            Data = oppList,
            HasMore = hasMore,
            Page = paginationInfo?.Page ?? 1,
            PageSize = pageSize,
        };
    }

    // Lookup etiketi: kod varsa "FRS-2026-0001 · Fırsat Adı", yoksa düz ad.
    private static string FormatLabel(string? code, string name) =>
        string.IsNullOrWhiteSpace(code) ? name : $"{code} · {name}";
}
