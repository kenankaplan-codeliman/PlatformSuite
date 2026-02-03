using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CRM.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IConfiguration _config;
    private readonly DatabaseContext dbContext;

    public UserRepository(DatabaseContext dbContext, IConfiguration _config)
    {
        this.dbContext = dbContext;
        this._config = _config;
    }

    public async Task<AppUser?> GetAsync(Guid userId)
    {
        return await dbContext.AppUser.FirstOrDefaultAsync(x => x.Id == userId);
    }

    public async Task<AppUser?> GetByEmailAsync(string email)
    {
        if (email == null)
            throw new ArgumentNullException(nameof(email));

        return await dbContext.AppUser.FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
    }

    public async Task<AppUser?> GetByAzureUserIdAsync(string microsoft365Id)
    {
        if (microsoft365Id == null)
            throw new ArgumentNullException(nameof(microsoft365Id));

        return await dbContext.AppUser.FirstOrDefaultAsync(x => x.Microsoft365Id == microsoft365Id);
    }

    public async Task<AppUser> CreateAsync(AppUser user)
    {
        var entry = dbContext.AppUser.Add(user);
        return entry.Entity;
    }
    public async Task<AppUser> UpdateAsync(AppUser user)
    {
        var entry = dbContext.AppUser.Update(user);
        return entry.Entity;
    }

    public async Task<AppUser> DeleteAsync(AppUser user)
    {
        var entry = dbContext.Remove(user);
        return entry.Entity;
    }

    public async Task<Dictionary<string, AccessLevel>> GetPrivileges(Guid userId)
    {

        var query = from ur in dbContext.AppUserRole
                    join rp in dbContext.AppRolePrivilege
                        on ur.RoleId equals rp.RoleId
                    where ur.UserId == userId
                          && ur.IsActive
                          && rp.IsActive
                    group rp by rp.PrivilegeCode into g
                    select new
                    {
                        PrivilegeCode = g.Key,
                        MaxAccessLevel = g.Max(x => x.AccessLevel)
                    };

        var userPrivilegeAccessMap = query.ToDictionary(
            x => x.PrivilegeCode,
            x => x.MaxAccessLevel
        );

        return userPrivilegeAccessMap;
    }

    public async Task<AccessLevel> GetAccessLevel(Guid userId, string privilegeCode)
    {
        Dictionary<string, AccessLevel> privileges = await GetPrivileges(userId);

        privileges.TryGetValue(privilegeCode, out var accessLevel);

        return accessLevel;
    }


    public async Task<PaginationResult<EntityReference>> Search(string searchText, PaginationInfo? paginationInfo)
    {

        if (string.IsNullOrEmpty(searchText))
            return new PaginationResult<EntityReference>()
            {
                Data = new List<EntityReference>(),
                HasMore = false,
            };


        int pageSize = int.Parse(_config["Search_Max_Record"]!);
        int skipCnt = 0;

        if (paginationInfo != null && paginationInfo.isValid())
        {
            pageSize = paginationInfo.PageSize;

            var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
            skipCnt = pageIndex * paginationInfo.PageSize;

        }

        var query = from usr in this.dbContext.AppUser.AsNoTracking()
                    where
                    usr.IsActive
                    && EF.Functions.ILike((usr.FirstName + " " + usr.LastName),$"%{searchText}%")
                    select new
                    {
                        usr.Id,
                        usr.FirstName,
                        usr.LastName,
                        usr.Email,
                        //usr.Phone,
                        //usr.MobilePhone
                    };


        var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();

        var hasMore = entityList.Count > pageSize;

        var modalList = entityList.Take(pageSize)
            .Select(item => new EntityReference(EntityType.Lead)
            {
                Id = item.Id,
                Name = $"{item.FirstName} {item.LastName}",
                Email = item.Email,
                //Phone = item.MobilePhone ?? item.Phone,
            })
            .ToList();

        return new PaginationResult<EntityReference>()
        {
            Data = modalList,
            HasMore = hasMore,
            Page = paginationInfo?.Page ?? 1,
            PageSize = pageSize,
        };



    }
}

