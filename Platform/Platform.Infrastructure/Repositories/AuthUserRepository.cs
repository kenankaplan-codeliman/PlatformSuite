using Platform.Application.Common.Security;
using Platform.Application.Exceptions;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Identities;
using Platform.Domain.Enums;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

public class AuthUserRepository : BaseEntityRepository<AuthUser>, IAuthUserRepository
{
    private readonly IAuthOrganizationRepository organizationRepository;
    private readonly IAuthRoleRepository roleRepository;
    private readonly IPasswordHasher passwordHasher;

    public AuthUserRepository(
        PlatformDbContext dbContext,
        IAuthOrganizationRepository organizationRepository,
        IAuthRoleRepository roleRepository,
        IPasswordHasher passwordHasher) : base(dbContext)
    {
        this.organizationRepository = organizationRepository;
        this.roleRepository = roleRepository;
        this.passwordHasher = passwordHasher;
    }

    public override async Task<AuthUser?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.AuthUser
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<AuthUser?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        if (email == null)
            throw new ArgumentNullException(nameof(email));

        return await dbContext.AuthUser
            .FirstOrDefaultAsync(x => EF.Functions.ILike(x.Email, email), cancellationToken);
    }

    public async Task<Dictionary<string, AccessLevel>> GetUserPrivilegesAsync(
        Guid userId, CancellationToken cancellationToken = default)
    {
        var query = from ur in dbContext.AuthUserRole
                    join rp in dbContext.AuthRolePrivilege on ur.RoleId equals rp.RoleId
                    where ur.UserId == userId && ur.IsActive && rp.IsActive
                    group rp by rp.PrivilegeCode into g
                    select new
                    {
                        PrivilegeCode = g.Key,
                        MaxAccessLevel = g.Max(x => x.AccessLevel)
                    };

        var result = await query.ToListAsync(cancellationToken);
        return result.ToDictionary(x => x.PrivilegeCode, x => x.MaxAccessLevel);
    }

    public async Task<AuthUser> GetOrCreateAsync(
        string email, string firstName, string lastName,
        string? password = null, string? azureUserId = null,
        Guid? organizationId = null, List<Guid>? roleIds = null,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(lastName))
            throw new ArgumentNullException();

        var user = await dbContext.AuthUser
        .FirstOrDefaultAsync(x =>
            (EF.Functions.ILike(x.Email, email) ||
            (azureUserId != null && EF.Functions.ILike(x.AzureUserId!, azureUserId))),
            cancellationToken);

        if (user != null)
            return user;

        var orgId = organizationId
            ?? (await organizationRepository.GetOrCreateDefaultOrganization(cancellationToken)).Id;

        var defaultRole = await roleRepository.GetDefaultRole(cancellationToken)
            ?? throw new BusinessException("Default Role is not defined.");

        var assignedRoleIds = roleIds ?? new List<Guid> { defaultRole.Id };

        user = new AuthUser
        {
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            PasswordHash = !string.IsNullOrEmpty(password)
                ? passwordHasher.Hash(password)
                : default,
            AzureUserId = azureUserId,
            OrganizationId = orgId
        };

        user = await CreateAsync(user, cancellationToken);
        await roleRepository.AddUserRole(user.Id, assignedRoleIds, cancellationToken);

        return user;
    }
}
