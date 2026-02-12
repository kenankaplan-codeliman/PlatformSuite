
using CRM.Application.Interfaces;
using CRM.Domain.Entities.Accounts;
using CRM.Domain.Entities.Activities;
using CRM.Domain.Entities.Common;
using CRM.Domain.Entities.Contacts;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Entities.Leads;
using CRM.Domain.Entities.Opportunities;
using CRM.Infrastructure.Data.Configurations;
using CRM.Infrastructure.Data.Configurations.Accounts;
using Microsoft.EntityFrameworkCore;
using AppRole = CRM.Domain.Entities.Identities.AppRole;

namespace CRM.Infrastructure.Data;

public class DatabaseContext : DbContext
{
    private readonly IContextUser contextUser;
    private readonly IContextAuthorization contextAuthorization;

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
    public DbSet<PhoneCall> PhoneCall{ get; set; }
    public DbSet<TaskActivity> TaskActivity{ get; set; }
    public DbSet<Appointment> Appointment { get; set; }

    // ======= Account =======
    public DbSet<Account> Account { get; set; }
    public DbSet<AccountEmail> AccountEmail { get; set; }
    public DbSet<AccountPhone> AccountPhone { get; set; }
    public DbSet<AccountAddress> AccountAddress { get; set; }
    public DbSet<AccountContact> AccountContact { get; set; }

    // ======= Contact =======
    public DbSet<Contact> Contact { get; set; }
    public DbSet<ContactEmail> ContactEmail { get; set; }
    public DbSet<ContactPhone> ContactPhone { get; set; }
    public DbSet<ContactAddress> ContactAddress { get; set; }

    // ======= Lead =======
    public DbSet<Lead> Lead { get; set; }

    // ======= Opportunity =======
    public DbSet<Opportunity> Opportunity { get; set; }



    public DatabaseContext(DbContextOptions<DatabaseContext> options, IContextUser currentUserContext, IContextAuthorization contextAuthorization)
        : base(options)
    {
        this.contextUser = currentUserContext;
        this.contextAuthorization = contextAuthorization;
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder builder)
    {
        builder.SetTypeConverter();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.SetGlobalFilter(contextUser, contextAuthorization);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DatabaseContext).Assembly);

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
            if (contextUser != null && entry.Entity is IAuditableEntity audit)
            {
                // ======= Create =======
                if (entry.State == EntityState.Added)
                {
                    audit.CreatedAt = now;
                    audit.CreatedBy = contextUser.UserId;

                }

                // ======= Update =======
                if (entry.State == EntityState.Modified)
                {
                    audit.UpdatedAt = now;
                    audit.UpdatedBy = contextUser.UserId;
                }
            }

            // ======= Owned Entity =======
            if (contextUser != null && entry.Entity is IOwnedEntity ownedEntity)
            {
                if (entry.State == EntityState.Added && 
                    ownedEntity.OwnerId==Guid.Empty && 
                    ownedEntity.OrganizationId == Guid.Empty)
                {
                    ownedEntity.OwnerId = contextUser.UserId;
                    ownedEntity.OrganizationId = contextUser.OrganizationId;
                }
            }


            // ======= Soft Delete =======
            if (contextUser != null && entry.Entity is ISoftDeleteEntity softDelete)
            {
                entry.Property(nameof(ISoftDeleteEntity.IsDeleted)).IsModified = false;
                entry.Property(nameof(ISoftDeleteEntity.DeletedBy)).IsModified = false;
                entry.Property(nameof(ISoftDeleteEntity.DeletedAt)).IsModified = false;

                if (entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    softDelete.IsDeleted = true;
                    softDelete.DeletedAt = now;
                    softDelete.DeletedBy = contextUser.UserId;
                }
            }
        }
    }

}
