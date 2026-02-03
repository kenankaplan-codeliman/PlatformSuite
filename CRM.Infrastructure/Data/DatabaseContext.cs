
using CRM.Application.Authentication.Interfaces;
using CRM.Application.Interfaces;
using CRM.Domain.Entities.Activity;
using CRM.Domain.Entities.Common;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Entities.Lead;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data.Configurations;
using CRM.Infrastructure.Data.Configurations.Modal;
using CRM.Infrastructure.Data.Converters;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Reflection.Emit;
using System.Security;
using AppRole = CRM.Domain.Entities.Identity.AppRole;

namespace CRM.Infrastructure.Data;

public class DatabaseContext : DbContext
{
    private readonly ICurrentUserContext currentUserContext;

    // ======= Identity =======
    public DbSet<AppOrganization> AppOrganization { get; set; }
    public DbSet<AppUser> AppUser { get; set; }
    public DbSet<AppRole> AppRole { get; set; }
    public DbSet<AppPrivilege> AppPrivilege { get; set; }
    public DbSet<AppUserRole> AppUserRole { get; set; }
    public DbSet<AppRolePrivilege> AppRolePrivilege { get; set; }
    public DbSet<AppLogin> AppLogin { get; set; }

    // ======= Activity =======
    public DbSet<ActivityBase> Activity { get; set; }
    public DbSet<ActivityParty> ActivityParty{ get; set; }
    public DbSet<EmailActivity> EmailActivity { get; set; }
    public DbSet<PhoneCallActivity> PhoneCallActivity{ get; set; }
    public DbSet<TaskActivity> TaskActivity{ get; set; }
    public DbSet<AppointmentActivity> AppointmentActivity { get; set; }

    // ======= Lead =======
    public DbSet<Lead> Lead { get; set; }

    public DatabaseContext(DbContextOptions<DatabaseContext> options, ICurrentUserContext currentUserContext)
        : base(options)
    {
        this.currentUserContext = currentUserContext;
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder builder)
    {
        builder.SetTypeConverter();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.SetGlobalFilter(currentUserContext);

        modelBuilder.ConfigureIdentityEntities();
        modelBuilder.ConfigureActivityEntities();
        modelBuilder.ConfigureLeadEntities();

    }
  

    public override int SaveChanges()
    {
        ApplyAuditAndSoftDelete();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        ApplyAuditAndSoftDelete();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ApplyAuditAndSoftDelete()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries())
        {
            // ======= Audit =======
            if (currentUserContext != null && entry.Entity is IAuditableEntity audit)
            {
                // ======= Create =======
                if (entry.State == EntityState.Added)
                {
                    audit.CreatedAt = now;
                    audit.CreatedBy = currentUserContext.UserId;

                }

                // ======= Update =======
                if (entry.State == EntityState.Modified)
                {
                    audit.UpdatedAt = now;
                    audit.UpdatedBy = currentUserContext.UserId;
                }
            }

            // ======= Owned Entity =======
            if (currentUserContext != null && entry.Entity is IOwnedEntity ownedEntity)
            {
                if (entry.State == EntityState.Added && 
                    ownedEntity.OwnerId==Guid.Empty && 
                    ownedEntity.OrganizationId == Guid.Empty)
                {
                    ownedEntity.OwnerId = currentUserContext.UserId;
                    ownedEntity.OrganizationId = currentUserContext.OrganizationId;
                }
            }


            // ======= Soft Delete =======
            if (currentUserContext != null && entry.Entity is ISoftDeleteEntity softDelete)
            {
                entry.Property(nameof(ISoftDeleteEntity.IsDeleted)).IsModified = false;
                entry.Property(nameof(ISoftDeleteEntity.DeletedBy)).IsModified = false;
                entry.Property(nameof(ISoftDeleteEntity.DeletedAt)).IsModified = false;

                if (entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    softDelete.IsDeleted = true;
                    softDelete.DeletedAt = now;
                    softDelete.DeletedBy = currentUserContext.UserId;
                }
            }
        }
    }

}
