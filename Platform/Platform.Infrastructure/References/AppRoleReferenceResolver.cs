using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;
using Platform.Infrastructure.Data;

namespace Platform.Infrastructure.References;

/// <summary>
/// AuthRole için <see cref="IEntityReferenceResolver"/> implementasyonu.
/// Frontend EntityLookupField'da <c>entityType="AppRole"</c> ile çağrıldığında
/// <c>/api/reference/lookup</c> üzerinden registry tarafından çözülür.
/// </summary>
public class AppRoleReferenceResolver : IEntityReferenceResolver
{
    private readonly PlatformDbContext dbContext;
    private readonly IConfiguration configuration;

    public AppRoleReferenceResolver(PlatformDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => "AppRole";

    public EntityReference GetReference(Guid id)
    {
        var role = dbContext.AuthRole
            .AsNoTracking()
            .Where(r => r.Id == id)
            .Select(r => new { r.Id, r.RoleName })
            .FirstOrDefault() ?? throw new NotFoundException();

        return new EntityReference(EntityType)
        {
            Id = role.Id,
            Name = role.RoleName,
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

        var tempQuery = dbContext.AuthRole
            .AsNoTracking()
            .Where(r => r.IsActive);

        if (!string.IsNullOrEmpty(searchText))
        {
            var pattern = $"%{searchText}%";
            tempQuery = tempQuery.Where(r => EF.Functions.ILike(r.RoleName, pattern));
        }

        var entityList = tempQuery
            .OrderBy(r => r.RoleName)
            .Skip(skipCnt)
            .Take(pageSize + 1)
            .Select(r => new { r.Id, r.RoleName })
            .ToList();

        var hasMore = entityList.Count > pageSize;

        var refList = entityList.Take(pageSize)
            .Select(r => new EntityReference(EntityType)
            {
                Id = r.Id,
                Name = r.RoleName,
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
