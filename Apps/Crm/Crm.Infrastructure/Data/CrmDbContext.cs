using Crm.Application.Interfaces;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Entities.Opportunities;
using Platform.Application.Interfaces;
using Platform.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Crm.Infrastructure.Data;

/// <summary>
/// CRM uygulamasına özgü DbContext. PlatformDbContext'in tüm DbSet'lerini devralır,
/// Lead/Opportunity ekler. ICrmDbContext'i implement ettiği için Crm.Application
/// query handler'ları DbContext tipini bilmeden tüketebilir.
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

    // ======= CRM =======
    public DbSet<Lead> Lead { get; set; }
    public DbSet<Opportunity> Opportunity { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // CRM-spesifik IEntityTypeConfiguration<T> sınıfları Crm.Infrastructure assembly'sinde aranır.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CrmDbContext).Assembly);
    }
}
