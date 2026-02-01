using CRM.Application.Interfaces;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DatabaseContext dbContext;

    public UserRepository(DatabaseContext dbContext)
    {
        this.dbContext = dbContext;
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
}

