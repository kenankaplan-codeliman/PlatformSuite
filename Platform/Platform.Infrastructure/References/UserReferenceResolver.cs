using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Identities;
using Platform.Infrastructure.Data;

namespace Platform.Infrastructure.References;

public class UserReferenceResolver : IEntityReferenceResolver
{
    private readonly PlatformDbContext dbContext;
    private readonly IConfiguration configuration;

    public UserReferenceResolver(PlatformDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(User);

    public EntityReference GetReference(Guid id)
    {
        var usr = dbContext.User
            .Select(x => new { x.Id, x.FirstName, x.LastName, x.Email })
            .FirstOrDefault(x => x.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(User))
        {
            Id = usr.Id,
            Name = $"{usr.FirstName} {usr.LastName}",
            Email = usr.Email,
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

        var tempQuery = dbContext.User.AsNoTracking().Where(x => x.IsActive);

        if (!string.IsNullOrEmpty(searchText))
        {
            tempQuery = tempQuery.Where(usr =>
                EF.Functions.ILike(usr.Email, $"%{searchText}%")
                && EF.Functions.ILike((usr.FirstName + " " + usr.LastName), $"%{searchText}%"));
        }

        var query = tempQuery.Select(usr => new
        {
            usr.Id,
            usr.FirstName,
            usr.LastName,
            usr.Email,
        });

        var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();
        var hasMore = entityList.Count > pageSize;

        var modalList = entityList.Take(pageSize)
            .Select(item => new EntityReference(nameof(User))
            {
                Id = item.Id,
                Name = $"{item.FirstName} {item.LastName}",
                Email = item.Email,
            })
            .ToList();

        return new EntityReferenceList
        {
            Data = modalList,
            HasMore = hasMore,
            Page = paginationInfo?.Page ?? 1,
            PageSize = pageSize,
        };
    }
}
