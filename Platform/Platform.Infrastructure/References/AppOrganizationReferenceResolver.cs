using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Identities;
using Platform.Infrastructure.Data;

namespace Platform.Infrastructure.References;

/// <summary>
/// AuthOrganization için <see cref="IEntityReferenceResolver"/> implementasyonu.
/// Frontend EntityLookupField'da <c>entityType="Organization"</c> ile çağrıldığında
/// <c>/api/reference/lookup</c> üzerinden registry tarafından çözülür; servicePath
/// vermeye gerek kalmaz.
///
/// Name alanı hiyerarşik <c>Title</c>'a öncelik verir (örn. "Default Organization \ Satış Departmanı");
/// Title null ise fallback olarak <c>OrganizationName</c> kullanılır — bkz.
/// <c>SearchAppOrganizationsHandler</c> ile birebir aynı davranış.
/// </summary>
public class AppOrganizationReferenceResolver : IEntityReferenceResolver
{
    private readonly PlatformDbContext dbContext;
    private readonly IConfiguration configuration;

    public AppOrganizationReferenceResolver(PlatformDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    // Frontend "Organization" string'i kullanır; nameof(AuthOrganization) "AuthOrganization"
    // olurdu — uyumsuz olurdu, bu yüzden literal kullanıyoruz.
    public string EntityType => "Organization";

    public EntityReference GetReference(Guid id)
    {
        var org = dbContext.AuthOrganization
            .AsNoTracking()
            .Where(o => o.Id == id)
            .Select(o => new { o.Id, o.OrganizationName, o.Title })
            .FirstOrDefault() ?? throw new NotFoundException();

        return new EntityReference(EntityType)
        {
            Id = org.Id,
            Name = org.Title ?? org.OrganizationName,
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

        var tempQuery = dbContext.AuthOrganization
            .AsNoTracking()
            .Where(o => o.IsActive && !o.IsDeleted);

        if (!string.IsNullOrEmpty(searchText))
        {
            var pattern = $"%{searchText}%";
            tempQuery = tempQuery.Where(o =>
                EF.Functions.ILike(o.OrganizationName, pattern)
                || EF.Functions.ILike(o.OrganizationCode, pattern)
                || (o.Title != null && EF.Functions.ILike(o.Title, pattern)));
        }

        var entityList = tempQuery
            .OrderBy(o => o.Title ?? o.OrganizationName)
            .Skip(skipCnt)
            .Take(pageSize + 1)
            .Select(o => new { o.Id, o.OrganizationName, o.Title })
            .ToList();

        var hasMore = entityList.Count > pageSize;

        var refList = entityList.Take(pageSize)
            .Select(o => new EntityReference(EntityType)
            {
                Id = o.Id,
                Name = o.Title ?? o.OrganizationName,
            })
            .ToList();

        return new EntityReferenceList
        {
            Data = refList,
            HasMore = hasMore,
            Page = paginationInfo?.Page ?? 1,
            PageSize = pageSize,
        };
    }
}
