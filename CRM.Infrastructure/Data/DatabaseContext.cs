
using CRM.Application.Interfaces;
using CRM.Domain.Entities.Accounts;
using CRM.Domain.Entities.Activities;
using CRM.Domain.Entities.Common;
using CRM.Domain.Entities.Contacts;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Entities.Leads;
using CRM.Domain.Entities.Opportunities;
using CRM.Domain.Entities.Products;
using CRM.Infrastructure.Data.Configurations;
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
    public DbSet<PhoneCallActivity> PhoneCallActivity{ get; set; }
    public DbSet<TaskActivity> TaskActivity{ get; set; }
    public DbSet<AppointmentActivity> AppointmentActivity { get; set; }

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

    // ======= Product =======
    public DbSet<Product> Product { get; set; }

    // ======= Opportunity =======
    public DbSet<Opportunity> Opportunity { get; set; }
    public DbSet<OpportunityProduct> OpportunityProduct { get; set; }



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
        ApplySaveChangeRules();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        ApplySaveChangeRules();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ApplySaveChangeRules()
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
                if (entry.State == EntityState.Added && ownedEntity.OwnerId == Guid.Empty && ownedEntity.OrganizationId == Guid.Empty)
                {
                    entry.Property(nameof(IOwnedEntity.OwnerId)).CurrentValue = contextUser.UserId;
                    entry.Property(nameof(IOwnedEntity.OrganizationId)).CurrentValue = contextUser.OrganizationId;
                }
                else if (entry.State == EntityState.Modified)
                {
                    // Update'te degisimi engelle
                    entry.Property(nameof(IOwnedEntity.OwnerId)).IsModified = false;
                    entry.Property(nameof(IOwnedEntity.OrganizationId)).IsModified = false;
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
