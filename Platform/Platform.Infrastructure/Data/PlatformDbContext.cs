using Platform.Application.Common.Abstractions;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Activities;
using Platform.Domain.Entities.Attachments;
using Platform.Domain.Entities.Common;
using Platform.Domain.Entities.Identities;
using Platform.Domain.Enums;
using Platform.Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Platform.Infrastructure.Data;

/// <summary>
/// Platform base DbContext — her uygulama (Crm, CodePro, ...) bu sınıfı extend eden
/// kendi DbContext'ini tanımlar ve uygulamaya özgü DbSet'leri ekler.
/// Constructor non-generic <see cref="DbContextOptions"/> alır; alt sınıflar
/// <c>DbContextOptions&lt;TDerived&gt;</c> ile çağırabilsin (generics invariant olduğundan
/// generic taban tipi alt sınıf çağrısını engellerdi).
/// </summary>
public abstract class PlatformDbContext : DbContext, IApplicationDbContext
{
    private readonly IContextUser contextUser;
    private readonly IContextAuthorization contextAuthorization;

    protected PlatformDbContext(
        DbContextOptions options,
        IContextUser contextUser,
        IContextAuthorization contextAuthorization)
        : base(options)
    {
        this.contextUser = contextUser;
        this.contextAuthorization = contextAuthorization;
    }

    // ======= Identity =======
    public DbSet<AuthOrganization> AuthOrganization { get; set; }
    public DbSet<AuthUser> AuthUser { get; set; }
    public DbSet<AuthRole> AuthRole { get; set; }
    public DbSet<AuthPrivilege> AuthPrivilege { get; set; }
    public DbSet<AuthUserRole> AuthUserRole { get; set; }
    public DbSet<AuthRolePrivilege> AuthRolePrivilege { get; set; }
    public DbSet<AuthUserLogin> AuthUserLogin { get; set; }

    // ======= Activity =======
    public DbSet<ActivityBase> Activity { get; set; }
    public DbSet<ActivityParty> ActivityParty { get; set; }
    public DbSet<EmailActivity> EmailActivity { get; set; }
    public DbSet<PhoneCallActivity> PhoneCallActivity { get; set; }
    public DbSet<TaskActivity> TaskActivity { get; set; }
    public DbSet<AppointmentActivity> AppointmentActivity { get; set; }

    // ======= Attachment =======
    public DbSet<AttachmentFileData> AttachmentFileData { get; set; }
    public DbSet<AttachmentFileMetadata> AttachmentFileMetadata { get; set; }
    public DbSet<AttachmentFileRelation> AttachmentFileRelation { get; set; }

    protected override void ConfigureConventions(ModelConfigurationBuilder builder)
    {
        builder.SetTypeConverter();
    }


    #region Global Query

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PlatformDbContext).Assembly);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (entityType.BaseType != null) continue;

            var clrType = entityType.ClrType;
            var param = Expression.Parameter(clrType, "e");
            var body = (Expression)Expression.Constant(true);

            if (typeof(ISoftDeleteEntity).IsAssignableFrom(clrType))
                body = Expression.AndAlso(body, BuildSoftDeleteBody(param));

            if (typeof(IOwnedEntity).IsAssignableFrom(clrType))
                body = Expression.AndAlso(body, BuildOwnerBody(param));

            if (body is ConstantExpression) continue;

            modelBuilder.Entity(clrType)
                .HasQueryFilter(Expression.Lambda(body, param));
        }
    }

    private static Expression BuildSoftDeleteBody(ParameterExpression param) =>
        Expression.Not(
            Expression.Property(param, nameof(ISoftDeleteEntity.IsDeleted)));

    private Expression BuildOwnerBody(ParameterExpression param)
    {
        var ownerIdProp = Expression.Property(param, nameof(IOwnedEntity.OwnerId));
        var orgIdProp = Expression.Property(param, nameof(IOwnedEntity.OrganizationId));

        var contextConst = Expression.Constant(this);
        var isUserAccess = Expression.Property(contextConst, nameof(IsUserAccess));
        var isOrgAccess = Expression.Property(contextConst, nameof(IsOrgAccess));
        var currentUserId = Expression.Property(contextConst, nameof(CurrentUserId));
        var orgIds = Expression.Property(contextConst, nameof(OrgIds));

        var userCheck = Expression.OrElse(
            Expression.Not(isUserAccess),
            Expression.Equal(ownerIdProp, currentUserId));

        var orgCheck = Expression.OrElse(
            Expression.Not(isOrgAccess),
            Expression.Call(
                orgIds,
                typeof(List<Guid>).GetMethod(nameof(List<Guid>.Contains))!,
                orgIdProp));

        return Expression.AndAlso(userCheck, orgCheck);
    }

    public Guid CurrentUserId => contextUser.UserId;
    public List<Guid> OrgIds => contextUser.AccessibleOrganizationList;
    public bool IsUserAccess => contextAuthorization.AccessLevel == AccessLevel.User;
    public bool IsOrgAccess => contextAuthorization.AccessLevel == AccessLevel.Organization;


    #endregion Global Query

    #region Save Changes
    public override int SaveChanges()
    {
        ApplySaveRules();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplySaveRules();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ApplySaveRules()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Unchanged) continue;

            // ======= Audit =======
            if (entry.Entity is IAuditableEntity audit)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Property(nameof(IAuditableEntity.CreatedAt)).CurrentValue = now;
                    entry.Property(nameof(IAuditableEntity.CreatedBy)).CurrentValue = contextUser.UserId;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Property(nameof(IAuditableEntity.UpdatedAt)).CurrentValue = now;
                    entry.Property(nameof(IAuditableEntity.UpdatedBy)).CurrentValue = contextUser.UserId;
                }
            }

            // ======= OwnedEntity =======
            if (entry.Entity is IOwnedEntity owned)
            {
                // Added: OwnerId boşsa infrastructure set eder
                if (entry.State == EntityState.Added && owned.OwnerId == Guid.Empty)
                {
                    entry.Property(nameof(IOwnedEntity.OwnerId)).CurrentValue = contextUser.UserId;
                    entry.Property(nameof(IOwnedEntity.OrganizationId)).CurrentValue = contextUser.OrganizationId;
                }

                // Modified / Deleted: sahiplik kontrolü
                if (entry.State is EntityState.Modified or EntityState.Deleted)
                {
                    var violation = contextAuthorization.AccessLevel switch
                    {
                        AccessLevel.User => owned.OwnerId != contextUser.UserId,
                        AccessLevel.Organization => !contextUser.AccessibleOrganizationList.Contains(owned.OrganizationId),
                        _ => false
                    };

                    if (violation)
                        throw new UnauthorizedAccessException(
                            $"{entry.Entity.GetType().Name}: Bu kayıt üzerinde yetkiniz yok.");
                }
            }

            // ======= SoftDelete =======
            if (entry.Entity is ISoftDeleteEntity && entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                entry.Property(nameof(ISoftDeleteEntity.IsDeleted)).CurrentValue = true;
                entry.Property(nameof(ISoftDeleteEntity.DeletedAt)).CurrentValue = now;
                entry.Property(nameof(ISoftDeleteEntity.DeletedBy)).CurrentValue = contextUser.UserId;
            }
        }
    }

    #endregion Save Changes
}
