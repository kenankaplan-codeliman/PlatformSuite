using CRM.Application.Exceptions;
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
    private readonly DatabaseContext dbContext;
    

    public UserRepository(DatabaseContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public AppUser Get(Guid userId)
    {
        var user = dbContext.AppUser.FirstOrDefault(x => x.Id == userId) ?? throw new NotFoundException();

        return user;
    }

    public AppUser? GetByEmail(string email)
    {
        if (email == null)
            throw new ArgumentNullException(nameof(email));

        return dbContext.AppUser.FirstOrDefault(x => x.Email.ToLower() == email.ToLower());
    }

    public AppUser? GetByAzureUserId(string microsoft365Id)
    {
        if (microsoft365Id == null)
            throw new ArgumentNullException(nameof(microsoft365Id));

        return dbContext.AppUser.FirstOrDefault(x => x.Microsoft365Id == microsoft365Id);
    }

    public AppUser Create(AppUser user)
    {
        var entry = dbContext.AppUser.Add(user);
        return entry.Entity;
    }
    public AppUser Update(AppUser user)
    {
        var entry = dbContext.AppUser.Update(user);
        return entry.Entity;
    }

    public AppUser Delete(AppUser user)
    {
        var entry = dbContext.Remove(user);
        return entry.Entity;
    }

    public Dictionary<string, AccessLevel> GetPrivileges(Guid userId)
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

    
}

