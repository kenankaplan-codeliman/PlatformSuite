using Crm.Application.Interfaces;
using Crm.Domain.Entities.Accounts;
using Crm.Domain.Entities.Contacts;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Entities.Opportunities;
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
    public DbSet<AccountEmail> AccountEmail { get; set; }
    public DbSet<AccountPhone> AccountPhone { get; set; }
    public DbSet<AccountAddress> AccountAddress { get; set; }
    public DbSet<AccountContact> AccountContact { get; set; }

    // ======= Contact =======
    public DbSet<Contact> Contact { get; set; }
    public DbSet<ContactEmail> ContactEmail { get; set; }
    public DbSet<ContactPhone> ContactPhone { get; set; }
    public DbSet<ContactAddress> ContactAddress { get; set; }

    // ======= CRM features =======
    public DbSet<Lead> Lead { get; set; }
    public DbSet<Opportunity> Opportunity { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // CRM-spesifik IEntityTypeConfiguration<T> sınıfları Crm.Infrastructure assembly'sinde aranır.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CrmDbContext).Assembly);
    }
}
