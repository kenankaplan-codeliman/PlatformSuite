
using CRM.Application.Authentication.Interfaces;
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
    public DbSet<AppLoginHistory> AppLoginHistory { get; set; }

    // ======= Activity =======
    public DbSet<ActivityBase> Activities { get; set; }
    public DbSet<ActivityParty> ActivityParties { get; set; }
    public DbSet<EmailActivity> EmailActivities { get; set; }
    public DbSet<PhoneCallActivity> PhoneCallActivities { get; set; }
    public DbSet<TaskActivity> TaskActivities { get; set; }
    public DbSet<AppointmentActivity> AppointmentActivities { get; set; }

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
            if (entry.Entity is IAuditableEntity audit)
            {
                if (entry.Property(nameof(IAuditableEntity.CreatedBy)).IsModified
                 || entry.Property(nameof(IAuditableEntity.CreatedAt)).IsModified
                 || entry.Property(nameof(IAuditableEntity.UpdatedAt)).IsModified
                 || entry.Property(nameof(IAuditableEntity.UpdatedBy)).IsModified
                    )
                {
                    throw new SecurityException("Createdi, Updated and IsDeleted fields cannot be set manually.");
                }

                // ======= Create =======
                if (entry.State == EntityState.Added)
                {
                    audit.CreatedAt = now;
                    audit.CreatedBy = currentUserContext.UserId;
                }

                // ======= Update =======
                if (entry.State == EntityState.Modified)
                {
                    //Exception Iptal edilirse burasi acilacak
                    //entry.Property(nameof(IAuditableEntity.CreatedAt)).IsModified = false;

                    audit.UpdatedAt = now;
                    audit.UpdatedBy = currentUserContext.UserId;
                }
            }

            // ======= Soft Delete =======
            if (entry.Entity is ISoftDeleteEntity softDelete)
            {
                if (entry.Property(nameof(ISoftDeleteEntity.IsDeleted)).IsModified)
                {
                    throw new SecurityException("Createdi, Updated and IsDeleted fields cannot be set manually.");
                }

                if (entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    softDelete.IsDeleted = true;

                    if (entry.Entity is IAuditableEntity deleteAudit)
                    {
                        deleteAudit.UpdatedAt = now;
                        deleteAudit.UpdatedBy = currentUserContext.UserId;
                    }
                }
            }
        }
    }

}
