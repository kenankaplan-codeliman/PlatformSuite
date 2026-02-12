using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models;

namespace CRM.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DatabaseContext dbContext;
    private readonly IOrganizationRepository organizationRepository;
    private readonly IRoleRepository roleRepository;


    public UserRepository(DatabaseContext dbContext,
        IOrganizationRepository organizationRepository,
        IRoleRepository roleRepository)
    {
        this.dbContext = dbContext;
        this.organizationRepository = organizationRepository;
        this.roleRepository = roleRepository;
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

        return dbContext.AppUser.FirstOrDefault(x => EF.Functions.ILike(x.Email, email));
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

    public Dictionary<string, AccessLevel> GetUserPrivileges(Guid userId)
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

    public async Task<AppUser> GetOrCreateAsync(string email, string firstName, string lastName, string? password = null, string? azureUserId = null, Guid? organizationId = null, List<Guid>? roleIds = null)
    {
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(lastName))
            throw new ArgumentNullException();

        AppUser? user = dbContext.AppUser
                                    .IgnoreQueryFilters()
                                    .AsNoTracking()
                                    .FirstOrDefault(x => !x.IsDeleted &&
                                                        EF.Functions.ILike(x.Email, email) ||
                                                            (
                                                                azureUserId != null && 
                                                                EF.Functions.ILike(x.AzureUserId!, azureUserId)
                                                            )
                                                        );

        if (user != null)
            return user;

        Guid orgId = organizationId
                    ?? (await organizationRepository.GetOrCreateDefaultOrganization()).Id;


        List<Guid> assignedRoleIds = roleIds ?? new List<Guid>() {
            roleRepository.GetDefaultRole()?.Id ?? throw new BusinessException("Default Role is not defined.")
        };

        user = new AppUser()
        {
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            PasswordHash = (!string.IsNullOrEmpty(password)) ? BCrypt.Net.BCrypt.HashPassword(password) : default,    
            AzureUserId = azureUserId,
            OrganizationId = orgId
        };

        user = Create(user);

        roleRepository.AddUserRole(user.Id, assignedRoleIds);

        await dbContext.SaveChangesAsync();

        return user;
    }
}

