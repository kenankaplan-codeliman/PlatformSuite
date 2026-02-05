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
    private readonly IConfiguration configuration;

    public UserRepository(DatabaseContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }
    
    public AppUser Get(Guid userId)
    {
        var user = dbContext.AppUser.FirstOrDefault(x => x.Id == userId);
        if (user == null)
            throw new NotFoundException();

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


    public PaginationResult<EntityReference> Search(string searchText, PaginationInfo? paginationInfo)
    {

        if (string.IsNullOrEmpty(searchText))
            return new PaginationResult<EntityReference>()
            {
                Data = new List<EntityReference>(),
                HasMore = false,
            };


        int pageSize = int.Parse(configuration["Search_Max_Record"]!);
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

