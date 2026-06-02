using Crm.Application.Interfaces;
using Crm.Domain.Entities.Accounts;
using Crm.Domain.Entities.Communications;
using Crm.Domain.Entities.Contacts;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Entities.Opportunities;
using Crm.Domain.Entities.Products;
using Platform.Application.Interfaces;
using Platform.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Crm.Infrastructure.Data;

/// <summary>
/// CRM uygulamasına özgü DbContext. PlatformDbContext'in tüm DbSet'lerini devralır,
/// Account/Contact/Lead/Opportunity ekler. ICrmDbContext'i implement ettiği için
/// Crm.Application query handler'ları DbContext tipini bilmeden tüketebilir.
/// </summary>
public sealed class CrmDbContext : PlatformDbContext, ICrmDbContext
{
    public CrmDbContext(
        DbContextOptions<CrmDbContext> options,
        IContextUser contextUser,
        IContextAuthorization contextAuthorization)
        : base(options, contextUser, contextAuthorization)
    {
    }

    // ======= Account =======
    public DbSet<Account> Account { get; set; }
    public DbSet<AccountContact> AccountContact { get; set; }

    // ======= Contact =======
    public DbSet<Contact> Contact { get; set; }

    // ======= Communications (polimorfik owner — Account/Contact/... ortak) =======
    public DbSet<EmailAddress> EmailAddress { get; set; }
    public DbSet<Phone> Phone { get; set; }
    public DbSet<Address> Address { get; set; }

    // ======= CRM features =======
    public DbSet<Lead> Lead { get; set; }
    public DbSet<Opportunity> Opportunity { get; set; }
    public DbSet<OpportunityProduct> OpportunityProduct { get; set; }
    public DbSet<Product> Product { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // CRM-spesifik IEntityTypeConfiguration<T> sınıfları Crm.Infrastructure assembly'sinde aranır.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CrmDbContext).Assembly);
    }
}
